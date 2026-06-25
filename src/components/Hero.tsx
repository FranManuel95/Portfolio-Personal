"use client";

import Image from "next/image";
import React from "react";
import { FaLinkedin, FaGithub, FaDownload } from "react-icons/fa";

const Hero = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  return (
    <section
      id="hero"
      className={`${isMenuOpen ? "pt-[8.5rem]" : "pt-16"} min-h-[90vh] flex items-center relative overflow-hidden`}
    >
      {/* Spotlight beam desde arriba */}
      <div className="hero-spotlight" />

      {/* Partículas flotantes (puntos de luz) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-[var(--accent)]/40"
            style={{
              left: `${10 + (i * 8) % 85}%`,
              top: `${15 + (i * 13) % 70}%`,
              boxShadow: "0 0 6px 2px rgba(129,140,248,0.3)",
              animation: `float-particle ${3 + i * 0.4}s ease-in-out infinite ${i * 0.3}s alternate`,
            }}
          />
        ))}
      </div>

      {/* Grid muy sutil */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,rgba(129,140,248,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(129,140,248,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 py-16">
        {/* Texto */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">

          {/* Badge con glow */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] text-[var(--accent)] text-xs font-mono uppercase tracking-widest"
            style={{ boxShadow: "0 0 20px -5px rgba(129,140,248,0.4)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Disponible · Sevilla, España
          </div>

          {/* Nombre con glow */}
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-none"
            style={{ textShadow: "0 0 80px rgba(129,140,248,0.3)" }}
          >
            Hola, soy{" "}
            <span
              className="text-[var(--accent)]"
              style={{ textShadow: "0 0 30px rgba(129,140,248,0.8)" }}
            >
              Fran
            </span>
          </h1>

          <p className="text-base md:text-xl text-[var(--text-dim)] mb-4 font-light tracking-wide">
            Desarrollador Web & Especialista en IA Aplicada
          </p>

          <p className="text-sm text-[var(--text-dim)]/70 max-w-md leading-relaxed mb-8">
            Construyo aplicaciones web y sistemas inteligentes con IA, llevando soluciones a producción.
          </p>

          {/* Línea de acento */}
          <div
            className="h-px w-24 mb-8"
            style={{
              background: "linear-gradient(90deg, var(--accent), transparent)",
              boxShadow: "0 0 10px rgba(129,140,248,0.5)",
            }}
          />

          {/* Botones */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a
              href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-[var(--accent)] border border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 transition-all duration-200"
              style={{ boxShadow: "0 0 20px -8px rgba(129,140,248,0.5)" }}
            >
              <FaLinkedin />
              LinkedIn
            </a>
            <a
              href="https://github.com/FranManuel95"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm border border-[var(--line)] hover:border-[var(--accent)]/30 transition-all duration-200"
            >
              <FaGithub />
              GitHub
            </a>
            <a
              href="/Fran%20Perej%C3%B3n%20%E2%80%94%20CV.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-[var(--accent)] text-black hover:brightness-110 transition-all duration-200"
              style={{ boxShadow: "0 4px 24px -6px rgba(129,140,248,0.7)" }}
            >
              <FaDownload />
              Descargar CV
            </a>
          </div>
        </div>

        {/* Foto con spotlight */}
        <div className="relative flex-shrink-0">
          {/* Glow de fondo de la foto */}
          <div className="absolute -inset-8 rounded-full blur-3xl bg-[var(--accent)]/15" />
          <div className="relative w-56 h-56 md:w-72 md:h-72">
            <div
              className="absolute inset-0 rounded-full border border-[var(--accent)]/20"
              style={{ boxShadow: "0 0 60px -10px rgba(129,140,248,0.5)" }}
            />
            <Image
              src="/FotoSinFondo.webp"
              alt="Fran"
              fill
              className="rounded-full object-contain"
              style={{ filter: "drop-shadow(0 0 30px rgba(129,140,248,0.3))" }}
              priority
              sizes="288px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
