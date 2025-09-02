"use client";

import React from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaJs,
  FaReact,
  FaNodeJs,
  FaNpm,
  FaPhp,
  FaGit,
  FaDocker,
} from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs, SiUnity, SiSymfony, SiMysql, SiSharp } from "react-icons/si";

/** Tipado seguro para CSS variables (sin any) */
type CSSVarName = `--${string}`;
type StyleWithVars = React.CSSProperties & Record<CSSVarName, string>;
const delay = (ms: number): StyleWithVars => ({ ["--d"]: `${ms}ms` } as StyleWithVars);

const technologies = [
  { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
  { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-500" /> },
  { name: "Bootstrap", icon: <FaBootstrap className="text-purple-600" /> },
  { name: "JavaScript", icon: <FaJs className="text-yellow-500" /> },
  { name: "React", icon: <FaReact className="text-blue-400" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-gray-200" /> },
  { name: "Unity", icon: <SiUnity className="text-gray-100" /> },
  { name: "C#", icon: <SiSharp className="text-purple-700" /> },
  { name: "PHP", icon: <FaPhp className="text-indigo-600" /> },
  { name: "Symfony", icon: <SiSymfony className="text-gray-100" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Npm", icon: <FaNpm className="text-gray-400" /> },
  { name: "MySQL", icon: <SiMysql className="text-blue-600" /> },
  { name: "Git", icon: <FaGit className="text-red-500" /> },
  { name: "Docker", icon: <FaDocker className="text-blue-400" /> },
];

const About = () => {
  return (
    // OJO: no ponemos id aquí para evitar duplicados; el id "sobremí" ya lo lleva la sección en app/page.tsx
    <section className="relative">
      {/* Fondo ultradark con leve gradiente */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"
      />
      <div className="container relative text-center">
        {/* Heading */}
        <h2 className="headline text-3xl mb-6 reveal" style={delay(0)}>
          Sobre mí
        </h2>

        {/* Texto (contenido intacto) */}
        <p
          className="md:text-2xl text-[color-mix(in_oklab,var(--text)_90%,#fff)] leading-relaxed max-w-4xl mx-auto reveal"
          style={delay(80)}
        >
          Me considero una persona{" "}
          <span className="text-[var(--accent-2)]">constante</span>,{" "}
          <span className="text-[var(--accent-2)]">resolutiva</span> y con gran{" "}
          <span className="text-[var(--accent-2)]">capacidad de adaptación</span>. Disfruto
          aprendiendo nuevas tecnologías y enfrentándome a desafíos que me ayuden a crecer
          profesionalmente. Tengo{" "}
          <span className="text-[var(--accent-2)]">facilidad para el aprendizaje</span>, me motiva
          seguir formándome y mejorar día a día.
        </p>

        {/* Subheading */}
        <h3
          className="text-2xl sm:text-3xl font-semibold mt-12 mb-6 text-[var(--accent)] reveal"
          style={delay(120)}
        >
          Tecnologías con las que he trabajado:
        </h3>

        {/* Grid de tecnologías con reveal escalonado */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {technologies.map((tech, i) => (
            <div
              key={tech.name}
              className="reveal surface p-3 flex flex-col items-center"
              style={delay(160 + i * 40)}
            >
              <div className="text-2xl">{tech.icon}</div>
              <span className="mt-1 text-xs font-medium text-[var(--text-dim)]">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
