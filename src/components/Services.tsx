"use client";

import React from "react";
import { Globe, BrainCircuit, Workflow, Mic } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    num: "01",
    icon: Globe,
    title: "Desarrollo Web",
    accent: "#60a5fa",
    textColor: "text-blue-400",
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
    textColor: "text-violet-400",
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
    textColor: "text-orange-400",
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
    textColor: "text-emerald-400",
    items: [
      "Agentes de atención al cliente 24/7 (voz y chat)",
      "Agentes internos para tareas operativas",
      "Asistentes de voz con VAPI, Twilio y ElevenLabs",
      "Integración con CRMs y sistemas internos",
    ],
  },
];

const Services = () => {
  return (
    <div className="divide-y divide-[var(--line)]">
      {services.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal replay key={s.title} delayMs={i * 60}>
            <div className="group grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[80px_200px_1fr] gap-4 md:gap-8 py-8 px-4 -mx-4 hover:bg-[var(--bg-elev-1)] transition-colors duration-200 cursor-default">

              {/* Number + Icon: desktop only column */}
              <div className="hidden lg:flex items-center gap-4">
                <span className="text-[var(--text-dim)]/40 font-mono text-sm tabular-nums">{s.num}</span>
                <div
                  className={`inline-flex items-center justify-center w-9 h-9 flex-shrink-0 ${s.textColor}`}
                  style={{ border: `1px solid ${s.accent}40`, background: "var(--bg-elev-2)" }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Title column */}
              <div className="flex items-center gap-3">
                {/* Mobile: show number+icon inline with title */}
                <div className="flex items-center gap-3 lg:hidden">
                  <span className="text-[var(--text-dim)]/40 font-mono text-xs tabular-nums">{s.num}</span>
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 flex-shrink-0 ${s.textColor}`}
                    style={{ border: `1px solid ${s.accent}40`, background: "var(--bg-elev-2)" }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className={`text-base font-bold uppercase tracking-tight ${s.textColor}`}>
                  {s.title}
                </h3>
              </div>

              {/* Items: 2-col on wider screens */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="text-sm text-[var(--text-dim)] flex items-start gap-2">
                    <span className="mt-[5px] flex-shrink-0 text-xs" style={{ color: s.accent }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};

export default Services;
