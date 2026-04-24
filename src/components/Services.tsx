"use client";

import React from "react";
import Reveal from "./Reveal";

/* =========================================================================
   Services — placeholder limpio.
   La versión pixel-art (oficina agéntica con personajes animados) se ha
   descartado. Pendiente: rediseñar con sprites generados vía PixelLab MCP
   cuando la integración esté activa y la documentación esté disponible.
   ========================================================================= */

type Service = {
  id: string;
  title: string;
  role: string;
  accent: string;
  items: string[];
};

const services: Service[] = [
  {
    id: "web",
    title: "Desarrollo Web",
    role: "Full-stack Engineer",
    accent: "#60a5fa",
    items: [
      "Aplicaciones full-stack con Next.js y React",
      "APIs REST y arquitecturas serverless",
      "Autenticación, pagos y bases de datos en la nube",
      "Deploy en Vercel con CI/CD",
    ],
  },
  {
    id: "ai",
    title: "IA Generativa",
    role: "AI Architect",
    accent: "#a78bfa",
    items: [
      "Sistemas RAG con bases de conocimiento propias",
      "Agentes conversacionales con memoria y herramientas",
      "Orquestación multi-modelo (OpenAI, Claude, Gemini)",
      "Optimización de costes por routing inteligente",
    ],
  },
  {
    id: "auto",
    title: "Automatización",
    role: "Workflow Hacker",
    accent: "#fb923c",
    items: [
      "Flujos end-to-end con n8n",
      "Integración de webhooks y APIs externas",
      "Gestión automática de emails y documentos",
      "Pipelines de validación y procesamiento de datos",
    ],
  },
  {
    id: "agents",
    title: "Agentes Inteligentes",
    role: "Agent Whisperer",
    accent: "#34d399",
    items: [
      "Agentes de atención al cliente 24/7 (voz y chat)",
      "Agentes internos para tareas operativas y de empresa",
      "Asistentes de voz con VAPI, Twilio y ElevenLabs",
      "Integración con CRMs y sistemas internos",
    ],
  },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      className="card p-6 flex flex-col gap-3"
      style={{
        borderTop: `2px solid ${service.accent}`,
      }}
    >
      <header>
        <div
          className="text-[11px] uppercase tracking-widest mb-2"
          style={{ color: service.accent, letterSpacing: "0.12em" }}
        >
          {service.role}
        </div>
        <h3 className="text-xl font-semibold">{service.title}</h3>
      </header>
      <ul className="flex flex-col gap-2 mt-2">
        {service.items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-[var(--text-dim)] leading-relaxed">
            <span
              aria-hidden
              className="mt-[6px] inline-block w-1.5 h-1.5 rounded-sm flex-shrink-0"
              style={{ background: service.accent }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

const Services = () => {
  return (
    <section id="services" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]" />

      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-3">
            Servicios
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-10 max-w-2xl mx-auto">
            Cuatro líneas de trabajo complementarias: desarrollo web moderno, IA generativa,
            automatización de procesos y agentes inteligentes.
          </p>
        </Reveal>

        <Reveal replay delayMs={120}>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Services;
