"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Footer from "../components/Footer";
import Experience from "../components/Experience";
import ProjectsShowcase from "../components/ProjectsShowCase";
import FabContact from "../components/FabContact";
import ContactForm from "../components/ContactForm";
import Services from "../components/Services";

/* Reusable scroll-reveal title — words split, stagger in */
function RevealTitle({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.h2
      ref={ref}
      className="section-title"
      initial={{ opacity: 0, y: 48, skewY: 3 }}
      animate={inView ? { opacity: 1, y: 0, skewY: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.h2>
  );
}

/* Section line that grows left→right on entry */
function SectionLine() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="w-full h-px bg-[var(--line)]"
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* Side number that fades in */
function SectionNum({ n }: { n: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.span
      ref={ref}
      className="text-6xl lg:text-8xl font-black leading-none self-start mt-1"
      style={{ color: "rgba(245,245,245,0.07)", letterSpacing: "-0.04em" }}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    >
      {n}
    </motion.span>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />

      <Hero isMenuOpen={isMenuOpen} />

      {/* ── 01 QUÉ HAGO ──────────────────────────────────────── */}
      <section id="servicios" className="relative">
        <SectionLine />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <RevealTitle>
              <span className="outline-word">Qué</span>
              <br />
              <span className="accent-word">hago</span>
            </RevealTitle>
            <SectionNum n="01" />
          </div>
          <Services />
        </div>
      </section>

      {/* ── 02 TRAYECTORIA ───────────────────────────────────── */}
      <section id="experiencia" className="relative">
        <SectionLine />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <RevealTitle>
              <span className="outline-word">Mi</span>
              <br />
              <span className="accent-word">trayectoria</span>
            </RevealTitle>
            <SectionNum n="02" />
          </div>
          <Experience />
        </div>
      </section>

      {/* ── 03 SOBRE MÍ ──────────────────────────────────────── */}
      <section id="sobremi" className="relative">
        <SectionLine />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <RevealTitle>
              <span className="outline-word">Sobre</span>
              <br />
              <span className="accent-word">mí</span>
            </RevealTitle>
            <SectionNum n="03" />
          </div>
          <About />
        </div>
      </section>

      {/* ── 04 PROYECTOS ─────────────────────────────────────── */}
      <section id="proyectos" className="relative">
        <SectionLine />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <RevealTitle>
              <span className="outline-word">Mis</span>
              <br />
              <span className="accent-word">proyectos</span>
            </RevealTitle>
            <SectionNum n="04" />
          </div>
          <ProjectsShowcase />
        </div>
      </section>

      {/* ── 05 CONTACTO ──────────────────────────────────────── */}
      <section id="contacto" className="relative">
        <SectionLine />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <RevealTitle>
              <span className="outline-word">Hablemos</span>
              <br />
              <span className="accent-word">hoy</span>
            </RevealTitle>
            <SectionNum n="05" />
          </div>
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
