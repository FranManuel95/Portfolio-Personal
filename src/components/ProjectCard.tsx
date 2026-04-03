"use client";

import Image from "next/image";
import React from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaSass, FaBootstrap, FaGulp,
  FaReact, FaDocker, FaNodeJs, FaGithub,
} from "react-icons/fa";
import {
  SiTailwindcss, SiVite, SiExpress, SiTypescript,
  SiNextdotjs, SiSupabase, SiOpenai,
} from "react-icons/si";
import { BrainCircuit, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";

export interface Project {
  title: string;
  description: string;
  link?: string;
  image: string;
  technologies: string[];
  tags?: string[];
  repo?: string;
  year?: number | string;
}

type Common = { featured?: boolean; compact?: boolean; isOpen?: boolean; onClick?: () => void; isMobile?: boolean };
type PropsWithProject = { project: Project } & Common;
type PropsWithFields = Project & Common;
export type ProjectCardProps = PropsWithProject | PropsWithFields;

const TECH_MAP: Record<string, React.ReactNode> = {
  html:        <FaHtml5 className="text-orange-500" title="HTML" />,
  css:         <FaCss3Alt className="text-blue-500" title="CSS" />,
  javascript:  <FaJs className="text-yellow-400" title="JavaScript" />,
  sass:        <FaSass className="text-pink-500" title="Sass" />,
  bootstrap:   <FaBootstrap className="text-indigo-500" title="Bootstrap" />,
  gulp:        <FaGulp className="text-red-500" title="Gulp" />,
  tailwindcss: <SiTailwindcss className="text-cyan-400" title="Tailwind" />,
  react:       <FaReact className="text-blue-400" title="React" />,
  vite:        <SiVite className="text-purple-400" title="Vite" />,
  docker:      <FaDocker className="text-blue-400" title="Docker" />,
  nodejs:      <FaNodeJs className="text-green-500" title="Node.js" />,
  express:     <SiExpress className="text-gray-300" title="Express" />,
  typescript:  <SiTypescript className="text-blue-500" title="TypeScript" />,
  nextjs:      <SiNextdotjs className="text-gray-200" title="Next.js" />,
  supabase:    <SiSupabase className="text-emerald-400" title="Supabase" />,
  openai:      <SiOpenai className="text-gray-200" title="OpenAI" />,
  gemini:      <span className="text-blue-400 font-bold text-[10px] leading-none" title="Gemini">G</span>,
  rag:         <BrainCircuit className="w-4 h-4 text-violet-400" />,
};

const TechBadge = ({ tech }: { tech: string }) => {
  const icon = TECH_MAP[tech];
  if (!icon) return null;
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--bg-elev-3)] border border-[var(--line)] text-base"
      title={tech}
    >
      {icon}
    </span>
  );
};

export default function ProjectCard(props: ProjectCardProps) {
  const data: Project =
    "project" in props
      ? props.project
      : {
          title: props.title, description: props.description, link: props.link,
          image: props.image, technologies: props.technologies,
          tags: props.tags, repo: props.repo, year: props.year,
        };

  const featured = props.featured ?? false;
  const { title, description, link, image, technologies, repo } = data;

  return (
    <Reveal replay>
      <article
        className={[
          "group relative rounded-2xl overflow-hidden",
          "bg-[var(--bg-elev-1)] border border-[var(--line)]",
          "transition-all duration-300",
          "hover:-translate-y-1 hover:border-[var(--accent)]/40",
          "hover:shadow-[0_24px_60px_-20px_rgba(124,134,255,0.25)]",
          featured ? "ring-1 ring-[var(--accent)]/50" : "",
        ].join(" ")}
      >
        {/* Imagen */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--bg-elev-2)]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            decoding="async"
          />
          {/* Gradiente inferior sobre imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elev-1)] via-transparent to-transparent opacity-60" />

          {/* Botones flotantes sobre imagen al hacer hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--accent)] text-black shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Demo
              </a>
            )}
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white/15 backdrop-blur text-white border border-white/20 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub className="w-3.5 h-3.5" />
                Código
              </a>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed line-clamp-3">{description}</p>

          {/* Tecnologías + links en footer de card */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t, i) => (
                <TechBadge key={`${t}-${i}`} tech={t} />
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                  title="Ver demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                  title="Ver código"
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
