// components/Projects.tsx
import React from "react";
import ProjectCard from "./ProjectCard";


const projects = [
  {
    title: "Proyecto 1",
    description: "Una descripción corta del proyecto",
    link: "https://enlace-del-proyecto.com",
  },
  {
    title: "Proyecto 2",
    description: "Otra descripción corta del proyecto",
    link: "https://enlace-del-proyecto2.com",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-xl font-bold mb-8 text-indigo-400">Mis Proyectos</h2>
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
