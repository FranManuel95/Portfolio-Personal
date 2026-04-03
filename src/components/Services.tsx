"use client";

import React from "react";
import { Globe, BrainCircuit, Workflow, Mic } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    icon: <Globe className="w-7 h-7" />,
    title: "Desarrollo Web",
    color: "text-blue-400",
    border: "border-blue-400/20 hover:border-blue-400/50",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(96,165,250,0.4)]",
    items: [
      "Aplicaciones full-stack con Next.js y React",
      "APIs REST y arquitecturas serverless",
      "Autenticación, pagos y bases de datos en la nube",
      "Deploy en Vercel con CI/CD",
    ],
  },
  {
    icon: <BrainCircuit className="w-7 h-7" />,
    title: "IA Generativa",
    color: "text-violet-400",
    border: "border-violet-400/20 hover:border-violet-400/50",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(167,139,250,0.4)]",
    items: [
      "Sistemas RAG con bases de conocimiento propias",
      "Agentes conversacionales con memoria y herramientas",
      "Orquestación multi-modelo (OpenAI, Claude, Gemini)",
      "Optimización de costes por routing inteligente",
    ],
  },
  {
    icon: <Workflow className="w-7 h-7" />,
    title: "Automatización",
    color: "text-orange-400",
    border: "border-orange-400/20 hover:border-orange-400/50",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(251,146,60,0.4)]",
    items: [
      "Flujos end-to-end con n8n",
      "Integración de webhooks y APIs externas",
      "Gestión automática de emails y documentos",
      "Pipelines de validación y procesamiento de datos",
    ],
  },
  {
    icon: <Mic className="w-7 h-7" />,
    title: "Agentes de Voz",
    color: "text-emerald-400",
    border: "border-emerald-400/20 hover:border-emerald-400/50",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(52,211,153,0.4)]",
    items: [
      "Asistentes telefónicos con VAPI y Twilio",
      "Síntesis de voz natural con ElevenLabs",
      "Agentes autónomos con lógica de negocio",
      "Integración con CRMs y sistemas internos",
    ],
  },
];

const Services = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]" />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-2">
            ¿En qué puedo ayudarte?
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-10 max-w-2xl mx-auto">
            Combino desarrollo web, inteligencia artificial y automatización para construir sistemas que trabajan solos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <Reveal replay key={s.title} delayMs={80 + i * 60}>
              <div
                className={`surface p-6 border transition-all duration-300 ${s.border} ${s.glow} h-full`}
              >
                <div className={`mb-4 ${s.color}`}>{s.icon}</div>
                <h3 className={`text-lg font-semibold mb-3 ${s.color}`}>{s.title}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-dim)]">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current ${s.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
