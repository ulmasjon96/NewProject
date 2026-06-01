import formBg from '@/assets/formBg.webp';
import CyberInput from '@/components/ui/CyberInput';
import CyberPhoneInput from '@/components/ui/CyberPhoneInput';
import CyberTextarea from '@/components/ui/CyberTextarea';
import { SectionTitle } from '@/components/ui/section-title';
import { toast } from '@/components/ui/toast';
import { FormEvent, useEffect, useState, type CSSProperties } from 'react';
import './contact-form-action-buttons.css';

import { useTranslation } from 'react-i18next';

type ContactApiResponse = {
  ok?: boolean;
  channel?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
};

type ClientTelegramConfig = {
  botToken: string;
  chatId: string;
};

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
  submittedAt: string;
};

function renderAnimatedLabel(text: string, offset = 0) {
  return Array.from(text).map((char, index) => (
    <span key={`${char}-${index}`} style={{ '--i': offset + index } as CSSProperties}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
}

function isGithubPagesHost(hostname: string) {
  return hostname.toLowerCase().endsWith('.github.io');
}

function resolveContactEndpoint() {
  const configuredEndpoint = String(import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact').trim();
  const liveFallbackEndpoint = String(import.meta.env.VITE_LOCAL_LIVE_API_ENDPOINT || '').trim();

  if (configuredEndpoint && configuredEndpoint !== '/api/contact') {
    return configuredEndpoint;
  }

  if (typeof window === 'undefined') {
    return configuredEndpoint || '/api/contact';
  }

  const isLiveServerHost = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  const isLiveServerPort = window.location.port === '5500';
  if (liveFallbackEndpoint && isLiveServerHost && isLiveServerPort) {
    return liveFallbackEndpoint;
  }

  if (configuredEndpoint === '/api/contact' && isGithubPagesHost(window.location.hostname)) {
    return '';
  }

  return configuredEndpoint || '/api/contact';
}

function resolveClientTelegramConfig(): ClientTelegramConfig | null {
  const botToken = String(import.meta.env.VITE_CLIENT_TELEGRAM_BOT_TOKEN || '').trim();
  const chatId = String(import.meta.env.VITE_CLIENT_TELEGRAM_CHAT_ID || '').trim();
  if (!botToken || !chatId) {
    return null;
  }
  return { botToken, chatId };
}

function escapeTelegramHtml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSubmittedAt(rawValue: string) {
  const input = String(rawValue || '').trim();
  const date = input ? new Date(input) : new Date();
  if (Number.isNaN(date.getTime())) {
    return input || new Date().toISOString();
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: string) => parts.find((part) => part.type === type)?.value || '';
  const day = getPart('day');
  const month = getPart('month');
  const year = getPart('year');
  const hour = getPart('hour');
  const minute = getPart('minute');

  return `${day}.${month}.${year} ${hour}:${minute} (Toshkent, UTC+5)`;
}

function buildTelegramMessage(payload: ContactPayload) {
  const safeName = escapeTelegramHtml(payload.name || 'Kiritilmagan');
  const safePhone = escapeTelegramHtml(payload.phone || 'Kiritilmagan');
  const safeEmail = escapeTelegramHtml(payload.email || 'Kiritilmagan');
  const safeMessage = escapeTelegramHtml(payload.message || 'Xabar yozilmagan');
  const safeSubmittedAt = escapeTelegramHtml(formatSubmittedAt(payload.submittedAt));

  return `
🌟 <b>NEW PORTFOLIO LEAD</b>
<i>A new message arrived from the website</i>

━━━━━━━━━━━━━━━━━━━━
👤 <b>Client</b>
• <b>Name:</b> <code>${safeName}</code>
• <b>Phone:</b> <a href="tel:${safePhone}">${safePhone}</a>
• <b>Email:</b> <a href="mailto:${safeEmail}">${safeEmail}</a>

💬 <b>Message</b>
<blockquote>${safeMessage}</blockquote>

🕒 <b>Submitted:</b> <code>${safeSubmittedAt}</code>
━━━━━━━━━━━━━━━━━━━━
🚀 <b>Portfolio Contact System</b>
`.trim();
}

async function sendViaApi(endpoint: string, payload: ContactPayload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as ContactApiResponse | null;
  if (!res.ok || !data?.ok) {
    throw new Error(
      data?.error?.message || "Xabar yuborilmadi. Iltimos keyinroq qayta urinib ko'ring",
    );
  }
}

async function sendViaClientTelegram(config: ClientTelegramConfig, payload: ContactPayload) {
  const messageText = buildTelegramMessage(payload);

  try {
    const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = (await response.json().catch(() => null)) as TelegramApiResponse | null;
    if (!response.ok || !data?.ok) {
      throw new Error(data?.description || 'Telegram API xatosi');
    }
    return;
  } catch {
    // Browser CORS cheklovi bo'lsa, requestni no-cors GET bilan yuboramiz.
    const query = new URLSearchParams({
      chat_id: config.chatId,
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: 'true',
    });

    await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage?${query.toString()}`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
    });
  }
}

export default function CyberContactForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [bgLoaded, setBgLoaded] = useState(false);
  const contactEndpoint = resolveContactEndpoint();
  const clientTelegramConfig = resolveClientTelegramConfig();

  useEffect(() => {
    const img = new Image();
    img.src = formBg;
    img.onload = () => setBgLoaded(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const form = e.currentTarget;

    /* ================= HTML VALIDATION ================= */
    if (!form.checkValidity()) {
      toast.error(t('form.errorValidation'), {
        description: t('form.errorValidationDesc'),
      });

      form.reportValidity();
      return;
    }

    /* ================= PHONE VALIDATION (REAL) ================= */
    // phone validator faqat submit bosilganda yuklanadi
    const { isValidPhoneNumber } = await import('react-phone-number-input');

    if (!phone || !isValidPhoneNumber(phone)) {
      toast.error(t('form.errorPhone'), {
        description: t('form.errorPhoneDesc'),
      });
      return;
    }

    /* ================= EMAIL VALIDATION ================= */
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    const emailValue = emailInput?.value.trim() || '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailValue)) {
      toast.error(t('form.errorEmail'), {
        description: t('form.errorEmailDesc'),
      });
      return;
    }

    /* ================= GET FORM DATA ================= */
    const formData = new FormData(form);
    const payload: ContactPayload = {
      name: String(formData.get('name') || '').trim(),
      email: emailValue,
      phone: String(phone),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || ''),
      submittedAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      let sentSuccessfully = false;
      let endpointError: unknown = null;

      if (contactEndpoint) {
        try {
          await sendViaApi(contactEndpoint, payload);
          sentSuccessfully = true;
        } catch (error) {
          endpointError = error;
        }
      }

      if (!sentSuccessfully && clientTelegramConfig) {
        await sendViaClientTelegram(clientTelegramConfig, payload);
        sentSuccessfully = true;
      }

      if (!sentSuccessfully) {
        if (!contactEndpoint && !clientTelegramConfig) {
          throw new Error(
            "Contact form sozlanmagan. `VITE_CONTACT_ENDPOINT` yoki `VITE_CLIENT_TELEGRAM_*` qiymatlarini to'g'ri kiriting",
          );
        }
        throw endpointError instanceof Error ? endpointError : new Error(t('form.errorSendDesc'));
      }

      toast.success(t('form.success'), {
        description: t('form.successDesc'),
      });

      setSent(true);
      form.reset();
      setPhone('');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message.trim() : '';
      const isTelegramStartIssue = /\/start|telegram[_\s-]?chat[_\s-]?id|chat\s+not\s+found/i.test(
        errorMessage,
      );

      toast.error(t('form.errorSend'), {
        description: isTelegramStartIssue
          ? t('form.errorSendDescTelegramStart')
          : errorMessage || t('form.errorSendDesc'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={bgLoaded ? { backgroundImage: `url(${formBg})` } : undefined}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/5 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          <SectionTitle number={t('contact.number')} title={t('contact.title')} />

          <div className="w-full max-w-[530px] relative z-10 md:ml-auto">
            <h1 className="text-[40px] xs:text-[50px] sm:text-[65px] md:text-[65px] lg:text-[70px] leading-tight tracking-[2px] sm:tracking-[3px] md:tracking-[5px] text-center font-brush break-words pb-2  bg-gradient-to-r from-transparent via-cyber-3 to-transparent bg-[length:90%] bg-no-repeat text-transparent bg-clip-text animate-textGlow">
              {t('contact.heading')}
            </h1>

            <form
              autoComplete="on"
              onSubmit={handleSubmit}
              className="
              bg-[hsl(var(--card)/0.1)]
              backdrop-blur-sm
              p-3 sm:p-4 md:p-4 mb-4
              border-l-[4px] md:border-l-[5px]
              border-[hsl(var(--primary))]
              rounded-xl
              relative
              shadow-[0_0_18px_hsl(var(--primary)/0.25),0_10px_30px_rgba(0,0,0,0.5),inset_0_0_40px_hsl(var(--primary)/0.08)]
              "
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-10000px] top-auto h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
              />

              <CyberInput
                label={t('form.name')}
                name="name"
                type="text"
                placeholder={t('form.namePlaceholder')}
              />
              <CyberPhoneInput
                label={t('form.phone')}
                value={phone}
                onChange={setPhone}
                placeholder={t('form.phonePlaceholder')}
              />

              <CyberInput
                label={t('form.email')}
                name="email"
                type="email"
                placeholder={t('form.emailPlaceholder')}
              />
              <CyberTextarea
                label={t('form.message')}
                name="message"
                placeholder={t('form.messagePlaceholder')}
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`cf-action-button cf-action-button--submit ${sent ? 'is-sent' : ''}`}
                  aria-live="polite"
                >
                  <div className="cf-action-outline" />
                  <div className="cf-action-state cf-action-state--default">
                    <div className="cf-action-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                      >
                        <g style={{ filter: 'url(#contact-form-send-shadow)' }}>
                          <path
                            fill="currentColor"
                            d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                          />
                          <path
                            fill="currentColor"
                            d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                          />
                        </g>
                        <defs>
                          <filter id="contact-form-send-shadow">
                            <feDropShadow floodOpacity="0.5" stdDeviation="0.6" dy="1" dx="0" />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                    <p>{renderAnimatedLabel(loading ? t('form.sending') : t('form.submit'))}</p>
                  </div>
                  <div className="cf-action-state cf-action-state--sent">
                    <div className="cf-action-icon">
                      <svg
                        stroke="black"
                        strokeWidth="0.5px"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g style={{ filter: 'url(#contact-form-check-shadow)' }}>
                          <path
                            d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                            fill="currentColor"
                          />
                          <path
                            d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                            fill="currentColor"
                          />
                        </g>
                        <defs>
                          <filter id="contact-form-check-shadow">
                            <feDropShadow floodOpacity="0.5" stdDeviation="0.6" dy="1" dx="0" />
                          </filter>
                        </defs>
                      </svg>
                    </div>
                    <p>{renderAnimatedLabel(t('form.sent'), 5)}</p>
                  </div>
                </button>

                <button
                  type="reset"
                  onClick={() => setPhone('')}
                  className="cf-action-button cf-action-button--reset"
                >
                  <div className="cf-action-outline" />
                  <div className="cf-action-state cf-action-state--default">
                    <div className="cf-action-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        width="1em"
                        height="1em"
                      >
                        <path
                          d="M20 12a8 8 0 1 1-2.34-5.66"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 4v5h-5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p>{renderAnimatedLabel(t('form.reset'))}</p>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
