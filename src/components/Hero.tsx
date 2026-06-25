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
      className={`${isMenuOpen ? "pt-[8.5rem]" : "pt-16"} pb-14 md:pb-20 relative overflow-hidden text-white`}
      onPointerMove={(e) => {
        if (window.matchMedia("(min-width: 768px)").matches) {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }
      }}
    >
      {/* BACKGROUNDS */}
      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl"
          style={{ animation: "aurora-shift 8s ease infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl"
          style={{ animation: "aurora-shift 10s ease infinite 2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl"
          style={{ animation: "aurora-shift 14s ease infinite 1s" }}
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[radial-gradient(65%_60%_at_50%_0%,rgba(139,92,246,0.12),transparent)] md:bg-[radial-gradient(70%_60%_at_20%_0%,rgba(139,92,246,0.18),transparent),radial-gradient(50%_40%_at_90%_80%,rgba(14,165,233,0.10),transparent)]"
        style={{ contain: "paint" }}
      />
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 z-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]"
        style={{ contain: "paint" }}
      >
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <motion.div
        aria-hidden
        className="hidden md:block pointer-events-none absolute w-[44vw] h-[44vw] max-w-[580px] max-h-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl bg-[var(--accent)]/20"
        style={{ left: glowX, top: glowY, willChange: "transform, filter", contain: "paint" }}
      />

      {/* CONTENIDO */}
      <div className="container relative z-10 grid gap-8 md:gap-10 lg:flex lg:justify-center lg:items-center lg:justify-items-center lg:min-h-[280px]">
        {/* Imagen */}
        <div className="flex items-center justify-center lg:justify-end h-full">
          <div className="relative w-[240px] h-[240px] md:w-[260px] md:h-[260px]">
            {/* Aurora gradient border */}
            <div className="absolute inset-0 p-[2px] rounded-full bg-gradient-to-br from-violet-500 via-emerald-400 to-sky-500">
              <div className="rounded-full overflow-hidden w-full h-full bg-[var(--bg)]">
                <Image
                  src="/FotoSinFondo.webp"
                  alt="Fran"
                  fill
                  className="rounded-full object-contain object-center"
                  sizes="(max-width: 1024px) 260px, 260px"
                  priority
                />
              </div>
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full shadow-[0_20px_60px_-20px_rgba(139,92,246,0.6)] pointer-events-none" />

            {/* Location badge — glassmorphism */}
            <div className="absolute -bottom-6 -right-5 px-3 py-1 rounded-full text-md font-semibold text-amber-400 glass-card border-amber-400/20">
              Sevilla, España
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-center h-full items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
            Hola, soy{" "}
            <span
              className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#8b5cf6,#0ea5e9,#10b981,#8b5cf6)] bg-[length:200%_100%] animate-shimmer"
            >
              Fran
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 tracking-wide font-medium">
            Desarrollador Web & Especialista en IA Aplicada
          </p>

          <p className="mt-3 text-sm md:text-base text-gray-400 max-w-lg leading-relaxed">
            Desarrollo aplicaciones web y sistemas inteligentes con IA,
            automatizando procesos y optimizando costes mediante arquitecturas escalables.
          </p>

          <div className="my-6 h-px w-24 bg-gradient-to-r from-violet-500/50 via-emerald-400/50 to-sky-500/50 rounded-full" />

          <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
            <a
              href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
              target="_blank"
              rel="noopener noreferrer"
              className="justify-center inline-flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/FranManuel95"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 glass-card text-white px-4 py-2 rounded-lg justify-center transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
            <a
              href="/Fran Perejón — CV.pdf"
              download
              className="inline-flex items-center justify-center gap-2 col-span-2 sm:col-span-1 bg-red-600/80 backdrop-blur border border-red-500/30 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600"
            >
              <FaDownload /> <span>Descargar CV</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
