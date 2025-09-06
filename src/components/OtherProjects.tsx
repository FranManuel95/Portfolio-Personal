"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

const otherprojects = [
  {
    title: "Citas motivacionales",
    description:
      "Web de citas motivacionales, con frases de personajes célebres y un botón para generar una nueva cita.",
    link: "/CitasMotivacionales/index3.html",
    image: "/citas.webp",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "Lista de tareas",
    description:
      "Web de lista de tareas, con la posibilidad de añadir, eliminar y marcar como completadas las tareas.",
    link: "/ListaDeTareas/index5.html",
    image: "/tareas.webp",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "RGB",
    description: "Web para generar colores RGB aleatorios.",
    link: "/RGB/index2.html",
    image: "/colores.webp",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "Cronómetro",
    description:
      "Web de cronómetro con botones para iniciar, pausar y reiniciar el tiempo.",
    link: "/Cronómetro/index4.html",
    image: "/crono.webp",
    technologies: ["html", "css", "javascript"],
  },
];

export default function OtherProjects() {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="otherprojects" className="py-16 bg-gray-100 dark:bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[var(--accent)]">
          Otros proyectos más pequeños
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 cv-auto">
          {otherprojects.map((p, i) => (
            <ProjectCard
              key={i}
              title={p.title}
              description={p.description}
              link={p.link}
              image={p.image}
              technologies={p.technologies}
              isOpen={openProject === i}
              onClick={() => setOpenProject(openProject === i ? null : i)}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
