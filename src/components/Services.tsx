"use client";

import React from "react";
import { Globe, BrainCircuit, Workflow, Mic } from "lucide-react";
import Reveal from "./Reveal";

const services = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    accent: "#60a5fa",        // blue-400
    textColor: "text-blue-400",
    bgGlow: "rgba(96,165,250,0.10)",
    borderHover: "hover:border-blue-400/30",
    shadowHover: "hover:shadow-[0_0_40px_-12px_rgba(96,165,250,0.3)]",
    items: [
      "Aplicaciones full-stack con Next.js y React",
      "APIs REST y arquitecturas serverless",
      "Autenticación, pagos y bases de datos en la nube",
      "Deploy en Vercel con CI/CD",
    ],
  },
  {
    icon: BrainCircuit,
    title: "IA Generativa",
    accent: "#a78bfa",        // violet-400
    textColor: "text-violet-400",
    bgGlow: "rgba(167,139,250,0.10)",
    borderHover: "hover:border-violet-400/30",
    shadowHover: "hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.3)]",
    items: [
      "Sistemas RAG con bases de conocimiento propias",
      "Agentes conversacionales con memoria y herramientas",
      "Orquestación multi-modelo (OpenAI, Claude, Gemini)",
      "Optimización de costes por routing inteligente",
    ],
  },
  {
    icon: Workflow,
    title: "Automatización",
    accent: "#fb923c",        // orange-400
    textColor: "text-orange-400",
    bgGlow: "rgba(251,146,60,0.10)",
    borderHover: "hover:border-orange-400/30",
    shadowHover: "hover:shadow-[0_0_40px_-12px_rgba(251,146,60,0.3)]",
    items: [
      "Flujos end-to-end con n8n",
      "Integración de webhooks y APIs externas",
      "Gestión automática de emails y documentos",
      "Pipelines de validación y procesamiento de datos",
    ],
  },
  {
    icon: Mic,
    title: "Agentes Inteligentes",
    accent: "#34d399",        // emerald-400
    textColor: "text-emerald-400",
    bgGlow: "rgba(52,211,153,0.10)",
    borderHover: "hover:border-emerald-400/30",
    shadowHover: "hover:shadow-[0_0_40px_-12px_rgba(52,211,153,0.3)]",
    items: [
      "Agentes de atención al cliente 24/7 (voz y chat)",
      "Agentes internos para tareas operativas y de empresa",
      "Asistentes de voz con VAPI, Twilio y ElevenLabs",
      "Integración con CRMs y sistemas internos",
    ],
  },
];

const Services = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-6">
            ¿En qué puedo ayudarte?
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-10 max-w-2xl mx-auto">
            Combino desarrollo web, inteligencia artificial y automatización para construir sistemas que trabajan solos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal replay key={s.title} delayMs={80 + i * 60}>
                <div
                  className={[
                    "group relative h-full glass-card p-6 overflow-hidden",
                    "transition-all duration-300",
                    s.borderHover,
                    s.shadowHover,
                    "hover:-translate-y-0.5",
                  ].join(" ")}
                  style={{
                    backgroundImage: `radial-gradient(400px 300px at 0% 0%, ${s.bgGlow}, transparent)`,
                  }}
                >
                  {/* Barra de gradiente superior */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }}
                  />

                  {/* Icono */}
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 border border-white/10 bg-white/5 backdrop-blur-sm ${s.textColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Título */}
                  <h3 className={`text-base font-semibold mb-3 ${s.textColor}`}>{s.title}</h3>

                  {/* Items */}
                  <ul className="space-y-2.5">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--text-dim)]">
                        <span
                          className="mt-[6px] w-1 h-1 rounded-full shrink-0"
                          style={{ background: s.accent }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
