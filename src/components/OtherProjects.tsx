"use client";

import React from "react";
import ProjectCard from "./ProjectCard";

/** Tipado delay para variables CSS (sin any) */
type CSSVarName = `--${string}`;
type StyleWithVars = React.CSSProperties & Record<CSSVarName, string>;
const delay = (ms: number): StyleWithVars => ({ ["--d"]: `${ms}ms` } as StyleWithVars);

/** Tipo de proyecto (igual que el que usa ProjectCard) */
type Project = {
  title: string;
  description: string;
  link: string;
  image: string;
  technologies: string[];
  code?: string; // opcional, por si más adelante añades repo
};

const otherprojects: Project[] = [
  {
    title: "Citas motivacionales ",
    description:
      "Web de citas motivacionales, con frases de personajes célebres y un botón para generar una nueva cita.",
    link: "/CitasMotivacionales/index3.html",
    image: "/citas.PNG",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "Lista de tareas",
    description:
      "Web de lista de tareas, con la posibilidad de añadir, eliminar y marcar como completadas las tareas.",
    link: "/ListaDeTareas/index5.html",
    image: "/tareas.PNG",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "RGB",
    description: "Web para generar colores RGB aleatorios.",
    link: "/RGB/index2.html",
    image: "/colores.PNG",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "Cronómetro",
    description:
      "Web de cronómetro con botones para iniciar, pausar y reiniciar el tiempo.",
    link: "/Cronómetro/index4.html",
    image: "/crono.PNG",
    technologies: ["html", "css", "javascript"],
  },
];

const OtherProjects = () => {
  return (
    <section className="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"
      />
      <div className="container relative text-center">
        <h2 className="headline text-3xl mb-10">Otros proyectos más pequeños</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {otherprojects.map((project, i) => (
            <div key={project.title} className="reveal" style={delay(i * 80)}>
              {/* ✅ Nuevo API: pasamos el objeto completo */}
              <ProjectCard project={project} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherProjects;
