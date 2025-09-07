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


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      {/* Héroe: sipara que aparezca inmediato */}
      <section id="hero" className="pt-16">
        <Hero isMenuOpen={isMenuOpen} />
      </section>

      {/* Experiencia */}
      <section id="experiencia" className="py-9">
        <div className="container">
        
            <Experience />
          
        </div>
      </section>

      {/* Sobre mí */}
      <section id="sobremí" className="py-9">
        <div className="container">
                    <About />
          
        </div>
      </section>

      {/* Proyectos */}
      <section id="proyectos" className="py-9">
        <div className="container">
        
            <ProjectsShowcase />
          
        </div>
      </section>

      {/* Contacto + Footer */}
      <section id="contacto" className="py-9">
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
