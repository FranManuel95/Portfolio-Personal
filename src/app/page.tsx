"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";
import Experience from "../components/Experience";
import ProjectsShowcase from "../components/ProjectsShowCase";
import FabContact from "../components/FabContact";
import ContactForm from "../components/ContactForm";

/** Tipado seguro para CSS variables */
type CSSVarName = `--${string}`;
type StyleWithVars = React.CSSProperties & Record<CSSVarName, string>;
const delay = (ms: number): StyleWithVars => ({ ["--d"]: `${ms}ms` } as StyleWithVars);

/** Hook reveal por sección */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    const targets = root.querySelectorAll(".reveal");
    if (targets.length) targets.forEach((t) => io.observe(t));
    else io.observe(root);

    return () => io.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const heroRef = useReveal<HTMLElement>();
  const expRef = useReveal<HTMLElement>();
  const aboutRef = useReveal<HTMLElement>();
  const showcaseRef = useReveal<HTMLElement>();
  const contactRef = useReveal<HTMLElement>();

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) console.log("Elemento root encontrado");
  }, []);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      <section id="hero" className="pt-16" ref={heroRef}>
        <div className="reveal reveal-up" style={delay(0)}>
          <Hero isMenuOpen={isMenuOpen} />
        </div>
      </section>

      <section id="experiencia" className="py-9" ref={expRef}>
        <div className="container">
          <div className="reveal" style={delay(0)}>
            <Experience />
          </div>
        </div>
      </section>

      <section id="sobremí" className="py-9" ref={aboutRef}>
        <div className="container">
          <div className="reveal" style={delay(40)}>
            <About />
          </div>
        </div>
      </section>

      <section id="proyectos" className="py-9" ref={showcaseRef}>
        <div className="container">
          <div className="reveal" style={delay(0)}>
            <ProjectsShowcase />
          </div>
        </div>
      </section>

      {/* CONTACTO: Formulario + Footer */}
      <section id="contacto" className="py-9" ref={contactRef}>
        <div className="container">
          <div className="reveal" style={delay(0)}>
            <ContactForm />
          </div>

          <div className="reveal mt-10" style={delay(120)}>
            <Footer />
          </div>
        </div>
      </section>

      <FabContact />
    </>
  );
}
