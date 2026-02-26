import profileImg from '@/assets/heroSection.webp';
import { QRCodeCanvas } from 'qrcode.react';
import { useRef, useState } from 'react';

import { Lang, resumeTranslations } from './resumeTranslations';

export default function Resume() {
  const [lang, setLang] = useState<Lang>('uz');
  const languages = [
    { code: 'uz', label: "O'zbekcha 🇺🇿" },
    { code: 'ru', label: 'Русский 🇷🇺' },
    { code: 'en', label: 'English 🇬🇧' },
  ];

  const t = resumeTranslations[lang];

  const resumeRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!resumeRef.current) return;

    document.body.classList.add('printing');

    try {
      // faqat tugma bosilganda yuklanadi
      const html2pdf = (await import('html2pdf.js')).default;

      await html2pdf()
        .set({
          margin: 0,
          filename: 'Ismatov_Olmasjon_Resume.pdf',
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(resumeRef.current)
        .save();
    } finally {
      document.body.classList.remove('printing');
    }
  };

  return (
    <div className="bg-neutral-200 min-h-screen py-6 sm:py-10 md:py-16 px-3 sm:px-6">
      <div className="fixed bottom-4 right-4 sm:top-6 sm:bottom-auto sm:right-6 z-50 flex flex-row sm:flex-col items-center gap-2 sm:gap-3 print:hidden">
        {/* LANGUAGE SELECT */}
        <div className="relative">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="
        appearance-none
        bg-white
        border border-gray-300
        text-gray-700
        px-4 py-2 pr-10
        rounded-lg
        shadow
        text-sm
        cursor-pointer
        hover:border-emerald-500
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
      "
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {/* custom arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            ▼
          </div>
        </div>

        {/* DOWNLOAD PDF */}
        <button
          onClick={downloadPDF}
          className="
      px-4 py-2
      bg-black
      text-white
      rounded-lg
      shadow
      text-sm
      hover:bg-emerald-600
      transition
    "
        >
          ⬇ {t.download}
        </button>
      </div>

      {/* RESUME PAPER */}
      <div
        ref={resumeRef}
        className="
    bg-white
    shadow-2xl
    mx-auto
    flex
    flex-col
    md:flex-row
    w-full
    max-w-[900px]
    md:max-w-[210mm]
    min-h-[auto]
    md:min-h-[297mm]
    overflow-hidden
  "
      >
        {/* SIDEBAR */}
        <div className="w-full md:w-[35%] bg-slate-900 text-white p-5 sm:p-6">
          <div className="text-center mb-6">
            <img
              src={profileImg}
              alt="Ismatov Olmasjon"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mx-auto border-4 border-emerald-500 object-cover"
            />

            <h1 className="text-2xl font-bold mt-4">ISMATOV O'LMASJON</h1>
            <p className="text-slate-300">{t.job}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-emerald-400 font-semibold mb-2">{t.contact}</h3>
            <p>📞 +998 90 123 45 67</p>
            <p>💬 Telegram: @ulmasjon96</p>
            <p>🌐 github.com/ulmasjon96</p>
            <p>📍 Tashkent, Uzbekistan</p>
          </div>

          <div className="mb-6">
            <h3 className="text-emerald-400 font-semibold mb-2">PORTFOLIO</h3>
            <div className="bg-white p-2 inline-block">
              <QRCodeCanvas value="https://ulmasjon96.github.io/My-Portfolio/#" size={90} />
            </div>
          </div>

          <div>
            <h3 className="text-emerald-400 font-semibold mb-2">{t.availability}</h3>
            <p>Immediate start</p>
            <p>Remote / Freelance</p>
            <p>Open for relocation</p>
          </div>
        </div>

        {/* MAIN */}
        <div className="w-full md:w-[65%] p-5 sm:p-7 md:p-10 text-gray-800">
          {/* PROFILE */}
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-emerald-500 mb-2">
              {t.profileTitle}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">{t.profileText}</p>
          </section>

          {/* SKILLS */}
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-emerald-500 mb-2">
              {t.skillsTitle}
            </h2>
            <ul className="list-disc ml-5 text-sm sm:text-base leading-relaxed">
              {t.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </section>

          {/* ACHIEVEMENTS */}
          <section className="mb-6">
            <h2 className="text-lg font-bold border-b-2 border-emerald-500 mb-2">
              {t.achievementsTitle}
            </h2>
            <ul className="list-disc ml-5 text-sm sm:text-base leading-relaxed">
              {t.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>

          {/* PROJECTS */}
          <section>
            <h2 className="text-lg font-bold border-b-2 border-emerald-500 mb-2">
              {t.projectsTitle}
            </h2>
            {t.projects.map((p, i) => (
              <p key={i} className="text-sm sm:text-base leading-relaxed">
                <b>{p}</b>
              </p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
