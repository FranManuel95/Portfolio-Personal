"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const experiences = [
  {
    role: "AI Engineer / Especialista en IA",
    company: "Derecho Virtual",
    period: "Feb 2026 — Presente",
    bullets: [
      "Lidero la parte técnica de varios proyectos digitales (sectores jurídico y educativo), desde la concepción hasta producción.",
      "Diseño y despliego MCP Servers propios para casos de uso jurídicos, integrando Claude con herramientas y datos internos.",
      "Desarrollo un sistema RAG con recuperación semántica sobre normativa legal (Pinecone) para consultar documentación jurídica.",
      "Construyo un agente comercial por WhatsApp (UltraMsg / Baileys + OpenClaw) y agentes de comunicación interna.",
      "Optimizo costes mediante routing inteligente entre LLMs (Claude, OpenAI, Gemini) según el tipo de operación.",
      "Opero una plataforma con cientos de alumnos activos y múltiples automatizaciones en producción.",
    ],
    tags: ["Claude", "OpenAI", "Gemini", "MCP Servers", "RAG", "Pinecone", "n8n", "Airtable", "OpenClaw", "Next.js", "TypeScript"],
    highlight: true,
  },
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Ene 2025 — Mar 2025",
    bullets: [
      "Desarrollo integral de una aplicación web en producción con Docker, PHP/Symfony en backend y Next.js, React y TypeScript en frontend.",
      "Optimización de rendimiento y escalabilidad de aplicaciones web en entornos de producción reales.",
      "Desarrollo y optimización de una aplicación móvil en Unity y C# para el cliente DPTelemetry.",
      "Trabajo en equipo ágil con Scrum: code reviews, planificación de sprints y entrega continua.",
    ],
    tags: ["Next.js", "React", "TypeScript", "Docker", "PHP", "Symfony", "Unity", "C#", "Scrum"],
    highlight: false,
  },
  {
    role: "Desarrollador Web",
    company: "Amograe Internacional",
    period: "Ene 2024 — Dic 2024",
    bullets: [
      "Mejora y evolución de un sistema CRM/ERP en Django (Python), con foco en el módulo de facturación.",
      "Optimización de UI/UX: filtros avanzados, validaciones y gestión de estados de documentos.",
      "Reducción de incidencias mejorando workflows internos y el rendimiento del sistema.",
    ],
    tags: ["Django", "Python", "MySQL", "UI/UX"],
    highlight: false,
  },
];

const N = experiences.length;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Experience = () => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (i: number) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  const e = experiences[active];

  return (
    <div>
      {/* ── Company selector ─────────────────────────────────── */}
      <div className="flex border-b border-[var(--line)] mb-10">
        {experiences.map((exp, i) => {
          const sel = active === i;
          return (
            <button
              key={exp.company}
              onClick={() => go(i)}
              className="flex-1 py-4 px-3 md:px-6 text-left relative focus-visible:outline-none group"
            >
              <span
                className="block text-[10px] font-mono uppercase tracking-widest mb-1 transition-colors duration-300"
                style={{ color: sel ? "var(--accent)" : "var(--text-dim)" }}
              >
                0{i + 1}
              </span>
              <span
                className="block font-black uppercase text-xs md:text-sm tracking-tight leading-tight transition-colors duration-300"
                style={{ color: sel ? "var(--text)" : "var(--text-dim)" }}
              >
                {exp.company}
              </span>

              {/* Animated underline */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                initial={false}
                animate={{
                  scaleX: sel ? 1 : 0,
                  background: "var(--accent)",
                  boxShadow: sel ? "0 0 14px rgba(0,255,135,0.7)" : "none",
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "left" }}
              />
            </button>
          );
        })}
      </div>

      {/* ── Animated panel ───────────────────────────────────── */}
      <div style={{ position: "relative", minHeight: 260, overflow: "hidden" }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={active}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="relative">
              {/* Giant background number */}
              <span
                aria-hidden
                className="absolute -top-6 -left-1 font-black pointer-events-none select-none leading-none"
                style={{
                  fontSize: "clamp(7rem, 22vw, 15rem)",
                  color: "rgba(245,245,245,0.03)",
                  letterSpacing: "-0.05em",
                }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3
                      className="font-black uppercase tracking-tight text-[var(--text)]"
                      style={{ fontSize: "clamp(1.2rem, 3.5vw, 2rem)", letterSpacing: "-0.03em" }}
                    >
                      {e.role}
                    </h3>
                    <p className="text-[var(--accent)] text-sm font-semibold mt-1 flex items-center gap-2">
                      {e.company}
                      {e.highlight && (
                        <span className="text-[10px] px-2 py-0.5 border border-[var(--accent)]/40 font-mono uppercase tracking-wider">
                          Actual
                        </span>
                      )}
                    </p>
                  </div>
                  <time className="text-xs text-[var(--text-dim)] font-mono bg-[var(--bg-elev-2)] px-3 py-1.5 border border-[var(--line)] whitespace-nowrap flex-shrink-0">
                    {e.period}
                  </time>
                </div>

                {/* Description */}
                <ul className="mb-6 max-w-2xl space-y-2">
                  {e.bullets.map((b, bi) => (
                    <li key={bi} className="text-[var(--text-dim)] text-sm leading-relaxed flex items-start gap-2">
                      <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-[var(--accent)] opacity-60" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Tags with stagger */}
                <motion.div
                  className="flex flex-wrap gap-1.5"
                  initial="hidden"
                  animate="show"
                  variants={{
                    show: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
                  }}
                >
                  {e.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      variants={{
                        hidden: { opacity: 0, scale: 0.85 },
                        show: { opacity: 1, scale: 1, transition: { ease: [0.22, 1, 0.36, 1] } },
                      }}
                      className="text-[11px] px-2 py-0.5 bg-[var(--bg-elev-2)] border border-[var(--line)] text-[var(--text-dim)] font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--line)]">
        <button
          onClick={() => go(active - 1)}
          disabled={active === 0}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-20 hover:text-[var(--accent)]"
          style={{ color: "var(--text-dim)" }}
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-3">
          {experiences.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => go(i)}
              animate={{
                width: active === i ? 24 : 8,
                background: active === i ? "var(--accent)" : "var(--line)",
                boxShadow: active === i ? "0 0 10px rgba(0,255,135,0.7)" : "none",
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: 8, borderRadius: 0 }}
              aria-label={`Ir a ${experiences[i].company}`}
            />
          ))}
        </div>

        <button
          onClick={() => go(active + 1)}
          disabled={active === N - 1}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-20 hover:text-[var(--accent)]"
          style={{ color: "var(--text-dim)" }}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default Experience;
