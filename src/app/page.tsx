"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";
import Experience from "../components/Experience";
import ProjectsShowcase from "../components/ProjectsShowCase";
import FabContact from "../components/FabContact";
import ContactForm from "../components/ContactForm";
import Services from "../components/Services";


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      {/* Hero – section id managed inside Hero.tsx */}
      <Hero isMenuOpen={isMenuOpen} />

      {/* Servicios */}
      <section id="servicios" className="py-12">
        <Services />
      </section>

      {/* Experiencia */}
      <section id="experiencia" className="py-12">
        <Experience />
      </section>

      {/* Sobre mí */}
      <section id="sobremi" className="py-12">
        <About />
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="py-12">
        <div className="container">
          <ProjectsShowcase />
        </div>
      </section>

      {/* Contacto + Footer */}
      <section id="contacto" className="py-12">
        <div className="container">
          <ContactForm />
          <div className="mt-10">
            <Footer />
          </div>
        </div>
      </section>

      <FabContact />
    </>
  );
}
