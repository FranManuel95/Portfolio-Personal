"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  MotionValue,
} from "framer-motion";

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

type SelectedState = { category: Category; tech: string } | null;

function StarField() {
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 70 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.6 + 0.4,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function Planet({
  tech,
  orbitAngle,
  offsetAngle,
  radius,
  size,
  color,
  isSelected,
  onClick,
}: {
  tech: string;
  orbitAngle: MotionValue<number>;
  offsetAngle: number;
  radius: number;
  size: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const x = useTransform(
    orbitAngle,
    (a) => Math.cos(((a + offsetAngle) * Math.PI) / 180) * radius
  );
  const y = useTransform(
    orbitAngle,
    (a) => Math.sin(((a + offsetAngle) * Math.PI) / 180) * radius
  );

  const fontSize = Math.max(8, size * 0.26);

  return (
    <motion.button
      onClick={onClick}
      className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full font-bold text-center leading-none select-none focus-visible:outline-none"
      style={{
        x,
        y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        background: `radial-gradient(circle at 30% 30%, ${color}30, ${color}08 65%, transparent 80%)`,
        border: `1px solid ${color}${isSelected ? "ff" : "55"}`,
        color: color,
        boxShadow: isSelected
          ? `0 0 30px ${color}cc, 0 0 60px ${color}66, inset 0 0 12px ${color}44`
          : `0 0 12px ${color}40`,
        fontSize,
        padding: 2,
        zIndex: isSelected ? 30 : 10,
        cursor: "pointer",
      }}
      whileHover={{ scale: 1.18 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      aria-label={tech}
    >
      <span style={{ fontSize, lineHeight: 1, wordBreak: "break-word" }}>{tech}</span>
    </motion.button>
  );
}

function Orbit({
  category,
  containerSize,
  paused,
  selected,
  setSelected,
  planetSize,
}: {
  category: Category;
  containerSize: number;
  paused: boolean;
  selected: SelectedState;
  setSelected: (s: SelectedState) => void;
  planetSize: number;
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
        />
      ))}
    </>
  );
}

export default function TechGalaxy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState(600);
  const [selected, setSelected] = useState<SelectedState>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const paused = selected !== null;
  const planetSize = Math.max(28, containerSize * 0.062);
  const coreSize = Math.max(60, containerSize * 0.11);

  return (
    <div className="w-full">
      {/* Galaxy */}
      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-[680px] mx-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        <StarField />

        {/* Orbit rings */}
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
                stroke={active ? c.color : "var(--line)"}
                strokeWidth={active ? 1 : 1}
                opacity={active ? 0.6 : 0.2}
                strokeDasharray={active ? "0" : "3 7"}
                style={{ transition: "stroke 0.4s, opacity 0.4s, stroke-dasharray 0.4s" }}
              />
            );
          })}
        </svg>

        {/* Center core */}
        <button
          onClick={() => setSelected(null)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-black uppercase tracking-tighter focus-visible:outline-none"
          style={{
            width: coreSize,
            height: coreSize,
            background:
              "radial-gradient(circle at 35% 35%, rgba(0,255,135,0.18), rgba(0,255,135,0.04) 60%, transparent)",
            border: "1px solid rgba(0,255,135,0.5)",
            color: "var(--accent)",
            boxShadow:
              "0 0 50px rgba(0,255,135,0.35), inset 0 0 25px rgba(0,255,135,0.12)",
            fontSize: coreSize * 0.22,
            cursor: "pointer",
            zIndex: 20,
          }}
          aria-label="Reanudar órbitas"
        >
          STACK
        </button>

        {/* Planets per orbit */}
        {CATEGORIES.map((c) => (
          <Orbit
            key={c.name}
            category={c}
            containerSize={containerSize}
            paused={paused}
            selected={selected}
            setSelected={setSelected}
            planetSize={planetSize}
          />
        ))}
      </div>

      {/* Info panel + category legend */}
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

        {/* Category legend */}
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
                  boxShadow: `0 0 6px ${c.color}`,
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
