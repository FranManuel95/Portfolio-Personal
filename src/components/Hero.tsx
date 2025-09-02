"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaDownload } from "react-icons/fa";
import { motion, useMotionValue, useTransform } from "framer-motion";

const MENU_ANIM_MS = 5;

const Hero = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const [menuOpenForLayout, setMenuOpenForLayout] = useState(isMenuOpen);
  const prev = useRef(isMenuOpen);

  // Parallax suave del glow
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useTransform(mx, [0, 1], ["8%", "92%"]);
  const glowY = useTransform(my, [0, 1], ["-10%", "85%"]);

  useEffect(() => {
    let timeoutId: number | undefined;
    const opening = !prev.current && isMenuOpen;
    const closing = prev.current && !isMenuOpen;
    if (opening) setMenuOpenForLayout(true);
    else if (closing) timeoutId = window.setTimeout(() => setMenuOpenForLayout(false), MENU_ANIM_MS);
    prev.current = isMenuOpen;
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [isMenuOpen]);

  return (
    <section
      className={`${menuOpenForLayout ? "pt-[8.5rem]" : "pt-16"} pb-14 md:pb-20 relative overflow-hidden text-white`}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      id="hero"
    >
      {/* Fondo ultradark */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_0%,rgba(124,134,255,0.25),transparent),radial-gradient(50%_40%_at_90%_80%,rgba(255,255,255,0.08),transparent)]"
      />
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]">
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute w-[44vw] h-[44vw] max-w-[580px] max-h-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[var(--accent)]/35"
        style={{ left: glowX, top: glowY }}
      />

      {/* CONTENEDOR: 2 columnas centradas, misma altura en lg+ */}
      <div className="container grid gap-8 md:gap-10 lg:flex lg:justify-center lg:items-center lg:justify-items-center lg:min-h-[280px]">
        {/* Columna Imagen (alineada al centro vertical, pegada al texto mediante gap reducido) */}
        <motion.div
          initial={{ opacity: 0, y: 16, rotateZ: -1 }}
          whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex items-center justify-center lg:justify-end h-full"
        >
          {/* Wrapper cuadrado + Image fill (sin warnings de aspect ratio) */}
          <div className="relative w-[240px] h-[240px] md:w-[260px] md:h-[260px]">
            <Image
              src="/SinFondo.png"
              alt="Fran"
              fill
              className="rounded-full object-cover shadow-[0_20px_60px_-20px_rgba(124,134,255,0.6)] ring-2 ring-white/10"
              sizes="(max-width: 1024px) 260px, 260px"
              priority
            />
            <div className="absolute -bottom-6 -right-5 px-3 py-1 rounded-full text-md font-semibold text-amber-400 bg-white/10 backdrop-blur border border-white/10">
              Sevilla, España
            </div>
          </div>
        </motion.div>

        {/* Columna Texto/CTAs (centrada vertical y horizontal en móvil, alineada a la izquierda en lg) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center h-full items-center lg:items-start text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
            Hola, soy{" "}
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#fff,rgba(124,134,255,1),#fff)] bg-[length:200%_100%] animate-[shimmer_3.2s_linear_infinite]">
              Fran
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 tracking-wide">Desarrollador Full-Stack</p>
          <p className="text-lg md:text-xl text-gray-300 tracking-wide">Graduado en Desarrollo de Aplicaciones Web</p>

          <div className="my-6 h-px w-24 bg-white/25 rounded-full" />

          {/* CTAs: pegadas al texto, responsivas */}
          <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
            <a
              href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 bg-[var(--accent)] text-black px-4 py-2 rounded-lg transition will-change-transform"
            >
              <span className="absolute inset-0 rounded-lg bg-white/40 opacity-0 group-hover:opacity-100 transition" />
              <FaLinkedin /> <span className="relative">LinkedIn</span>
            </a>
            <a
              href="https://github.com/FranManuel95"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              <span className="absolute inset-0 rounded-lg ring-1 ring-white/10 group-hover:ring-white/20 transition" />
              <FaGithub /> <span className="relative">GitHub</span>
            </a>
            <a
              href="mailto:perejonfcomanuel@gmail.com?subject=Estoy%20interesado%20en%20tu%20trabajo."
              className="group relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition" />
              <FaEnvelope /> <span className="relative">Email</span>
            </a>
            <a
              href="/Currículum Fran Perejón Carmona.pdf"
              download
              className="group relative flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <span className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition" />
              <FaDownload /> <span className="relative">CV</span>
            </a>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
