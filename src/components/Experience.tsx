"use client";

import React from "react";
import Reveal from "./Reveal";

const experiences = [
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Enero / 2025 - Marzo / 2025",
    description:
      "Analizar y desarrollar un proyecto integral utilizando Docker, Php, Symfony, Next.js, React y TypeScript. En este proyecto, realicé tareas de diversa índole, lo que me permitió adaptarme al trabajo en equipo y adquirir experiencia con diversas tecnologías. Posteriormente, pasé a un proyecto en el que trabajamos en la mejora de funcionalidades y optimización de aspectos de una aplicación móvil desarrollada por la empresa DPTelemetry, utilizando Unity y C#.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    description:
      "Colaboré en la mejora de un sistema CRM desarrollado en Django (Python), centrándome en optimizar la sección de facturas. Implementé mejoras en la interfaz y en diversas funcionalidades, lo que permitió una gestión más ágil.",
  },
];

const Experience = () => {




  return (
    <section className="relative">
      <div
        
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"
      />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-6 text-[var(--text)]">
            <span className="inline-flex items-center gap-2">Experiencia Profesional</span>
          </h2>
        </Reveal>

        
        <div className="relative grid gap-8 md:grid-cols-2">
          <div
          
            className=" md:block absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-gradient-to-b from-transparent via-[var(--line)] to-transparent"
          />
          {experiences.map((exp, i) => (
            <Reveal replay key={`${exp.company}-${i}`}>
              <article className="surface p-6">
                <h3 className="text-xl font-semibold text-[var(--text)]">{exp.role}</h3>
                <p className="text-[var(--accent)] mt-1">{exp.company}</p>
                <p className="text-sm text-[var(--text-dim)]">{exp.period}</p>
                <p className="mt-3 text-[var(--text)]/90 leading-relaxed">{exp.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Experience;
