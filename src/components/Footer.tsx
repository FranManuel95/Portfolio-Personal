// components/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-lg">© {new Date().getFullYear()} Mi Portfolio. Todos los derechos reservados.</p>
        <div className="mt-4">
          <a
            href="https://github.com/tu-perfil"
            target="_blank"
            className="text-indigo-500 hover:text-indigo-300 mx-3"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/tu-perfil"
            target="_blank"
            className="text-indigo-500 hover:text-indigo-300 mx-3"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  