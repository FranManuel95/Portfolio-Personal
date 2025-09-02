"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

/** Tipado delay para variables CSS */
type CSSVarName = `--${string}`;
type StyleWithVars = React.CSSProperties & Record<CSSVarName, string>;
const delay = (ms: number): StyleWithVars => ({ ["--d"]: `${ms}ms` } as StyleWithVars);

/** Datos: mantengo exactamente tus contenidos */
type Project = {
  title: string;
  description: string;
  link: string;
  image: string;
  technologies: string[];
  code?: string; // opcional para botón "Código"
};

/* Proyectos principales */
const projects: Project[] = [
  {
    title: "Web Techno Festival",
    description:
      "Web de un festival de música electrónica, con información sobre el evento, artistas, horarios y venta de entradas.",
    link: "/SaSS/index.html",
    image: "/techno.PNG",
    technologies: ["html", "css", "javascript", "sass", "gulp"],
  },
  {
    title: "Blog Rick and Morty",
    description:
      "Web de blog sobre la serie Rick and Morty, con información sobre personajes, episodios y curiosidades.",
    link: "/Creación/index.html",
    image: "/rick-morty.PNG",
    technologies: ["html", "css", "javascript"],
  },
  {
    title: "Frontend Academia",
    description:
      "Web de una academia de formación online, con información sobre cursos, proyectos, testimonios y contacto.",
    link: "/PortafolioBootstrap/index.html",
    image: "/academia.PNG",
    technologies: ["html", "css", "bootstrap"],
  },
  {
    title: "Frontend Store",
    description:
      "Web de tienda de ropa online, con catálogo de productos y carrito de compra.",
    link: "/FrontendStore/index.html",
    image: "/front.PNG",
    technologies: ["html", "css"],
  },
];

/* Experimentos (antes “Otros proyectos”) */
const experiments: Project[] = [
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

/** Hook: observa dinámicamente los .reveal dentro de un contenedor
 *  - Re-escanea al montar y cuando se añaden/eliminan nodos (MutationObserver)
 *  - Marca .is-visible al entrar en viewport
 */
function useRevealWithin<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    const observeAll = () => {
      const nodes = root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
      nodes.forEach((n) => io.observe(n));
    };

    // Observa cambios en el árbol (filtros agregan/quitán cards)
    const mo = new MutationObserver(() => {
      observeAll();
    });

    observeAll();
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return containerRef;
}

export default function ProjectsShowcase() {
  // === Filtros & búsqueda ===
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    [...projects, ...experiments].forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const containerRef = useRevealWithin<HTMLDivElement>(); // 👈 FIX: auto-reveal en cambios

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
  const featured = projects.slice(0, 4).filter(matches);

  const labs = experiments.filter(matches);

  return (
    <div className="relative" ref={containerRef}>
      {/* Fondo sutil de sección */}
      <div
        aria-hidden
        className="absolute -inset-x-6 -inset-y-8 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-2)] to-[var(--bg)]"
      />

      <div className="relative text-center">
        {/* Header de sección */}
        <h2 className="headline text-3xl mb-3">Proyectos</h2>
        <p className="text-[var(--text-dim)] mt-8 mb-8">
          Explora mis trabajos. Filtra por stack o busca por nombre/descrición.
        </p>

        {/* Controles: búsqueda + chips de filtros */}
        <div className="surface p-4 mb-10 reveal" style={delay(0)}>
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
            {allTechs.map((tech, i) => {
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
                  style={delay(40 + i * 12)}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* DESTACADOS */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h3 className="text-xl font-semibold mb-4 text-[var(--accent)] reveal" style={delay(0)}>
              Destacados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((p, i) => (
                <div key={`feat-${p.title}`} className="reveal" style={delay(60 + i * 80)}>
                  <ProjectCard project={p} featured />
                </div>
              ))}
            </div>
          </section>
        )}


        {/* prácticas */}
        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-4 text-[var(--accent)] reveal" style={delay(0)}>
            prácticas
          </h3>
          {labs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {labs.map((p, i) => (
                <div key={`lab-${p.title}`} className="reveal" style={delay(60 + i * 60)}>
                  <ProjectCard project={p} compact />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-dim)]">No hay prácticas con esos filtros.</p>
          )}
        </section>
      </div>
    </div>
  );
}
