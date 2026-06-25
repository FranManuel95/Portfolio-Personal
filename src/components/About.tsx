"use client";

import React from "react";
import Reveal from "./Reveal";

const techStack = [
  {
    category: "IA & Agentes",
    items: ["Claude", "OpenAI", "Gemini", "MCP Servers", "Skills propios", "OpenClaw", "RAG", "Pinecone"],
  },
  {
    category: "Automatización",
    items: ["n8n", "Airtable", "UltraMsg / Baileys", "API"],
  },
  {
    category: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML/CSS", "SCSS", "Vite"],
  },
  {
    category: "Backend & BD",
    items: ["Node.js", "Express", "PHP", "Symfony", "Django", "Supabase", "MySQL", "PostgreSQL"],
  },
  {
    category: "Infra & DevOps",
    items: ["Linux / VPS", "Docker", "Vercel", "Netlify", "Cloudflare", "Azure", "Stripe", "Teachable", "Git"],
  },
];

const About = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

      {/* LEFT: Bio */}
      <Reveal replay>
        <div>
          <p className="text-[var(--text)] text-lg leading-relaxed mb-6">
            Construyo{" "}
            <span className="text-[var(--accent-2)] font-medium">sistemas de IA aplicada</span>{" "}
            que resuelven problemas concretos de negocio y llegan a producción: agentes
            conversacionales, pipelines RAG y automatizaciones que sustituyen procesos manuales.
          </p>
          <p className="text-[var(--text-dim)] text-base leading-relaxed mb-6">
            Mi base{" "}
            <span className="text-[var(--accent-2)] font-medium">full-stack</span>{" "}
            me permite controlar el sistema completo —de la interfaz a la infraestructura de IA—,
            optimizando costes de modelos y desplegando soluciones estables y mantenibles.
          </p>
          <p className="text-[var(--text-dim)] text-base leading-relaxed">
            Actualmente en{" "}
            <span className="text-[var(--accent)] font-semibold">Derecho Virtual</span> como
            AI Engineer, liderando proyectos en los sectores jurídico y educativo desde la
            concepción hasta producción, con cientos de usuarios activos.
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
