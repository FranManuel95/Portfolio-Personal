import Link from "next/link";

// Recibimos isMenuOpen y setIsMenuOpen como props
const Header = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean, setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // Función para alternar el estado del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white fixed w-full top-0 left-0 z-50 shadow-md h-16 flex items-center">
      <nav className="max-w-7xl mx-auto flex justify-between items-center w-full px-6">
        
        {/* Botón de hamburguesa (visible en móviles más pequeños) */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Menú de navegación */}
        <ul
          className={`sm:flex sm:space-x-6 sm:static absolute left-0 w-full bg-gray-900 sm:bg-transparent transition-all duration-300 ease-in-out sm:flex-row justify-center ${
            isMenuOpen ? "top-16" : "-top-96"
          } sm:top-0`}
        >
          {["Sobre mí", "Proyectos", "Contacto", "Experiencia"].map((item, index) => (
            <li key={index} className="text-center text-sm sm:text-base text-[var(--primary-color)]">
              <Link
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="relative group text-lg font-medium"
                onClick={() => setIsMenuOpen(false)} // Cerrar el menú cuando se hace clic
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
