"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

// ─── TYPES (shared between background scene + controls panel) ───────────────

export type CategoryName =
  | "IA & Agentes"
  | "Automatización"
  | "Frontend"
  | "Backend & BD"
  | "Infra & DevOps";

export type SurfaceType = "plasma" | "lava" | "earth" | "gas" | "rocky";

export type Category = {
  name: CategoryName;
  brand: string;
  baseColor: string;
  accentColor: string;
  surface: SurfaceType;
  radius: number;
  speed: number;
  techs: string[];
};

export const CATEGORIES: Category[] = [
  {
    name: "IA & Agentes",
    brand: "#00ff87",
    baseColor: "#1eb874",
    accentColor: "#a8ffd0",
    surface: "plasma",
    radius: 4.5,
    speed: 0.09,
    techs: ["Claude", "OpenAI", "Gemini", "DeepSeek", "MCP", "Skills", "OpenClaw", "RAG", "Pinecone", "File Search"],
  },
  {
    name: "Automatización",
    brand: "#fb923c",
    baseColor: "#c2410c",
    accentColor: "#ffb976",
    surface: "lava",
    radius: 7,
    speed: 0.066,
    techs: ["n8n", "Airtable", "Trello", "Calendly", "UltraMsg", "API"],
  },
  {
    name: "Frontend",
    brand: "#60a5fa",
    baseColor: "#1e40af",
    accentColor: "#7dd3fc",
    surface: "earth",
    radius: 9.7,
    speed: 0.046,
    techs: ["Next.js", "React", "TypeScript", "Tailwind", "HTML/CSS", "SCSS", "Vite"],
  },
  {
    name: "Backend & BD",
    brand: "#a78bfa",
    baseColor: "#6d28d9",
    accentColor: "#ddd6fe",
    surface: "gas",
    radius: 12.6,
    speed: 0.034,
    techs: ["Node.js", "Express", "Python", "PHP", "Symfony", "Django", "Supabase", "MySQL", "Postgres"],
  },
  {
    name: "Infra & DevOps",
    brand: "#fbbf24",
    baseColor: "#92400e",
    accentColor: "#fde68a",
    surface: "rocky",
    radius: 15.5,
    speed: 0.025,
    techs: ["Linux", "Docker", "Vercel", "Netlify", "Cloudflare", "Azure", "Stripe", "Teachable", "Git"],
  },
];

export type SelectedState = { category: Category; tech: string } | null;

// ─── CONTEXT ───────────────────────────────────────────────────────────────

type CtxValue = {
  selected: SelectedState;
  setSelected: React.Dispatch<React.SetStateAction<SelectedState>>;
  hoveredCategory: string | null;
  setHoveredCategory: React.Dispatch<React.SetStateAction<string | null>>;
  filterCategory: string | null;
  setFilterCategory: React.Dispatch<React.SetStateAction<string | null>>;
  manualPause: boolean;
  setManualPause: React.Dispatch<React.SetStateAction<boolean>>;
  speedMul: 0.5 | 1 | 2;
  setSpeedMul: React.Dispatch<React.SetStateAction<0.5 | 1 | 2>>;
};

const TechGalaxyCtx = createContext<CtxValue | null>(null);

export function TechGalaxyProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<SelectedState>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [manualPause, setManualPause] = useState(false);
  const [speedMul, setSpeedMul] = useState<0.5 | 1 | 2>(1);

  const value = useMemo<CtxValue>(
    () => ({
      selected,
      setSelected,
      hoveredCategory,
      setHoveredCategory,
      filterCategory,
      setFilterCategory,
      manualPause,
      setManualPause,
      speedMul,
      setSpeedMul,
    }),
    [selected, hoveredCategory, filterCategory, manualPause, speedMul]
  );

  return <TechGalaxyCtx.Provider value={value}>{children}</TechGalaxyCtx.Provider>;
}

export function useTechGalaxy() {
  const ctx = useContext(TechGalaxyCtx);
  if (!ctx) {
    throw new Error("useTechGalaxy must be used within TechGalaxyProvider");
  }
  return ctx;
}
