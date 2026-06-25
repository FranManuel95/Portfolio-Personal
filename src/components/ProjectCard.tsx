"use client";

import Image from "next/image";
import React, { useRef } from "react";
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
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
      className="inline-flex items-center justify-center w-7 h-7 bg-[var(--bg-elev-3)] border border-[var(--line)] text-base"
      title={tech}
    >
      {icon}
    </span>
  );
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const rotX = useSpring(rawX, { stiffness: 240, damping: 22, mass: 0.5 });
  const rotY = useSpring(rawY, { stiffness: 240, damping: 22, mass: 0.5 });

  const shine = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.07) 0%, transparent 65%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawY.set((px - 0.5) * 18);
    rawX.set((py - 0.5) * -18);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ position: "relative" }}>
        {children}
        {/* Specular shine overlay */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: shine,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>
    </motion.div>
  );
}

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
      <TiltCard>
        <article
          className={[
            "bg-[var(--bg-elev-1)] border border-[var(--line)] overflow-hidden",
            "transition-all duration-300 hover:border-[var(--accent)]/30",
            "hover:shadow-[0_0_40px_-12px_rgba(0,255,135,0.2)]",
            featured ? "border-[var(--accent)]/40" : "",
          ].join(" ")}
        >
          {/* Imagen */}
          <div className="relative w-full aspect-[16/9] bg-black/20 overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Contenido */}
          <div className="p-5 border-t border-[var(--line)]">
            <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">{title}</h3>
            <p className="mt-2 text-[var(--text-dim)] text-sm leading-relaxed">{description}</p>

            {/* Tecnologías */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {technologies.map((t, i) => (
                <TechBadge key={`${t}-${i}`} tech={t} />
              ))}
            </div>

            {/* Botones */}
            <div className="mt-4 flex gap-3 items-center">
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[var(--accent)] text-black hover:opacity-90 transition-opacity"
                >
                  Ver demo
                </a>
              )}
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border border-[var(--line)] text-[var(--text-dim)] hover:border-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                >
                  Ver código
                </a>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}
