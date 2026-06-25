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
  const [active, setActive] = useState(0);
  const exp = experiences[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] border border-[var(--line)]">
      {/* LEFT: Company tab list */}
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-[var(--line)]">
        {experiences.map((e, i) => (
          <button
            key={e.company}
            onClick={() => setActive(i)}
            className={["exp-tab flex-shrink-0", active === i ? "active" : ""].join(" ")}
          >
            <div className="font-bold text-sm uppercase tracking-tight whitespace-nowrap">
              {e.company}
            </div>
            <div className="text-[10px] font-mono text-[var(--text-dim)] mt-0.5 whitespace-nowrap">
              {e.period}
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT: Detail panel */}
      <div className="p-6 lg:px-10 lg:py-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <h3 className="text-xl font-bold text-[var(--text)] tracking-tight">{exp.role}</h3>
            <p className="text-[var(--accent)] text-sm font-semibold mt-1 flex items-center gap-2">
              {exp.company}
              {exp.highlight && (
                <span className="text-[10px] px-2 py-0.5 border border-[var(--accent)]/40 font-mono uppercase tracking-wider">
                  Actual
                </span>
              )}
            </p>
          </div>
          <time className="text-xs text-[var(--text-dim)] font-mono bg-[var(--bg-elev-2)] px-3 py-1.5 border border-[var(--line)] whitespace-nowrap flex-shrink-0">
            {exp.period}
          </time>
        </div>

        <p className="text-[var(--text-dim)] leading-relaxed text-sm">{exp.description}</p>

        {exp.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {exp.tags.map((tag) => (
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
};

export default Experience;
