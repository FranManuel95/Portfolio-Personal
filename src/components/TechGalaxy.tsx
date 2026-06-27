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

type Category = {
  name: string;
  color: string;
  radiusFactor: number;
  direction: 1 | -1;
  duration: number;
  techs: string[];
};

const CATEGORIES: Category[] = [
  {
    name: "IA & Agentes",
    color: "#00ff87",
    radiusFactor: 0.14,
    direction: 1,
    duration: 70,
    techs: ["Claude", "OpenAI", "Gemini", "DeepSeek", "MCP", "Skills", "OpenClaw", "RAG", "Pinecone", "File Search"],
  },
  {
    name: "Automatización",
    color: "#fb923c",
    radiusFactor: 0.225,
    direction: -1,
    duration: 95,
    techs: ["n8n", "Airtable", "Trello", "Calendly", "UltraMsg", "API"],
  },
  {
    name: "Frontend",
    color: "#60a5fa",
    radiusFactor: 0.31,
    direction: 1,
    duration: 130,
    techs: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS", "SCSS", "Vite"],
  },
  {
    name: "Backend & BD",
    color: "#a78bfa",
    radiusFactor: 0.395,
    direction: -1,
    duration: 165,
    techs: ["Node.js", "Express", "Python", "PHP", "Symfony", "Django", "Supabase", "MySQL", "Postgres"],
  },
  {
    name: "Infra & DevOps",
    color: "#fbbf24",
    radiusFactor: 0.48,
    direction: 1,
    duration: 200,
    techs: ["Linux", "Docker", "Vercel", "Netlify", "Cloudflare", "Azure", "Stripe", "Teachable", "Git"],
  },
];

