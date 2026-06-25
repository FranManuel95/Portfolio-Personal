"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";

const STATS = [
  { num: 2, suffix: "+", label: "Años exp" },
  { num: 10, suffix: "+", label: "Proyectos" },
  { num: 3, suffix: "", label: "Empresas" },
  { num: 4, suffix: "", label: "Especialidades" },
];

function AnimatedStat({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = num / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, num]);

  return (
    <div ref={ref} className="pr-6">
      <p className="text-3xl font-black text-[var(--accent)]" style={{ letterSpacing: "-0.03em" }}>
        {count}{suffix}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mt-0.5">{label}</p>
    </div>
  );
}

const SKILLS = [
  "Next.js", "TypeScript", "React", "Python", "n8n", "OpenAI API",
  "Claude API", "LangChain", "Supabase", "Docker", "Vercel", "Tailwind CSS",
  "Node.js", "PHP / Symfony", "VAPI", "ElevenLabs", "RAG", "Agentes IA",
];
const TICKER = [...SKILLS, ...SKILLS];

const Hero = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useTransform(mx, [0, 1], ["8%", "92%"]);
  const glowY = useTransform(my, [0, 1], ["-10%", "85%"]);

  return (
    <section
      id="hero"
      className={`${isMenuOpen ? "pt-[8.5rem]" : "pt-16"} min-h-screen flex flex-col relative overflow-hidden`}
      onPointerMove={(e) => {
        if (window.matchMedia("(min-width: 768px)").matches) {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }
      }}
    >
      {/* Left accent rail */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />

      {/* Ambient glow that follows cursor */}
      <motion.div
        aria-hidden
        className="hidden md:block pointer-events-none absolute w-[44vw] h-[44vw] max-w-[580px] max-h-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[var(--accent)]/8"
        style={{ left: glowX, top: glowY, willChange: "transform", contain: "paint" }}
      />

      {/* Main content */}
      <div className="flex-1 flex items-center">
        <div className="container relative z-10 pl-8 md:pl-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">

            {/* Mobile photo (visible only on small screens, centered) */}
            <div className="lg:hidden flex justify-center">
              <div className="relative w-36 h-44">
                <div className="absolute -inset-2 border border-[var(--accent)]/20" />
                <div className="absolute -bottom-3 -right-3 w-full h-full border border-[var(--line)]" />
                <Image
                  src="/FotoSinFondo.webp"
                  alt="Fran Perejón"
                  fill
                  className="object-contain"
                  sizes="144px"
                  priority
                />
              </div>
            </div>

            {/* LEFT: Editorial text */}
            <div>
              <p className="text-[var(--accent)] text-xs font-mono uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot inline-block" />
                Disponible · Sevilla, España
              </p>

              <h1
                className="font-black uppercase leading-none mb-2"
                style={{ fontSize: "clamp(4rem, 15vw, 11rem)", letterSpacing: "-0.04em" }}
              >
                <span style={{ color: "var(--text)" }}>Fra</span>
                <span style={{ color: "var(--accent)" }}>n</span>
              </h1>

              <h2
                className="font-black uppercase text-transparent leading-none mb-6"
                style={{
                  fontSize: "clamp(1rem, 3.8vw, 3rem)",
                  letterSpacing: "-0.03em",
                  WebkitTextStroke: "1px rgba(245,245,245,0.22)",
                }}
              >
                Dev Web &amp; IA Aplicada
              </h2>

              <div
                className="h-px w-24 mb-6"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />

              <p className="text-[var(--text-dim)] max-w-lg text-sm leading-relaxed mb-8">
                Construyo aplicaciones web y sistemas de IA que van a producción.
                Actualmente Especialista en IA en{" "}
                <span className="text-[var(--accent)] font-medium">Derecho Virtual</span>,
                diseñando agentes, flujos RAG y automatizaciones end-to-end.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2.5 font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  <FaLinkedin /> LinkedIn
                </a>
                <a
                  href="https://github.com/FranManuel95"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--line)] text-[var(--text)] px-4 py-2.5 text-sm uppercase tracking-wider hover:border-[var(--text-dim)] transition-colors"
                >
                  <FaGithub /> GitHub
                </a>
                <a
                  href="/Fran%20Perej%C3%B3n%20%E2%80%94%20CV.pdf"
                  download
                  className="inline-flex items-center gap-2 border border-[var(--accent-2)] text-[var(--accent-2)] px-4 py-2.5 text-sm uppercase tracking-wider hover:bg-[var(--accent-2)] hover:text-black transition-colors"
                >
                  <FaDownload /> Descargar CV
                </a>
              </div>
            </div>

            {/* RIGHT: Editorial photo frame */}
            <div className="hidden lg:block relative flex-shrink-0">
              <div className="relative w-52 h-64">
                <div className="absolute -inset-3 border border-[var(--accent)]/20" />
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-[var(--line)]" />
                <Image
                  src="/FotoSinFondo.webp"
                  alt="Fran Perejón"
                  fill
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-700"
                  sizes="208px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats row — animated counters */}
          <div className="mt-12 grid grid-cols-4 gap-0 border-t border-[var(--line)] pt-8 max-w-lg">
            {STATS.map((s) => (
              <AnimatedStat key={s.label} num={s.num} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS TICKER — bottom strip */}
      <div className="border-t border-[var(--line)] py-3 overflow-hidden flex-shrink-0">
        <div className="ticker-track select-none">
          {TICKER.map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-5 text-[11px] font-mono uppercase tracking-widest text-[var(--text-dim)]"
            >
              <span className="text-[var(--accent)] opacity-50">·</span>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
