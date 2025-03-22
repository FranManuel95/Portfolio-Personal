// components/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-5 text-center px-12">
        <p className="text-lg">© {new Date().getFullYear()} Francisco Manuel Perejón Carmona. Todos los derechos reservados.</p>
        
        {/* Créditos y Licencias */}
        <div className="text-sm">
          <p>
            Este proyecto utiliza las siguientes librerías y recursos:
          </p>
          <ul className="list-disc list-inside">
            <li><a href="https://fonts.google.com/" className="text-indigo-400" target="_blank" rel="noopener noreferrer">Google Fonts</a> (Licencia libre de uso)</li>
            <li><a href="https://react-icons.github.io/react-icons/" className="text-indigo-400" target="_blank" rel="noopener noreferrer">React Icons</a> (MIT License)</li>
          </ul>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  