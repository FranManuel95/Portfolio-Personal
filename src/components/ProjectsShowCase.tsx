"use client";
import React, { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

type ProjectType = "app" | "landing";

type Project = {
  title: string;
  description: string;
  link?: string;
  repo?: string;
  image: string;
  technologies: string[];
  type: ProjectType;
};

const projects: Project[] = [
  // ── Apps ─────────────────────────────────────────────────────────────────
  {
    type: "app",
    title: "LexTutor Agent",
    description:
      "Plataforma de tutoría jurídica con IA para estudiantes de Derecho en España. Sistema RAG con arquitectura multi-modelo (OpenAI + Gemini), routing automático por operación y generación de quizzes, exámenes y corrección automática.",
    link: "https://lextutoragent01.vercel.app",
    repo: "https://github.com/FranManuel95/Lextutor-Agent",
    image: "/Lextutor.GIF",
    technologies: ["nextjs", "typescript", "tailwindcss", "supabase", "openai", "gemini", "rag"],
  },
  {
    type: "app",
    title: "Task Manager",
    description:
      "Plataforma completa para la gestión avanzada de proyectos y tareas, diseñada para equipos que necesitan organización, control y colaboración en tiempo real.",
    repo: "https://github.com/FranManuel95/Task-Manager",
    image: "/CapturaProyectoTareas.webp",
    technologies: ["html", "tailwindcss", "typescript", "react", "vite", "docker", "nodejs", "express"],
  },
  // ── Landings ─────────────────────────────────────────────────────────────
  {
    type: "landing",
    title: "Web Techno Festival",
    description:
      "Web de un festival de música electrónica, con información sobre el evento, artistas, horarios y venta de entradas.",
    link: "/SaSS/index.html",
    image: "/techno.webp",
    technologies: ["html", "css", "javascript", "sass"],
  },
  {
    type: "landing",
    title: "Blog Rick and Morty",
    description:
      "Web de blog sobre la serie Rick and Morty, con información sobre personajes, episodios y curiosidades.",
    link: "/Creación/index.html",
    image: "/rick-morty.webp",
    technologies: ["html", "css", "javascript"],
  },
  {
    type: "landing",
    title: "Frontend Academia",
    description:
      "Web de una academia de formación online, con información sobre cursos, proyectos, testimonios y contacto.",
    link: "/PortafolioBootstrap/index.html",
    image: "/academia.webp",
    technologies: ["html", "css", "bootstrap"],
  },
];

type TypeFilter = "all" | "app" | "landing";

const TYPE_LABELS: Record<TypeFilter, string> = {
  all:     "Todos",
  app:     "Apps",
  landing: "Landings",
};

const TYPE_BADGE: Record<ProjectType, { label: string; className: string }> = {
  app:     { label: "App",     className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  landing: { label: "Landing", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

export default function ProjectsShowcase() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleTech = (tech: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tech)) next.delete(tech); else next.add(tech);
      return next;
    });
  };

  const clearFilters = () => {
    setSelected(new Set());
    setQuery("");
    setTypeFilter("all");
  };

  const matches = (p: Project) => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    const q = query.trim().toLowerCase();
    const queryOk =
      q.length === 0 ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const techOk = Array.from(selected).every((t) => p.technologies.includes(t));
    return queryOk && techOk;
  };

  const filtered = projects.filter(matches);
  const apps     = filtered.filter((p) => p.type === "app");
  const landings = filtered.filter((p) => p.type === "landing");
  const hasFilters = query.trim() || selected.size > 0 || typeFilter !== "all";

  return (
    <div className="relative">
      <div className="absolute -inset-x-6 -inset-y-8 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-2)] to-[var(--bg)]" />

      <div className="relative text-center">
        <Reveal replay>
          <h2 className="headline text-3xl mb-3">Proyectos</h2>
        </Reveal>

        <Reveal replay>
          <p className="text-[var(--text-dim)] mt-8 mb-8">
            Explora mis trabajos. Filtra por tipo, stack o busca por nombre.
          </p>
        </Reveal>

        {/* ── Filtros ─────────────────────────────────────────────────────── */}
        <Reveal replay delayMs={60}>
          <div className="surface p-4 mb-10">
            {/* Búsqueda + botón limpiar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar proyecto..."
                className="flex-1 rounded-lg bg-[var(--bg-elev-2)] border border-[var(--line)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)]"
                aria-label="Buscar proyecto"
              />
              <button
                onClick={clearFilters}
                className="btn btn-ghost self-start md:self-auto"
                aria-label="Limpiar filtros"
              >
                Limpiar filtros
              </button>
            </div>

            {/* Tabs de tipo */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {(["all", "app", "landing"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    typeFilter === t
                      ? "border-[var(--accent)] text-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,#000)]"
                      : "border-[var(--line)] text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--text-dim)]"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            {/* Techs */}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
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

        {/* ── Resultados ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <Reveal replay delayMs={80}>
            <p className="text-[var(--text-dim)]">No hay proyectos con esos filtros.</p>
          </Reveal>
        ) : hasFilters ? (
          // Con filtro activo: grid plano sin agrupación
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectWithBadge key={p.title} project={p} />
            ))}
          </div>
        ) : (
          // Sin filtro: dos grupos con encabezado
          <div className="space-y-12">
            {apps.length > 0 && (
              <ProjectGroup
                label="Apps"
                badgeClass="bg-blue-500/15 text-blue-400 border-blue-500/30"
                projects={apps}
                cols={2}
              />
            )}
            {landings.length > 0 && (
              <ProjectGroup
                label="Landing Pages"
                badgeClass="bg-amber-500/15 text-amber-400 border-amber-500/30"
                projects={landings}
                cols={3}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Helpers de renderizado ─────────────────────────────────────────────── */

function ProjectGroup({
  label, badgeClass, projects: list, cols,
}: {
  label: string;
  badgeClass: string;
  projects: Project[];
  cols: 2 | 3;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 text-left">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeClass}`}>
          {label}
        </span>
        <span className="flex-1 h-px bg-[var(--line)]" />
      </div>
      <div
        className={`grid grid-cols-1 gap-6 ${
          cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {list.map((p) => (
          <ProjectWithBadge key={p.title} project={p} />
        ))}
      </div>
    </div>
  );
}

function ProjectWithBadge({ project }: { project: Project }) {
  const badge = TYPE_BADGE[project.type];
  return (
    <div className="relative">
      <span
        className={`absolute top-3 left-3 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full border tracking-wide ${badge.className}`}
      >
        {badge.label}
      </span>
      <ProjectCard project={project} compact />
    </div>
  );
}
