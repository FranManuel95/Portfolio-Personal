import { FaBriefcase } from "react-icons/fa";

const experiences = [
  {
    role: "Desarrollador Full-Stack en prácticas",
    company: "CodeArts Solutions",
    period: "Enero/2025 - Marzo/2025",
    description:
      "Comencé mis páracticas en un proyecto integral que involucraba Docker, Php, Symfony, Next.js, React y TypeScript. En este proyecto, realicé tareas de diversa índole, lo que me permitió adaptarme al trabajo en equipo y adquirir experiencia con diversas tecnologías. Posteriormente, pasé a un proyecto en el que trabajamos en la mejora de funcionalidades y optimización de aspectos de una aplicación móvil desarrollada por la empresa DPTelemetry, utilizando Unity y C#.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Amograe Internacional",
    period: "2024",
    description:
      "Comencé trabajando como montador de eventos (decoración/atrezo). Durante una cena, surgió la conversación sobre un sistema CRM que utilizaban para gestionar diversos procesos de la empresa, y mencionaron que querían mejorar la apariencia y algunas funcionalidades de la sección de facturas, que estaba desarrollado en Django (Python). De manera desinteresada, me ofrecí a colaborar con ellos, aprovechando la oportunidad para poner a prueba mis habilidades. Finalmente, logré optimizar la interfaz y funcionalidades, obteniendo un alto nivel de satisfacción por parte de la empresa.",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-16 bg-gray-300 text-white px-6 sm:px-14">
      <div className="max-w-screen mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8 text-indigo-400 flex justify-center items-center gap-2 sm:text-3xl">
          <FaBriefcase className=" mb-1.5" /> Experiencia Profesional
        </h2>

        <div className="grid gap-4 md:grid-cols-2 ">
  {experiences.map((exp, index) => (
    <div
      key={index}
      className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 w-full"  // Cambié "max-w-sm" por "w-full"
    >
      <h3 className="text-xl font-semibold">{exp.role}</h3>
      <p className="text-indigo-300">{exp.company}</p>
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
