"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaDownload,
  FaReact,
  FaNodeJs,
  FaGit,
  FaDocker,
  FaEnvelope,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiTypescript,
  SiSupabase,
  SiN8N,
  SiOpenai,
  SiVercel,
} from "react-icons/si";
import {
  Globe,
  BrainCircuit,
  Workflow,
  Mic,
  MapPin,
  Briefcase,
  ExternalLink,
  Clock,
} from "lucide-react";
import Header from "../components/Header";
import FabContact from "../components/FabContact";

/* ─── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ─── Data ───────────────────────────────────────────────── */
const services = [
  { icon: Globe, title: "Desarrollo Web", color: "text-blue-400", desc: "Apps full-stack con Next.js, React, APIs REST y serverless." },
  { icon: BrainCircuit, title: "IA Generativa", color: "text-violet-400", desc: "Sistemas RAG, agentes multi-modelo y optimización de costes." },
  { icon: Workflow, title: "Automatización", color: "text-orange-400", desc: "Flujos end-to-end con n8n, webhooks e integración de APIs." },
  { icon: Mic, title: "Agentes Inteligentes", color: "text-emerald-400", desc: "Agentes de voz y chat 24/7 con VAPI, Twilio y ElevenLabs." },
];

const stackItems = [
  { name: "Next.js",    icon: <SiNextdotjs className="text-gray-200 text-lg" /> },
  { name: "React",      icon: <FaReact className="text-blue-400 text-lg" /> },
  { name: "TypeScript", icon: <SiTypescript className="text-blue-500 text-lg" /> },
  { name: "Tailwind",   icon: <SiTailwindcss className="text-cyan-500 text-lg" /> },
  { name: "Supabase",   icon: <SiSupabase className="text-emerald-500 text-lg" /> },
  { name: "Node.js",    icon: <FaNodeJs className="text-green-500 text-lg" /> },
  { name: "OpenAI",     icon: <SiOpenai className="text-gray-200 text-lg" /> },
  { name: "n8n",        icon: <SiN8N className="text-orange-500 text-lg" /> },
  { name: "Docker",     icon: <FaDocker className="text-blue-400 text-lg" /> },
  { name: "Vercel",     icon: <SiVercel className="text-gray-200 text-lg" /> },
  { name: "Git",        icon: <FaGit className="text-red-500 text-lg" /> },
  { name: "RAG/Agentes",icon: <BrainCircuit className="text-violet-400 text-lg" /> },
];

const experiences = [
  {
    role: "Especialista en IA",
    company: "Derecho Virtual",
    period: "Feb 2026 — Actualidad",
    current: true,
    desc: "Agentes conversacionales, sistemas RAG y flujos n8n con OpenAI, Claude y Gemini.",
  },
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Ene 2025 — Mar 2025",
    current: false,
    desc: "Proyecto integral con Docker, PHP, Symfony, Next.js, React y TypeScript.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    current: false,
    desc: "Mejora de sistema CRM en Django con optimización de la sección de facturas.",
  },
];

