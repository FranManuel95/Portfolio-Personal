"use client";

import React from "react";
import Reveal from "./Reveal";

const experiences = [
  {
    role: "Especialista en IA",
    company: "Derecho Virtual",
    period: "Feb 2026 — Actualidad",
    description:
      "Desarrollo e implementación de soluciones basadas en IA generativa y automatización de procesos que forman parte del núcleo del producto. Diseño de agentes conversacionales, sistemas RAG y flujos automatizados con n8n para la gestión de emails, validación de documentos y procesos educativos. Integración de múltiples LLMs con optimización de costes mediante orquestación de modelos.",
    tags: ["n8n", "OpenAI", "Claude", "Gemini", "RAG", "Next.js", "Supabase", "TypeScript"],
    highlight: true,
  },
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Ene 2025 — Mar 2025",
    description:
      "Desarrollo de proyecto integral con Docker, PHP, Symfony, Next.js, React y TypeScript. Posteriormente, mejora de funcionalidades y optimización de una aplicación móvil desarrollada con Unity y C# para la empresa DPTelemetry.",
    tags: ["Next.js", "React", "TypeScript", "Docker", "Symfony", "PHP", "Unity", "C#"],
    highlight: false,
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    description:
      "Mejora de un sistema CRM desarrollado en Django (Python), centrado en optimizar la sección de facturas. Implementación de mejoras en la interfaz y funcionalidades para una gestión más ágil.",
    tags: ["Django", "Python"],
    highlight: false,
  },
];

const Experience = () => {
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      {experiences.map((exp, i) => (
        <Reveal replay key={`${exp.company}-${i}`} delayMs={i * 80}>
          <div className="flex gap-6">
            {/* Large number node */}
            <div className="flex-shrink-0 w-16 text-right">
              <span
                className="text-5xl font-black leading-none"
                style={{ color: "var(--bg-elev-3)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Content */}
            <div
              className="flex-1 border-t-2 pt-4"
              style={{ borderColor: exp.highlight ? "var(--accent)" : "var(--line)" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="text-base md:text-lg font-bold uppercase tracking-tight text-[var(--text)]">
                    {exp.role}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--accent)] flex items-center gap-2">
                    {exp.company}
                    {exp.highlight && (
                      <span className="text-[10px] px-2 py-0.5 border border-[var(--accent)]/40 text-[var(--accent)] font-mono uppercase tracking-wider">
                        Actual
                      </span>
                    )}
                  </p>
                </div>
                <time className="text-xs text-[var(--text-dim)] font-mono shrink-0 mt-1">
                  {exp.period}
                </time>
              </div>

              <p className="mt-3 text-sm text-[var(--text-dim)] leading-relaxed">
                {exp.description}
              </p>

              {/* Tech tags */}
              {exp.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
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
        </Reveal>
      ))}
    </div>
  );
};

export default Experience;
