import Image from "next/image";
import { FaLinkedin, FaGithub, FaEnvelope, FaDownload } from "react-icons/fa";

const Hero = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  return (
    <section
      className={`bg-gradient-to-r from-gray-900 to-black text-white flex flex-col lg:flex-row justify-center items-center text-center lg:text-left px-8 pt-16 mt-2 transition-all duration-300 ease-in-out ${
        isMenuOpen ? "pt-40" : "pt-16" // Cambia el padding-top cuando el menú está abierto
      }`}
    >
      {/* Imagen de perfil */}
      <div className="lg:mb-14 lg:mr-12 flex justify-center">
        <Image
          src="/SinFondo.png"
          alt="Fran"
          width={200}
          height={200}
          className="rounded-full object-cover shadow-xl"
          priority
        />
      </div>

      {/* Texto y descripción */}
      <div className="min-h-82 flex flex-col justify-center items-center lg:items-start">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight drop-shadow-xl animate-fade-in">
          Hola, soy <span className="text-indigo-400">Fran</span>
        </h1>
        <p className="text-lg md:text-xl mb-4 text-gray-300 tracking-wide">
          Developer Full-Stack Developer | En constante aprendizaje
        </p>
        <p className="text-lg md:text-xl mb-4 text-gray-300 tracking-wide">
          Graduado en Desarrollo de Aplicaciones Web
        </p>
        <p className="text-lg md:text-xl mb-5 text-gray-300 tracking-wide">
          Sevilla, España
        </p>
        {/* Botones de contacto */}
        
        <div className="flex gap-4 mb-6">
  <a
    href="https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg transition duration-300"
  >
    <FaLinkedin /> LinkedIn
  </a>
  <a
    href="https://github.com/FranManuel95"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition duration-300"
  >
    <FaGithub /> GitHub
  </a>
  <a
    href="mailto:perejonfcomanuel@gmail.com"
    className="flex items-center gap-2 bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition duration-300"
  >
    <FaEnvelope /> Email
  </a>
  <a
    href="/CV_Fran.pdf"
    download
    className="flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition duration-300"
  >
    <FaDownload /> CV
  </a>
</div>

      </div>
      
    </section>
  );
};

export default Hero;
