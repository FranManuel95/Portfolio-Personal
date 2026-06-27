"use client";

import React from "react";
import Reveal from "./Reveal";
import { TechGalaxyControls } from "./TechGalaxy";

const About = () => {
  return (
    <div>
      {/* Bio — centered, single column for breathing room.
          pointer-events:auto only on the centered text block so the wide empty sides
          let drag/zoom fall through to the canvas underneath. */}
      <Reveal replay>
        <div className="max-w-2xl mx-auto text-center mb-16 pointer-events-auto">
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
