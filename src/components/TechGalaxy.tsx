"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useSpring,
  MotionValue,
} from "framer-motion";
import {
  FaReact, FaHtml5, FaSass, FaNodeJs, FaDocker, FaLinux, FaPython, FaPhp,
  FaGitAlt, FaStripe,
} from "react-icons/fa";
import {
  SiOpenai, SiNextdotjs, SiTypescript, SiTailwindcss, SiVite, SiExpress,
  SiSymfony, SiDjango, SiSupabase, SiMysql, SiPostgresql, SiVercel,
  SiNetlify, SiCloudflare, SiAirtable, SiTrello,
} from "react-icons/si";
import { BrainCircuit, Search, Calendar, MessageCircle, Sparkles, Server, Wand2, ShieldCheck } from "lucide-react";

type CategoryName =
  | "IA & Agentes"
  | "Automatización"
  | "Frontend"
  | "Backend & BD"
  | "Infra & DevOps";

type Category = {
  name: CategoryName;
  color: string;       // brand/accent color (glow & ring)
  surface: string;     // surface tone for planet (more realistic)
  highlight: string;   // light side
  shadow: string;      // dark side
  radiusFactor: number;
  direction: 1 | -1;
  duration: number;
  techs: string[];
};

const CATEGORIES: Category[] = [
  {
    name: "IA & Agentes",
    color: "#00ff87",
    surface: "#1eb874",
    highlight: "#e8fff4",
    shadow: "#022d1c",
    radiusFactor: 0.135,
    direction: 1,
    duration: 70,
    techs: ["Claude", "OpenAI", "Gemini", "DeepSeek", "MCP", "Skills", "OpenClaw", "RAG", "Pinecone", "File Search"],
  },
  {
    name: "Automatización",
    color: "#fb923c",
    surface: "#c2410c",
    highlight: "#fff1de",
    shadow: "#2d0a00",
    radiusFactor: 0.22,
    direction: -1,
    duration: 95,
    techs: ["n8n", "Airtable", "Trello", "Calendly", "UltraMsg", "API"],
  },
  {
    name: "Frontend",
    color: "#60a5fa",
    surface: "#3b82f6",
    highlight: "#ddeeff",
    shadow: "#061a3d",
    radiusFactor: 0.305,
    direction: 1,
    duration: 130,
    techs: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS", "SCSS", "Vite"],
  },
  {
    name: "Backend & BD",
    color: "#a78bfa",
    surface: "#7c3aed",
    highlight: "#eddfff",
    shadow: "#1c0d3d",
    radiusFactor: 0.39,
    direction: -1,
    duration: 165,
    techs: ["Node.js", "Express", "Python", "PHP", "Symfony", "Django", "Supabase", "MySQL", "Postgres"],
  },
  {
    name: "Infra & DevOps",
    color: "#fbbf24",
    surface: "#b45309",
    highlight: "#fff3c0",
    shadow: "#2a1500",
    radiusFactor: 0.475,
    direction: 1,
    duration: 200,
    techs: ["Linux", "Docker", "Vercel", "Netlify", "Cloudflare", "Azure", "Stripe", "Teachable", "Git"],
  },
];

const TILT_DEG = 38;
const RINGED_TECHS = new Set(["Pinecone", "Postgres", "Docker", "n8n"]);

