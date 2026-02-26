import { lazy, Suspense, useEffect, useId, useState } from 'react';
import { AsYouType, type CountryCode } from 'libphonenumber-js';
import PhoneField from './PhoneField';

const PhoneInput = lazy(() => import('react-phone-number-input'));

type Props = {
  value?: string;
  onChange: (v?: string) => void;
  label?: string;
  placeholder?: string;
};

const detectCountryFromPhone = (phone?: string): CountryCode | undefined => {
  if (!phone) return undefined;
  const detector = new AsYouType();
  detector.input(phone);
  return detector.getCountry() ?? undefined;
};

export default function CyberPhoneInput({ value, onChange, label, placeholder }: Props) {
  const fieldId = useId();
  const [mounted, setMounted] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<CountryCode | undefined>(
    detectCountryFromPhone(value),
  );

  useEffect(() => {
    // CSS ham kech yuklanadi
    import('react-phone-number-input/style.css');
    setMounted(true);
  }, []);

  useEffect(() => {
    setDetectedCountry(detectCountryFromPhone(value));
  }, [value]);

  return (
    <div
      className="
  relative w-full group my-10

  rounded-md
  bg-[#000c24b3]
  backdrop-blur-md
  border border-cyan-400/30
  shadow-[0_0_15px_rgba(0,140,255,0.25),inset_0_0_10px_rgba(0,0,0,0.8)]
  transition-all duration-300

  focus-within:bg-[#00162ed0]
  focus-within:border-cyan-300
  focus-within:shadow-[0_0_25px_rgba(0,200,255,0.6),inset_0_0_12px_rgba(0,0,0,0.9)]

  flex items-center gap-3 pl-2 overflow-visible

  /* COUNTRY BLOCK */
  [&_.PhoneInputCountry]:relative
  [&_.PhoneInputCountry]:h-[50px]
  [&_.PhoneInputCountry]:flex
  [&_.PhoneInputCountry]:items-center
  [&_.PhoneInputCountry]:border-r
  [&_.PhoneInputCountry]:border-cyan-400/20
  [&_.PhoneInputCountry]:bg-[#020617]
  [&_.PhoneInputCountry]:rounded-l-md

  /* FLAG */
  [&_.PhoneInputCountryIcon]:w-6
  [&_.PhoneInputCountryIcon]:h-4
  [&_.PhoneInputCountryIcon]:rounded-sm
  [&_.PhoneInputCountryIcon]:shadow-[0_0_6px_rgba(0,255,255,0.6)]

  /* ARROW */
  [&_.PhoneInputCountrySelectArrow]:text-cyan-300
  [&_.PhoneInputCountrySelectArrow]:ml-1
  [&_.PhoneInputCountrySelectArrow]:opacity-0

  /* === SELECT DROPDOWN FIX === */
  [&_.PhoneInputCountrySelect]:absolute
  [&_.PhoneInputCountrySelect]:left-0
  [&_.PhoneInputCountrySelect]:top-[52px]
  [&_.PhoneInputCountrySelect]:z-[9999]
  [&_.PhoneInputCountrySelect]:w-[280px]
  [&_.PhoneInputCountrySelect]:max-h-[260px]
  [&_.PhoneInputCountrySelect]:overflow-y-auto
  [&_.PhoneInputCountrySelect]:rounded-md
  [&_.PhoneInputCountrySelect]:border
  [&_.PhoneInputCountrySelect]:border-cyan-400/40
  [&_.PhoneInputCountrySelect]:bg-[#020617f0]
  [&_.PhoneInputCountrySelect]:backdrop-blur-md
  [&_.PhoneInputCountrySelect]:shadow-[0_0_20px_rgba(0,255,255,0.35)]
  [&_.PhoneInputCountrySelect]:text-cyan-200
  [&_.PhoneInputCountrySelect]:outline-none

  /* OPTIONS */
  [&_.PhoneInputCountrySelect_option]:bg-[#020617]
  [&_.PhoneInputCountrySelect_option]:text-cyan-200

  /* INPUT */
  [&_.PhoneInputInput]:peer
  [&_.PhoneInputInput]:w-full
  [&_.PhoneInputInput]:h-[50px]
  [&_.PhoneInputInput]:pr-0 lg:[&_.PhoneInputInput]:pr-[160px]

  [&_.PhoneInputInput]:rounded-r-md
  [&_.PhoneInputInput]:bg-transparent
  [&_.PhoneInputInput]:text-cyan-300
  [&_.PhoneInputInput]:text-lg
  [&_.PhoneInputInput]:tracking-wider
  [&_.PhoneInputInput]:outline-none
  [&_.PhoneInputInput]:transition-all
  [&_.PhoneInputInput]:focus:shadow-[0_0_25px_rgba(0,200,255,0.6),inset_0_0_12px_rgba(0,0,0,0.9)]
  [&_.PhoneInputInput::placeholder]:text-cyan-500/40
"
    >
      <Suspense
        fallback={
          <div className="h-[50px] w-full rounded-md bg-[#00162ed0] animate-pulse border border-cyan-400/20" />
        }
      >
        {!mounted && (
          <input
            id={fieldId}
            type="tel"
            disabled
            aria-hidden="true"
            tabIndex={-1}
            className="sr-only"
          />
        )}
        {mounted && (
          <PhoneInput
            id={fieldId}
            international
            autoComplete="tel"
            placeholder={placeholder || label}
            value={value}
            // Prevent caret jumps on some mobile keyboards.
            smartCaret={false}
            country={detectedCountry}
            onCountryChange={(country) => {
              setDetectedCountry((country as CountryCode | undefined) ?? undefined);
            }}
            onChange={(nextValue) => {
              setDetectedCountry(detectCountryFromPhone(nextValue));
              onChange(nextValue);
            }}
            inputComponent={PhoneField}
          />
        )}
      </Suspense>

      {/* LABEL */}
      <label
        htmlFor={fieldId}
        className="
        absolute -top-6 left-0
        text-xs tracking-[2px] uppercase
        text-cyan-400/70
        transition-all duration-300
        group-focus-within:text-cyan-300
        group-focus-within:-translate-y-1
      "
      >
        {label}
      </label>

      {/* ACTIVE DOT */}
      <span
        className="
        absolute right-4 top-1/2 -translate-y-1/2
        w-2.5 h-2.5 rounded-full
        bg-cyan-400/40
        shadow-[0_0_10px_rgba(0,180,255,0.6)]
        transition-all duration-300
        group-focus-within:bg-cyan-300
        group-focus-within:scale-125
      "
      />

      {/* SCAN LINE */}
      <span
        className="
         pointer-events-none
         absolute left-0 top-0 w-full h-[2px]
         opacity-0
         bg-gradient-to-r from-transparent via-white to-transparent
         blur-[1px]
         group-focus-within:opacity-100
         group-focus-within:animate-scan
       "
      />

      {/* GLOW */}
      <span
        className="
        absolute inset-0 rounded-md
        bg-cyan-400/10
        opacity-0
        transition-opacity duration-300
        group-focus-within:opacity-100
        pointer-events-none
      "
      />

      {/* POWER BAR */}
      <span
        className="
        absolute bottom-0 left-0 h-[2px] w-full
        origin-left scale-x-0
        bg-gradient-to-r from-cyan-300 to-cyan-500/40
        transition-transform duration-300
        group-focus-within:scale-x-100
      "
      />
      {/* EQUALIZER */}
      <div className="absolute bottom-2 left-5 right-14 h-1 flex gap-[2px] opacity-0 group-focus-within:opacity-100">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 bg-cyan-400/40 animate-equalizer"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}
