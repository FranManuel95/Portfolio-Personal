"use client";
import React from "react";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

type Project = {
  title: string;
  description: string;
  link?: string;
  repo?: string;
  image: string;
  technologies: string[];
  type: "app" | "landing";
};

const projects: Project[] = [
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
];

export default function ProjectsShowcase() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((p, i) => (
        <Reveal replay key={p.title} delayMs={i * 80}>
          <ProjectCard project={p} />
        </Reveal>
      ))}
    </div>
  );
}
