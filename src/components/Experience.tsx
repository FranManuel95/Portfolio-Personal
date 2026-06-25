"use client";

import React from "react";
import Reveal from "./Reveal";

const experiences = [
  {
    role: "Especialista en IA",
    company: "Derecho Virtual",
    period: "Febrero 2026 — Actualidad",
    description:
      "Desarrollo e implementación de soluciones basadas en IA generativa y automatización de procesos que forman parte del núcleo del producto. Diseño de agentes conversacionales, sistemas RAG y flujos automatizados con n8n para la gestión de emails, validación de documentos y procesos educativos. Integración de múltiples LLMs (OpenAI, Claude, Gemini) con optimización de costes mediante orquestación de modelos.",
    highlight: true,
  },
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Enero 2025 — Marzo 2025",
    description:
      "Desarrollo de proyecto integral con Docker, PHP, Symfony, Next.js, React y TypeScript. Posteriormente, mejora de funcionalidades y optimización de una aplicación móvil desarrollada con Unity y C# para la empresa DPTelemetry.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    description:
      "Mejora de un sistema CRM desarrollado en Django (Python), centrado en optimizar la sección de facturas. Implementación de mejoras en la interfaz y funcionalidades para una gestión más ágil.",
  },
];

const Experience = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-12 text-[var(--text)]">
            Experiencia Profesional
          </h2>
        </Reveal>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <Reveal replay key={`${exp.company}-${i}`}>
              <article
                className={[
                  "glass-card p-6 relative overflow-hidden",
                  "transition-all duration-300 hover:-translate-y-0.5",
                  exp.highlight
                    ? "border-[var(--accent)]/40 shadow-[0_0_32px_-8px_var(--accent),0_16px_48px_rgba(0,0,0,0.5)]"
                    : "hover:shadow-[0_20px_48px_rgba(0,0,0,0.5)]",
                ].join(" ")}
              >
                {/* Barra de gradiente superior para el item destacado */}
                {exp.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                    style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                  />
                )}

                {/* Nodo glow del timeline */}
                <div
                  className={[
                    "absolute -left-1 top-6 w-2 h-2 rounded-full",
                    exp.highlight
                      ? "bg-[var(--accent)] shadow-[0_0_12px_4px_rgba(16,185,129,0.6)]"
                      : "bg-[var(--aurora-1)]/60 shadow-[0_0_8px_2px_rgba(14,165,233,0.3)]",
                  ].join(" ")}
                />

                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text)]">{exp.role}</h3>
                    <p className="mt-0.5 font-medium text-[var(--accent)]">
                      {exp.company}
                      {exp.highlight && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                          Actual
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-dim)] shrink-0">{exp.period}</p>
                </div>
                <p className="mt-3 text-[var(--text)]/90 leading-relaxed">{exp.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
