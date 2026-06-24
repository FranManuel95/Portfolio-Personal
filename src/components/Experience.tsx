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
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)]/40 to-[var(--bg)]" />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-14">
            Experiencia Profesional
          </h2>
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-3 bottom-4 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--line)] to-transparent" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <Reveal replay key={`${exp.company}-${i}`} delayMs={i * 80}>
                <div className="flex gap-5 md:gap-7">
                  {/* Timeline node */}
                  <div className="relative flex-shrink-0 mt-1.5">
                    <div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "border-2 font-bold text-xs tracking-tight",
                        exp.highlight
                          ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_18%,var(--bg))] text-[var(--accent)] shadow-[0_0_20px_-4px_rgba(16,185,129,0.5)]"
                          : "border-[var(--line)] bg-[var(--bg-elev-2)] text-[var(--text-dim)]",
                      ].join(" ")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Card */}
                  <article
                    className={[
                      "flex-1 surface p-5 md:p-6 transition-all duration-300",
                      exp.highlight
                        ? "border-[var(--accent)]/25 shadow-[0_0_40px_-12px_rgba(16,185,129,0.25)]"
                        : "hover:border-[var(--line)]/80",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-[var(--text)]">
                          {exp.role}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-[var(--accent)]">
                          {exp.company}
                          {exp.highlight && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/12 border border-[var(--accent)]/25 align-middle">
                              Actual
                            </span>
                          )}
                        </p>
                      </div>
                      <time className="text-xs text-[var(--text-dim)] shrink-0 mt-1 font-mono">
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
                            className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-elev-3)] border border-[var(--line)] text-[var(--text-dim)] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
