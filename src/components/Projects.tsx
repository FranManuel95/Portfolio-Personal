import React from "react";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "Web Techno Festival",
    description: "Web de un festival de música electrónica, con información sobre el evento, artistas, horarios y venta de entradas.",
    link: "/SaSS/index.html",
    image: "/techno.png",
    technologies: ['html', 'css', 'javascript', 'sass', 'gulp'],  // Aquí añadimos las tecnologías
  },
  {
    title: "Blog Rick and Morty",
    description: "Web de blog sobre la serie Rick and Morty, con información sobre personajes, episodios y curiosidades.",
    link: "/Creación/index.html",
    image: "/rick-morty.png",
    technologies: ['html', 'css', 'javascript'],  // Aquí añadimos las tecnologías
  },

  {
    title: "Frontend Academia",
    description: "Web de una academia de formación online, con información sobre cursos, proyectos, testimonios y contacto.",
    link: "/PortafolioBootstrap/index.html",
    image: "/academia.png",
    technologies: ['html', 'css', 'bootstrap'],  // Aquí añadimos las tecnologías
  },
  {
    title: "Frontend Store",
    description: "Web de tienda de ropa online, con catálogo de productos y carrito de compra.",
    link: "/FrontendStore/index.html",
    image: "/front.png",
    technologies: ['html', 'css'],  // Aquí añadimos las tecnologías
  },
  
];

const Projects = () => {
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
              technologies={project.technologies}  // Aquí pasas las tecnologías al componente
            />
          ))}
        </div>
      </div>
    </section>
  );
};


export default Projects;
