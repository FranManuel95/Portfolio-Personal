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

  // Estados de visibilidad
  const imgHiddenMobile = isMobile ? isOpen : false; // en móvil la imagen se oculta cuando está abierto
  const contentVisibleMobile = isMobile ? isOpen : false;

  return (
    <div
      className="relative group bg-white min-h-[300px] rounded-xl shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl overflow-hidden"
      onClick={isMobile ? onClick : undefined}
      role={isMobile ? "button" : undefined}
      aria-expanded={isMobile ? isOpen : undefined}
    >
      {/* Capa imagen (fondo) */}
      <div
  className={`absolute inset-0 bg-cover bg-center rounded-xl transition-all duration-500 ease-in-out
    ${isMobile
      ? (imgHiddenMobile ? 'opacity-0 z-10' : 'opacity-100 z-20')
      : 'opacity-100 z-20 group-hover:opacity-0 group-hover:z-10 group-hover:pointer-events-none'
    }`}
  style={{ backgroundImage: `url('${image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
  aria-hidden={isMobile ? isOpen : false}
/>

      {/* Capa contenido */}
      <div
  className={`absolute inset-0 flex items-center justify-center text-center bg-white p-6 transition-opacity duration-500 ease-in-out rounded-xl
    ${isMobile
      ? (contentVisibleMobile ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-10 pointer-events-none')
      : 'opacity-0 z-10 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:z-20'
    }`}
  aria-hidden={isMobile ? !isOpen : true}
>
  <div>
    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>

    <a
      href={link}
      className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-semibold"
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isMobile ? (isOpen ? 0 : -1) : -1}
      aria-disabled={isMobile ? (!isOpen) : undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (isMobile && !isOpen) e.preventDefault();
      }}
    >
      Ver Proyecto
    </a>

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
