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

      <Hero isMenuOpen={isMenuOpen} />

      {/* ── 01 QUÉ HAGO ──────────────────────────────────────── */}
      <section id="servicios" className="relative">
        <div className="w-full h-px bg-[var(--line)]" />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <h2 className="section-title">
              <span className="outline-word">Qué</span>
              <br />
              <span className="accent-word">hago</span>
            </h2>
            <span
              className="text-6xl lg:text-8xl font-black leading-none self-start mt-1"
              style={{ color: "var(--bg-elev-3)", letterSpacing: "-0.04em" }}
            >
              01
            </span>
          </div>
          <Services />
        </div>
      </section>

      {/* ── 02 TRAYECTORIA ───────────────────────────────────── */}
      <section id="experiencia" className="relative">
        <div className="w-full h-px bg-[var(--line)]" />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <h2 className="section-title">
              <span className="outline-word">Mi</span>
              <br />
              <span className="accent-word">trayectoria</span>
            </h2>
            <span
              className="text-6xl lg:text-8xl font-black leading-none self-start mt-1"
              style={{ color: "var(--bg-elev-3)", letterSpacing: "-0.04em" }}
            >
              02
            </span>
          </div>
          <Experience />
        </div>
      </section>

      {/* ── 03 SOBRE MÍ ──────────────────────────────────────── */}
      <section id="sobremi" className="relative">
        <div className="w-full h-px bg-[var(--line)]" />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <h2 className="section-title">
              <span className="outline-word">Sobre</span>
              <br />
              <span className="accent-word">mí</span>
            </h2>
            <span
              className="text-6xl lg:text-8xl font-black leading-none self-start mt-1"
              style={{ color: "var(--bg-elev-3)", letterSpacing: "-0.04em" }}
            >
              03
            </span>
          </div>
          <About />
        </div>
      </section>

      {/* ── 04 PROYECTOS ─────────────────────────────────────── */}
      <section id="proyectos" className="relative">
        <div className="w-full h-px bg-[var(--line)]" />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <h2 className="section-title">
              <span className="outline-word">Mis</span>
              <br />
              <span className="accent-word">proyectos</span>
            </h2>
            <span
              className="text-6xl lg:text-8xl font-black leading-none self-start mt-1"
              style={{ color: "var(--bg-elev-3)", letterSpacing: "-0.04em" }}
            >
              04
            </span>
          </div>
          <ProjectsShowcase />
        </div>
      </section>

      {/* ── 05 CONTACTO ──────────────────────────────────────── */}
      <section id="contacto" className="relative">
        <div className="w-full h-px bg-[var(--line)]" />
        <div className="container py-16 lg:py-24">
          <div className="flex items-end justify-between mb-14">
            <h2 className="section-title">
              <span className="outline-word">Hablemos</span>
              <br />
              <span className="accent-word">hoy</span>
            </h2>
            <span
              className="text-6xl lg:text-8xl font-black leading-none self-start mt-1"
              style={{ color: "var(--bg-elev-3)", letterSpacing: "-0.04em" }}
            >
              05
            </span>
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
