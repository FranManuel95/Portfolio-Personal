"use client";

import Image from "next/image";
import { JSX, useRef } from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaSass, FaBootstrap, FaGulp } from "react-icons/fa";

type Project = {
  title: string;
  description: string;
  link: string;
  image: string;
  technologies: string[];
  code?: string;
};

type Props = {
  project: Project;
  featured?: boolean;
  compact?: boolean;
};

const BLUR_SVG =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='20'><filter id='b'><feGaussianBlur stdDeviation='3' /></filter><rect width='100%' height='100%' fill='#0b0c10' /><rect width='100%' height='100%' fill='#7c86ff' opacity='.08' filter='url(#b)'/></svg>`
  ).toString("base64");

const TECH_ICON: Record<string, JSX.Element> = {
  html: <FaHtml5 className="text-red-500" aria-label="HTML" />,
  css: <FaCss3Alt className="text-blue-500" aria-label="CSS" />,
  javascript: <FaJs className="text-yellow-400" aria-label="JavaScript" />,
  sass: <FaSass className="text-pink-500" aria-label="Sass" />,
  bootstrap: <FaBootstrap className="text-indigo-500" aria-label="Bootstrap" />,
  gulp: <FaGulp className="text-orange-500" aria-label="Gulp" />,
};

export default function ProjectCard({ project, featured, compact }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Tilt 3D solo en desktop
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current || window.innerWidth < 1024) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(
      2
    )}deg) rotateY(${(px * 8).toFixed(2)}deg) scale(1.02)`;
  };
  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <article
      ref={ref}
      className={`relative overflow-hidden surface group will-change-transform transition-transform duration-300 ease-out ${
        featured ? "p-0" : "p-0"
      }`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Imagen de portada */}
      <div className="relative h-[220px] md:h-[260px]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_SVG}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={featured}
        />
        {/* Overlay gradiente para legibilidad */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3">
        <header className="flex items-start justify-between gap-3">
          <h4 className={`text-lg font-semibold ${featured ? "text-xl" : ""}`}>
            {project.title}
          </h4>
        </header>

        <p className={`text-[var(--text-dim)] ${compact ? "line-clamp-3" : ""}`}>
          {project.description}
        </p>

        {/* Chips de tecnologías (máximo 5 visibles para consistencia) */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 5).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--line)] text-xs text-[var(--text-dim)]"
            >
              <span className="text-base">{TECH_ICON[t] ?? null}</span>
              {t}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-2 flex items-center gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Ver demo
          </a>
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Código
            </a>
          )}
        </div>
      </div>

      {/* Glow al hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(600px 220px at 50% 100%, rgba(124,134,255,0.28), transparent)",
        }}
      />
    </article>
  );
}
