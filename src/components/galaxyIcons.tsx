"use client";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import {
  SiClaude, SiOpenai, SiGooglegemini, SiN8N, SiAirtable, SiTrello, SiCalendly,
  SiWhatsapp, SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiHtml5, SiSass,
  SiVite, SiNodedotjs, SiExpress, SiPython, SiPhp, SiSymfony, SiDjango,
  SiSupabase, SiMysql, SiPostgresql, SiLinux, SiDocker, SiVercel, SiNetlify,
  SiCloudflare, SiStripe, SiGit,
} from "react-icons/si";
import type { IconType } from "react-icons";

// Tech label (must match CATEGORIES in TechGalaxyScene) → brand icon.
// Anything not present here falls back to a clean monogram.
const ICON_MAP: Record<string, IconType> = {
  Claude: SiClaude,
  OpenAI: SiOpenai,
  Gemini: SiGooglegemini,
  n8n: SiN8N,
  Airtable: SiAirtable,
  Trello: SiTrello,
  Calendly: SiCalendly,
  UltraMsg: SiWhatsapp,
  "Next.js": SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  Tailwind: SiTailwindcss,
  "HTML/CSS": SiHtml5,
  SCSS: SiSass,
  Vite: SiVite,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  Python: SiPython,
  PHP: SiPhp,
  Symfony: SiSymfony,
  Django: SiDjango,
  Supabase: SiSupabase,
  MySQL: SiMysql,
  Postgres: SiPostgresql,
  Linux: SiLinux,
  Docker: SiDocker,
  Vercel: SiVercel,
  Netlify: SiNetlify,
  Cloudflare: SiCloudflare,
  Stripe: SiStripe,
  Git: SiGit,
};

// Concept/brand-less techs → short monogram drawn in the canvas.
const MONOGRAM: Record<string, string> = {
  DeepSeek: "DS",
  MCP: "MCP",
  Skills: "SK",
  OpenClaw: "OC",
  RAG: "RAG",
  Pinecone: "PC",
  "File Search": "FS",
  API: "API",
  Azure: "Az",
  Teachable: "Tc",
};

const SIZE = 256;
const cache = new Map<string, THREE.CanvasTexture>();

function drawMonogram(ctx: CanvasRenderingContext2D, text: string) {
  ctx.save();
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 ${text.length > 2 ? 92 : 128}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 16;
  ctx.fillText(text, SIZE / 2, SIZE / 2 + 4);
  ctx.restore();
}

/**
 * Returns a cached CanvasTexture with the tech's brand logo (white) or a
 * monogram fallback, drawn with a dark drop-shadow so it stays legible on any
 * planet color. Brand logos load async (SVG→Image); a monogram is drawn first
 * so the texture is never blank.
 */
export function getIconTexture(tech: string): THREE.CanvasTexture {
  const cached = cache.get(tech);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(tech, tex);

  const Icon = ICON_MAP[tech];
  if (!Icon) {
    drawMonogram(ctx, MONOGRAM[tech] ?? tech.slice(0, 2).toUpperCase());
    tex.needsUpdate = true;
    return tex;
  }

  // Draw a monogram immediately as a placeholder, then overlay the real logo.
  drawMonogram(ctx, tech.slice(0, 2).toUpperCase());
  tex.needsUpdate = true;

  try {
    const svg = renderToStaticMarkup(
      React.createElement(Icon, { color: "#ffffff", size: 200 })
    );
    const url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 18;
      const pad = 36;
      ctx.drawImage(img, pad, pad, SIZE - pad * 2, SIZE - pad * 2);
      ctx.restore();
      tex.needsUpdate = true;
    };
    img.src = url;
  } catch {
    // keep the monogram placeholder
  }

  return tex;
}
