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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {services.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal replay key={s.title} delayMs={80 + i * 60}>
            <div
              className="border-l-2 pl-6 py-4"
              style={{ borderColor: s.accent }}
            >
              <div className="flex items-start gap-3 mb-2">
                <span
                  className="text-5xl font-black leading-none select-none"
                  style={{ color: "var(--bg-elev-3)" }}
                >
                  {s.num}
                </span>
                <div
                  className={`inline-flex items-center justify-center w-9 h-9 mt-1 border border-[var(--line)] bg-[var(--bg-elev-2)] ${s.textColor} flex-shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className={`text-xl font-bold uppercase tracking-tight ${s.textColor} -mt-1 mb-3`}>
                {s.title}
              </h3>
              <ul className="space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="text-sm text-[var(--text-dim)]">
                    — {item}
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
