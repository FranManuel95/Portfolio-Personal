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

const projects: Project[] = [
  {
    title: "LexTutor Agent",
    description:
      "Plataforma de tutoría jurídica con IA para estudiantes de Derecho en España. Sistema RAG con arquitectura multi-modelo (OpenAI + Gemini), routing automático por operación y generación de quizzes, exámenes y corrección automática.",
    link: "https://lextutoragent01.vercel.app",
    repo: "https://github.com/FranManuel95/Lextutor-Agent",
    image: "/Lextutor.GIF",
    technologies: ["nextjs", "typescript", "tailwindcss", "supabase", "openai", "gemini", "rag"],
  },
  {
    title: "Task Manager",
    description:
      "Plataforma completa para la gestión avanzada de proyectos y tareas, diseñada para equipos que necesitan organización, control y colaboración en tiempo real.",
    repo: "https://github.com/FranManuel95/Task-Manager",
    image: "/CapturaProyectoTareas.webp",
    technologies: ["html", "tailwindcss", "typescript", "react", "vite", "docker", "nodejs", "express"],
  },
];

export default function ProjectsShowcase() {
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
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

  const filtered = projects.filter(matches);

  return (
    <div className="relative">
      <div className="absolute -inset-x-6 -inset-y-8 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-2)] to-[var(--bg)]" />

      <div className="relative text-center">
        <Reveal replay>
          <h2 className="headline text-3xl mb-3">Proyectos</h2>
        </Reveal>

        <Reveal replay>
          <p className="text-[var(--text-dim)] mt-8 mb-8">
            Explora mis trabajos. Filtra por stack o busca por nombre/descripción.
          </p>
        </Reveal>

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

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((p, i) => (
              <Reveal replay key={p.title} delayMs={60 + i * 60}>
                <ProjectCard project={p} compact />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal replay delayMs={80}>
            <p className="text-[var(--text-dim)]">
              No hay proyectos con esos filtros.
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
