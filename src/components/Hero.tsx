"use client";

import Image from "next/image";
import React from "react";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Hero = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useTransform(mx, [0, 1], ["8%", "92%"]);
  const glowY = useTransform(my, [0, 1], ["-10%", "85%"]);

  return (
    <section
      id="hero"
      className={`${isMenuOpen ? "pt-[8.5rem]" : "pt-16"} min-h-screen flex items-center relative overflow-hidden`}
      onPointerMove={(e) => {
        if (window.matchMedia("(min-width: 768px)").matches) {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }
      }}
    >
      {/* Vertical accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />

      {/* Subtle moving glow */}
      <motion.div
        aria-hidden
        className="hidden md:block pointer-events-none absolute w-[44vw] h-[44vw] max-w-[580px] max-h-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[var(--accent)]/10"
        style={{ left: glowX, top: glowY, willChange: "transform", contain: "paint" }}
      />

      <div className="container relative z-10 pl-8 md:pl-16">
        <p className="text-[var(--accent)] text-sm font-mono uppercase tracking-[0.3em] mb-6">
          Disponible para proyectos
        </p>

        {/* Giant name */}
        <h1
          className="font-black uppercase leading-none mb-4"
          style={{ fontSize: "clamp(4rem, 15vw, 12rem)", letterSpacing: "-0.04em" }}
        >
          <span style={{ color: "var(--text)" }}>Fra</span>
          <span style={{ color: "var(--accent)" }}>n</span>
        </h1>

        {/* Outline subtitle */}
        <h2
          className="font-black uppercase text-transparent leading-none mb-8"
          style={{
            fontSize: "clamp(1.5rem, 5vw, 4rem)",
            letterSpacing: "-0.03em",
            WebkitTextStroke: "1px rgba(245,245,245,0.3)",
          }}
        >
          Dev Web &amp; IA Aplicada
        </h2>

        {/* Accent divider */}
        <div className="h-px w-32 bg-[var(--accent)] mb-8" />

        {/* Buttons and photo in row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 font-semibold text-sm uppercase tracking-wider transition-opacity hover:opacity-90"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/FranManuel95"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--line)] text-[var(--text)] px-4 py-2 text-sm uppercase tracking-wider hover:border-[var(--text-dim)] transition-colors"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
            <a
              href="/Fran%20Perej%C3%B3n%20%E2%80%94%20CV.pdf"
              download
              className="inline-flex items-center gap-2 border border-[var(--accent-2)] text-[var(--accent-2)] px-4 py-2 text-sm uppercase tracking-wider hover:bg-[var(--accent-2)] hover:text-black transition-colors"
            >
              <FaDownload /> <span>Descargar CV</span>
            </a>
          </div>

          {/* Photo with editorial treatment */}
          <div className="relative w-48 h-48 border-2 border-[var(--accent)] flex-shrink-0">
            <Image
              src="/FotoSinFondo.webp"
              alt="Fran"
              fill
              className="object-contain grayscale hover:grayscale-0 transition-all duration-500"
              sizes="192px"
              priority
            />
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-[var(--text-dim)]" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-12 flex gap-8 border-t border-[var(--line)] pt-8">
          <div>
            <p className="text-4xl font-black text-[var(--accent)]">3+</p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-dim)]">Años exp</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--accent)]">10+</p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-dim)]">Proyectos</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--accent)]">4</p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-dim)]">Especialidades</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
