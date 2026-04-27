"use client";

import React from "react";
import {
  FaReact, FaNodeJs, FaGit, FaDocker,
} from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs, SiTypescript, SiSupabase, SiN8N, SiOpenai, SiVercel } from "react-icons/si";
import { BrainCircuit, Mic, Workflow, Globe } from "lucide-react";
import Reveal from "./Reveal";
import TypewriterText from "./TypewriterText";

const stackGroups = [
  {
    label: "Desarrollo Web",
    icon: <Globe className="w-4 h-4" />,
    items: [
      { name: "Next.js",     icon: <SiNextdotjs className="text-gray-200" /> },
      { name: "React",       icon: <FaReact className="text-blue-400" /> },
      { name: "TypeScript",  icon: <SiTypescript className="text-blue-500" /> },
      { name: "Tailwind",    icon: <SiTailwindcss className="text-cyan-500" /> },
      { name: "Supabase",    icon: <SiSupabase className="text-emerald-500" /> },
      { name: "Node.js",     icon: <FaNodeJs className="text-green-500" /> },
    ],
  },
  {
    label: "IA Generativa",
    icon: <BrainCircuit className="w-4 h-4" />,
    items: [
      { name: "OpenAI",      icon: <SiOpenai className="text-gray-200" /> },
      { name: "Claude",      icon: <span className="text-orange-400 font-bold text-xs">AI</span> },
      { name: "Gemini",      icon: <span className="text-blue-400 font-bold text-xs">G</span> },
      { name: "OpenRouter",  icon: <span className="text-purple-400 font-bold text-xs">OR</span> },
      { name: "OpenClaw",    icon: <span className="text-amber-400 font-bold text-xs">OC</span> },
      { name: "RAG / Agentes", icon: <BrainCircuit className="w-4 h-4 text-violet-400" /> },
    ],
  },
  {
    label: "Automatización",
    icon: <Workflow className="w-4 h-4" />,
    items: [
      { name: "n8n",         icon: <SiN8N className="text-orange-500" /> },
      { name: "Webhooks",    icon: <span className="text-green-400 font-bold text-xs">{"{}"}</span> },
      { name: "APIs REST",   icon: <span className="text-blue-300 font-bold text-xs">API</span> },
    ],
  },
  {
    label: "Agentes de Voz",
    icon: <Mic className="w-4 h-4" />,
    items: [
      { name: "VAPI",        icon: <Mic className="w-4 h-4 text-purple-400" /> },
      { name: "ElevenLabs",  icon: <span className="text-yellow-400 font-bold text-xs">11</span> },
      { name: "Twilio",      icon: <span className="text-red-400 font-bold text-xs">T</span> },
    ],
  },
  {
    label: "DevOps & Tools",
    icon: <FaDocker className="w-4 h-4" />,
    items: [
      { name: "Git",         icon: <FaGit className="text-red-500" /> },
      { name: "Docker",      icon: <FaDocker className="text-blue-400" /> },
      { name: "Vercel",      icon: <SiVercel className="text-gray-200" /> },
    ],
  },
];

const About = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]" />
      <div className="container relative text-center">

        <Reveal replay>
          <h2 className="headline text-3xl py-4 mt-6 mb-6">Sobre mí</h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <TypewriterText
            as="p"
            className="md:text-2xl text-[color-mix(in_oklab,var(--text)_90%,#fff)] leading-relaxed max-w-4xl mx-auto"
            speed={26}
            startDelay={120}
            punctuationPauseMs={110}
            inViewMargin="0px 0px -12% 0px"
            segments={[
              { text: "Mi base es el " },
              { text: "desarrollo web", className: "text-[var(--accent-2)]" },
              { text: ", pero he evolucionado hacia un perfil híbrido donde combino " },
              { text: "frontend, backend, inteligencia artificial y automatización", className: "text-[var(--accent-2)]" },
              { text: ". " },

              { text: "Diseño y construyo " },
              { text: "sistemas completos", className: "text-[var(--accent-2)]" },
              { text: " que van más allá de una web tradicional: agentes conversacionales, flujos automatizados y arquitecturas de IA " },
              { text: "escalables e independientes de proveedor", className: "text-[var(--accent-2)]" },
              { text: ". " },

              { text: "Me muevo bien entre " },
              { text: "controlar la infraestructura de IA", className: "text-[var(--accent-2)]" },
              { text: ", optimizar costes de modelos y llevar soluciones reales a " },
              { text: "producción", className: "text-[var(--accent-2)]" },
              { text: "." },
            ]}
          />
        </Reveal>

        <Reveal replay delayMs={120}>
          <h3 className="text-2xl sm:text-3xl font-semibold mt-14 mb-8 text-[var(--accent)]">
            Stack & Capacidades
          </h3>
        </Reveal>

        <div className="flex flex-col gap-8">
          {stackGroups.map((group, gi) => (
            <Reveal replay key={group.label} delayMs={160 + gi * 60}>
              <div>
                <div className="flex items-center justify-center gap-2 mb-4 text-[var(--text-dim)]">
                  {group.icon}
                  <span className="text-sm font-semibold uppercase tracking-widest">{group.label}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {group.items.map((tech) => (
                    <div key={tech.name} className="surface p-3 flex flex-col items-center gap-1">
                      <div className="text-2xl flex items-center justify-center h-7">{tech.icon}</div>
                      <span className="text-xs font-medium text-[var(--text-dim)] text-center leading-tight">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
