"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import TypewriterText from "./TypewriterText";

/* =========================================================================
   Pixel-art sprite helper
   Each sprite is a string[] where every char represents 1 pixel.
   A per-sprite palette maps chars -> hex colors.
   ========================================================================= */
type Palette = Record<string, string>;

function spriteRects(rows: string[], palette: Palette) {
  const rects: React.ReactElement[] = [];
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === "." || c === " " || !palette[c]) {
        x++;
        continue;
      }
      let w = 1;
      while (x + w < row.length && row[x + w] === c) w++;
      rects.push(
        <rect
          key={`${x}-${y}-${c}`}
          x={x}
          y={y}
          width={w}
          height={1}
          fill={palette[c]}
          shapeRendering="crispEdges"
        />
      );
      x += w;
    }
  }
  return rects;
}

/* =========================================================================
   Character sprites — human pixel art (16 × 22).
   Shared codes:
     . transparent    S skin light     s skin shadow    K eye / outline
     h hair main      H hair highlight W white (eyes/shirt)
     M mouth/lips     N shoe dark      w shoe sole
   Character-specific codes defined per palette.
   ========================================================================= */

// --- DEV — male full-stack engineer ------------------------------------
//   Brown hair, glasses, blue tee, jeans, navy sneakers.
const devRows = [
  "....hhhhhh......", // 0  hair top
  "...hhhhhhhh.....", // 1  hair sides
  "...hhSSSShh.....", // 2  hair framing forehead
  "...hSSSSSSh.....", // 3  forehead
  "...SKWWWWKS.....", // 4  glasses frame
  "...SKWkWkKS.....", // 5  eyes through glasses (k = pupil)
  "...sSSSSSSs.....", // 6  cheeks
  "....sSMMSs......", // 7  mouth
  ".....SSSS.......", // 8  neck
  "....BBBBBB......", // 9  collar
  "...BBBBBBBB.....", // 10 shoulders
  "..SBBBBBBBBS....", // 11 arms + hands
  "..SBBBBBBBBS....", // 12
  "...BBBBBBBB.....", // 13 torso
  "...JJJJJJJJ.....", // 14 belt/waist
  "...JJJJJJJJ.....", // 15 pants top
  "...JJJ..JJJ.....", // 16 legs split
  "...JJJ..JJJ.....", // 17
  "...jjj..jjj.....", // 18 pants shadow
  "..NNNN..NNNN....", // 19 shoes
  "..NNNN..NNNN....", // 20
  "..wwww..wwww....", // 21 rubber soles
];
const devPalette: Palette = {
  S: "#eecaa4", // skin light
  s: "#c69b77", // skin shadow
  h: "#4a2c15", // hair
  K: "#1a1a1a", // glasses / outline
  k: "#2a3a55", // pupil
  W: "#f5f1e8", // lens white
  M: "#8a4030", // lips/beard
  B: "#2563eb", // blue tee
  J: "#2a3f5a", // jeans
  j: "#1a2a3e", // jeans shadow
  N: "#15192a", // sneaker
  w: "#e6e0d0", // sneaker sole
};

// --- AI — female AI architect ------------------------------------------
//   Dark hair tied back, blazer over white blouse, pencil skirt, heels.
const aiRows = [
  "....hhhhhh......", // 0  hair crown
  "...hhhhhhhh.....", // 1  hair sides
  "...hhhhhhhh.....", // 2  hair
  "...hhSSSShh.....", // 3  forehead under bangs
  "...hSSSSSSh.....", // 4  forehead
  "...SSKWWKSS.....", // 5  eyes (K lashes, W whites)
  "...sSSSSSSs.....", // 6  cheeks
  "....sSMMSs......", // 7  lips
  ".....SSPS.......", // 8  neck + pearl
  "....VVVVVV......", // 9  blazer collar
  "...VVWxxWVV.....", // 10 blazer lapels + blouse + buttons
  "..SVVWWWWVVS....", // 11 arms + blouse
  "..SVVVVVVVVS....", // 12 arms closed
  "...VVVVVVVV.....", // 13 blazer waist
  "...DDDDDDDD.....", // 14 pencil skirt top
  "...DDDDDDDD.....", // 15 skirt
  "...DDDDDDDD.....", // 16 skirt hem
  "....SSSSSS......", // 17 bare legs top
  "....SS..SS......", // 18 legs split
  "....SS..SS......", // 19
  "...XXX..XXX.....", // 20 heels top
  "...XX....XX.....", // 21 heel tip
];
const aiPalette: Palette = {
  S: "#eecaa4",
  s: "#c69b77",
  h: "#1c1208", // near-black brown
  K: "#101014",
  W: "#f0eee8", // blouse / eye whites
  M: "#b03244", // red lips
  V: "#2a2a44", // navy blazer
  D: "#14142a", // darker skirt
  x: "#2a2a44", // buttons (same as blazer for subtle)
  P: "#e8e4d8", // pearl
  X: "#0a0a12", // heels
};

// --- AUTO — male automation engineer -----------------------------------
//   Sandy brown short hair, orange henley, olive cargo pants, brown sneakers.
const autoRows = [
  "....hhhhhh......", // 0  hair
  "...hhhhhhhh.....", // 1
  "...hhSSSShh.....", // 2  forehead
  "...hSSSSSSh.....", // 3
  "...SSKWWKSS.....", // 4  eyes
  "...sSSSSSSs.....", // 5  cheeks
  "....sSMMSs......", // 6  smile
  ".....SSSS.......", // 7  neck
  "....OOxxOO......", // 8  henley neckline (x = button placket)
  "...OOOOOOOO.....", // 9  shoulders
  "..SOOOOOOOOS....", // 10 arms
  "..SOOOOOOOOS....", // 11
  "...OOOOOOOO.....", // 12 torso
  "...OOOOOOOO.....", // 13 hem
  "...GGGGGGGG.....", // 14 belt line
  "...GGGGGGGG.....", // 15 cargo pants top
  "...GGG..GGG.....", // 16 legs split
  "...GGG..GGG.....", // 17
  "...ggg..ggg.....", // 18 pants shadow
  "..CCCC..CCCC....", // 19 shoes
  "..CCCC..CCCC....", // 20
  "..wwww..wwww....", // 21 soles
];
const autoPalette: Palette = {
  S: "#eecaa4",
  s: "#c69b77",
  h: "#6a401c", // sandy brown
  K: "#1a1a1a",
  W: "#f5f1e8",
  M: "#8a4030",
  O: "#ea580c", // orange
  x: "#b8450a", // orange shadow / placket
  G: "#3e4030", // olive cargo
  g: "#2a2c20", // cargo shadow
  C: "#5a3a20", // brown sneaker
  w: "#d8d0c0",
};

