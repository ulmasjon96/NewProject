/* ================= TEXTAREA ================= */
interface CyberTextareaProps {
  label: string;
  name: string;
  id?: string;
  placeholder?: string;
}

function CyberTextarea({ label, name, id, placeholder }: CyberTextareaProps) {
  const fieldId = id || name;

  return (
    <div className="relative w-full group my-12">
      <textarea
        id={fieldId}
        name={name}
        required
        autoComplete="off"
        placeholder={placeholder || label}
        rows={5}
        className="
        peer w-full max-h-[100px]
        px-5 pt-2 pb-10 pr-14
        rounded-md
        resize-none
        bg-[#000c24b3]
        text-cyan-300
        text-lg tracking-wider
        outline-none
        border border-cyan-400/30
        backdrop-blur-md
        shadow-[0_0_15px_rgba(0,140,255,0.25),inset_0_0_10px_rgba(0,0,0,0.8)]
        transition-all duration-300
        focus:bg-[#00162ed0]
        focus:border-cyan-300
        focus:shadow-[0_0_25px_rgba(0,200,255,0.6),inset_0_0_12px_rgba(0,0,0,0.9)]
        placeholder:text-cyan-500/40
      "
      />

      {/* LABEL */}
      <label
        htmlFor={fieldId}
        className="
  absolute -top-6 left-0
  text-xs tracking-[2px] uppercase
  text-cyan-400/70
  transition-all duration-300
  peer-focus:text-cyan-300
  peer-focus:-translate-y-1
"
      >
        {label}
      </label>

      {/* ACTIVE DOT */}
      <span
        className="
        absolute right-4 top-6
        w-2.5 h-2.5 rounded-full
        bg-cyan-400/40
        shadow-[0_0_10px_rgba(0,180,255,0.6)]
        transition-all duration-300
        peer-focus:bg-cyan-300
        peer-focus:scale-125
      "
      />

      {/* VERTICAL SCAN LINE */}
      <span
        className="
        pointer-events-none
        absolute left-0 top-0
        w-full h-[2px]
        opacity-0
        bg-gradient-to-r from-transparent via-white to-transparent
        blur-[1px]
        peer-focus:opacity-100
        peer-focus:animate-scan-vertical
      "
      />

      {/* GLOW OVERLAY */}
      <span
        className="
        absolute inset-0 rounded-md
        bg-cyan-400/10
        opacity-0
        transition-opacity duration-300
        peer-focus:opacity-100
        pointer-events-none
      "
      />

      {/* BOTTOM POWER BAR */}
      <span
        className="
        absolute bottom-0 left-0 h-[2px] w-full
        origin-left scale-x-0
        bg-gradient-to-r from-cyan-300 to-cyan-500/40
        transition-transform duration-300
        peer-focus:scale-x-100
      "
      />

      {/* DATA BARS */}
      <div className="absolute bottom-3 left-5 right-14 h-1 flex gap-[2px] opacity-0 peer-focus:opacity-100">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="flex-1 bg-cyan-400/40 animate-equalizer"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default CyberTextarea;
