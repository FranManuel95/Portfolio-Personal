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
    bgGlow: "rgba(96,165,250,0.12)",
    borderHover: "hover:border-blue-400/35",
    shadowHover: "hover:shadow-[0_0_48px_-14px_rgba(96,165,250,0.35)]",
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
    bgGlow: "rgba(167,139,250,0.12)",
    borderHover: "hover:border-violet-400/35",
    shadowHover: "hover:shadow-[0_0_48px_-14px_rgba(167,139,250,0.35)]",
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
    bgGlow: "rgba(251,146,60,0.12)",
    borderHover: "hover:border-orange-400/35",
    shadowHover: "hover:shadow-[0_0_48px_-14px_rgba(251,146,60,0.35)]",
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
    bgGlow: "rgba(52,211,153,0.12)",
    borderHover: "hover:border-emerald-400/35",
    shadowHover: "hover:shadow-[0_0_48px_-14px_rgba(52,211,153,0.35)]",
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
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)]/40 to-[var(--bg)]" />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-6">
            ¿En qué puedo ayudarte?
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-10 max-w-2xl mx-auto text-sm md:text-base">
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
                    "group relative h-full rounded-2xl p-6 overflow-hidden",
                    "border border-[var(--line)] bg-[var(--bg-elev-1)]",
                    "transition-all duration-300 cursor-default",
                    s.borderHover,
                    s.shadowHover,
                    "hover:-translate-y-1",
                  ].join(" ")}
                  style={{
                    backgroundImage: `radial-gradient(380px 280px at 0% 0%, ${s.bgGlow}, transparent)`,
                  }}
                >
                  {/* Background number */}
                  <span
                    className="absolute -top-3 -right-1 text-[7rem] font-black leading-none select-none pointer-events-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-300"
                    style={{ color: s.accent }}
                  >
                    {s.num}
                  </span>

                  {/* Icon */}
                  <div
                    className={`relative inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 border border-[var(--line)] bg-[var(--bg-elev-2)] ${s.textColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className={`relative text-base font-semibold mb-3 ${s.textColor}`}>
                    {s.title}
                  </h3>

                  {/* Items */}
                  <ul className="relative space-y-2.5">
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