// --- AGENT — female voice/agents specialist ---------------------------
//   Long auburn hair, red blouse, black pencil skirt, pumps (headset drawn separately).
const agentRows = [
  "....HHHHHH......", // 0  hair crown
  "..HHHHHHHHHH....", // 1  hair wide
  ".HHHHSSSSHHHH...", // 2  forehead framed
  ".HHHSSSSSSHH....", // 3
  ".HHSSKWWKSSHH...", // 4  eyes + hair around face
  ".HHsSSSSSSsH....", // 5  cheeks
  "..HHsSMMSsHH....", // 6  lips
  "...HHSSSSHH.....", // 7  neck + hair falling
  "....RRRRRR......", // 8  blouse collar
  "...RRRRRRRR.....", // 9  shoulders
  "..SRRRRRRRRS....", // 10 arms + hands
  "..SRRRRRRRRS....", // 11
  "...RRRRRRRR.....", // 12 torso
  "...RRRRRRRR.....", // 13 waist
  "...NNNNNNNN.....", // 14 belt
  "...DDDDDDDD.....", // 15 skirt top
  "...DDDDDDDD.....", // 16 skirt
  "...DDDDDDDD.....", // 17 hem
  "....SSSSSS......", // 18 bare legs top
  "....SS..SS......", // 19 legs
  "...XXX..XXX.....", // 20 heels
  "...XX....XX.....", // 21 heel tip
];
const agentPalette: Palette = {
  S: "#eecaa4",
  s: "#c69b77",
  H: "#5a2a14", // auburn
  K: "#141018",
  W: "#f0eee8",
  M: "#b03244", // red lips
  R: "#d23844", // red blouse
  N: "#1a1a22", // belt
  D: "#14141e", // skirt
  X: "#0a0a12", // heels
};

/* =========================================================================
   Service definitions
   ========================================================================= */
type Service = {
  id: string;
  title: string;
  role: string;
  accent: string;
  wallA: string;
  wallB: string;
  floorA: string;
  floorB: string;
  items: string[];
  sprite: { rows: string[]; palette: Palette };
  /** ms duration for the walk loop so each agent moves at a slightly different pace */
  walkDuration: number;
};

const services: Service[] = [
  {
    id: "web",
    title: "Desarrollo Web",
    role: "Full-stack Engineer",
    accent: "#60a5fa",
    wallA: "#1e6fd4",
    wallB: "#1558b0",
    floorA: "#c8b89a",
    floorB: "#b8a888",
    items: [
      "Aplicaciones full-stack con Next.js y React",
      "APIs REST y arquitecturas serverless",
      "Autenticación, pagos y bases de datos en la nube",
      "Deploy en Vercel con CI/CD",
    ],
    sprite: { rows: devRows, palette: devPalette },
    walkDuration: 9,
  },
  {
    id: "ai",
    title: "IA Generativa",
    role: "AI Architect",
    accent: "#a78bfa",
    wallA: "#7c3aed",
    wallB: "#5b21b6",
    floorA: "#c8b89a",
    floorB: "#b8a888",
    items: [
      "Sistemas RAG con bases de conocimiento propias",
      "Agentes conversacionales con memoria y herramientas",
      "Orquestación multi-modelo (OpenAI, Claude, Gemini)",
      "Optimización de costes por routing inteligente",
    ],
    sprite: { rows: aiRows, palette: aiPalette },
    walkDuration: 11,
  },
  {
    id: "auto",
    title: "Automatización",
    role: "Workflow Hacker",
    accent: "#fb923c",
    wallA: "#d95c10",
    wallB: "#b84a0a",
    floorA: "#c8b89a",
    floorB: "#b8a888",
    items: [
      "Flujos end-to-end con n8n",
      "Integración de webhooks y APIs externas",
      "Gestión automática de emails y documentos",
      "Pipelines de validación y procesamiento de datos",
    ],
    sprite: { rows: autoRows, palette: autoPalette },
    walkDuration: 7,
  },
  {
    id: "agents",
    title: "Agentes Inteligentes",
    role: "Agent Whisperer",
    accent: "#34d399",
    wallA: "#0a9068",
    wallB: "#077554",
    floorA: "#c8b89a",
    floorB: "#b8a888",
    items: [
      "Agentes de atención al cliente 24/7 (voz y chat)",
      "Agentes internos para tareas operativas y de empresa",
      "Asistentes de voz con VAPI, Twilio y ElevenLabs",
      "Integración con CRMs y sistemas internos",
    ],
    sprite: { rows: agentRows, palette: agentPalette },
    walkDuration: 10,
  },
];

/* =========================================================================
   Pixel Sprite component
   ========================================================================= */
function PixelSprite({
  rows,
  palette,
  className,
  style,
}: {
  rows: string[];
  palette: Palette;
  className?: string;
  style?: React.CSSProperties;
}) {
  const w = rows[0]?.length ?? 16;
  const h = rows.length;
  const rects = useMemo(() => spriteRects(rows, palette), [rows, palette]);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      className={className}
      style={{ imageRendering: "pixelated", ...style }}
      aria-hidden
    >
      {rects}
    </svg>
  );
}

/* =========================================================================
   Furniture components (pixel art, top-down side view)
   ========================================================================= */

