import React from "react";
import { FaHtml5, FaCss3Alt, FaBootstrap, FaJs, FaReact, FaNodeJs, FaNpm,FaPhp, FaGit, FaDocker } from "react-icons/fa";
import { SiTailwindcss, SiNextdotjs, SiUnity, SiSymfony, SiMysql, SiSharp } from "react-icons/si";

const technologies = [
  { name: "HTML", icon: <FaHtml5 className="text-orange-500" /> },
  { name: "CSS", icon: <FaCss3Alt className="text-blue-500" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="text-cyan-500" /> },
  { name: "Bootstrap", icon: <FaBootstrap className="text-purple-600" /> },
  { name: "JavaScript", icon: <FaJs className="text-yellow-500" /> },
  { name: "React", icon: <FaReact className="text-blue-400" /> },
  { name: "Next.js", icon: <SiNextdotjs className="text-gray-800" /> },
  { name: "Unity", icon: <SiUnity className="text-black" /> },
  { name: "C#", icon: <SiSharp className="text-purple-700" /> },
  { name: "PHP", icon: <FaPhp className="text-indigo-600" /> },
  { name: "Symfony", icon: <SiSymfony className="text-black" /> },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
  { name: "Npm", icon: <FaNpm className="text-gray-600" /> },
  { name: "MySQL", icon: <SiMysql className="text-blue-600" /> },
  { name: "Git", icon: <FaGit className="text-red-500" /> },
  { name: "Docker", icon: <FaDocker className="text-blue-400" /> },
];

const About = () => {
  return (
    <section id="about" className="py-12 bg-gray-200">
      <div className="max-w-5xl mx-auto text-center px-4 sm:px-14">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-400">Sobre mí</h2>
        <p className="md:text-2xl text-gray-800 leading-relaxed">
          Me considero una persona{" "}
          <span className="text-[var(--secondary-color)]">constante</span>,{" "}
          <span className="text-[var(--secondary-color)]">resolutiva</span> y con gran{" "}
          <span className="text-[var(--secondary-color)]">capacidad de adaptación</span>. Disfruto aprendiendo nuevas tecnologías y 
          enfrentándome a desafíos que me ayuden a crecer profesionalmente. Tengo{" "}
          <span className="text-[var(--secondary-color)]">facilidad para el aprendizaje</span>, me motiva seguir formándome y mejorar día a día.
        </p>

        <h3 className="text-2xl sm:text-3xl font-semibold mt-14 mb-6 text-indigo-400 ">Tecnologías con las que he trabajado:</h3>

        <div className="grid grid-cols-4 sm:grid-cols-7  md:grid-cols-8 gap-3">
          {technologies.map((tech, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-1 flex flex-col items-center hover:scale-105 transition-transform">
              <div className="text-2xl">{tech.icon}</div>
              <span className="mt-1 text-xs font-medium text-gray-700">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
