"use client";

import Image from "next/image";
import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaSass, FaBootstrap, FaGulp } from "react-icons/fa";
import Reveal from "./Reveal";
/** Modelo de proyecto */
export interface Project {
  title: string;
  description: string;
  link: string;             // demo
  image: string;            // ruta en /public (ideal .webp)
  technologies: string[];
  tags?: string[];
  repo?: string;            // opcional
  year?: number | string;
}

/** Props comunes (opcionales para compat) */
type Common = {
  featured?: boolean;
  compact?: boolean;
  isOpen?: boolean;   // ignorado
  onClick?: () => void; // ignorado
  isMobile?: boolean; // ignorado
};

/** Dos formas válidas de uso */
type PropsWithProject = { project: Project } & Common;
type PropsWithFields = Project & Common;
export type ProjectCardProps = PropsWithProject | PropsWithFields;

const TechIcon = ({ tech }: { tech: string }) => {
  switch (tech) {
    case "html": return <FaHtml5 className="text-red-600" title="HTML" />;
    case "css": return <FaCss3Alt className="text-blue-600" title="CSS" />;
    case "javascript": return <FaJs className="text-yellow-400" title="JavaScript" />;
    case "sass": return <FaSass className="text-pink-600" title="Sass" />;
    case "bootstrap": return <FaBootstrap className="text-indigo-600" title="Bootstrap" />;
    case "gulp": return <FaGulp className="text-orange-600" title="Gulp" />;
    default: return null;
  }
};

export default function ProjectCard(props: ProjectCardProps) {
  const data: Project =
    "project" in props
      ? props.project
      : {
          title: props.title,
          description: props.description,
          link: props.link,
          image: props.image,
          technologies: props.technologies,
          tags: props.tags,
          repo: props.repo,
          year: props.year,
        };

  const featured = props.featured ?? false;
  const compact = props.compact ?? false;

  const { title, description, link, image, technologies, repo } = data;

  const padding = compact ? "p-4" : "p-5";
  const titleCls = compact ? "text-lg" : "text-xl";
  const descCls = compact ? "text-sm" : "text-base";

  return (
    <Reveal replay>
    <article
      className={[
        // Sin overflow-hidden, sin transform/transition/hover-scale
        "rounded-xl shadow-md",
        "bg-[var(--bg-elev-1)] border border-[var(--line)]",
        featured ? "ring-1 ring-[var(--accent)]/60" : "",
      ].join(" ")}
    >
      {/* Imagen: recorte solo aquí para esquinas superiores */}
      <div className="relative w-full aspect-[16/9] bg-black/10 rounded-t-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Contenido */}
      <div
        className={[
          padding,
          "border-t border-[var(--line)] bg-[var(--bg-elev-1)]",
          "rounded-b-xl",
        ].join(" ")}
      >
        <h3 className={`${titleCls} font-semibold text-[var(--text)]`}>{title}</h3>
        <p className={`mt-2 text-[var(--text-dim)] ${descCls}`}>{description}</p>

        {/* Tecnologías */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xl">
          {technologies.map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center">
              <TechIcon tech={t} />
            </span>
          ))}
        </div>

        {/* Acciones (sin transiciones ni efectos hover) */}
        <div className="mt-4 flex gap-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium
                       bg-[var(--accent)] text-black"
          >
            Ver demo
          </a>

          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium
                         bg-white/5"
            >
              Código
            </a>
          )}
        </div>
      </div>
    </article>
    </Reveal>
  );
}