const TECH_ICONS: Record<string, React.ReactNode> = {
  Claude:      <Sparkles strokeWidth={2.2} />,
  OpenAI:      <SiOpenai />,
  Gemini:      <Wand2 strokeWidth={2.2} />,
  DeepSeek:    <BrainCircuit strokeWidth={2.2} />,
  MCP:         <Server strokeWidth={2.2} />,
  Skills:      <ShieldCheck strokeWidth={2.2} />,
  OpenClaw:    <span style={{ fontSize: "0.7em", fontWeight: 800 }}>OC</span>,
  RAG:         <BrainCircuit strokeWidth={2.2} />,
  Pinecone:    <span style={{ fontSize: "0.7em", fontWeight: 800 }}>PC</span>,
  "File Search": <Search strokeWidth={2.2} />,
  n8n:         <span style={{ fontSize: "0.6em", fontWeight: 800 }}>n8n</span>,
  Airtable:    <SiAirtable />,
  Trello:      <SiTrello />,
  Calendly:    <Calendar strokeWidth={2.2} />,
  UltraMsg:    <MessageCircle strokeWidth={2.2} />,
  API:         <span style={{ fontSize: "0.6em", fontWeight: 800 }}>API</span>,
  "Next.js":   <SiNextdotjs />,
  React:       <FaReact />,
  TypeScript:  <SiTypescript />,
  Tailwind:    <SiTailwindcss />,
  "HTML/CSS":  <FaHtml5 />,
  SCSS:        <FaSass />,
  Vite:        <SiVite />,
  "Node.js":   <FaNodeJs />,
  Express:     <SiExpress />,
  Python:      <FaPython />,
  PHP:         <FaPhp />,
  Symfony:     <SiSymfony />,
  Django:      <SiDjango />,
  Supabase:    <SiSupabase />,
  MySQL:       <SiMysql />,
  Postgres:    <SiPostgresql />,
  Linux:       <FaLinux />,
  Docker:      <FaDocker />,
  Vercel:      <SiVercel />,
  Netlify:     <SiNetlify />,
  Cloudflare:  <SiCloudflare />,
  Azure:       <span style={{ fontSize: "0.7em", fontWeight: 800 }}>Az</span>,
  Stripe:      <FaStripe />,
  Teachable:   <span style={{ fontSize: "0.7em", fontWeight: 800 }}>Tc</span>,
  Git:         <FaGitAlt />,
};

type SelectedState = { category: Category; tech: string } | null;

// ─── BACKGROUND ─────────────────────────────────────────────────────────────

