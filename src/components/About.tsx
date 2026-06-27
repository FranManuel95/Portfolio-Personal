"use client";

import React from "react";
import Reveal from "./Reveal";
import { TechGalaxyControls } from "./TechGalaxy";

const About = () => {
  return (
    <div>
      {/* Bio — sits at the top of the galaxy section, with a subtle vertical fade
          from var(--bg) so the text stays legible over stars/nebulae and any
          stray planet that passes directly underneath. pointer-events:auto only
          on the centered block — wide side margins let drag/zoom reach the canvas. */}
      <Reveal replay>
        <div
          className="max-w-2xl mx-auto text-center pointer-events-auto"
          style={{
            marginBottom: "clamp(24vh, 32vh, 40vh)",
            padding: "1rem 0.5rem 2rem",
            background:
              "radial-gradient(ellipse 90% 100% at center, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0.55) 60%, transparent 100%)",
          }}
        >
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

      {/* Controls panel — re-enables pointer-events on its own centered max-w-2xl wrapper */}
      <Reveal replay delayMs={120}>
        <TechGalaxyControls />
      </Reveal>
    </div>
  );
};

export default About;
