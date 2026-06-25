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
        px-4 py-3
        bg-[var(--bg-elev-2)]
        border border-[var(--accent)]/30
        text-[var(--text)] font-semibold text-sm
        transition-all duration-300
        hover:border-[var(--accent)]/60 hover:bg-[var(--bg-elev-3)]
      "
      style={{
        boxShadow: "0 12px 40px -18px rgba(0,255,135,0.45)",
      }}
    >
      <span
        className="h-2 w-2 rounded-full animate-pulse-dot"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 10px rgba(0,255,135,0.8)",
        }}
      />
      Contactar
    </a>
  );
}