function StarLayer({
  count, sizeRange, opacityRange, depth, mx, my,
}: {
  count: number;
  sizeRange: [number, number];
  opacityRange: [number, number];
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; baseOp: number; delay: number; dur: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        baseOp: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
        delay: Math.random() * 5,
        dur: 2 + Math.random() * 4,
      }))
    );
  }, [count, sizeRange, opacityRange]);

  const tx = useTransform(mx, (v) => v * depth);
  const ty = useTransform(my, (v) => v * depth);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x: tx, y: ty }}
    >
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.baseOp,
            boxShadow: s.size > 1.5 ? `0 0 ${s.size * 2}px rgba(255,255,255,0.5)` : undefined,
          }}
          animate={{ opacity: [s.baseOp * 0.4, s.baseOp, s.baseOp * 0.4] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

function Comets() {
  const [comets, setComets] = useState<
    { id: number; from: { x: number; y: number }; to: { x: number; y: number }; thickness: number }[]
  >([]);

  useEffect(() => {
    let id = 0;
    const spawn = () => {
      const fromSide = Math.floor(Math.random() * 4);
      const startEdge = (e: number) => {
        if (e === 0) return { x: Math.random() * 100, y: -5 };
        if (e === 1) return { x: 105, y: Math.random() * 100 };
        if (e === 2) return { x: Math.random() * 100, y: 105 };
        return { x: -5, y: Math.random() * 100 };
      };
      const from = startEdge(fromSide);
      const to = { x: 100 - from.x + (Math.random() - 0.5) * 40, y: 100 - from.y + (Math.random() - 0.5) * 40 };
      const newId = ++id;
      const thickness = 1.5 + Math.random() * 1.5;
      setComets((c) => [...c, { id: newId, from, to, thickness }]);
      setTimeout(() => setComets((c) => c.filter((x) => x.id !== newId)), 2500);
    };
    const tick = () => spawn();
    const interval = setInterval(tick, 3500 + Math.random() * 3500);
    setTimeout(spawn, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {comets.map((c) => {
          const angle = Math.atan2(c.to.y - c.from.y, c.to.x - c.from.x) * 180 / Math.PI;
          return (
            <motion.div
              key={c.id}
              className="absolute"
              initial={{ left: `${c.from.x}%`, top: `${c.from.y}%`, opacity: 0 }}
              animate={{ left: `${c.to.x}%`, top: `${c.to.y}%`, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.2, ease: "easeOut", times: [0, 0.15, 0.85, 1] }}
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                style={{
                  width: 160,
                  height: c.thickness,
                  background: "linear-gradient(90deg, transparent, rgba(255,235,200,0.95))",
                  boxShadow: "0 0 14px rgba(255,200,150,0.9), 0 0 28px rgba(255,150,80,0.6)",
                  borderRadius: 2,
                  transform: "translateX(-100%)",
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function Nebulae() {
  // Warm, dramatic nebula clouds inspired by deep-space photography
  const blobs = [
    { x: 8, y: 18, color: "rgba(255,80,40,0.18)", size: "55%" },
    { x: 70, y: 12, color: "rgba(120,40,180,0.16)", size: "45%" },
    { x: 78, y: 75, color: "rgba(255,140,60,0.14)", size: "50%" },
    { x: 18, y: 78, color: "rgba(60,200,180,0.10)", size: "40%" },
    { x: 50, y: 50, color: "rgba(180,40,80,0.10)", size: "70%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 60%)`,
            filter: "blur(50px)",
          }}
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 14 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}

// ─── SUN (plasma, animated) ─────────────────────────────────────────────────

function Sun({ size, onClick }: { size: number; onClick: () => void }) {
  const total = size * 3.6;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
      style={{ width: total, height: total, zIndex: 25 }}
      aria-label="Reanudar órbitas"
    >
      {/* Outer halo (volumetric glow) */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          width: total,
          height: total,
          marginLeft: -total / 2,
          marginTop: -total / 2,
          background:
            "radial-gradient(circle, rgba(255,140,40,0.22) 0%, rgba(255,80,30,0.12) 25%, rgba(200,40,20,0.06) 45%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Pulsing inner corona */}
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 2,
          height: size * 2,
          marginLeft: -size,
          marginTop: -size,
          background:
            "radial-gradient(circle, rgba(255,180,80,0.55) 0%, rgba(255,100,40,0.2) 45%, transparent 75%)",
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.85, 0.55, 0.85] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating ray spokes */}
      <motion.svg
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: size * 2.6,
          height: size * 2.6,
          marginLeft: -size * 1.3,
          marginTop: -size * 1.3,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * 360;
          const len = i % 2 === 0 ? 18 : 10;
          const x1 = 50 + Math.cos(a * Math.PI / 180) * 32;
          const y1 = 50 + Math.sin(a * Math.PI / 180) * 32;
          const x2 = 50 + Math.cos(a * Math.PI / 180) * (32 + len);
          const y2 = 50 + Math.sin(a * Math.PI / 180) * (32 + len);
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={i % 2 === 0 ? "rgba(255,180,80,0.55)" : "rgba(255,100,40,0.35)"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </motion.svg>

      {/* The sun body with animated plasma surface (SVG turbulence) */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background:
            "radial-gradient(circle at 35% 32%, #fff7d1 0%, #ffd070 15%, #ff8a2b 40%, #d94e1f 70%, #6f1a0a 100%)",
          boxShadow:
            "0 0 50px rgba(255,140,40,0.95), 0 0 100px rgba(255,80,30,0.7), inset -10px -10px 24px rgba(120,20,0,0.65), inset 6px 6px 16px rgba(255,210,140,0.3)",
          cursor: "pointer",
        }}
      >
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: 0.55 }}>
          <defs>
            <filter id="plasma-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="3">
                <animate attributeName="baseFrequency" dur="22s" values="0.018;0.03;0.018" repeatCount="indefinite" />
              </feTurbulence>
              <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0.05  0 0 0 0.95 0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#plasma-noise)" />
        </svg>
        {/* Specular */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "10%",
            left: "18%",
            width: "30%",
            height: "22%",
            background: "radial-gradient(ellipse, rgba(255,250,220,0.65) 0%, transparent 70%)",
            filter: "blur(3px)",
          }}
        />
        <span
          className="relative font-black uppercase tracking-tighter"
          style={{
            color: "rgba(255,250,220,0.95)",
            fontSize: size * 0.2,
            textShadow: "0 1px 4px rgba(120,20,0,0.9), 0 0 12px rgba(255,180,80,0.6)",
            zIndex: 2,
          }}
        >
          STACK
        </span>
      </div>
    </button>
  );
}

// ─── PLANET ──────────────────────────────────────────────────────────────────

function planetSurface(c: Category) {
  // Per-category visual identity: each gets a distinct surface style
  switch (c.name) {
    case "IA & Agentes":
      // Plasma/ionized — glowing brand color with depth
      return {
        background: `radial-gradient(circle at 32% 28%, ${c.highlight} 0%, ${c.color} 30%, ${c.surface} 65%, ${c.shadow} 100%)`,
        ringColor: c.color,
        extra: null,
      };
    case "Automatización":
      // Lava — hot, cracked
      return {
        background: `
          radial-gradient(circle at 65% 70%, rgba(255,255,180,0.3) 0%, transparent 25%),
          radial-gradient(circle at 32% 28%, ${c.highlight} 0%, ${c.color} 25%, ${c.surface} 60%, ${c.shadow} 100%)
        `,
        ringColor: c.color,
        extra: null,
      };
    case "Frontend":
      // Earth-like — blue with cloud swirls
      return {
        background: `
          radial-gradient(ellipse 70% 30% at 60% 40%, rgba(255,255,255,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 40% 25% at 25% 65%, rgba(255,255,255,0.15) 0%, transparent 70%),
          radial-gradient(circle at 32% 28%, ${c.highlight} 0%, ${c.color} 35%, ${c.surface} 70%, ${c.shadow} 100%)
        `,
        ringColor: c.color,
        extra: null,
      };
    case "Backend & BD":
      // Gas giant — horizontal bands
      return {
        background: `
          repeating-linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.15) 8%, transparent 16%, rgba(255,255,255,0.06) 22%, transparent 30%),
          radial-gradient(circle at 32% 28%, ${c.highlight} 0%, ${c.color} 35%, ${c.surface} 70%, ${c.shadow} 100%)
        `,
        ringColor: c.color,
        extra: null,
      };
    case "Infra & DevOps":
      // Rocky — matte with subtle craters
      return {
        background: `
          radial-gradient(circle at 70% 35%, rgba(0,0,0,0.18) 0%, transparent 8%),
          radial-gradient(circle at 30% 65%, rgba(0,0,0,0.15) 0%, transparent 7%),
          radial-gradient(circle at 60% 75%, rgba(0,0,0,0.18) 0%, transparent 6%),
          radial-gradient(circle at 32% 28%, ${c.highlight} 0%, ${c.color} 35%, ${c.surface} 75%, ${c.shadow} 100%)
        `,
        ringColor: c.color,
        extra: null,
      };
  }
}

function Planet({
  tech,
  category,
  orbitAngle,
  offsetAngle,
  radius,
  size,
  isSelected,
  onClick,
  onHover,
}: {
  tech: string;
  category: Category;
  orbitAngle: MotionValue<number>;
  offsetAngle: number;
  radius: number;
  size: number;
  isSelected: boolean;
  onClick: () => void;
  onHover: (h: boolean) => void;
}) {
  const x = useTransform(
    orbitAngle,
    (a) => Math.cos(((a + offsetAngle) * Math.PI) / 180) * radius
  );
  const y = useTransform(
    orbitAngle,
    (a) => Math.sin(((a + offsetAngle) * Math.PI) / 180) * radius
  );

  // Foreground planets bigger & brighter, background ones smaller & dimmer
  const depthOpacity = useTransform(y, (v) => 0.55 + (v + radius) / (radius * 2) * 0.45);
  const depthScale = useTransform(y, (v) => 0.72 + (v + radius) / (radius * 2) * 0.45);

  const surface = planetSurface(category);
  const icon = TECH_ICONS[tech];
  const iconSize = size * 0.4;
  const hasRing = RINGED_TECHS.has(tech);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="absolute top-1/2 left-1/2 focus-visible:outline-none"
      style={{
        x,
        y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        transform: `rotateX(-${TILT_DEG}deg)`,
        transformStyle: "preserve-3d",
        zIndex: isSelected ? 50 : 10,
        cursor: "pointer",
        opacity: depthOpacity,
        scale: depthScale,
      }}
      whileHover={{ scale: 1.4 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      aria-label={tech}
    >
      {/* Ring (Saturn-like) */}
      {hasRing && (
        <div
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            width: size * 1.9,
            height: size * 0.4,
            marginLeft: -size * 0.95,
            marginTop: -size * 0.2,
            background: `linear-gradient(180deg, transparent 0%, ${surface.ringColor}55 30%, ${surface.ringColor}cc 50%, ${surface.ringColor}55 70%, transparent 100%)`,
            borderRadius: "50%",
            transform: "rotateZ(-20deg)",
            boxShadow: `0 0 8px ${surface.ringColor}40`,
            zIndex: -1,
          }}
        />
      )}

      <div
        className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
        style={{
          background: surface.background,
          boxShadow: isSelected
            ? `inset -${size * 0.22}px -${size * 0.22}px ${size * 0.3}px rgba(0,0,0,0.7), 0 0 ${size * 0.8}px ${surface.ringColor}, 0 0 ${size * 1.8}px ${surface.ringColor}80`
            : `inset -${size * 0.22}px -${size * 0.22}px ${size * 0.3}px rgba(0,0,0,0.7), 0 0 ${size * 0.35}px ${surface.ringColor}88`,
          border: `1px solid ${surface.ringColor}88`,
          color: "rgba(0,0,0,0.7)",
          fontSize: iconSize,
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `${size * 0.1}px`,
            left: `${size * 0.16}px`,
            width: size * 0.28,
            height: size * 0.2,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        {/* Icon — slightly recessed, becomes vivid when selected */}
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isSelected ? "#ffffff" : "rgba(255,255,255,0.85)",
            opacity: isSelected ? 1 : 0.78,
            filter: isSelected
              ? `drop-shadow(0 0 6px ${surface.ringColor}) drop-shadow(0 1px 1px rgba(0,0,0,0.6))`
              : "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
            transition: "color 0.3s, opacity 0.3s, filter 0.3s",
            zIndex: 2,
          }}
        >
          {icon}
        </div>
      </div>
    </motion.button>
  );
}

// ─── ORBIT ──────────────────────────────────────────────────────────────────

function Orbit({
  category,
  containerSize,
  paused,
  selected,
  setSelected,
  planetSize,
  onPlanetHover,
}: {
  category: Category;
  containerSize: number;
  paused: boolean;
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  planetSize: number;
  onPlanetHover: (cat: string | null) => void;
}) {
  const angle = useMotionValue(0);
  const angleRef = useRef(0);
  const lastT = useRef<number | null>(null);

  useAnimationFrame((t) => {
    if (paused) {
      lastT.current = null;
      return;
    }
    if (lastT.current === null) {
      lastT.current = t;
      return;
    }
    const dt = t - lastT.current;
    lastT.current = t;
    angleRef.current += dt * (360 / category.duration / 1000) * category.direction;
    angle.set(angleRef.current);
  });

  const radius = containerSize * category.radiusFactor;
  const isCategorySelected = selected?.category.name === category.name;

  return (
    <>
      {category.techs.map((tech, i) => (
        <Planet
          key={tech}
          tech={tech}
          category={category}
          orbitAngle={angle}
          offsetAngle={(i / category.techs.length) * 360}
          radius={radius}
          size={planetSize}
          isSelected={isCategorySelected && selected?.tech === tech}
          onClick={() => setSelected({ category, tech })}
          onHover={(h) => onPlanetHover(h ? category.name : null)}
        />
      ))}
    </>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function TechGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(600);
  const [selected, setSelected] = useState<SelectedState>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 20 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const paused = selected !== null;
  const planetSize = Math.max(34, containerSize * 0.072);
  const sunSize = Math.max(80, containerSize * 0.13);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-[780px] mx-auto"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          mxRaw.set(((e.clientX - rect.left) / rect.width - 0.5) * 30);
          myRaw.set(((e.clientY - rect.top) / rect.height - 0.5) * 30);
        }}
        onMouseLeave={() => {
          mxRaw.set(0);
          myRaw.set(0);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {/* Deep-space background */}
        <Nebulae />
        <StarLayer count={50} sizeRange={[0.4, 1.0]} opacityRange={[0.2, 0.5]} depth={0.4} mx={mx} my={my} />
        <StarLayer count={32} sizeRange={[0.8, 1.6]} opacityRange={[0.35, 0.75]} depth={1.0} mx={mx} my={my} />
        <StarLayer count={14} sizeRange={[1.4, 2.4]} opacityRange={[0.55, 0.95]} depth={1.8} mx={mx} my={my} />
        <Comets />

        {/* 3D-tilted orbital plane */}
        <div
          className="absolute inset-0"
          style={{
            perspective: 1500,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `rotateX(${TILT_DEG}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Orbit rings — naturally render as ellipses due to 3D rotation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {CATEGORIES.map((c) => {
                const r = containerSize * c.radiusFactor;
                const active =
                  selected?.category.name === c.name || hoveredCategory === c.name;
                return (
                  <circle
                    key={c.name}
                    cx="50%"
                    cy="50%"
                    r={r}
                    fill="none"
                    stroke={active ? c.color : "rgba(255,255,255,0.22)"}
                    strokeWidth={active ? 1.5 : 1}
                    opacity={active ? 0.7 : 0.4}
                    strokeDasharray={active ? "0" : "1 6"}
                    style={{ transition: "stroke 0.4s, opacity 0.4s, stroke-dasharray 0.4s, stroke-width 0.4s" }}
                  />
                );
              })}
            </svg>

            {CATEGORIES.map((c) => (
              <Orbit
                key={c.name}
                category={c}
                containerSize={containerSize}
                paused={paused}
                selected={selected}
                setSelected={setSelected}
                planetSize={planetSize}
                onPlanetHover={setHoveredCategory}
              />
            ))}
          </div>
        </div>

        {/* Sun (faces camera, outside tilted plane) */}
        <Sun size={sunSize} onClick={() => setSelected(null)} />
      </div>

      {/* Info panel + legend */}
      <div className="mt-8 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={`${selected.category.name}-${selected.tech}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2"
                style={{ color: selected.category.color }}
              >
                {selected.category.name}
              </p>
              <h4
                className="font-black uppercase tracking-tight"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                }}
              >
                {selected.tech}
              </h4>
              <button
                onClick={() => setSelected(null)}
                className="mt-4 text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
              >
                × Cerrar · Reanudar órbitas
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)]"
            >
              ◆ Pulsa un planeta para explorar mi stack
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onMouseEnter={() => setHoveredCategory(c.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-opacity"
              style={{
                color: c.color,
                opacity:
                  hoveredCategory && hoveredCategory !== c.name ? 0.35 : 1,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: c.color,
                  boxShadow: `0 0 8px ${c.color}`,
                }}
              />
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
