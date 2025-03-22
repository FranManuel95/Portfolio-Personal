// components/Projects.tsx
import React from "react";
import ProjectCard from "./ProjectCard";


const projects = [
  {
    title: "Blog Rick and Morty",
    description: "Una descripción corta del proyecto",
    link: "/Creación/index.html",
  },
  {
    title: "Web Techno Festival",
    description: "Otra descripción corta del proyecto",
    link: "/SaSS/index.html",
  },
  {
    title: "Frontend Store",
    description: "Otra descripción corta del proyecto",
    link: "/FrontendStore/index.html",
  },
  {
    title: "Frontend Academía",
    description: "Otra descripción corta del proyecto",
    link: "/PortfolioBootstrap/index.html",
  },

];

const Projects = () => {
  return (
    <section id="proyectos" className="py-18 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-indigo-400">Mis Proyectos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8  px-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
