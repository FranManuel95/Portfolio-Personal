import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Web Techno Festival",
    description: "Web de un festival de música electrónica, con información sobre el evento, artistas, horarios y venta de entradas.",
    link: "/SaSS/index.html",
    image: "/techno.PNG",
    technologies: ['html', 'css', 'javascript', 'sass', 'gulp'],
  },
  {
    title: "Blog Rick and Morty",
    description: "Web de blog sobre la serie Rick and Morty, con información sobre personajes, episodios y curiosidades.",
    link: "/Creación/index.html",
    image: "/rick-morty.PNG",
    technologies: ['html', 'css', 'javascript'],
  },
  {
    title: "Frontend Academia",
    description: "Web de una academia de formación online, con información sobre cursos, proyectos, testimonios y contacto.",
    link: "/PortafolioBootstrap/index.html",
    image: "/academia.PNG",
    technologies: ['html', 'css', 'bootstrap'],
  },
  {
    title: "Frontend Store",
    description: "Web de tienda de ropa online, con catálogo de productos y carrito de compra.",
    link: "/FrontendStore/index.html",
    image: "/front.PNG",
    technologies: ['html', 'css'],
  },
];

const Projects = () => {
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
    <section id="proyectos" className="py-18 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-indigo-400">
          Mis Proyectos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              link={project.link}
              image={project.image}
              technologies={project.technologies}
              isOpen={openProject === index} // Solo este proyecto se abre si coincide con el estado
              onClick={() => setOpenProject(openProject === index ? null : index)} // Alterna entre abrir/cerrar
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
