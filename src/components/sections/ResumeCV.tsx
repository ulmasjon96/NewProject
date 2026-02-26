export default function ResumeCV() {
  return (
    <section id="resume" className="bg-neutral-100 py-16 scroll-mt-28">
      <div className="max-w-5xl mx-auto shadow-2xl bg-white grid grid-cols-12 print:shadow-none">
        {/* LEFT SIDEBAR */}
        <aside className="col-span-4 bg-neutral-900 text-white p-8 space-y-8">
          {/* Avatar */}
          <div className="text-center">
            <img
              src="/profile.jpg"
              alt="profile"
              className="w-36 h-36 mx-auto rounded-full object-cover border-4 border-white"
            />
            <h2 className="mt-4 text-xl font-bold">Ismatov O'lmasjon</h2>
            <p className="text-sm text-gray-300">Frontend Developer</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="uppercase text-sm tracking-widest border-b border-gray-600 pb-2 mb-3">
              Contact
            </h3>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>📞 +998 XX XXX XX XX</li>
              <li>✉️ yourmail@gmail.com</li>
              <li>🌐 ulmasjon96.github.io</li>
              <li>💬 t.me/ulmasjon96</li>
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="uppercase text-sm tracking-widest border-b border-gray-600 pb-2 mb-3">
              Skills
            </h3>

            {[
              ['React', 90],
              ['TypeScript', 85],
              ['Tailwind CSS', 90],
              ['JavaScript', 85],
              ['Git', 80],
            ].map(([name, value]) => (
              <div key={name as string} className="mb-3">
                <p className="text-xs mb-1">{name}</p>
                <div className="w-full h-2 bg-gray-700">
                  <div className="h-2 bg-cyan-400" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div>
            <h3 className="uppercase text-sm tracking-widest border-b border-gray-600 pb-2 mb-3">
              Languages
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Uzbek — Native</li>
              <li>Russian — Intermediate</li>
              <li>English — Technical Reading</li>
            </ul>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="col-span-8 p-10 space-y-10">
          {/* Profile */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Profile</h2>
            <p className="text-gray-700 leading-7 text-sm">
              Frontend Developer specializing in building responsive and high-performance web
              applications using React and TypeScript. Focused on reusable component architecture,
              UI/UX quality and performance optimization through lazy loading and code splitting.
            </p>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Projects & Experience</h2>

            <div className="mb-5">
              <h4 className="font-semibold">Personal Portfolio Website</h4>
              <p className="text-sm text-gray-500 mb-2">React • TypeScript • Tailwind</p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>Multi-language responsive portfolio</li>
                <li>Lazy loading & code splitting optimization</li>
                <li>Telegram contact form integration</li>
                <li>SEO & social preview configuration</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Reusable UI Component System</h4>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                <li>Inputs, modals, tooltips, and buttons</li>
                <li>Component architecture and maintainability</li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-2xl font-bold mb-3">Education</h2>
            <p className="text-sm text-gray-700">
              Self-taught Frontend Developer — focused on practical projects, documentation learning
              and real UI implementation.
            </p>
          </div>

          {/* DOWNLOAD CV BUTTON */}
          <div className="mt-12 text-center print:hidden">
            <a
              href={`${import.meta.env.BASE_URL}Ismatov_Olmasjon_Frontend_Developer_CV.pdf`}
              download
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-neutral-900 text-white font-semibold text-lg shadow-xl hover:scale-105 hover:bg-neutral-800 transition-all duration-300"
            >
              📄 Download Full Resume (PDF)
            </a>

            <p className="text-xs text-gray-500 mt-3">
              Click to download my complete CV in PDF format
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
