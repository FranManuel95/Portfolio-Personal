"use client";

import React, { useState } from "react";
import { Globe, BrainCircuit, Workflow, Mic } from "lucide-react";

const services = [
  {
    num: "01",
    icon: Globe,
    title: "Desarrollo Web",
    accent: "#60a5fa",
    items: [
      "Aplicaciones full-stack con Next.js y React",
      "APIs REST y arquitecturas serverless",
      "Autenticación, pagos y bases de datos en la nube",
      "Deploy en Vercel con CI/CD",
    ],
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "IA Generativa",
    accent: "#a78bfa",
    items: [
      "Sistemas RAG con bases de conocimiento propias",
      "Agentes conversacionales con memoria y herramientas",
      "Orquestación multi-modelo (OpenAI, Claude, Gemini)",
      "Optimización de costes por routing inteligente",
    ],
  },
  {
    num: "03",
    icon: Workflow,
    title: "Automatización",
    accent: "#fb923c",
    items: [
      "Flujos end-to-end con n8n",
      "Integración de webhooks y APIs externas",
      "Gestión automática de emails y documentos",
      "Pipelines de validación y procesamiento de datos",
    ],
  },
  {
    num: "04",
    icon: Mic,
    title: "Agentes Inteligentes",
    accent: "#34d399",
    items: [
      "Agentes de atención al cliente 24/7 (voz y chat)",
      "Agentes internos para tareas operativas",
      "Asistentes de voz con VAPI, Twilio y ElevenLabs",
      "Integración con CRMs y sistemas internos",
    ],
  },
];

const Services = () => {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="divide-y divide-[var(--line)]">
      {services.map((s, i) => {
        const Icon = s.icon;
        const isOpen = open === i;

        return (
          <div key={s.title}>
            <button
              onClick={() => setOpen(i)}
              className="w-full text-left py-5 md:py-6 group focus-visible:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4 md:gap-6">

                {/* Giant number — changes color when open */}
                <span
                  className="font-black leading-none tabular-nums flex-shrink-0 transition-all duration-500"
                  style={{
                    fontSize: "clamp(3rem, 10vw, 6rem)",
                    letterSpacing: "-0.05em",
                    color: isOpen ? s.accent : "rgba(245,245,245,0.06)",
                    textShadow: isOpen ? `0 0 60px ${s.accent}50` : "none",
                  }}
                >
                  {s.num}
                </span>

                {/* Title + Icon + Toggle */}
                <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
                  <h3
                    className="font-black uppercase tracking-tight truncate transition-colors duration-300"
                    style={{
                      fontSize: "clamp(1.1rem, 3.5vw, 1.875rem)",
                      color: isOpen ? s.accent : "var(--text)",
                    }}
                  >
                    {s.title}
                  </h3>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div
                      className="w-9 h-9 flex items-center justify-center border transition-all duration-300"
                      style={{
                        borderColor: isOpen ? `${s.accent}60` : "var(--line)",
                        color: isOpen ? s.accent : "var(--text-dim)",
                        background: isOpen ? `${s.accent}12` : "var(--bg-elev-2)",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className="w-5 text-xl font-light leading-none transition-all duration-300"
                      style={{ color: isOpen ? s.accent : "var(--text-dim)" }}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Expandable items — smooth height + opacity */}
            <div
              style={{
                maxHeight: isOpen ? "220px" : "0",
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.45s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
              }}
            >
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pb-6"
                style={{
                  paddingLeft: "clamp(3.5rem, 11vw, 7rem)",
                }}
              >
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-[var(--text-dim)] flex items-start gap-2"
                  >
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: s.accent }}
                    >
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Services;
