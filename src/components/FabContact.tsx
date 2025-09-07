"use client";

export default function FabContact() {
  return (
    <a
      href="#contacto"
      aria-label="Ir a la sección de contacto"
      title="Contactar ahora"
      className="
        fixed right-5 bottom-6 z-[60]
        inline-flex items-center gap-2
        px-4 py-3 rounded-xl
        bg-[color-mix(in_oklab,var(--accent)_18%,#000)]
        border border-[color-mix(in_oklab,var(--accent)_40%,var(--line))]
        text-[#eaf0ff] font-semibold
        shadow-[0_18px_40px_-24px_rgba(124,134,255,.7)]
        focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
      "
      style={{
        boxShadow:
          "0 12px 30px -18px rgba(124,134,255,.65), inset 0 1px 0 0 rgba(255,255,255,.03)",
      }}
    >
      <span
        
        className="h-2 w-2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #b8beff 0, #7c86ff 40%, rgba(124,134,255,0) 70%)",
          boxShadow: "0 0 18px rgba(124,134,255,.9)",
        }}
      />
      Contactar ahora
    </a>
  );
}
