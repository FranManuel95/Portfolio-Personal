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

      {/* Héroe */}
      <Hero isMenuOpen={isMenuOpen} />

      {/* Servicios */}
      <section id="servicios" className="py-16 relative overflow-hidden">
        <span className="absolute -top-4 right-4 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none leading-none">01</span>
        <div className="container">
          <h2 className="section-title mb-12">
            <span className="outline-word">Qué</span><br />
            <span className="accent-word">hago</span>
          </h2>
          <Services />
        </div>
      </section>

      {/* Experiencia */}
      <section id="experiencia" className="py-16 relative overflow-hidden">
        <span className="absolute -top-4 right-4 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none leading-none">02</span>
        <div className="container">
          <h2 className="section-title mb-12">
            <span className="outline-word">Mi</span><br />
            <span className="accent-word">trayectoria</span>
          </h2>
          <Experience />
        </div>
      </section>

      {/* Sobre mí */}
      <section id="sobremi" className="py-16 relative overflow-hidden">
        <span className="absolute -top-4 right-4 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none leading-none">03</span>
        <div className="container">
          <h2 className="section-title mb-12">
            <span className="outline-word">Sobre</span><br />
            <span className="accent-word">mí</span>
          </h2>
          <About />
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="py-16 relative overflow-hidden">
        <span className="absolute -top-4 right-4 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none leading-none">04</span>
        <div className="container">
          <h2 className="section-title mb-12">
            <span className="outline-word">Mis</span><br />
            <span className="accent-word">proyectos</span>
          </h2>
          <ProjectsShowcase />
        </div>
      </section>

      {/* Contacto + Footer */}
      <section id="contacto" className="py-16 relative overflow-hidden">
        <span className="absolute -top-4 right-4 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none leading-none">05</span>
        <div className="container">
          <h2 className="section-title mb-12">
            <span className="outline-word">Hablemos</span><br />
            <span className="accent-word">hoy</span>
          </h2>
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