const projects = [
  {
    title: "LexTutor Agent",
    description:
      "Plataforma de tutoría jurídica con IA para estudiantes de Derecho. Sistema RAG multi-modelo (OpenAI + Gemini), routing automático y generación de quizzes.",
    techs: ["Next.js", "TypeScript", "Supabase", "OpenAI", "Gemini", "RAG"],
    link: "https://lextutoragent01.vercel.app",
    repo: "https://github.com/FranManuel95/Lextutor-Agent",
    color: "from-violet-600/20 to-blue-600/10",
    accent: "#a78bfa",
  },
  {
    title: "Task Manager",
    description:
      "Plataforma completa para gestión avanzada de proyectos y tareas. Diseñada para equipos que necesitan organización y colaboración en tiempo real.",
    techs: ["React", "TypeScript", "Vite", "Docker", "Node.js", "Express"],
    repo: "https://github.com/FranManuel95/Task-Manager",
    color: "from-emerald-600/20 to-cyan-600/10",
    accent: "#34d399",
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      <main className="pt-20 pb-10 container">
        <div className="bento-grid">

          {/* ── Cell 1: Hero ──────────────────────────────── */}
          <motion.div
            id="hero"
            className="bento-col-8 bento-card"
            style={{
              background:
                "radial-gradient(110% 80% at 50% 0%, color-mix(in oklab, var(--accent) 10%, var(--bg-elev-1)), var(--bg-elev-1))",
            }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            {/* Grid pattern */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.045] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(70% 70% at 50% 30%, black, transparent)",
              }}
            />

            {/* Glow */}
            <div
              aria-hidden
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: "color-mix(in oklab, var(--accent) 20%, transparent)" }}
            />

            <div className="relative flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Photo */}
              <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36">
                <Image
                  src="/FotoSinFondo.webp"
                  alt="Fran Perejón"
                  fill
                  className="rounded-2xl object-contain object-center"
                  style={{ boxShadow: "0 12px 40px -16px color-mix(in oklab, var(--accent) 50%, transparent)" }}
                  sizes="144px"
                  priority
                />
              </div>

              {/* Text */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-dim)" }}>
                  Bienvenido, soy
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1" style={{ color: "var(--text)" }}>
                  Fran Perejón
                </h1>
                <p className="text-base sm:text-lg font-medium mb-3" style={{ color: "var(--accent)" }}>
                  Desarrollador Web & Especialista en IA Aplicada
                </p>
                <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: "var(--text-dim)" }}>
                  Desarrollo aplicaciones web y sistemas inteligentes con IA,
                  automatizando procesos y optimizando costes mediante arquitecturas escalables.
                </p>

                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a
                    href="#proyectos"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "color-mix(in oklab, var(--accent) 18%, var(--bg-elev-2))",
                      border: "1px solid color-mix(in oklab, var(--accent) 35%, var(--line))",
                      color: "var(--text)",
                    }}
                  >
                    Ver proyectos
                  </a>
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-elev-2)",
                      border: "1px solid var(--line)",
                      color: "var(--text-dim)",
                    }}
                  >
                    Contactar
                  </a>
                  <a
                    href="/Fran Perejón — CV.pdf"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-elev-2)",
                      border: "1px solid var(--line)",
                      color: "var(--text-dim)",
                    }}
                  >
                    <FaDownload className="text-xs" />
                    CV
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Cell 2: Disponibilidad ────────────────────── */}
          <motion.div
            className="bento-col-4 bento-card flex flex-col justify-between gap-4"
            style={{
              background:
                "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, #10b981 12%, var(--bg-elev-1)), var(--bg-elev-1))",
            }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.08}
          >
            {/* Badge */}
            <div className="flex items-center gap-2">
              <span
                className="animate-pulse-dot h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: "#10b981", boxShadow: "0 0 10px #10b981" }}
              />
              <span className="text-sm font-semibold" style={{ color: "#10b981" }}>
                Disponible para proyectos
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Location */}
              <div
                className="flex items-center gap-2.5 rounded-xl p-3"
                style={{ background: "var(--bg-elev-2)", border: "1px solid var(--line)" }}
              >
                <MapPin className="w-4 h-4 shrink-0" style={{ color: "#10b981" }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Ubicación</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Sevilla, España</p>
                </div>
              </div>

              {/* Experience */}
              <div
                className="flex items-center gap-2.5 rounded-xl p-3"
                style={{ background: "var(--bg-elev-2)", border: "1px solid var(--line)" }}
              >
                <Briefcase className="w-4 h-4 shrink-0" style={{ color: "#10b981" }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>Experiencia</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>3+ años</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-1">
              <a
                href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-elev-2)",
                  border: "1px solid var(--line)",
                  color: "var(--text-dim)",
                }}
              >
                <FaLinkedin />
                LinkedIn
              </a>
              <a
                href="https://github.com/FranManuel95"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--bg-elev-2)",
                  border: "1px solid var(--line)",
                  color: "var(--text-dim)",
                }}
              >
                <FaGithub />
                GitHub
              </a>
            </div>
          </motion.div>

          {/* ── Cell 3: Servicios ─────────────────────────── */}
          <motion.div
            id="servicios"
            className="bento-col-4 bento-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            custom={0}
          >
            <h2 className="text-base font-bold mb-4 tracking-tight" style={{ color: "var(--text)" }}>
              Servicios
            </h2>
            <div className="flex flex-col gap-3">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.title}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-200"
                    style={{ background: "var(--bg-elev-2)", border: "1px solid var(--line)" }}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${svc.color}`} />
                    <div>
                      <p className={`text-sm font-semibold ${svc.color}`}>{svc.title}</p>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "var(--text-dim)" }}>{svc.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Cell 4: Stack ─────────────────────────────── */}
          <motion.div
            id="sobremi"
            className="bento-col-6 bento-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            custom={0}
          >
            <h2 className="text-base font-bold mb-4 tracking-tight" style={{ color: "var(--text)" }}>
              Stack Tecnológico
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
              {stackItems.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "var(--bg-elev-2)", border: "1px solid var(--line)" }}
                >
                  <div className="flex items-center justify-center h-6">{item.icon}</div>
                  <span className="text-[10px] font-medium text-center leading-tight" style={{ color: "var(--text-dim)" }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Cell 5: Experiencia ───────────────────────── */}
          <motion.div
            id="experiencia"
            className="bento-col-6 bento-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            custom={0}
          >
            <h2 className="text-base font-bold mb-4 tracking-tight" style={{ color: "var(--text)" }}>
              Experiencia
            </h2>
            <div className="flex flex-col gap-3">
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3.5"
                  style={{
                    background: "var(--bg-elev-2)",
                    border: exp.current
                      ? "1px solid color-mix(in oklab, var(--accent) 35%, var(--line))"
                      : "1px solid var(--line)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text)" }}>
                        {exp.role}
                      </p>
                      <p className="text-xs font-medium mt-0.5" style={{ color: "var(--accent)" }}>
                        {exp.company}
                        {exp.current && (
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase"
                            style={{
                              background: "color-mix(in oklab, var(--accent) 15%, transparent)",
                              color: "var(--accent)",
                              border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
                            }}
                          >
                            Actual
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" style={{ color: "var(--text-dim)" }} />
                      <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>{exp.period}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>{exp.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Cell 6: Proyecto 1 ────────────────────────── */}
          <motion.div
            id="proyectos"
            className="bento-col-6 bento-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            custom={0}
          >
            {/* Colored header band */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-[1.25rem] bg-gradient-to-r ${projects[0].color.replace("from-", "from-").replace("/20", "").replace("/10", "")}`}
              style={{ background: `linear-gradient(90deg, ${projects[0].accent}80, ${projects[0].accent}20)` }}
            />

            <div className="flex flex-col h-full pt-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
                  {projects[0].title}
                </h3>
                <div className="flex gap-2 shrink-0">
                  {projects[0].repo && (
                    <a
                      href={projects[0].repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "var(--bg-elev-2)",
                        border: "1px solid var(--line)",
                        color: "var(--text-dim)",
                      }}
                    >
                      <FaGithub className="text-xs" /> Repo
                    </a>
                  )}
                  {projects[0].link && (
                    <a
                      href={projects[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: `color-mix(in oklab, ${projects[0].accent} 12%, var(--bg-elev-2))`,
                        border: `1px solid color-mix(in oklab, ${projects[0].accent} 30%, var(--line))`,
                        color: projects[0].accent,
                      }}
                    >
                      <ExternalLink className="w-3 h-3" /> Demo
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-dim)" }}>
                {projects[0].description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {projects[0].techs.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `color-mix(in oklab, ${projects[0].accent} 10%, var(--bg-elev-2))`,
                      border: `1px solid color-mix(in oklab, ${projects[0].accent} 25%, var(--line))`,
                      color: projects[0].accent,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Cell 7: Proyecto 2 ────────────────────────── */}
          <motion.div
            className="bento-col-6 bento-card"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            custom={0.06}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[1.25rem]"
              style={{ background: `linear-gradient(90deg, ${projects[1].accent}80, ${projects[1].accent}20)` }}
            />

            <div className="flex flex-col h-full pt-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
                  {projects[1].title}
                </h3>
                <div className="flex gap-2 shrink-0">
                  {projects[1].repo && (
                    <a
                      href={projects[1].repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: "var(--bg-elev-2)",
                        border: "1px solid var(--line)",
                        color: "var(--text-dim)",
                      }}
                    >
                      <FaGithub className="text-xs" /> Repo
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-dim)" }}>
                {projects[1].description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {projects[1].techs.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: `color-mix(in oklab, ${projects[1].accent} 10%, var(--bg-elev-2))`,
                      border: `1px solid color-mix(in oklab, ${projects[1].accent} 25%, var(--line))`,
                      color: projects[1].accent,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Cell 8: Contacto ──────────────────────────── */}
          <motion.div
            id="contacto"
            className="bento-col-12 bento-card text-center"
            style={{
              background:
                "radial-gradient(80% 120% at 50% 50%, color-mix(in oklab, var(--accent) 8%, var(--bg-elev-1)), var(--bg-elev-1))",
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            custom={0}
          >
            <div className="max-w-xl mx-auto flex flex-col items-center gap-5 py-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--text)" }}>
                  ¿Hablamos?
                </h2>
                <p className="text-sm sm:text-base" style={{ color: "var(--text-dim)" }}>
                  Estoy disponible para proyectos freelance, colaboraciones y nuevas oportunidades.
                  No dudes en escribirme.
                </p>
              </div>

              <a
                href="mailto:perejonfcomanuel@gmail.com"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "color-mix(in oklab, var(--accent) 18%, var(--bg-elev-2))",
                  border: "1px solid color-mix(in oklab, var(--accent) 40%, var(--line))",
                  color: "var(--text)",
                  boxShadow: "0 12px 32px -12px color-mix(in oklab, var(--accent) 40%, transparent)",
                }}
              >
                <FaEnvelope />
                perejonfcomanuel@gmail.com
              </a>

              <div className="flex gap-4">
                <a
                  href="https://github.com/FranManuel95"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "var(--bg-elev-2)",
                    border: "1px solid var(--line)",
                    color: "var(--text-dim)",
                  }}
                >
                  <FaGithub />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "var(--bg-elev-2)",
                    border: "1px solid var(--line)",
                    color: "var(--text-dim)",
                  }}
                >
                  <FaLinkedin />
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <FabContact />
    </>
  );
}
