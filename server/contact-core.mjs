import { randomUUID } from 'node:crypto';
import { z } from 'zod';

const MAX_MESSAGE_LENGTH = 2000;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_MAX = 5;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const rateBuckets = new Map();
let cleanupTick = 0;

const contactSchema = z.object({
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email("Email formati noto'g'ri").max(180),
  phone: z.string().trim().min(6, 'Telefon raqam kiritilishi kerak').max(40),
  message: z.string().trim().max(MAX_MESSAGE_LENGTH).optional().default(''),
  website: z.string().trim().max(120).optional().default(''),
  turnstileToken: z.string().trim().max(4096).optional().default(''),
  submittedAt: z.string().trim().max(80).optional(),
});

function safeTrim(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isUpstashConfigured(env) {
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

function buildUpstashUrl(baseUrl, command, ...args) {
  const normalizedBase = String(baseUrl).replace(/\/+$/, '');
  const encodedArgs = args.map((item) => encodeURIComponent(String(item)));
  return `${normalizedBase}/${[command, ...encodedArgs].join('/')}`;
}

async function runUpstashCommand(env, command, ...args) {
  const response = await fetch(buildUpstashUrl(env.UPSTASH_REDIS_REST_URL, command, ...args), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data?.error || data?.message || `Upstash request failed (${response.status})`;
    throw new Error(message);
  }
  return data?.result;
}

async function verifyTurnstileToken({ secret, token, ip }) {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip && ip !== 'unknown') {
    body.set('remoteip', ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    return {
      ok: false,
      error: `Turnstile tekshiruv xatosi (${response.status})`,
    };
  }

  if (data?.success) {
    return { ok: true };
  }

  const codeText = Array.isArray(data?.['error-codes'])
    ? data['error-codes'].join(', ')
    : 'invalid-token';

  return {
    ok: false,
    error: `Turnstile tasdiqlanmadi (${codeText})`,
  };
}

function resolveIp(ip, headers) {
  if (ip && typeof ip === 'string') return ip;
  const forwarded = headers?.['x-forwarded-for'] ?? headers?.['X-Forwarded-For'];
  if (Array.isArray(forwarded)) return (forwarded[0] || '').split(',')[0].trim() || 'unknown';
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim() || 'unknown';
  return 'unknown';
}

function response(status, body, headers = {}) {
  return { status, body, headers };
}

function errorResponse(requestId, status, code, message, details, headers = {}) {
  return response(
    status,
    {
      ok: false,
      requestId,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    headers,
  );
}

function escapeHTML(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildTelegramMessage({ name, email, phone, message, submittedAt }) {
  const safeName = escapeHTML(name || 'Kiritilmagan');
  const safeEmail = escapeHTML(email || 'Kiritilmagan');
  const safePhone = escapeHTML(phone || 'Kiritilmagan');
  const safeMessage = escapeHTML(message || 'Xabar yozilmagan');
  const safeSubmittedAt = escapeHTML(submittedAt || new Date().toISOString());

  return [
    '<b>PORTFOLIO CONTACT REQUEST</b>',
    '',
    `<b>Name:</b> ${safeName}`,
    `<b>Phone:</b> <a href="tel:${safePhone}">${safePhone}</a>`,
    `<b>Email:</b> <a href="mailto:${safeEmail}">${safeEmail}</a>`,
    '',
    '<b>Message:</b>',
    `<blockquote expandable>${safeMessage}</blockquote>`,
    '',
    `<i>${safeSubmittedAt}</i>`,
  ].join('\n');
}

function buildEmailBody({ name, email, phone, message, submittedAt, requestId }) {
  const safeName = escapeHTML(name || 'Kiritilmagan');
  const safeEmail = escapeHTML(email || 'Kiritilmagan');
  const safePhone = escapeHTML(phone || 'Kiritilmagan');
  const safeMessage = escapeHTML(message || 'Xabar yozilmagan');
  const safeSubmittedAt = escapeHTML(submittedAt || new Date().toISOString());
  const safeRequestId = escapeHTML(requestId);

  const subject = `Portfolio contact: ${name || 'Unknown sender'}`;
  const html = [
    '<h2>Portfolio Contact Request</h2>',
    `<p><b>Request ID:</b> ${safeRequestId}</p>`,
    `<p><b>Name:</b> ${safeName}</p>`,
    `<p><b>Phone:</b> ${safePhone}</p>`,
    `<p><b>Email:</b> ${safeEmail}</p>`,
    `<p><b>Submitted:</b> ${safeSubmittedAt}</p>`,
    '<hr/>',
    `<p>${safeMessage}</p>`,
  ].join('\n');
  const text = [
    'Portfolio Contact Request',
    `Request ID: ${requestId}`,
    `Name: ${name || 'Kiritilmagan'}`,
    `Phone: ${phone || 'Kiritilmagan'}`,
    `Email: ${email || 'Kiritilmagan'}`,
    `Submitted: ${submittedAt || new Date().toISOString()}`,
    '',
    message || 'Xabar yozilmagan',
  ].join('\n');

  return { subject, html, text };
}

function isResendConfigured(env) {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM && env.RESEND_TO);
}

async function sendTelegram({ token, chatId, text }) {
  const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const tgData = await tgResponse.json().catch(() => null);
  if (!tgResponse.ok || !tgData?.ok) {
    return {
      ok: false,
      error: tgData?.description || `Telegram API xatosi (status ${tgResponse.status})`,
    };
  }

  return { ok: true };
}

async function sendResend({ apiKey, from, to, replyTo, emailBody }) {
  const recipients = to
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (!recipients.length) {
    return { ok: false, error: "RESEND_TO noto'g'ri berilgan" };
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: emailBody.subject,
      html: emailBody.html,
      text: emailBody.text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const resendData = await resendResponse.json().catch(() => null);
  if (!resendResponse.ok) {
    return {
      ok: false,
      error:
        resendData?.message ||
        resendData?.error ||
        `Resend API xatosi (status ${resendResponse.status})`,
    };
  }

  return { ok: true };
}

function humanizeDeliveryError(errorMessage) {
  const lower = String(errorMessage || '').toLowerCase();
  if (lower.includes('chat not found')) {
    return 'Telegram botga /start yuboring yoki TELEGRAM_CHAT_ID ni tekshiring';
  }
  if (lower.includes('bot was blocked')) {
    return 'Bot bloklangan. Telegramda botni qayta oching';
  }
  if (lower.includes('unauthorized')) {
    return "TELEGRAM_BOT_TOKEN noto'g'ri yoki eskirgan. Tokenni rotate qiling";
  }
  return "Xabar yuborilmadi. Iltimos keyinroq qayta urinib ko'ring";
}

async function applyRateLimit(ip, env, logger) {
  if (String(env.CONTACT_RATE_LIMIT_ENABLED || 'true').toLowerCase() === 'false') {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const windowMs = parsePositiveInt(env.CONTACT_RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_LIMIT_WINDOW_MS);
  const max = parsePositiveInt(env.CONTACT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX);

  if (isUpstashConfigured(env)) {
    const redisKey = `contact:rate:${ip}`;
    try {
      const countRaw = await runUpstashCommand(env, 'incr', redisKey);
      const count = Number(countRaw || 0);

      if (count === 1) {
        await runUpstashCommand(env, 'pexpire', redisKey, windowMs);
      }

      if (count > max) {
        const ttlRaw = await runUpstashCommand(env, 'pttl', redisKey);
        const ttlMs = Math.max(1000, Number(ttlRaw || windowMs));
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
        };
      }

      return { allowed: true, retryAfterSeconds: 0 };
    } catch (error) {
      logger.warn('[contact] upstash-rate-limit-fallback', {
        error: error instanceof Error ? error.message : 'unknown',
      });
      // fallback to in-memory limiter
    }
  }

  const now = Date.now();
  const key = `contact:${ip}`;

  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    cleanupTick += 1;
    if (cleanupTick % 100 === 0) {
      for (const [bucketKey, bucketValue] of rateBuckets.entries()) {
        if (bucketValue.resetAt <= now) {
          rateBuckets.delete(bucketKey);
        }
      }
    }
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  rateBuckets.set(key, existing);

  if (existing.count > max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

async function notifyMonitor(env, payload) {
  const webhookUrl = safeTrim(env.CONTACT_MONITOR_WEBHOOK_URL, 400);
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silent monitoring failure
  }
}

export async function handleContactRequest({
  method,
  headers = {},
  body,
  env,
  ip,
  logger = console,
}) {
  const requestId = randomUUID();
  const normalizedMethod = String(method || '').toUpperCase();
  const clientIp = resolveIp(ip, headers);

  if (normalizedMethod !== 'POST') {
    return errorResponse(
      requestId,
      405,
      'METHOD_NOT_ALLOWED',
      "Faqat POST so'rovi ruxsat etiladi",
      undefined,
      { Allow: 'POST' },
    );
  }

  let parsedBody;
  try {
    parsedBody = typeof body === 'string' ? JSON.parse(body || '{}') : body || {};
  } catch {
    return errorResponse(requestId, 400, 'INVALID_JSON', "JSON formati noto'g'ri");
  }

  const validation = contactSchema.safeParse(parsedBody);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    return errorResponse(
      requestId,
      400,
      'VALIDATION_ERROR',
      firstIssue?.message || "So'rov ma'lumotlari noto'g'ri",
      {
        field: firstIssue?.path?.[0] ?? null,
      },
    );
  }

  const payload = {
    ...validation.data,
    submittedAt: validation.data.submittedAt || new Date().toISOString(),
  };

  if (payload.website) {
    logger.warn('[contact] honeypot-hit', { requestId, ip: clientIp });
    return response(200, { ok: true, requestId });
  }

  const turnstileSecret = safeTrim(env.TURNSTILE_SECRET_KEY, 4096);
  if (turnstileSecret) {
    if (!payload.turnstileToken) {
      return errorResponse(
        requestId,
        400,
        'TURNSTILE_REQUIRED',
        'Bot tekshiruvi yakunlanmagan',
      );
    }

    const turnstile = await verifyTurnstileToken({
      secret: turnstileSecret,
      token: payload.turnstileToken,
      ip: clientIp,
    });
    if (!turnstile.ok) {
      return errorResponse(
        requestId,
        400,
        'TURNSTILE_FAILED',
        turnstile.error || "Bot tekshiruvdan o'tmadi",
      );
    }
  }

  const rateLimit = await applyRateLimit(clientIp, env, logger);
  if (!rateLimit.allowed) {
    return errorResponse(
      requestId,
      429,
      'RATE_LIMIT',
      "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring",
      undefined,
      { 'Retry-After': String(rateLimit.retryAfterSeconds) },
    );
  }

  const hasTelegram = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  const hasResend = isResendConfigured(env);

  if (!hasTelegram && !hasResend) {
    logger.error('[contact] missing-config', { requestId });
    return errorResponse(
      requestId,
      500,
      'CONFIG_ERROR',
      "Server sozlamalari to'liq emas (Telegram yoki fallback email yo'q)",
    );
  }

  const messageText = buildTelegramMessage(payload);
  let telegramError = '';
  if (hasTelegram) {
    try {
      const telegramResult = await sendTelegram({
        token: env.TELEGRAM_BOT_TOKEN,
        chatId: env.TELEGRAM_CHAT_ID,
        text: messageText,
      });
      if (telegramResult.ok) {
        return response(200, { ok: true, requestId, channel: 'telegram' });
      }
      telegramError = telegramResult.error || "Telegramga yuborib bo'lmadi";
    } catch (error) {
      telegramError = error instanceof Error ? error.message : 'Telegram xatosi';
    }
    logger.error('[contact] telegram-failed', { requestId, error: telegramError });
  }

  if (hasResend) {
    const emailBody = buildEmailBody({ ...payload, requestId });
    try {
      const resendResult = await sendResend({
        apiKey: env.RESEND_API_KEY,
        from: env.RESEND_FROM,
        to: env.RESEND_TO,
        replyTo: payload.email,
        emailBody,
      });
      if (resendResult.ok) {
        logger.warn('[contact] fallback-email-sent', { requestId, fromTelegram: hasTelegram });
        await notifyMonitor(env, {
          level: 'warn',
          event: 'contact_fallback_email_sent',
          requestId,
          ip: clientIp,
          telegramError,
          timestamp: new Date().toISOString(),
        });
        return response(200, { ok: true, requestId, channel: 'email' });
      }

      const fallbackError = resendResult.error || 'Fallback email yuborilmadi';
      logger.error('[contact] fallback-email-failed', {
        requestId,
        telegramError,
        fallbackError,
      });
      await notifyMonitor(env, {
        level: 'error',
        event: 'contact_delivery_failed',
        requestId,
        ip: clientIp,
        telegramError,
        fallbackError,
        timestamp: new Date().toISOString(),
      });
      return errorResponse(
        requestId,
        502,
        'DELIVERY_FAILED',
        humanizeDeliveryError(telegramError || fallbackError),
      );
    } catch (error) {
      const fallbackError = error instanceof Error ? error.message : 'Fallback email xatosi';
      logger.error('[contact] fallback-email-exception', {
        requestId,
        telegramError,
        fallbackError,
      });
      await notifyMonitor(env, {
        level: 'error',
        event: 'contact_delivery_failed',
        requestId,
        ip: clientIp,
        telegramError,
        fallbackError,
        timestamp: new Date().toISOString(),
      });
      return errorResponse(
        requestId,
        502,
        'DELIVERY_FAILED',
        humanizeDeliveryError(telegramError || fallbackError),
      );
    }
  }

  await notifyMonitor(env, {
    level: 'error',
    event: 'contact_telegram_failed_no_fallback',
    requestId,
    ip: clientIp,
    telegramError,
    timestamp: new Date().toISOString(),
  });
  return errorResponse(requestId, 502, 'DELIVERY_FAILED', humanizeDeliveryError(telegramError));
}
