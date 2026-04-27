"use client";

import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

const otherprojects = [
  {
    title: "Web Techno Festival",
    description:
      "Web de un festival de música electrónica, con información sobre el evento, artistas, horarios y venta de entradas.",
    link: "/SaSS/index.html",
    image: "/techno.webp",
    technologies: ["html", "css", "javascript", "sass"],
  },
  {
    title: "Blog Rick and Morty",
    description:
      "Web de blog sobre la serie Rick and Morty, con información sobre personajes, episodios y curiosidades.",
    link: "/Creación/index.html",
    image: "/rick-morty.webp",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "Frontend Academia",
    description:
      "Web de una academia de formación online, con información sobre cursos, proyectos, testimonios y contacto.",
    link: "/PortafolioBootstrap/index.html",
    image: "/academia.webp",
    technologies: ["html", "css", "bootstrap"],
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
    <section id="otherprojects" className="py-16 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto text-center px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-[var(--accent)]">
          Landing Pages
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
