"use client";

import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import MagneticButton from "./MagneticButton";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!/<>[]{}";

function ScrambleText({
  text,
  colors,
}: {
  text: string;
  colors: string[];
}) {
  // Start fully scrambled
  const [chars, setChars] = useState<string[]>(() =>
    text.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  useEffect(() => {
    let frame = 0;
    const total = 140; // ~2.3s at 16ms
    const id = setInterval(() => {
      frame++;
      setChars(
        text.split("").map((ch, i) => {
          // Each letter resolves sequentially, last one very late
          const resolveAt = Math.floor(20 + (i / text.length) * total * 0.82);
          return frame > resolveAt ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
        })
      );
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text]);

  return (
    <>
      {chars.map((ch, i) => (
        <span key={i} style={{ color: colors[i] }}>
          {ch}
        </span>
      ))}
    </>
  );
}

const STATS = [
  { num: 2, suffix: "+", label: "Años exp" },
  { num: 3, suffix: "", label: "Empresas" },
  { num: 100, suffix: "+", label: "Usuarios activos" },
  { num: 10, suffix: "+", label: "Proyectos" },
];

function AnimatedStat({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2400;
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
    <div ref={ref}>
      <p className="text-2xl sm:text-3xl font-black text-[var(--accent)] tabular-nums" style={{ letterSpacing: "-0.03em" }}>
        {count}{suffix}
      </p>
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

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
        <div className="container relative z-10 pl-5 md:pl-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-20 items-center">

            {/* Mobile photo */}
            <div className="lg:hidden flex justify-center">
              <div className="relative w-44 h-56">
                <div className="absolute -inset-2 border border-[var(--accent)]/20" />
                <div className="absolute -bottom-3 -right-3 w-full h-full border border-[var(--line)]" />
                <Image
                  src="/FotoSinFondo.webp"
                  alt="Fran Perejón"
                  fill
                  className="object-contain"
                  sizes="176px"
                  priority
                />
              </div>
            </div>

            {/* LEFT: Editorial text */}
            <div>
              <p className="text-[var(--accent)] text-xs font-mono uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot inline-block" />
                Disponible para proyectos
              </p>

              <h1
                className="font-black uppercase leading-none mb-2"
                style={{ fontSize: "clamp(4rem, 12vw, 9rem)", letterSpacing: "-0.04em" }}
              >
                <ScrambleText
                  text="FRAN"
                  colors={["var(--text)", "var(--text)", "var(--text)", "var(--text)"]}
                />
              </h1>

              <h2
                className="font-bold uppercase leading-none mb-6"
                style={{
                  fontSize: "clamp(0.85rem, 2.2vw, 1.6rem)",
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                }}
              >
                AI Engineer &amp; Automatización
              </h2>

              <div
                className="h-px w-24 mb-6"
                style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }}
              />

              <p className="text-[var(--text-dim)] max-w-lg text-sm leading-relaxed mb-8">
                Diseño y opero agentes de IA, pipelines RAG y automatizaciones que resuelven
                problemas concretos y llegan a producción, software real en uso, no demos.
                De la interfaz al modelo, controlo el sistema completo.
              </p>

              <div className="flex flex-wrap gap-3">
                {/* Primary — Descargar CV (la acción concreta) */}
                <MagneticButton>
                  <a
                    href="/Fran%20Perej%C3%B3n%20%E2%80%94%20CV.pdf"
                    download
                    data-cursor
                    aria-label="Descargar mi CV en PDF"
                    className="group inline-flex items-center gap-2.5 bg-[var(--accent)] text-black px-5 py-3 font-semibold text-sm uppercase tracking-wider border border-[var(--accent)] transition-all duration-200 hover:shadow-[0_0_28px_-6px_var(--accent)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                  >
                    <FaDownload className="text-base transition-transform duration-200 group-hover:-translate-y-0.5" />
                    Descargar CV
                  </a>
                </MagneticButton>

                {/* LinkedIn */}
                <MagneticButton>
                  <a
                    href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    aria-label="Abrir mi perfil de LinkedIn"
                    className="inline-flex items-center gap-2.5 border border-[var(--line)] text-[var(--text)] px-5 py-3 font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <FaLinkedin className="text-base" /> LinkedIn
                  </a>
                </MagneticButton>

                {/* GitHub */}
                <MagneticButton>
                  <a
                    href="https://github.com/FranManuel95"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    aria-label="Abrir mi perfil de GitHub"
                    className="inline-flex items-center gap-2.5 border border-[var(--line)] text-[var(--text)] px-5 py-3 font-semibold text-sm uppercase tracking-wider transition-all duration-200 hover:border-[var(--text)] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <FaGithub className="text-base" /> GitHub
                  </a>
                </MagneticButton>
              </div>
            </div>

            {/* RIGHT: Editorial photo frame — larger & more balanced */}
            <div className="hidden lg:flex items-center justify-end flex-shrink-0">
              <div className="relative w-72 h-[22rem]">
                <div className="absolute -inset-3 border border-[var(--accent)]/20" />
                <div className="absolute -bottom-5 -right-5 w-full h-full border border-[var(--line)]" />
                <Image
                  src="/FotoSinFondo.webp"
                  alt="Fran Perejón"
                  fill
                  className="object-contain transition-all duration-700"
                  sizes="288px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats row — animated counters (2×2 on mobile, 4 across on larger screens) */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-t border-[var(--line)] pt-8 max-w-lg">
            {STATS.map((s) => (
              <AnimatedStat key={s.label} num={s.num} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
