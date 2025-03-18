import { FaBriefcase } from "react-icons/fa";

const experiences = [
  {
    role: "Desarrollador Full-Stack",
    company: "Tech Solutions",
    period: "2023 - Actualidad",
    description:
      "Desarrollo de aplicaciones web utilizando React, Next.js y Node.js. Optimización de rendimiento y accesibilidad.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Startup XYZ",
    period: "2021 - 2023",
    description:
      "Creación de interfaces dinámicas con React y Tailwind CSS. Mejora de la experiencia de usuario en plataformas SaaS.",
  },
  {
    role: "Técnico en Desarrollo Web",
    company: "Freelance",
    period: "2019 - 2021",
    description:
      "Diseño y desarrollo de páginas web personalizadas para clientes utilizando HTML, CSS y JavaScript.",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-16 bg-gray-300 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-indigo-400 flex justify-center items-center gap-2">
          <FaBriefcase /> Experiencia Profesional
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
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
