"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = { label: string; id: string };

const NAV: NavItem[] = [
  { label: "Contacto", id: "contacto" },
  { label: "Experiencia", id: "experiencia" },
  { label: "Sobre mí", id: "sobremí" }, // coincide con tu sección
  { label: "Proyectos", id: "proyectos" },
];

type Props = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ isMenuOpen, setIsMenuOpen }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [elevated, setElevated] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Diccionario de refs para anchors (sin Map, sin return en el callback)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const setLinkRef = (id: string) => (el: HTMLAnchorElement | null) => {
    linkRefs.current[id] = el; // no devolvemos nada => Ref callback válido
  };

  const navListRef = useRef<HTMLUListElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // Progreso de scroll + sombra del header
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled =
        (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
      setScrollProgress(scrolled);
      setElevated(h.scrollTop > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea scroll en móvil cuando el menú está abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = isMenuOpen ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isMenuOpen]);

  // Scroll-Spy con IntersectionObserver
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mueve el indicador bajo el link activo (desktop)
  useEffect(() => {
    const indicator = indicatorRef.current;
    const list = navListRef.current;
    if (!indicator || !list || !activeId) {
      if (indicator) indicator.style.opacity = "0";
      return;
    }
    const link = linkRefs.current[activeId];
    if (!link) {
      indicator.style.opacity = "0";
      return;
    }
    const listRect = list.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const left = linkRect.left - listRect.left;
    const width = linkRect.width;

    indicator.style.opacity = "1";
    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
  }, [activeId]);

  // Recalcular en resize
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      // fuerza recálculo reposicionando el indicador
      setActiveId((prev) => (prev ? prev : ""));
    });
    if (navListRef.current) ro.observe(navListRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] h-16 text-white transition-shadow ${
        elevated ? "shadow-[0_12px_40px_-24px_rgba(0,0,0,0.6)]" : ""
      }`}
      role="banner"
    >
      {/* Fondo ultradark vidrio */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xl border-b border-white/10" />
      {/* Barra de progreso superior */}
      <div
        className="absolute top-0 left-0 h-[3px] bg-[var(--accent)]/95 shadow-[0_0_18px_rgba(124,134,255,0.8)]"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <nav
        className="relative container h-full flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Branding */}
        <Link
          href="#hero"
          className="relative font-semibold tracking-tight text-lg hover:opacity-90 transition"
        >
          Fran<span className="text-[var(--accent)]">Daw</span>
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-lg opacity-0 hover:opacity-100 transition"
            style={{
              background:
                "radial-gradient(200px 60px at 50% 100%, rgba(124,134,255,0.18), rgba(0,0,0,0))",
              filter: "blur(8px)",
            }}
          />
        </Link>

        {/* Desktop nav */}
        <div className="relative hidden sm:block">
          <ul
            ref={navListRef}
            className="flex items-center gap-6 relative"
          >
            {/* Indicador deslizante */}
            <span
              ref={indicatorRef}
              aria-hidden
              className="pointer-events-none absolute -bottom-1 h-0.5 w-0 bg-[var(--accent)] rounded-full transition-all duration-300"
              style={{
                left: 0,
                transform: "translateX(0)",
                opacity: 0,
                boxShadow: "0 0 10px rgba(124,134,255,.8)",
              }}
            />
            {NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={`#${item.id}`}
                    ref={setLinkRef(item.id)} // ✅ callback que devuelve void
                    className={`relative font-medium text-sm transition-colors ${
                      isActive ? "text-[var(--accent)]" : "text-white"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-3 rounded-lg opacity-0 hover:opacity-100 transition"
                      style={{
                        background: 
                          "radial-gradient(120px 40px at 50% 120%, rgba(124,134,255,0.18), rgba(0,0,0,0))",
                        filter: "blur(10px)",
                      }}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 transition"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>

        {/* Menú móvil */}
        <div
          className={`sm:hidden absolute left-3 right-3 origin-top ${
            isMenuOpen
              ? "top-20 scale-100 opacity-100"
              : "top-10 scale-95 opacity-0 pointer-events-none"
          } transition-all duration-300 ease-out`}
        >
          <ul
            id="main-menu"
            className="rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-2xl p-3 flex flex-col items-stretch gap-2 shadow-2xl"
          >
            {NAV.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
