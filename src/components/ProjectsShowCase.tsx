"use client";
import React, { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

/** Modelo de proyecto */
type Project = {
  title: string;
  description: string;
  link?: string;
  repo?: string;
  image: string;
  technologies: string[];
  code?: string;
};

/* Proyectos principales */
const projects: Project[] = [
  {
    title: "Task Manager",
    description:
      "TaskManager es una plataforma completa para la gestión avanzada de proyectos y tareas, diseñada para equipos que necesitan organización, control y colaboración en tiempo real.",
    repo: "https://github.com/FranManuel95/Task-Manager",
    image: "/CapturaProyectoTareas.webp",
    technologies: ["html", "tailwindcss", "typescript","react", "vite", "docker", "nodejs", "express"],
  },
  {
    title: "Web Techno Festival",
    description:
      "Web de un festival de música electrónica, con información sobre el evento, artistas, horarios y venta de entradas.",
    link: "/SaSS/index.html",
    image: "/techno.webp",
    technologies: ["html", "css", "javascript", "sass", "gulp"],
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

/* Experimentos */
const experiments: Project[] = [
  {
    title: "Citas motivacionales ",
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

export default function ProjectsShowcase() {
  // === Filtros & búsqueda ===
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    [...projects, ...experiments].forEach((p) =>
      p.technologies.forEach((t) => set.add(t))
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleTech = (tech: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tech)) next.delete(tech);
      else next.add(tech);
      return next;
    });
  };

  const clearFilters = () => {
    setSelected(new Set());
    setQuery("");
  };

  const matches = (p: Project) => {
    const q = query.trim().toLowerCase();
    const queryOk =
      q.length === 0 ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const techOk = Array.from(selected).every((t) => p.technologies.includes(t));
    return queryOk && techOk;
  };

  // === División en secciones ===

  const labs = experiments.filter(matches);
  const destacados = projects.filter(matches);

  return (
    <div className="relative">
      {/* Fondo sutil de sección */}
      <div
        
        className="absolute -inset-x-6 -inset-y-8 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-2)] to-[var(--bg)]"
      />

      <div className="relative text-center">
        {/* Header de sección */}
        <Reveal replay>
          <h2 className="headline text-3xl mb-3">Proyectos</h2>
        </Reveal>

        <Reveal replay >
          <p className="text-[var(--text-dim)] mt-8 mb-8">
            Explora mis trabajos. Filtra por stack o busca por nombre/descripción.
          </p>
        </Reveal>

        {/* Controles: búsqueda + chips de filtros */}
        <Reveal replay delayMs={60}>
          <div className="surface p-4 mb-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar proyecto..."
                  className="w-full rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  aria-label="Buscar proyecto"
                />
              </div>

              <button
                onClick={clearFilters}
                className="btn btn-ghost self-start md:self-auto"
                aria-label="Limpiar filtros"
              >
                Limpiar filtros
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {allTechs.map((tech) => {
                const active = selected.has(tech);
                return (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      active
                        ? "border-[var(--accent)] text-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,#000)]"
                        : "border-[var(--line)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--text-dim)]"
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* DESTACADOS */}
       
          <section className="mb-12">
            <Reveal replay>
              <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
                Destacados
              </h3>
            </Reveal>

            {destacados.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {destacados.map((p, i) => (
                <Reveal replay key={`dest-${p.title}`} delayMs={60 + i * 60}>
                  <ProjectCard project={p} compact />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal replay delayMs={80}>
              <p className="text-[var(--text-dim)]">
                No hay proyectos destacados con esos filtros.
              </p>
            </Reveal>
          )}
          </section>
        

        {/* PRÁCTICAS */}
        <section className="mb-4">
          <Reveal replay>
            <h3 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Prácticas
            </h3>
          </Reveal>

          {labs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {labs.map((p, i) => (
                <Reveal replay key={`lab-${p.title}`} delayMs={60 + i * 60}>
                  <ProjectCard project={p} compact />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal replay delayMs={80}>
              <p className="text-[var(--text-dim)]">
                No hay prácticas con esos filtros.
              </p>
            </Reveal>
          )}
        </section>
      </div>
    </div>
  );
}
