"use client";

import React, { useState, useRef } from "react";
import { Globe, BrainCircuit, Workflow, Mic } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="divide-y divide-[var(--line)]"
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
    >
      {services.map((s, i) => {
        const Icon = s.icon;
        const isOpen = open === i;

        return (
          <motion.div
            key={s.title}
            variants={{
              hidden: { opacity: 0, y: 32 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <button
              onClick={() => setOpen(i)}
              className="w-full text-left py-5 md:py-6 group focus-visible:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-4 md:gap-6">

                {/* Giant number */}
                <motion.span
                  className="font-black leading-none tabular-nums flex-shrink-0"
                  animate={{
                    color: isOpen ? s.accent : "rgba(245,245,245,0.06)",
                    textShadow: isOpen ? `0 0 60px ${s.accent}50` : "0 0 0px transparent",
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontSize: "clamp(3rem, 10vw, 6rem)", letterSpacing: "-0.05em" }}
                >
                  {s.num}
                </motion.span>

                {/* Title + Icon + Toggle */}
                <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
                  <motion.h3
                    className="font-black uppercase tracking-tight truncate"
                    animate={{ color: isOpen ? s.accent : "var(--text)" }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: "clamp(1.1rem, 3.5vw, 1.875rem)" }}
                  >
                    {s.title}
                  </motion.h3>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <motion.div
                      className="w-9 h-9 flex items-center justify-center border"
                      animate={{
                        borderColor: isOpen ? `${s.accent}60` : "var(--line)",
                        color: isOpen ? s.accent : "var(--text-dim)",
                        background: isOpen ? `${s.accent}12` : "var(--bg-elev-2)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>

                    <motion.span
                      className="w-5 text-xl font-light leading-none"
                      animate={{ color: isOpen ? s.accent : "var(--text-dim)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {isOpen ? "−" : "+"}
                    </motion.span>
                  </div>
                </div>
              </div>
            </button>

            {/* Expandable items with AnimatePresence + stagger */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <motion.ul
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pb-6"
                    style={{ paddingLeft: "clamp(3.5rem, 11vw, 7rem)" }}
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
                  >
                    {s.items.map((item) => (
                      <motion.li
                        key={item}
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0, transition: { ease: [0.22, 1, 0.36, 1] } },
                        }}
                        className="text-sm text-[var(--text-dim)] flex items-start gap-2"
                      >
                        <span className="flex-shrink-0 mt-0.5" style={{ color: s.accent }}>
                          —
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Services;
