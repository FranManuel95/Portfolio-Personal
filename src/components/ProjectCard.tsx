import { FaHtml5, FaCss3Alt, FaJs, FaSass, FaBootstrap, FaGulp } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
  technologies: string[];
  isOpen: boolean;
  onClick: () => void;
  isMobile: boolean;
}

const ProjectCard = ({ title, description, link, image, technologies, isOpen, onClick, isMobile }: ProjectCardProps) => {
  const getTechnologyIcon = (tech: string) => {
    switch (tech) {
      case 'html': return <FaHtml5 className="text-red-600" />;
      case 'css': return <FaCss3Alt className="text-blue-600" />;
      case 'javascript': return <FaJs className="text-yellow-400" />;
      case 'sass': return <FaSass className="text-pink-600" />;
      case 'bootstrap': return <FaBootstrap className="text-indigo-600" />;
      case 'gulp': return <FaGulp className="text-orange-600" />;
      default: return null;
    }
  };

  return (
    <div
      className="relative group bg-white min-h-[300px] rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
      onClick={isMobile ? onClick : undefined} // En móviles, usa el evento onClick
    >
      {/* Fondo con la imagen */}
      <div
        className={`absolute inset-0 bg-cover bg-center rounded-xl transition-all duration-500 ease-in-out 
          ${isMobile ? (isOpen ? 'opacity-0' : 'opacity-100') : 'group-hover:opacity-0'}`}
        style={{
          backgroundImage: `url('${image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Contenido del proyecto */}
      <div
        className={`absolute inset-0 flex items-center justify-center text-center bg-white p-6 transition-opacity duration-500 ease-in-out rounded-xl 
          ${isMobile ? (isOpen ? 'opacity-100' : 'opacity-0') : 'opacity-0 group-hover:opacity-100'}`}
      >
        <div>
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

          {/* Mostrar las tecnologías con iconos */}
          <div className="mt-4 flex justify-center gap-2">
            {technologies.map((tech, index) => (
              <span key={index} className="text-xl">{getTechnologyIcon(tech)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
