"use client";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const LINKS = [
  {
    href: "https://www.linkedin.com/in/francisco-manuel-perej%C3%B3n-carmona-7bbb1214a/",
    icon: <FaLinkedin className="w-5 h-5" />,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/FranManuel95",
    icon: <FaGithub className="w-5 h-5" />,
    label: "GitHub",
  },
  {
    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_TO ?? ""}`,
    icon: <MdEmail className="w-5 h-5" />,
    label: "Email",
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-[var(--line)] mt-6">
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elev-1)]/60 to-transparent pointer-events-none" />
      <div className="container relative py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Marca */}
        <div className="text-center sm:text-left">
          <p className="font-semibold text-[var(--text)]">
            Fran<span className="text-[var(--accent)]">.dev</span>
          </p>
          <p className="text-xs text-[var(--text-dim)] mt-0.5">
            © {new Date().getFullYear()} Francisco Manuel Perejón Carmona
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xs text-[var(--text-dim)] text-center hidden sm:block">
          Desarrollador Web & Especialista en IA Aplicada · Sevilla, España
        </p>

        {/* Redes */}
        <div className="flex items-center gap-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.label}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--bg-elev-2)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all duration-200"
            >
              {l.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
