import { FaBriefcase } from "react-icons/fa";

const experiences = [
  {
    role: "Desarrollador Full-Stack",
    company: "CodeArts Solutions",
    period: "Enero / 2025 - Marzo / 2025",
    description:
      "Analizar y desarrollar un proyecto integral utilizando Docker, Php, Symfony, Next.js, React y TypeScript. En este proyecto, realicé tareas de diversa índole, lo que me permitió adaptarme al trabajo en equipo y adquirir experiencia con diversas tecnologías. Posteriormente, pasé a un proyecto en el que trabajamos en la mejora de funcionalidades y optimización de aspectos de una aplicación móvil desarrollada por la empresa DPTelemetry, utilizando Unity y C#.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    description:
      "Colaboré en la mejora de un sistema CRM desarrollado en Django (Python), centrándome en optimizar la sección de facturas. Implementé mejoras en la interfaz y en diversas funcionalidades, lo que permitió una gestión más ágil.",
  },
];

const Experience = () => {
  return (
    <section id="experiencia" className="py-18 bg-gray-300 text-white px-6 sm:px-14">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8 text-indigo-400 flex justify-center items-center gap-2 sm:text-3xl">
          <FaBriefcase className="mb-1.5" /> Experiencia Profesional
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 py-5">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-102 transition-transform duration-300 w-full"
            >
              <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
              <p className="text-indigo-300 mb-1">{exp.company}</p>
              <p className="text-sm text-gray-400">{exp.period}</p>
              <p className="mt-2 text-gray-300">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
