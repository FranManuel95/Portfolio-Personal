"use client";

import React from "react";
import Reveal from "./Reveal";
import TechGalaxy from "./TechGalaxy";

const APTITUDES = [
  "Arquitectura de sistemas de IA",
  "Optimización de costes y procesos",
  "Resolución de problemas complejos",
  "Trabajo en equipo",
  "Adaptabilidad tecnológica",
];

const FORMACION = [
  {
    title: "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)",
    meta: "CESUR · 2023–2025",
  },
  {
    title: "n8n: Agentes de IA Avanzados — MCP, WhatsApp, Voz",
    meta: "Udemy · 2025",
  },
];

function FichaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--accent)] mb-1">
        {label}
      </p>
      <p className="text-sm text-[var(--text)] leading-relaxed">{value}</p>
    </div>
  );
}

const About = () => {
  return (
    <div>
      {/* Intro — two columns: bio + a "ficha" card that completes the profile */}
      <div className="grid lg:grid-cols-[1.45fr_1fr] gap-10 lg:gap-14 items-start mb-16 lg:mb-20">
        {/* LEFT — bio + pull quote */}
        <Reveal replay>
          <div>
            <p className="text-[var(--text)] text-lg leading-relaxed mb-5">
              Empecé en el{" "}
              <span className="text-[var(--accent-2)] font-medium">desarrollo full-stack</span>{" "}
              y me especialicé en{" "}
              <span className="text-[var(--accent-2)] font-medium">IA generativa aplicada</span>.
              Esa doble base es lo que me permite llevar la IA a producción de verdad, no quedarme
              en la demo.
            </p>
            <p className="text-[var(--text-dim)] text-base leading-relaxed mb-5">
              Controlo el sistema completo, desde la interfaz hasta la infraestructura de modelos,
              así que puedo optimizar costes, cuidar la calidad de las respuestas y desplegar
              soluciones estables y mantenibles.
            </p>
            <p className="text-[var(--text-dim)] text-base leading-relaxed">
              En{" "}
              <span className="text-[var(--accent)] font-semibold">Derecho Virtual</span> lidero la
              parte técnica de proyectos en los sectores jurídico y educativo, desde la concepción
              hasta producción, operando una plataforma con cientos de usuarios activos.
            </p>

            <blockquote
              className="mt-7 pl-4 border-l-2 text-[var(--text)] text-base italic leading-relaxed"
              style={{ borderColor: "var(--accent)" }}
            >
              «Construyo rápido, sin deuda técnica innecesaria, y entiendo el negocio que hay
              detrás del código.»
            </blockquote>
          </div>
        </Reveal>

        {/* RIGHT — profile card */}
        <Reveal replay delayMs={100}>
          <div className="border border-[var(--line)] bg-[var(--bg-elev-1)] p-6 lg:p-7 space-y-5">
            <FichaRow label="Rol actual" value="AI Engineer · Derecho Virtual" />
            <div className="h-px bg-[var(--line)]" />
            <FichaRow label="Ubicación" value="San Juan de Aznalfarache, Sevilla" />
            <div className="h-px bg-[var(--line)]" />
            <FichaRow label="Idiomas" value="Español (nativo) · Inglés (B1)" />
            <div className="h-px bg-[var(--line)]" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--accent)] mb-2">
                Formación
              </p>
              <ul className="space-y-2.5">
                {FORMACION.map((f) => (
                  <li key={f.title}>
                    <p className="text-sm text-[var(--text)] leading-snug">{f.title}</p>
                    <p className="text-xs text-[var(--text-dim)] mt-0.5">{f.meta}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[var(--text-dim)] leading-relaxed">
                <span className="text-[var(--accent)] font-semibold">+ Autodidacta:</span> mi
                especialización en IA, agentes y automatización es autoformación continua, afinada
                cada día en producción.
              </p>
            </div>
            <div className="h-px bg-[var(--line)]" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--accent)] mb-2.5">
                Aptitudes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {APTITUDES.map((a) => (
                  <span
                    key={a}
                    className="px-2 py-1 text-[11px] text-[var(--text-dim)] border border-[var(--line)]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Galaxy title */}
      <Reveal replay>
        <div className="text-center mb-2">
          <h3
            className="font-black uppercase tracking-tight inline-block"
            style={{ fontSize: "clamp(1.6rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            <span style={{ color: "var(--text)" }}>Mi </span>
            <span style={{ color: "var(--accent)" }}>stack</span>
          </h3>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)]">
            Un sistema solar de tecnologías · explóralo
          </p>
        </div>
      </Reveal>

      {/* Tech Galaxy */}
      <Reveal replay delayMs={120}>
        <TechGalaxy />
      </Reveal>
    </div>
  );
};

export default About;