/** Dual-monitor desk */
function DeskAndMonitor({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 58 28" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Monitor L */}
      <rect x="3"  y="1" width="18" height="13" fill="#15161c" shapeRendering="crispEdges" />
      <rect x="4"  y="2" width="16" height="11" fill={accent}  opacity="0.15" shapeRendering="crispEdges" />
      <rect x="5"  y="3" width="9"  height="1"  fill={accent}  shapeRendering="crispEdges" />
      <rect x="5"  y="5" width="12" height="1"  fill={accent}  opacity="0.7"  shapeRendering="crispEdges" />
      <rect x="5"  y="7" width="7"  height="1"  fill={accent}  opacity="0.85" shapeRendering="crispEdges" />
      <rect x="5"  y="9" width="10" height="1"  fill={accent}  opacity="0.55" shapeRendering="crispEdges" />
      <rect x="10" y="14" width="3" height="3"  fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="7"  y="17" width="9" height="1"  fill="#0d0e13" shapeRendering="crispEdges" />
      {/* Monitor R */}
      <rect x="37" y="1" width="18" height="13" fill="#15161c" shapeRendering="crispEdges" />
      <rect x="38" y="2" width="16" height="11" fill={accent}  opacity="0.15" shapeRendering="crispEdges" />
      <rect x="39" y="3" width="12" height="1"  fill={accent}  shapeRendering="crispEdges" />
      <rect x="39" y="5" width="8"  height="1"  fill={accent}  opacity="0.7"  shapeRendering="crispEdges" />
      <rect x="39" y="7" width="10" height="1"  fill={accent}  opacity="0.85" shapeRendering="crispEdges" />
      <rect x="39" y="9" width="6"  height="1"  fill={accent}  opacity="0.55" shapeRendering="crispEdges" />
      <rect x="45" y="14" width="3" height="3"  fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="42" y="17" width="9" height="1"  fill="#0d0e13" shapeRendering="crispEdges" />
      {/* Keyboard */}
      <rect x="19" y="19" width="20" height="3" fill="#2a2840" shapeRendering="crispEdges" />
      <rect x="20" y="20" width="18" height="1" fill={accent}  opacity="0.35" shapeRendering="crispEdges" />
      {/* Mouse */}
      <rect x="40" y="19" width="4"  height="3" fill="#2a2840" shapeRendering="crispEdges" />
      <rect x="41" y="19" width="1"  height="1" fill={accent}  opacity="0.7"  shapeRendering="crispEdges" />
      {/* Desk surface */}
      <rect x="0"  y="18" width="58" height="4" fill="#8b6040" shapeRendering="crispEdges" />
      <rect x="0"  y="22" width="58" height="1" fill="#6a4828" shapeRendering="crispEdges" />
      {/* Legs */}
      <rect x="2"  y="23" width="3"  height="5" fill="#6a4828" shapeRendering="crispEdges" />
      <rect x="53" y="23" width="3"  height="5" fill="#6a4828" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Office chair */
function PixelChair({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 16 20" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Headrest */}
      <rect x="5"  y="0" width="6"  height="2"  fill="#252840" shapeRendering="crispEdges" />
      {/* Backrest */}
      <rect x="3"  y="1" width="10" height="8"  fill="#1d2030" shapeRendering="crispEdges" />
      <rect x="4"  y="2" width="8"  height="6"  fill={accent}  opacity="0.18" shapeRendering="crispEdges" />
      {/* Armrests */}
      <rect x="1"  y="8" width="2"  height="4"  fill="#151620" shapeRendering="crispEdges" />
      <rect x="13" y="8" width="2"  height="4"  fill="#151620" shapeRendering="crispEdges" />
      {/* Seat */}
      <rect x="2"  y="9" width="12" height="5"  fill="#1d2030" shapeRendering="crispEdges" />
      <rect x="3"  y="10" width="10" height="3" fill={accent}  opacity="0.13" shapeRendering="crispEdges" />
      {/* Center pole */}
      <rect x="7"  y="14" width="2" height="3"  fill="#0d0e13" shapeRendering="crispEdges" />
      {/* Star base */}
      <rect x="4"  y="17" width="8" height="1"  fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="7"  y="16" width="2" height="4"  fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="2"  y="18" width="3" height="1"  fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="11" y="18" width="3" height="1"  fill="#0d0e13" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Potted plant */
function PixelPlant() {
  return (
    <svg viewBox="0 0 14 22" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Leaves */}
      <rect x="2"  y="4"  width="5" height="5"  fill="#2d7a30" shapeRendering="crispEdges" />
      <rect x="7"  y="3"  width="5" height="5"  fill="#3a9a40" shapeRendering="crispEdges" />
      <rect x="4"  y="1"  width="5" height="5"  fill="#3a9a40" shapeRendering="crispEdges" />
      <rect x="3"  y="7"  width="3" height="2"  fill="#4ab050" shapeRendering="crispEdges" />
      <rect x="8"  y="6"  width="3" height="2"  fill="#4ab050" shapeRendering="crispEdges" />
      <rect x="5"  y="2"  width="1" height="1"  fill="#60c060" shapeRendering="crispEdges" />
      <rect x="9"  y="4"  width="1" height="1"  fill="#60c060" shapeRendering="crispEdges" />
      {/* Stem */}
      <rect x="6"  y="8"  width="2" height="5"  fill="#2d7a30" shapeRendering="crispEdges" />
      {/* Pot rim */}
      <rect x="2"  y="13" width="10" height="2" fill="#7a4a28" shapeRendering="crispEdges" />
      {/* Pot body */}
      <rect x="3"  y="15" width="8" height="6"  fill="#5a3820" shapeRendering="crispEdges" />
      <rect x="4"  y="15" width="6" height="2"  fill="#2a1a08" shapeRendering="crispEdges" />
      <rect x="4"  y="19" width="6" height="1"  fill="#3a2010" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Bookshelf */
function PixelBookshelf({ accent }: { accent: string }) {
  const B = ["#d23030","#2a8cd2","#d2a030","#602a8c","#2a8c50","#c06020"];
  return (
    <svg viewBox="0 0 24 32" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Frame */}
      <rect x="0"  y="0"  width="24" height="32" fill="#2a1a0e" shapeRendering="crispEdges" />
      <rect x="2"  y="2"  width="20" height="28" fill="#1a0f08" shapeRendering="crispEdges" />
      {/* Shelves */}
      <rect x="1"  y="11" width="22" height="2"  fill="#2a1a0e" shapeRendering="crispEdges" />
      <rect x="1"  y="21" width="22" height="2"  fill="#2a1a0e" shapeRendering="crispEdges" />
      {/* Books top */}
      <rect x="3"  y="3"  width="3" height="8"   fill={B[0]}   shapeRendering="crispEdges" />
      <rect x="6"  y="4"  width="2" height="7"   fill={B[1]}   shapeRendering="crispEdges" />
      <rect x="8"  y="3"  width="3" height="8"   fill={B[2]}   shapeRendering="crispEdges" />
      <rect x="11" y="5"  width="2" height="6"   fill={B[3]}   shapeRendering="crispEdges" />
      <rect x="13" y="3"  width="3" height="8"   fill={B[4]}   shapeRendering="crispEdges" />
      <rect x="16" y="4"  width="4" height="7"   fill={B[5]}   shapeRendering="crispEdges" />
      {/* Books middle */}
      <rect x="3"  y="13" width="4" height="8"   fill={B[2]}   shapeRendering="crispEdges" />
      <rect x="7"  y="14" width="3" height="7"   fill={B[0]}   shapeRendering="crispEdges" />
      <rect x="10" y="13" width="2" height="8"   fill={B[5]}   shapeRendering="crispEdges" />
      <rect x="12" y="14" width="4" height="7"   fill={accent} opacity="0.9" shapeRendering="crispEdges" />
      <rect x="16" y="13" width="3" height="8"   fill={B[3]}   shapeRendering="crispEdges" />
      {/* Books bottom */}
      <rect x="3"  y="23" width="5" height="7"   fill={B[1]}   shapeRendering="crispEdges" />
      <rect x="8"  y="24" width="3" height="6"   fill={B[4]}   shapeRendering="crispEdges" />
      <rect x="11" y="23" width="4" height="7"   fill={B[0]}   shapeRendering="crispEdges" />
      <rect x="15" y="24" width="6" height="6"   fill={accent} opacity="0.7" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Server rack */
function PixelServerRack({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 16 32" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      <rect x="0" y="0"  width="16" height="32" fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="1" y="1"  width="14" height="30" fill="#15161c" shapeRendering="crispEdges" />
      {[0,1,2,3,4,5,6].map(i => (
        <React.Fragment key={i}>
          <rect x="2"  y={2 + i * 4} width="12" height="3"  fill="#1d1f2a" shapeRendering="crispEdges" />
          <rect x="3"  y={3 + i * 4} width="5"  height="1"  fill={accent}  opacity="0.55" shapeRendering="crispEdges" />
          <rect x="13" y={3 + i * 4} width="1"  height="1"  fill={i % 3 === 0 ? "#30d060" : accent} shapeRendering="crispEdges" />
        </React.Fragment>
      ))}
      {/* Power strip */}
      <rect x="2"  y="30" width="12" height="1"  fill={accent} opacity="0.25" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Standing whiteboard */
function PixelWhiteboard({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 28 26" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Frame */}
      <rect x="0"  y="0"  width="28" height="20" fill="#2a2a3a" shapeRendering="crispEdges" />
      {/* Surface */}
      <rect x="1"  y="1"  width="26" height="18" fill="#eeeef6" shapeRendering="crispEdges" />
      {/* Content */}
      <rect x="3"  y="3"  width="8"  height="5"  fill={accent} opacity="0.45" shapeRendering="crispEdges" />
      <rect x="13" y="3"  width="8"  height="5"  fill={accent} opacity="0.28" shapeRendering="crispEdges" />
      <rect x="8"  y="8"  width="2"  height="3"  fill={accent} opacity="0.55" shapeRendering="crispEdges" />
      <rect x="17" y="8"  width="2"  height="3"  fill={accent} opacity="0.38" shapeRendering="crispEdges" />
      <rect x="3"  y="13" width="22" height="1"  fill="#88889a" opacity="0.4" shapeRendering="crispEdges" />
      <rect x="3"  y="15" width="15" height="1"  fill="#88889a" opacity="0.3" shapeRendering="crispEdges" />
      {/* Tray */}
      <rect x="1"  y="18" width="26" height="2"  fill="#1a1a28" shapeRendering="crispEdges" />
      <rect x="3"  y="18" width="2"  height="1"  fill={accent} opacity="0.7" shapeRendering="crispEdges" />
      {/* Legs */}
      <rect x="5"  y="20" width="3"  height="6"  fill="#2a2a3a" shapeRendering="crispEdges" />
      <rect x="20" y="20" width="3"  height="6"  fill="#2a2a3a" shapeRendering="crispEdges" />
      <rect x="3"  y="24" width="6"  height="2"  fill="#2a2a3a" shapeRendering="crispEdges" />
      <rect x="19" y="24" width="6"  height="2"  fill="#2a2a3a" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Filing cabinet (2 drawers) */
function PixelFilingCabinet({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 14 26" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      <rect x="0"  y="0"  width="14" height="26" fill="#1d2030" shapeRendering="crispEdges" />
      {/* Drawer 1 */}
      <rect x="1"  y="1"  width="12" height="11" fill="#252840" shapeRendering="crispEdges" />
      <rect x="1"  y="1"  width="12" height="1"  fill="#2e3050" shapeRendering="crispEdges" />
      <rect x="4"  y="5"  width="6"  height="2"  fill={accent}  opacity="0.45" shapeRendering="crispEdges" />
      <rect x="5"  y="5"  width="4"  height="1"  fill={accent}  shapeRendering="crispEdges" />
      {/* Divider */}
      <rect x="0"  y="12" width="14" height="2"  fill="#15161c" shapeRendering="crispEdges" />
      {/* Drawer 2 */}
      <rect x="1"  y="14" width="12" height="11" fill="#252840" shapeRendering="crispEdges" />
      <rect x="1"  y="14" width="12" height="1"  fill="#2e3050" shapeRendering="crispEdges" />
      <rect x="4"  y="18" width="6"  height="2"  fill={accent}  opacity="0.45" shapeRendering="crispEdges" />
      <rect x="5"  y="18" width="4"  height="1"  fill={accent}  shapeRendering="crispEdges" />
      {/* Base */}
      <rect x="0"  y="25" width="14" height="1"  fill="#0d0e13" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Floor lamp */
function PixelLamp({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 12 30" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Shade */}
      <rect x="1"  y="0"  width="10" height="3"  fill={accent}  opacity="0.85" shapeRendering="crispEdges" />
      <rect x="0"  y="2"  width="12" height="4"  fill={accent}  opacity="0.65" shapeRendering="crispEdges" />
      <rect x="3"  y="6"  width="6"  height="2"  fill={accent}  opacity="0.3"  shapeRendering="crispEdges" />
      {/* Pole */}
      <rect x="5"  y="7"  width="2"  height="18" fill="#1d1f2a" shapeRendering="crispEdges" />
      {/* Base */}
      <rect x="3"  y="25" width="6"  height="2"  fill="#252838" shapeRendering="crispEdges" />
      <rect x="2"  y="27" width="8"  height="3"  fill="#1d1f2a" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Coffee machine */
function PixelCoffeeMaker({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 14 20" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Body */}
      <rect x="1"  y="1"  width="12" height="13" fill="#1d1f2a" shapeRendering="crispEdges" />
      <rect x="2"  y="0"  width="10" height="2"  fill="#252838" shapeRendering="crispEdges" />
      {/* Display */}
      <rect x="2"  y="2"  width="10" height="4"  fill={accent}  opacity="0.35" shapeRendering="crispEdges" />
      <rect x="3"  y="3"  width="4"  height="2"  fill={accent}  opacity="0.6"  shapeRendering="crispEdges" />
      {/* Buttons */}
      <rect x="2"  y="7"  width="2"  height="2"  fill={accent}  shapeRendering="crispEdges" />
      <rect x="5"  y="7"  width="2"  height="2"  fill="#30d060" shapeRendering="crispEdges" />
      <rect x="8"  y="7"  width="2"  height="2"  fill="#d03030" shapeRendering="crispEdges" />
      {/* Spout */}
      <rect x="4"  y="11" width="6"  height="2"  fill="#252838" shapeRendering="crispEdges" />
      {/* Cup */}
      <rect x="3"  y="14" width="8"  height="5"  fill="#2a1a08" shapeRendering="crispEdges" />
      <rect x="4"  y="15" width="6"  height="2"  fill={accent}  opacity="0.55" shapeRendering="crispEdges" />
      <rect x="11" y="15" width="2"  height="3"  fill="#2a1a08" shapeRendering="crispEdges" />
      {/* Steam */}
      <rect x="5"  y="0"  width="1"  height="1"  fill={accent}  opacity="0.4"  shapeRendering="crispEdges" />
      <rect x="8"  y="0"  width="1"  height="1"  fill={accent}  opacity="0.4"  shapeRendering="crispEdges" />
    </svg>
  );
}

/** Small round meeting table */
function PixelRoundTable({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 26 18" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Shadow */}
      <rect x="2"  y="14" width="22" height="2"  fill="#000"    opacity="0.2"  shapeRendering="crispEdges" />
      {/* Tabletop edge */}
      <rect x="1"  y="4"  width="24" height="8"  fill="#3a2010" shapeRendering="crispEdges" />
      {/* Tabletop surface */}
      <rect x="2"  y="3"  width="22" height="8"  fill="#4a2a14" shapeRendering="crispEdges" />
      <rect x="2"  y="3"  width="22" height="1"  fill="#5a3418" shapeRendering="crispEdges" />
      {/* Surface gloss */}
      <rect x="8"  y="5"  width="10" height="4"  fill={accent}  opacity="0.12" shapeRendering="crispEdges" />
      {/* Leg */}
      <rect x="12" y="11" width="2"  height="6"  fill="#1a0f08" shapeRendering="crispEdges" />
      <rect x="9"  y="15" width="8"  height="2"  fill="#1a0f08" shapeRendering="crispEdges" />
    </svg>
  );
}

/** Headset (on desk) */
function PixelHeadset({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 18 14" width="100%" height="100%" style={{ imageRendering: "pixelated" }} aria-hidden>
      {/* Headband */}
      <rect x="3"  y="1"  width="12" height="2"  fill="#1d1f2a" shapeRendering="crispEdges" />
      {/* Ear cups */}
      <rect x="1"  y="2"  width="4"  height="6"  fill={accent}  opacity="0.85" shapeRendering="crispEdges" />
      <rect x="13" y="2"  width="4"  height="6"  fill={accent}  opacity="0.85" shapeRendering="crispEdges" />
      <rect x="2"  y="3"  width="2"  height="4"  fill={accent}  opacity="0.4"  shapeRendering="crispEdges" />
      <rect x="14" y="3"  width="2"  height="4"  fill={accent}  opacity="0.4"  shapeRendering="crispEdges" />
      {/* Mic arm */}
      <rect x="5"  y="6"  width="4"  height="1"  fill="#1d1f2a" shapeRendering="crispEdges" />
      <rect x="5"  y="7"  width="2"  height="5"  fill="#1d1f2a" shapeRendering="crispEdges" />
      {/* Mic ball */}
      <rect x="4"  y="11" width="3"  height="3"  fill={accent}  shapeRendering="crispEdges" />
    </svg>
  );
}

/* =========================================================================
   Room (one office) — top-down angled view, connected layout
   ========================================================================= */
type FurniturePiece = {
  top?: string; bottom?: string; left?: string; right?: string;
  width: string; height: string;
  node: React.ReactNode;
  zIndex?: number;
};

function getRoomFurniture(service: Service): FurniturePiece[] {
  const a = service.accent;
  switch (service.id) {
    case "web":
      return [
        // Server rack — back-right corner
        { top: "5%",  right: "4%",  width: "9%",  height: "34%", node: <PixelServerRack accent={a} /> },
        // Plant — back-left corner
        { top: "5%",  left: "4%",   width: "7%",  height: "28%", node: <PixelPlant /> },
        // Coffee maker — mid-right, on desk edge
        { top: "42%", right: "6%",  width: "8%",  height: "18%", node: <PixelCoffeeMaker accent={a} /> },
        // Chair — in front of desk
        { top: "54%", left: "22%",  width: "11%", height: "22%", node: <PixelChair accent={a} />, zIndex: 2 },
      ];
    case "ai":
      return [
        // Bookshelf — back-left
        { top: "4%",  left: "3%",   width: "11%", height: "38%", node: <PixelBookshelf accent={a} /> },
        // Plant — back-right corner
        { top: "6%",  right: "4%",  width: "7%",  height: "26%", node: <PixelPlant /> },
        // Floor lamp — mid-right
        { top: "34%", right: "14%", width: "5%",  height: "26%", node: <PixelLamp accent={a} /> },
        // Chair — in front of desk
        { top: "54%", left: "20%",  width: "11%", height: "22%", node: <PixelChair accent={a} />, zIndex: 2 },
      ];
    case "auto":
      return [
        // Filing cabinet — back-right
        { top: "4%",  right: "4%",  width: "9%",  height: "30%", node: <PixelFilingCabinet accent={a} /> },
        // Plant — back-left
        { top: "6%",  left: "4%",   width: "7%",  height: "26%", node: <PixelPlant /> },
        // Coffee maker — mid-left corner
        { top: "42%", left: "5%",   width: "8%",  height: "18%", node: <PixelCoffeeMaker accent={a} /> },
        // Chair — in front of desk
        { top: "54%", left: "24%",  width: "11%", height: "22%", node: <PixelChair accent={a} />, zIndex: 2 },
      ];
    case "agents":
      return [
        // Whiteboard — back-left wall
        { top: "4%",  left: "3%",   width: "15%", height: "28%", node: <PixelWhiteboard accent={a} /> },
        // Plant — back-right corner
        { top: "6%",  right: "4%",  width: "7%",  height: "26%", node: <PixelPlant /> },
        // Round meeting table — mid-right area
        { top: "50%", right: "5%",  width: "16%", height: "18%", node: <PixelRoundTable accent={a} /> },
        // Chair — in front of desk
        { top: "54%", left: "20%",  width: "11%", height: "22%", node: <PixelChair accent={a} />, zIndex: 2 },
      ];
    default:
      return [];
  }
}

function Room({
  service,
  active,
  onToggle,
  idx,
  doorSides = [],
}: {
  service: Service;
  active: boolean;
  onToggle: () => void;
  idx: number;
  doorSides?: Array<"right" | "bottom" | "left" | "top">;
}) {
  const charRef = useRef<HTMLButtonElement | null>(null);

  const segments = useMemo(
    () => [
      { text: `— ${service.role} —\n`, className: "font-bold" },
      ...service.items.map((it) => ({ text: `• ${it}\n` })),
    ],
    [service]
  );

  const furniture = useMemo(() => getRoomFurniture(service), [service]);

  // Wall/floor split at 32%
  const SPLIT = 32;

  return (
    <div
      className="room relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg,
          ${service.wallA} 0%,
          ${service.wallB} ${SPLIT}%,
          ${service.floorA} ${SPLIT}%,
          ${service.floorB} 100%)`,
        height: "100%",
        boxShadow: active
          ? `inset 0 0 0 2px ${service.accent}88`
          : `inset 0 0 0 1px rgba(255,255,255,0.04)`,
        transition: "box-shadow .3s var(--ease)",
      }}
    >
      {/* Wall top cap — lighter strip simulating top-of-wall seen from the angle */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "5px",
          background: `linear-gradient(180deg,
            rgba(255,255,255,0.22) 0%,
            rgba(255,255,255,0.08) 60%,
            rgba(0,0,0,0.35) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Wall vertical shading — gives the back wall solid mass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: "5px",
          height: `calc(${SPLIT}% - 5px)`,
          background: `linear-gradient(180deg,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0) 40%,
            rgba(0,0,0,0.35) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Door openings on corridor-facing walls */}
      {doorSides.map((side) => {
        const isH = side === "top" || side === "bottom";
        const base: React.CSSProperties = {
          position: "absolute",
          zIndex: 6,
          background: `linear-gradient(${
            side === "left"   ? "270deg" :
            side === "right"  ? "90deg"  :
            side === "top"    ? "0deg"   : "180deg"
          }, ${service.accent}55, transparent)`,
          border: `1px solid ${service.accent}66`,
        };
        const pos: React.CSSProperties = isH
          ? { left: "50%", transform: "translateX(-50%)", width: "34px", height: "5px",
              [side]: 0 }
          : { top: "62%",  transform: "translateY(-50%)", height: "28px", width: "5px",
              [side]: 0 };
        return <div key={side} aria-hidden style={{ ...base, ...pos }} />;
      })}

      {/* Baseboard — thin strip at wall/floor junction */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: `${SPLIT}%`,
          height: "3px",
          background: `linear-gradient(90deg, ${service.accent}33, ${service.accent}11 50%, ${service.accent}33)`,
          boxShadow: `0 1px 4px ${service.accent}44`,
        }}
      />

      {/* Floor tile grid — warm wood planks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: `${SPLIT}%`,
          bottom: 0,
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.18) 1px, transparent 1px),
            linear-gradient(0deg,  rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 10px",
        }}
      />
      {/* Subtle floor vignette — warm light from wall above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: `${SPLIT}%`,
          bottom: 0,
          background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.10) 100%)`,
        }}
      />

      {/* Ceiling light — small glow on back wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "28%",
          height: "8%",
          background: `radial-gradient(ellipse at 50% 0%, ${service.accent}30 0%, transparent 80%)`,
        }}
      />

      {/* Window on back wall */}
      <div
        aria-hidden
        className="absolute"
        style={{
          right: "22%",
          top: "6%",
          width: "18%",
          height: "22%",
          background: `linear-gradient(180deg, ${service.accent}28, ${service.accent}0a)`,
          border: `2px solid ${service.accent}55`,
          boxShadow: `inset 0 0 0 1px #00000044, 0 0 12px ${service.accent}22`,
        }}
      >
        {/* Window cross */}
        <div className="absolute inset-x-0" style={{ top: "50%", height: "1px", background: `${service.accent}55` }} />
        <div className="absolute inset-y-0" style={{ left: "50%", width: "1px",  background: `${service.accent}55` }} />
      </div>

      {/* Room label — wall plaque */}
      <div className="absolute left-2 top-2 flex items-center gap-1.5 z-10">
        <span
          className="inline-block w-1.5 h-1.5 rounded-sm"
          style={{ background: service.accent, boxShadow: `0 0 6px ${service.accent}` }}
        />
        <span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: service.accent, letterSpacing: "0.1em" }}
        >
          {service.title}
        </span>
      </div>

      {/* Desk + dual monitors */}
      <div
        className="absolute"
        style={{ left: "18%", top: "28%", width: "52%", height: "26%", zIndex: 1 }}
      >
        <DeskAndMonitor accent={service.accent} />
      </div>

      {/* Headset on desk (agents room only) */}
      {service.id === "agents" && (
        <div className="absolute" style={{ left: "56%", top: "38%", width: "8%", height: "10%", zIndex: 2 }}>
          <PixelHeadset accent={service.accent} />
        </div>
      )}

      {/* Furniture pieces (with drop shadow on floor for 3D depth) */}
      {furniture.map((f, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: f.top, bottom: f.bottom,
            left: f.left, right: f.right,
            width: f.width, height: f.height,
            zIndex: f.zIndex ?? 1,
          }}
        >
          {/* Floor shadow pooled below the item */}
          <div
            style={{
              position: "absolute",
              left: "-6%", right: "-6%",
              bottom: "-6%",
              height: "18%",
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, transparent 75%)",
              filter: "blur(2px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
            {f.node}
          </div>
        </div>
      ))}

      {/* Character (clickable) */}
      <button
        ref={charRef}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        aria-label={`Abrir diálogo de ${service.title}`}
        className={`agent group absolute focus:outline-none ${active ? "is-active" : ""}`}
        style={{
          left: 0,
          bottom: "3%",
          width: "14%",
          height: "42%",
          "--walk-duration": `${service.walkDuration}s`,
          "--bob-delay": `${idx * 0.3}s`,
        } as React.CSSProperties}
      >
        <span className="agent-bob block w-full h-full">
          <span className="agent-shadow" aria-hidden />
          <PixelSprite
            rows={service.sprite.rows}
            palette={service.sprite.palette}
            className="agent-sprite"
          />
        </span>
      </button>

      {/* Speech bubble */}
      {active && (
        <div
          role="dialog"
          aria-label={`${service.title} — diálogo`}
          onClick={(e) => e.stopPropagation()}
          className="bubble absolute z-30"
          style={{
            left: "4%", right: "4%", top: "5%",
            background: "#f7f7fa",
            color: "#111218",
            border: `3px solid ${service.accent}`,
            boxShadow: `0 10px 0 -2px #00000040, 0 0 0 3px #00000080`,
            padding: "10px 12px 12px",
            borderRadius: "10px",
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            fontSize: "11px",
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
          }}
        >
          <button
            onClick={onToggle}
            aria-label="Cerrar diálogo"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-bold"
            style={{
              background: "#f7f7fa",
              color: "#111218",
              border: `3px solid ${service.accent}`,
              lineHeight: 1,
            }}
          >
            ×
          </button>
          <TypewriterText
            key={service.id + "-bubble"}
            segments={segments}
            speed={14}
            punctuationPauseMs={60}
            startDelay={0}
            cursor
            as="div"
          />
          {/* Bubble tail */}
          <span
            aria-hidden
            className="absolute"
            style={{
              left: "10%", bottom: -14,
              width: 0, height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: `14px solid ${service.accent}`,
            }}
          />
          <span
            aria-hidden
            className="absolute"
            style={{
              left: "10%", marginLeft: 2, bottom: -9,
              width: 0, height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "10px solid #f7f7fa",
            }}
          />
        </div>
      )}

      <style jsx>{`
        .agent {
          animation: walk var(--walk-duration, 9s) linear infinite;
          will-change: transform;
          cursor: pointer;
          z-index: 3;
        }
        .agent.is-active { animation-play-state: paused; }
        .agent-bob {
          animation: bob 0.55s steps(2) infinite;
          animation-delay: var(--bob-delay, 0s);
        }
        .agent.is-active .agent-bob { animation-play-state: paused; }
        .agent-shadow {
          position: absolute;
          left: 14%; right: 14%; bottom: -4%;
          height: 8%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.55), transparent 70%);
          filter: blur(1px);
        }
        .agent-sprite {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%; height: 100%;
          filter: drop-shadow(0 2px 0 rgba(0,0,0,0.35));
          transition: transform 0.2s var(--ease);
        }
        .agent:hover .agent-sprite { transform: translateY(-2px) scale(1.04); }
        @keyframes walk {
          0%   { left: 2%;  transform: scaleX(1);  }
          48%  { left: 80%; transform: scaleX(1);  }
          50%  { left: 80%; transform: scaleX(-1); }
          98%  { left: 2%;  transform: scaleX(-1); }
          100% { left: 2%;  transform: scaleX(1);  }
        }
        @keyframes bob {
          0%   { transform: translateY(0);   }
          50%  { transform: translateY(-2px);}
          100% { transform: translateY(0);   }
        }
        @media (prefers-reduced-motion: reduce) {
          .agent, .agent-bob { animation: none !important; }
          .agent { left: 40% !important; }
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   VCorridor — vertical strip (column) separating left room from right room
   ========================================================================= */
function VCorridor({ accentL, accentR }: { accentL: string; accentR: string }) {
  const DOOR = 32;
  const WALL = 6;
  // 3D block wall: concrete/stone with top highlight
  const wallBg = "linear-gradient(180deg, #b0aca4 0%, #888480 25%, #605c58 100%)";
  return (
    <div
      className="relative"
      style={{
        background: "#9a9690",
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px),
          linear-gradient(0deg,  rgba(255,255,255,0.10) 1px, transparent 1px)
        `,
        backgroundSize: "13px 13px",
      }}
    >
      {/* LEFT WALL — above door */}
      <div style={{ position:"absolute", left:0, top:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`, background:wallBg, boxShadow:"inset -1px 0 0 rgba(0,0,0,0.6)" }} />
      {/* LEFT door opening */}
      <div style={{
        position:"absolute", left:0, top:`calc(50% - ${DOOR/2}px)`, width:WALL, height:DOOR,
        background:`linear-gradient(90deg, ${accentL}70, ${accentL}20 60%, transparent)`,
        borderTop:`2px solid ${accentL}`, borderBottom:`2px solid ${accentL}`,
        boxShadow:`inset 2px 0 0 ${accentL}55`,
      }} />
      {/* LEFT WALL — below door */}
      <div style={{ position:"absolute", left:0, bottom:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`, background:wallBg, boxShadow:"inset -1px 0 0 rgba(0,0,0,0.6)" }} />

      {/* RIGHT WALL — above door */}
      <div style={{ position:"absolute", right:0, top:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`, background:wallBg, boxShadow:"inset 1px 0 0 rgba(0,0,0,0.6)" }} />
      {/* RIGHT door opening */}
      <div style={{
        position:"absolute", right:0, top:`calc(50% - ${DOOR/2}px)`, width:WALL, height:DOOR,
        background:`linear-gradient(270deg, ${accentR}70, ${accentR}20 60%, transparent)`,
        borderTop:`2px solid ${accentR}`, borderBottom:`2px solid ${accentR}`,
        boxShadow:`inset -2px 0 0 ${accentR}55`,
      }} />
      {/* RIGHT WALL — below door */}
      <div style={{ position:"absolute", right:0, bottom:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`, background:wallBg, boxShadow:"inset 1px 0 0 rgba(0,0,0,0.6)" }} />

      {/* Hallway center light */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 70% 40% at 50% 50%, rgba(255,255,255,0.18), transparent)",
        pointerEvents:"none",
      }} />
    </div>
  );
}

/* =========================================================================
   HCorridor — horizontal strip (row) separating top room from bottom room
   ========================================================================= */
function HCorridor({ accentT, accentB }: { accentT: string; accentB: string }) {
  const DOOR = 34;
  const WALL = 6;
  // Top wall: concrete/stone with top highlight
  const wallTopBg    = "linear-gradient(180deg, #b0aca4 0%, #888480 45%, #605c58 100%)";
  const wallBottomBg = "linear-gradient(0deg,   #b0aca4 0%, #888480 45%, #605c58 100%)";
  return (
    <div
      className="relative"
      style={{
        background: "#9a9690",
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px),
          linear-gradient(0deg,  rgba(255,255,255,0.10) 1px, transparent 1px)
        `,
        backgroundSize: "13px 13px",
      }}
    >
      {/* TOP WALL — left of door */}
      <div style={{ position:"absolute", top:0, left:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`, background:wallTopBg }} />
      {/* TOP door opening */}
      <div style={{
        position:"absolute", top:0, left:`calc(50% - ${DOOR/2}px)`, height:WALL, width:DOOR,
        background:`linear-gradient(180deg, ${accentT}70, ${accentT}20 60%, transparent)`,
        borderLeft:`2px solid ${accentT}`, borderRight:`2px solid ${accentT}`,
        boxShadow:`inset 0 2px 0 ${accentT}55`,
      }} />
      {/* TOP WALL — right of door */}
      <div style={{ position:"absolute", top:0, right:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`, background:wallTopBg }} />

      {/* BOTTOM WALL — left of door */}
      <div style={{ position:"absolute", bottom:0, left:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`, background:wallBottomBg }} />
      {/* BOTTOM door opening */}
      <div style={{
        position:"absolute", bottom:0, left:`calc(50% - ${DOOR/2}px)`, height:WALL, width:DOOR,
        background:`linear-gradient(0deg, ${accentB}70, ${accentB}20 60%, transparent)`,
        borderLeft:`2px solid ${accentB}`, borderRight:`2px solid ${accentB}`,
        boxShadow:`inset 0 -2px 0 ${accentB}55`,
      }} />
      {/* BOTTOM WALL — right of door */}
      <div style={{ position:"absolute", bottom:0, right:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`, background:wallBottomBg }} />

      {/* Hallway center light */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 40% 70% at 50% 50%, rgba(255,255,255,0.18), transparent)",
        pointerEvents:"none",
      }} />
    </div>
  );
}

/* =========================================================================
   CoffeeArea — central break room connecting all corridors
   ========================================================================= */
function CoffeeArea() {
  const amber = "#f59e0b";
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "#b8a480",
        backgroundImage:`
          linear-gradient(90deg, rgba(0,0,0,0.14) 1px, transparent 1px),
          linear-gradient(0deg, rgba(255,255,255,0.10) 1px, transparent 1px)
        `,
        backgroundSize:"10px 10px",
      }}
    >
      {/* Round rug under the table */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: "50%", bottom: "16%",
          transform: "translateX(-50%)",
          width: "74%", height: "52%",
          background: `radial-gradient(ellipse at center, ${amber}28 0%, ${amber}14 40%, transparent 70%)`,
          border: `1px dashed ${amber}33`,
          borderRadius: "50%",
        }}
      />

      {/* Ceiling pendant lamp — glow + cord + shade */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: "50%", top: 0,
          transform: "translateX(-50%)",
          width: "44%", height: "22%",
          background: `radial-gradient(ellipse at 50% 0%, ${amber}55 0%, ${amber}15 40%, transparent 75%)`,
        }}
      />
      <div aria-hidden className="absolute" style={{ left:"50%", top:0, width:2, height:"20%", marginLeft:-1, background:"#2a2c3a" }} />
      <div aria-hidden className="absolute"
        style={{ left:"50%", top:"16%", width:14, height:6, marginLeft:-7,
          background: amber, borderRadius:"0 0 6px 6px",
          boxShadow:`0 0 8px ${amber}99, inset 0 -1px 0 rgba(0,0,0,0.4)` }} />

      {/* Coffee machine top-left */}
      <div className="absolute" style={{ top:"8%", left:"4%", width:"28%", height:"46%" }}>
        <PixelCoffeeMaker accent={amber} />
      </div>

      {/* Plant top-right */}
      <div className="absolute" style={{ top:"4%", right:"4%", width:"22%", height:"44%" }}>
        <PixelPlant />
      </div>

      {/* Round table, centered on the rug */}
      <div className="absolute" style={{ bottom:"14%", left:"50%", transform:"translateX(-50%)", width:"48%", height:"34%" }}>
        <PixelRoundTable accent={amber} />
      </div>

      {/* Two small stools flanking the table */}
      <div aria-hidden className="absolute"
        style={{ left:"10%", bottom:"20%", width:7, height:7,
          background:"#1d2030", borderRadius:"50%",
          boxShadow:`inset 0 0 0 1px ${amber}88, 0 2px 3px rgba(0,0,0,0.6)` }} />
      <div aria-hidden className="absolute"
        style={{ right:"10%", bottom:"20%", width:7, height:7,
          background:"#1d2030", borderRadius:"50%",
          boxShadow:`inset 0 0 0 1px ${amber}88, 0 2px 3px rgba(0,0,0,0.6)` }} />

      {/* Label */}
      <div
        className="absolute bottom-0.5 inset-x-0 text-center pointer-events-none"
        style={{ fontSize:6, color:`${amber}aa`, fontFamily:"ui-monospace,monospace", letterSpacing:"0.14em", fontWeight:"bold" }}
      >
        ☕ BREAK
      </div>
      {/* Corner wall-join blocks (with top-highlight for 3D) */}
      {(["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"] as const).map(c => (
        <div key={c} aria-hidden className={`absolute ${c} w-[6px] h-[6px]`}
          style={{ background:"#605c58", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.25)" }} />
      ))}
    </div>
  );
}

/* =========================================================================
   Main Services component
   ========================================================================= */
const Services = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Click outside closes any active bubble
  useEffect(() => {
    if (!activeId) return;
    const onDocClick = () => setActiveId(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [activeId]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]" />

      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-6">
            ¿En qué puedo ayudarte?
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-3 max-w-2xl mx-auto">
            Bienvenido a mi{" "}
            <span className="text-[var(--text)] font-semibold">oficina agéntica</span>.
            Cada agente trabaja en su despacho — haz clic para escuchar lo que hace.
          </p>
        </Reveal>

        <Reveal replay delayMs={120}>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-dim)] text-center mb-10">
            <span className="inline-block w-2 h-2 align-middle mr-2 rounded-sm bg-emerald-400 animate-pulse" />
            4 agentes online · click para interactuar
          </p>
        </Reveal>

        {/* ── Connected office floor plan ── */}
        <Reveal replay delayMs={160}>
          {/* Perspective wrapper — gives the 70° top-down angle */}
          <div
            className="office-scene"
            style={{
              perspective: "1000px",
              perspectiveOrigin: "50% -5%",
            }}
          >
            <div
              className="office-tilt"
              style={{
                transform: "rotateX(16deg)",
                transformOrigin: "center top",
                willChange: "transform",
              }}
            >
              {/* Outer building shell — thick pixel wall with 3D top cap */}
              <div
                className="office-shell relative"
                style={{
                  background: "linear-gradient(180deg, #c8c4bc 0%, #9a9690 35%, #706c68 100%)",
                  padding: "10px",
                  borderRadius: "2px",
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.40), " +   // top highlight (wall top)
                    "inset 0 -2px 0 rgba(0,0,0,0.4), " +          // bottom shadow
                    "0 0 0 1px #504c48, " +
                    "0 70px 140px -20px rgba(0,0,0,0.75)",
                }}
              >
                {/* Corner bolts (decorative) */}
                {["top-1.5 left-1.5","top-1.5 right-1.5","bottom-1.5 left-1.5","bottom-1.5 right-1.5"].map(pos => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`absolute ${pos} w-1.5 h-1.5 rounded-full`}
                    style={{ background: "#d4d0c8", boxShadow: "inset 0 0 0 1px #807c78" }}
                  />
                ))}

                {/*
                3 × 3 grid:
                [WEB]      [V-corridor] [AI]
                [H-corridor][COFFEE]   [H-corridor]
                [AUTO]     [V-corridor] [AGENTS]
              */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 52px 1fr",
                    gridTemplateRows: "minmax(185px,22vw) 44px minmax(185px,22vw)",
                    background: "#706c68",
                  }}
                >
                  {/* Row 1 */}
                  <Room service={services[0]} idx={0}
                    active={activeId === services[0].id}
                    onToggle={() => setActiveId(p => p === services[0].id ? null : services[0].id)}
                    doorSides={["right","bottom"]} />

                  <VCorridor accentL={services[0].accent} accentR={services[1].accent} />

                  <Room service={services[1]} idx={1}
                    active={activeId === services[1].id}
                    onToggle={() => setActiveId(p => p === services[1].id ? null : services[1].id)}
                    doorSides={["left","bottom"]} />

                  {/* Row 2 */}
                  <HCorridor accentT={services[0].accent} accentB={services[2].accent} />
                  <CoffeeArea />
                  <HCorridor accentT={services[1].accent} accentB={services[3].accent} />

                  {/* Row 3 */}
                  <Room service={services[2]} idx={2}
                    active={activeId === services[2].id}
                    onToggle={() => setActiveId(p => p === services[2].id ? null : services[2].id)}
                    doorSides={["right","top"]} />

                  <VCorridor accentL={services[2].accent} accentR={services[3].accent} />

                  <Room service={services[3]} idx={3}
                    active={activeId === services[3].id}
                    onToggle={() => setActiveId(p => p === services[3].id ? null : services[3].id)}
                    doorSides={["left","top"]} />
                </div>

                {/* Floor-plan footer label */}
                <div
                  className="flex items-center justify-center gap-3 mt-[7px]"
                  style={{ borderTop: "1px solid #9a9690" }}
                >
                  <span
                    className="block text-[9px] tracking-[0.2em] uppercase py-1.5"
                    style={{ color: "#706c68", fontFamily: "ui-monospace, monospace" }}
                  >
                    Planta&nbsp;1&nbsp;·&nbsp;Oficina&nbsp;Agéntica&nbsp;·&nbsp;4&nbsp;despachos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shadow cast on the page below the tilted building */}
          <div
            aria-hidden
            style={{
              height: "40px",
              marginTop: "-10px",
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,0,0,0.55) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </Reveal>
      </div>

      <style jsx>{`
        /* On small screens skip the tilt so rooms stay readable */
        @media (max-width: 639px) {
          .office-tilt {
            transform: none !important;
          }
          .office-scene {
            perspective: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;
