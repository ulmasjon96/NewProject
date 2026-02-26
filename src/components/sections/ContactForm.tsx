import formBg from '@/assets/formbg.jpg';
import CyberInput from '@/components/ui/CyberInput';
import CyberPhoneInput from '@/components/ui/CyberPhoneInput';
import CyberTextarea from '@/components/ui/CyberTextarea';
import { SectionTitle } from '@/components/ui/section-title';
import { toast } from '@/components/ui/toast';
import { FormEvent, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

type ContactApiResponse = {
  ok?: boolean;
  channel?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

function resolveContactEndpoint() {
  const configuredEndpoint = String(import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact').trim();
  const liveFallbackEndpoint = String(import.meta.env.VITE_LOCAL_LIVE_API_ENDPOINT || '').trim();

  if (configuredEndpoint && configuredEndpoint !== '/api/contact') {
    return configuredEndpoint;
  }

  if (!liveFallbackEndpoint || typeof window === 'undefined') {
    return configuredEndpoint || '/api/contact';
  }

  const isLiveServerHost = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
  const isLiveServerPort = window.location.port === '5500';
  if (isLiveServerHost && isLiveServerPort) {
    return liveFallbackEndpoint;
  }

  return configuredEndpoint || '/api/contact';
}

export default function CyberContactForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [bgLoaded, setBgLoaded] = useState(false);
  const contactEndpoint = resolveContactEndpoint();

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
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: emailValue,
      phone: String(phone),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || ''),
      submittedAt: new Date().toISOString(),
    };

    setLoading(true);

    try {
      const res = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as ContactApiResponse | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error?.message || t('form.errorSendDesc'));
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
      const isTelegramStartIssue =
        /\/start|telegram[_\s-]?chat[_\s-]?id|chat\s+not\s+found/i.test(errorMessage);

      toast.error(t('form.errorSend'), {
        description:
          isTelegramStartIssue
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
            {/* Animations */}
            <style>{`
              @keyframes scan {
                0%{top:0;opacity:0}
                10%{opacity:1}
                90%{opacity:1}
                100%{top:100%;opacity:0}
              }

              @keyframes float {
                0%,100%{transform:translateY(0)}
                50%{transform:translateY(-6px)}
              }

              .scanline{
                position:absolute;
                height:2px;
                width:100%;
                background:linear-gradient(90deg,transparent,hsl(var(--accent)),transparent);
                animation:scan 2s linear infinite;
                filter:blur(1px);
              }

              @media (max-width:380px){
                form button{
                  font-size:13px;
                  letter-spacing:1px;
                }
              }
            `}</style>

            <h1 className="text-[40px] xs:text-[50px] sm:text-[65px] md:text-[65px] lg:text-[70px] leading-tight tracking-[2px] sm:tracking-[3px] md:tracking-[5px] text-center font-brush break-words pb-2 sm:mb-6 md:mb-8 bg-gradient-to-r from-transparent via-cyber-3 to-transparent bg-[length:90%] bg-no-repeat text-transparent bg-clip-text animate-textGlow">
              {t('contact.heading')}
            </h1>

            <form
              autoComplete="on"
              onSubmit={handleSubmit}
              className="
              bg-[hsl(var(--card)/0.1)]
              backdrop-blur-sm
              p-4 sm:p-6 md:p-6
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
                  className="w-full py-3 px-3 text-sm sm:text-base bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold uppercase tracking-[2px] transition-all duration-300 shadow-[var(--shadow-glow)] hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? t('form.sending') : sent ? t('form.sent') : t('form.submit')}
                </button>

                <button
                  type="reset"
                  onClick={() => setPhone('')}
                  className="w-full py-3 px-3 text-sm sm:text-base bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] font-bold uppercase tracking-[2px] transition-all duration-300 hover:bg-[hsl(var(--accent)/0.2)]"
                >
                  {t('form.reset')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
