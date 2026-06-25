"use client";

import React from "react";
import Reveal from "./Reveal";

const techStack = [
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    category: "Backend & APIs",
    items: ["Node.js", "Python", "PHP / Symfony", "REST APIs", "Supabase / PostgreSQL"],
  },
  {
    category: "IA & Modelos",
    items: ["OpenAI API", "Claude API", "Gemini", "LangChain", "RAG", "OpenRouter"],
  },
  {
    category: "Automatización",
    items: ["n8n", "Webhooks", "VAPI", "ElevenLabs", "Twilio"],
  },
  {
    category: "Infraestructura",
    items: ["Docker", "Vercel", "Git", "CI/CD"],
  },
];

const About = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

      {/* LEFT: Bio */}
      <Reveal replay>
        <div>
          <p className="text-[var(--text)] text-lg leading-relaxed mb-6">
            Mi base es el{" "}
            <span className="text-[var(--accent-2)] font-medium">desarrollo web</span>, pero he
            evolucionado hacia un perfil híbrido donde combino frontend, backend,{" "}
            <span className="text-[var(--accent-2)] font-medium">inteligencia artificial</span> y
            automatización.
          </p>
          <p className="text-[var(--text-dim)] text-base leading-relaxed mb-6">
            Diseño y construyo sistemas completos: agentes conversacionales, flujos RAG y
            arquitecturas de IA escalables e independientes de proveedor. Me muevo bien entre
            controlar la infraestructura de modelos, optimizar costes y llevar soluciones a
            producción.
          </p>
          <p className="text-[var(--text-dim)] text-base leading-relaxed">
            Actualmente en{" "}
            <span className="text-[var(--accent)] font-semibold">Derecho Virtual</span> como
            Especialista en IA, donde construyo el core tecnológico de IA del producto.
          </p>

        </div>
      </Reveal>

      {/* RIGHT: Tech stack by category */}
      <Reveal replay delayMs={80}>
        <div className="space-y-6">
          {techStack.map((group, gi) => (
            <div key={group.category}>
              <h4
                className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-2"
                style={{ color: "var(--accent)" }}
              >
                {group.category}
              </h4>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                {group.items.join(" · ")}
              </p>
              {gi < techStack.length - 1 && (
                <div className="mt-5 h-px bg-[var(--line)]" />
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
};

export default About;
