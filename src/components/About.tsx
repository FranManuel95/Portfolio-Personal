"use client";

import React from "react";
import {
  FaHtml5, FaCss3Alt, FaBootstrap, FaJs, FaReact, FaNodeJs, FaNpm, FaPhp, FaGit, FaDocker,
} from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs, SiUnity, SiSymfony, SiMysql, SiSharp } from "react-icons/si";
import Reveal from "./Reveal";
import TypewriterText from "./TypewriterText";

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
    <section className="relative">
      <div
        
        className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]"
      />
      <div className="container relative text-center">
        {/* Heading */}
        <Reveal replay>
          <h2 className="headline text-3xl py-4 mt-6 mb-6">Sobre mí</h2>
        </Reveal>

        {/* Texto */}
        <Reveal replay delayMs={60}>
         <TypewriterText
  as="p"
  className="md:text-2xl text-[color-mix(in_oklab,var(--text)_90%,#fff)] leading-relaxed max-w-4xl mx-auto"
  speed={26}
  startDelay={120}
  punctuationPauseMs={110}
  inViewMargin="0px 0px -12% 0px"
  segments={[
    { text: "Me defino por la " },
    { text: "constancia", className: "text-[var(--accent-2)]" },
    { text: ", la " },
    { text: "resolución de problemas", className: "text-[var(--accent-2)]" },
    { text: " y la " },
    { text: "capacidad de adaptación", className: "text-[var(--accent-2)]" },
    { text: ". " },

    { text: "Disfruto aprendiendo tecnologías nuevas y llevándolas a la práctica para construir " },
    { text: "soluciones claras y mantenibles", className: "text-[var(--accent-2)]" },
    { text: ". " },

    { text: "Soy " },
    { text: "perseverante", className: "text-[var(--accent-2)]" },
    { text: ": cuando aparece un reto, profundizo hasta entender el porqué y encontrar el cómo, sin dejarlo a medias. " },

    { text: "Valoro el " },
    { text: "trabajo en equipo", className: "text-[var(--accent-2)]" },
    { text: ", comparto lo que sé y trato a los demás como me gustaría que me tratasen. " },

    { text: "Mi objetivo: " },
    { text: "mejorar un poco cada día", className: "text-[var(--accent-2)]" },
    { text: " y aportar " },
    { text: "impacto real", className: "text-[var(--accent-2)]" },
    { text: " en cada proyecto." },
  ]}
/>

        </Reveal>

        {/* Subheading */}
        <Reveal replay delayMs={120}>
          <h3 className="text-2xl sm:text-3xl font-semibold mt-12 mb-6 text-[var(--accent)]">
            Tecnologías con las que he trabajado:
          </h3>
        </Reveal>

        {/* Grid con stagger simple */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {technologies.map((tech, i) => (
            <Reveal replay key={tech.name} delayMs={160 + i * 60}>
              <div className="surface p-3 flex flex-col items-center">
                <div className="text-2xl">{tech.icon}</div>
                <span className="mt-1 text-xs font-medium text-[var(--text-dim)]">{tech.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
