import { FaHtml5, FaCss3Alt, FaJs, FaSass, FaBootstrap, FaGulp } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
  technologies: string[];
}

const ProjectCard = ({ title, description, link, image, technologies }: ProjectCardProps) => {
  const getTechnologyIcon = (tech: string) => {
    switch (tech) {
      case 'html':
        return <FaHtml5 className="text-red-600" />; // HTML tiene color rojo
      case 'css':
        return <FaCss3Alt className="text-blue-600" />; // CSS tiene color azul
      case 'javascript':
        return <FaJs className="text-yellow-400" />; // JavaScript tiene color amarillo
      case 'sass':
        return <FaSass className="text-pink-600" />; // Sass tiene color rosa
      case 'bootstrap':
        return <FaBootstrap className="text-indigo-600" />; // Bootstrap tiene color azul oscuro
      case 'gulp':
        return <FaGulp className="text-orange-600" />; // Gulp tiene color naranja
      default:
        return null;
    }
  };

  return (
    <div className="relative group bg-white min-h-[300px] rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">
      {/* Fondo con la imagen (se oculta al hacer hover) */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-xl transition-all duration-500 ease-in-out group-hover:opacity-0"
        style={{
          backgroundImage: `url('${image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Contenido de la tarjeta (se oculta inicialmente) */}
      <div className="absolute inset-0 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 bg-white p-6 transition-opacity duration-500 ease-in-out rounded-xl">
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
          
          {/* Mostrar las tecnologías con colores */}
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
