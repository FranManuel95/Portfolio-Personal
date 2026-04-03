"use client";

import Image from "next/image";
import React from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaSass, FaBootstrap, FaGulp,
  FaReact, FaDocker, FaNodeJs,
} from "react-icons/fa";
import {
  SiTailwindcss, SiVite, SiExpress, SiTypescript,
  SiNextdotjs, SiSupabase, SiOpenai,
} from "react-icons/si";
import { BrainCircuit } from "lucide-react";
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
  html:        <FaHtml5 className="text-red-600" title="HTML" />,
  css:         <FaCss3Alt className="text-blue-600" title="CSS" />,
  javascript:  <FaJs className="text-yellow-400" title="JavaScript" />,
  sass:        <FaSass className="text-pink-600" title="Sass" />,
  bootstrap:   <FaBootstrap className="text-indigo-600" title="Bootstrap" />,
  gulp:        <FaGulp className="text-orange-600" title="Gulp" />,
  tailwindcss: <SiTailwindcss className="text-cyan-400" title="TailwindCSS" />,
  react:       <FaReact className="text-blue-400" title="React" />,
  vite:        <SiVite className="text-purple-500" title="Vite" />,
  docker:      <FaDocker className="text-blue-500" title="Docker" />,
  nodejs:      <FaNodeJs className="text-green-600" title="Node.js" />,
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
          "rounded-xl shadow-md",
          "bg-[var(--bg-elev-1)] border border-[var(--line)]",
          featured ? "ring-1 ring-[var(--accent)]/60" : "",
        ].join(" ")}
      >
        {/* Imagen */}
        <div className="relative w-full aspect-[16/9] bg-black/10 rounded-t-xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Contenido */}
        <div className="p-5 border-t border-[var(--line)] bg-[var(--bg-elev-1)] rounded-b-xl text-center">
          <h3 className="text-xl font-semibold text-[var(--text)]">{title}</h3>
          <p className="mt-2 text-[var(--text-dim)] text-base">{description}</p>

          {/* Tecnologías */}
          <div className="mt-3 flex justify-center gap-2 text-xl">
            {technologies.map((t, i) => (
              <span key={`${t}-${i}`} className="inline-flex items-center">
                <TechBadge tech={t} />
              </span>
            ))}
          </div>

          {/* Botones */}
          <div className="mt-4 flex gap-3 items-center justify-center">
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium bg-[var(--accent)] text-black"
              >
                Ver demo
              </a>
            )}
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium bg-white/25"
              >
                Ver código
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
