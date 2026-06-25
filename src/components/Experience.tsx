"use client";

import React, { useState } from "react";

const experiences = [
  {
    role: "Especialista en IA",
    company: "Derecho Virtual",
    period: "Feb 2026 — Actualidad",
    description:
      "Desarrollo e implementación de soluciones basadas en IA generativa y automatización de procesos que forman parte del núcleo del producto. Diseño de agentes conversacionales, sistemas RAG y flujos automatizados con n8n para gestión de emails, validación de documentos y procesos educativos. Integración de múltiples LLMs con optimización de costes mediante orquestación de modelos.",
    tags: ["n8n", "OpenAI", "Claude", "Gemini", "RAG", "Next.js", "Supabase", "TypeScript"],
    highlight: true,
  },
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Ene 2025 — Mar 2025",
    description:
      "Proyecto integral con Docker, PHP, Symfony, Next.js, React y TypeScript para un cliente enterprise. Posterior mejora de funcionalidades y optimización de una aplicación móvil con Unity y C# para DPTelemetry.",
    tags: ["Next.js", "React", "TypeScript", "Docker", "Symfony", "PHP", "Unity", "C#"],
    highlight: false,
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    description:
      "Mejora de un sistema CRM en Django (Python), centrado en optimizar la sección de facturas. Implementación de mejoras en la interfaz y funcionalidades para una gestión más ágil y eficiente.",
    tags: ["Django", "Python"],
    highlight: false,
  },
];

const Experience = () => {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="relative">
      {/* Vertical timeline rail */}
      <div
        className="absolute top-0 bottom-0"
        style={{ left: "11px", width: "1px", background: "var(--line)" }}
      />

      <div className="divide-y divide-[var(--line)]">
        {experiences.map((e, i) => {
          const isOpen = open === i;

          return (
            <div key={e.company} className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-0 top-6 w-6 h-6 flex items-center justify-center">
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-400"
                  style={{
                    background: isOpen ? "var(--accent)" : "var(--bg-elev-3)",
                    border: `1px solid ${isOpen ? "var(--accent)" : "var(--line)"}`,
                    boxShadow: isOpen ? "0 0 12px rgba(0,255,135,0.6)" : "none",
                  }}
                />
              </div>

              {/* Clickable header */}
              <button
                onClick={() => setOpen(i)}
                className="w-full text-left py-5 md:py-6 focus-visible:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[11px] font-mono uppercase tracking-widest transition-colors duration-300"
                        style={{ color: isOpen ? "var(--accent)" : "var(--text-dim)" }}
                      >
                        {e.period}
                      </span>
                      {e.highlight && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 border font-mono uppercase tracking-wider"
                          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                        >
                          Actual
                        </span>
                      )}
                    </div>

                    <h3
                      className="font-black uppercase tracking-tight transition-colors duration-300"
                      style={{
                        fontSize: "clamp(1rem, 3vw, 1.5rem)",
                        color: isOpen ? "var(--text)" : "var(--text-dim)",
                      }}
                    >
                      {e.role}
                    </h3>

                    <p
                      className="text-sm font-semibold mt-0.5 transition-colors duration-300"
                      style={{ color: isOpen ? "var(--accent)" : "var(--text-dim)" }}
                    >
                      {e.company}
                    </p>
                  </div>

                  <span
                    className="text-xl font-light flex-shrink-0 mt-1 transition-colors duration-300"
                    style={{ color: isOpen ? "var(--accent)" : "var(--text-dim)" }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
              </button>

              {/* Expandable detail */}
              <div
                style={{
                  maxHeight: isOpen ? "400px" : "0",
                  opacity: isOpen ? 1 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.45s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
                }}
              >
                <p className="text-[var(--text-dim)] text-sm leading-relaxed pb-4">
                  {e.description}
                </p>

                {e.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-6">
                    {e.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 bg-[var(--bg-elev-2)] border border-[var(--line)] text-[var(--text-dim)] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;
