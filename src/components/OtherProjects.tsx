import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

// Array de proyectos con tecnologías
const otherprojects = [
  {
    title: "Citas motivacionales ",
    description: "Web de citas motivacionales, con frases de personajes célebres y un botón para generar una nueva cita.",
    link: "/CitasMotivacionales/index3.html",
    image: "/citas.PNG",
    technologies: ['html', 'css', 'javascript'],
  },
  {
    title: "Lista de tareas",
    description: "Web de lista de tareas, con la posibilidad de añadir, eliminar y marcar como completadas las tareas.",
    link: "/ListaDeTareas/index5.html",
    image: "/tareas.PNG",
    technologies: ['html', 'css', 'javascript'],
  },
  {
    title: "RGB",
    description: "Web para generar colores RGB aleatorios.",
    link: "/RGB/index2.html",
    image: "/colores.PNG",
    technologies: ['html', 'css', 'javascript'],
  },
  {
    title: "Cronómetro",
    description: "Web de cronómetro con botones para iniciar, pausar y reiniciar el tiempo.",
    link: "/Cronómetro/index4.html",
    image: "/crono.PNG",
    technologies: ['html', 'css', 'javascript'],
  },
];

const OtherProjects = () => {
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // Se considera móvil si el ancho es menor a 768px
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section id="otherprojects" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-indigo-400">
          Otros proyectos más pequeños
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 px-12">
          {otherprojects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              link={project.link}
              image={project.image}
              technologies={project.technologies}
              isOpen={openProject === index}
              onClick={() => setOpenProject(openProject === index ? null : index)}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherProjects;
