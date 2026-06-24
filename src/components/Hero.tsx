"use client";

import Image from "next/image";
import React from "react";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";
import { MapPin } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const Hero = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useTransform(mx, [0, 1], ["5%", "95%"]);
  const glowY = useTransform(my, [0, 1], ["-15%", "90%"]);

  return (
    <section
      id="hero"
      className={`${isMenuOpen ? "pt-[8.5rem]" : "pt-16"} pb-16 md:pb-24 relative overflow-hidden`}
      onPointerMove={(e) => {
        if (window.matchMedia("(min-width: 768px)").matches) {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }
      }}
    >
      {/* Grid background */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 z-0 [mask-image:radial-gradient(60%_70%_at_50%_40%,black,transparent)]"
        style={{ contain: "paint" }}
      >
        <div className="absolute inset-0 opacity-[0.055] bg-[linear-gradient(to_right,rgba(16,185,129,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.5)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      {/* Radial gradient bg */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[radial-gradient(55%_55%_at_50%_5%,rgba(16,185,129,0.13),transparent)] md:bg-[radial-gradient(65%_55%_at_20%_5%,rgba(16,185,129,0.18),transparent),radial-gradient(45%_40%_at_88%_80%,rgba(245,158,11,0.07),transparent)]"
      />

      {/* Mouse-follow glow */}
      <motion.div
        aria-hidden
        className="hidden md:block pointer-events-none absolute w-[42vw] h-[42vw] max-w-[540px] max-h-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[var(--accent)]/25"
        style={{ left: glowX, top: glowY, willChange: "transform", contain: "paint" }}
      />

      <div className="container relative z-10 flex flex-col items-center lg:flex-row lg:items-center lg:justify-center gap-10 md:gap-14 pt-8 md:pt-12">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .6, ease: [.22, 1, .36, 1] }}
          className="relative flex-shrink-0"
        >
          <div className="relative w-[220px] h-[220px] md:w-[248px] md:h-[248px]">
            {/* Decorative ring */}
            <div className="absolute -inset-2 rounded-full border border-[var(--accent)]/20" />
            <div className="absolute -inset-4 rounded-full border border-[var(--accent)]/08" />
            <Image
              src="/FotoSinFondo.webp"
              alt="Fran Perejón"
              fill
              className="rounded-full object-contain object-center shadow-[0_0_60px_-10px_rgba(16,185,129,0.45)]"
              sizes="248px"
              priority
            />
          </div>

          {/* Location badge */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[var(--text-dim)] bg-[var(--bg-elev-2)] border border-[var(--line)] backdrop-blur whitespace-nowrap shadow-lg">
            <MapPin className="w-3 h-3 text-[var(--accent)]" />
            Sevilla, España
          </div>
        </motion.div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .65, delay: .1, ease: [.22, 1, .36, 1] }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl"
        >
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_10%,var(--bg-elev-1))] text-xs font-medium text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-dot" />
            Disponible para proyectos
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight text-[var(--text)]">
            Hola, soy{" "}
            <span className="bg-clip-text text-transparent bg-[linear-gradient(100deg,#10b981,#34d399,#6ee7b7,#34d399,#10b981)] bg-[length:200%_100%] animate-shimmer">
              Fran
            </span>
          </h1>

          <p className="text-base md:text-lg font-medium text-[var(--text-dim)] tracking-wide mb-3">
            Desarrollador Web & Especialista en IA Aplicada
          </p>

          <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed max-w-lg opacity-80">
            Construyo aplicaciones web y sistemas inteligentes con IA, automatizando
            procesos y optimizando arquitecturas escalables para llevar soluciones a producción.
          </p>

          <div className="my-6 h-px w-20 bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <a
              href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0a66c2] hover:bg-[#0958a8] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_20px_-8px_rgba(10,102,194,0.6)]"
            >
              <FaLinkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="https://github.com/FranManuel95"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--bg-elev-2)] hover:bg-[var(--bg-elev-3)] text-[var(--text)] border border-[var(--line)] hover:border-[var(--accent)]/30 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="/Fran%20Perej%C3%B3n%20%E2%80%94%20CV.pdf"
              download
              className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_20px_-8px_rgba(16,185,129,0.6)]"
            >
              <FaDownload className="w-4 h-4" />
              Descargar CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
