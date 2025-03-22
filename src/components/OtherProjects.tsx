// components/Projects.tsx
import React from "react";
import ProjectCard from "./ProjectCard";


const otherprojects = [
    {
      title: "Citas motivacionales ",
      description: "Otra descripción corta del proyecto",
      link: "/CitasMotivacionales/index3.html",
    },
    {
      title: "Cronómetro",
      description: "Otra descripción corta del proyecto",
      link: "/Cronómetro/index4.html",
    },
    {
      title: "Lista de tareas",
      description: "Otra descripción corta del proyecto",
      link: "/ListaDeTareas/index5.html",
    },
    {
      title: "RGB",
      description: "Otra descripción corta del proyecto",
      link: "/RGB/index2.html",
    },
];

const OtherProjects = () => {
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
              />
            ))}
          </div>
        </div>
      </section>
    );
  };
  

export default OtherProjects;