const TILT_DEG = 25;

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
  depth: number; // parallax strength
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
  const [comets, setComets] = useState<{ id: number; from: { x: number; y: number }; to: { x: number; y: number } }[]>([]);

  useEffect(() => {
    let id = 0;
    const spawn = () => {
      const fromSide = Math.floor(Math.random() * 4);
      const startEdge = (e: number) => {
        if (e === 0) return { x: Math.random() * 100, y: -5 };       // top
        if (e === 1) return { x: 105, y: Math.random() * 100 };       // right
        if (e === 2) return { x: Math.random() * 100, y: 105 };       // bottom
        return { x: -5, y: Math.random() * 100 };                      // left
      };
      const from = startEdge(fromSide);
      const to = { x: 100 - from.x + (Math.random() - 0.5) * 30, y: 100 - from.y + (Math.random() - 0.5) * 30 };
      const newId = ++id;
      setComets((c) => [...c, { id: newId, from, to }]);
      setTimeout(() => setComets((c) => c.filter((x) => x.id !== newId)), 2500);
    };
    const interval = setInterval(spawn, 6000 + Math.random() * 5000);
    setTimeout(spawn, 2500);
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
                  width: 120,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9))",
                  boxShadow: "0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(0,255,135,0.4)",
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
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {CATEGORIES.map((c, i) => (
        <motion.div
          key={c.name}
          className="absolute rounded-full"
          style={{
            width: "45%",
            height: "45%",
            left: `${15 + (i * 17) % 70}%`,
            top: `${10 + (i * 23) % 70}%`,
            background: `radial-gradient(circle, ${c.color}18 0%, ${c.color}05 30%, transparent 60%)`,
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}

// ─── SUN ─────────────────────────────────────────────────────────────────────

function Sun({ size, onClick }: { size: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
      style={{ width: size * 3, height: size * 3, zIndex: 25 }}
      aria-label="Reanudar órbitas"
    >
      {/* Outer corona ring (pulsing) */}
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 2.6,
          height: size * 2.6,
          marginLeft: -size * 1.3,
          marginTop: -size * 1.3,
          background: "radial-gradient(circle, rgba(0,255,135,0.18) 0%, rgba(0,255,135,0.06) 40%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.4, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Inner corona */}
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          marginLeft: -size * 0.9,
          marginTop: -size * 0.9,
          background: "radial-gradient(circle, rgba(0,255,135,0.35) 0%, rgba(0,255,135,0.1) 50%, transparent 80%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.9, 0.6, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Rotating rays */}
      <motion.svg
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: size * 2.4,
          height: size * 2.4,
          marginLeft: -size * 1.2,
          marginTop: -size * 1.2,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 360;
          const x1 = 50 + Math.cos(a * Math.PI / 180) * 32;
          const y1 = 50 + Math.sin(a * Math.PI / 180) * 32;
          const x2 = 50 + Math.cos(a * Math.PI / 180) * 48;
          const y2 = 50 + Math.sin(a * Math.PI / 180) * 48;
          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="rgba(0,255,135,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </motion.svg>
      {/* Sun core */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: "radial-gradient(circle at 35% 35%, #d6ffea 0%, #00ff87 35%, #00a85a 80%, #006b3a 100%)",
          boxShadow: "0 0 30px rgba(0,255,135,0.9), 0 0 60px rgba(0,255,135,0.5), inset -8px -8px 20px rgba(0,107,58,0.6)",
          cursor: "pointer",
        }}
      >
        <span
          className="font-black uppercase tracking-tighter"
          style={{
            color: "#003622",
            fontSize: size * 0.21,
            textShadow: "0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          STACK
        </span>
      </div>
    </button>
  );
}

// ─── PLANET ──────────────────────────────────────────────────────────────────

function Planet({
  tech,
  orbitAngle,
  offsetAngle,
  radius,
  size,
  color,
  isSelected,
  onClick,
  onHover,
}: {
  tech: string;
  orbitAngle: MotionValue<number>;
  offsetAngle: number;
  radius: number;
  size: number;
  color: string;
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

  // Depth cue: planets behind the sun (in 3D space) are smaller-feeling — simulate via opacity
  // Since we tilt with rotateX, lower Y in screen space = farther back
  const depthOpacity = useTransform(y, (v) => 0.7 + (v + radius) / (radius * 2) * 0.3);

  const icon = TECH_ICONS[tech];
  const iconSize = size * 0.42;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="absolute top-1/2 left-1/2 rounded-full focus-visible:outline-none"
      style={{
        x,
        y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        // Counter-rotate so planet faces camera even though parent is tilted
        transform: `rotateX(-${TILT_DEG}deg)`,
        transformStyle: "preserve-3d",
        zIndex: isSelected ? 50 : 10,
        cursor: "pointer",
        opacity: depthOpacity,
      }}
      whileHover={{ scale: 1.35 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      aria-label={tech}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${color}f5, ${color}aa 35%, ${color}55 65%, ${color}22 90%)`,
          boxShadow: isSelected
            ? `inset -${size * 0.18}px -${size * 0.18}px ${size * 0.25}px rgba(0,0,0,0.55), 0 0 ${size * 0.8}px ${color}, 0 0 ${size * 1.6}px ${color}80`
            : `inset -${size * 0.18}px -${size * 0.18}px ${size * 0.25}px rgba(0,0,0,0.55), 0 0 ${size * 0.4}px ${color}aa`,
          border: `1px solid ${color}`,
          color: "#0c0c0c",
          fontSize: iconSize,
        }}
      >
        <div style={{ width: iconSize, height: iconSize, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        {/* Specular highlight */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `${size * 0.12}px`,
            left: `${size * 0.18}px`,
            width: size * 0.22,
            height: size * 0.18,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 65%)",
            filter: "blur(1.5px)",
          }}
        />
      </div>
    </motion.button>
  );
}

// ─── ORBIT (driver) ──────────────────────────────────────────────────────────

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
          orbitAngle={angle}
          offsetAngle={(i / category.techs.length) * 360}
          radius={radius}
          size={planetSize}
          color={category.color}
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

  // Parallax for stars
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
  const planetSize = Math.max(34, containerSize * 0.07);
  const sunSize = Math.max(70, containerSize * 0.12);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-[760px] mx-auto"
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
        {/* Background layers */}
        <Nebulae />
        <StarLayer count={45} sizeRange={[0.4, 1.0]} opacityRange={[0.2, 0.5]} depth={0.4} mx={mx} my={my} />
        <StarLayer count={30} sizeRange={[0.8, 1.6]} opacityRange={[0.35, 0.75]} depth={1.0} mx={mx} my={my} />
        <StarLayer count={12} sizeRange={[1.4, 2.4]} opacityRange={[0.55, 0.95]} depth={1.8} mx={mx} my={my} />
        <Comets />

        {/* 3D-tilted orbital plane */}
        <div
          className="absolute inset-0"
          style={{
            perspective: 1400,
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
            {/* Orbit ring ellipses (the tilt turns them into ellipses visually) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                {CATEGORIES.map((c) => (
                  <radialGradient key={`grad-${c.name}`} id={`orbit-grad-${c.name.replace(/[^a-z]/gi, "")}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={c.color} stopOpacity="0" />
                    <stop offset="90%" stopColor={c.color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={c.color} stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>
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
                    stroke={active ? c.color : "rgba(255,255,255,0.18)"}
                    strokeWidth={active ? 1.5 : 1}
                    opacity={active ? 0.7 : 0.35}
                    strokeDasharray={active ? "0" : "2 8"}
                    style={{ transition: "stroke 0.4s, opacity 0.4s, stroke-dasharray 0.4s, stroke-width 0.4s" }}
                  />
                );
              })}
            </svg>

            {/* Planets */}
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

        {/* Sun (outside the tilted plane so it always faces camera) */}
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

        {/* Legend */}
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
