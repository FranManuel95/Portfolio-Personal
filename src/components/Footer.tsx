// components/Footer.tsx
"use client";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container text-center">
        <p className="text-lg">
          © {new Date().getFullYear()} Francisco Manuel Perejón Carmona. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
