import Link from "next/link";

const Header = ({ isMenuOpen, setIsMenuOpen }: { isMenuOpen: boolean, setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-900 text-white fixed w-full top-0 left-0 z-50 shadow-md h-16 flex items-center">
      <nav className="relative max-w-7xl mx-auto flex justify-between items-center w-full px-6">
        {/* Botón hamburguesa */}
        <button
          className="sm:hidden text-white focus:outline-none relative z-[70]"  // <-- por encima del menú
          onClick={toggleMenu}
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Menú de navegación */}
        <ul
          id="main-menu"
          className={`sm:flex sm:space-x-6 sm:static absolute left-0 w-full bg-gray-900 sm:bg-transparent transition-all duration-300 ease-in-out
                      sm:flex-row flex flex-col items-center justify-center z-[60]
                      ${isMenuOpen ? "top-0" : "-top-96"} sm:top-0`}
        >
          {["Contacto", "Experiencia", "Sobre mí", "Proyectos"].map((item, index) => (
            <li
              key={index}
              className="
                py-1 text-center text-sm sm:text-base text-[var(--primary-color)]
                flex justify-center "
            >
              <Link
                href={`#${item.toLowerCase().replace(" ", "")}`}
                className="relative group text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
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
