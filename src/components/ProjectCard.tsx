
interface ProjectCardProps {
    title: string;
    description: string;
    link: string;
  }
  
  const ProjectCard = ({ title, description, link }: ProjectCardProps) => {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <a
          href={link}
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver Proyecto
        </a>
      </div>
    );
  };
  
  export default ProjectCard;
  