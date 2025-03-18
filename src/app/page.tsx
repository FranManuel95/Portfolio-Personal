'use client';

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Footer from "../components/Footer";
import Experience from "../components/Experience";

const Home = () => {
  // Estado para controlar si el menú está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Este código solo se ejecutará en el cliente
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // Realiza lo que necesites con el DOM, pero solo en el cliente
      console.log("Elemento root encontrado");
    }
  }, []);

  return (
    <>
      {/* Pasamos isMenuOpen y setIsMenuOpen a Header */}
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
      
      {/* Pasamos isMenuOpen a Hero */}
      <Hero isMenuOpen={isMenuOpen} />
      <Experience />
      <About />
      <Projects />
      <Footer />
    </>
  );
};

export default Home;
