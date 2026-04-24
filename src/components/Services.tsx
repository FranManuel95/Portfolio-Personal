"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
//   24×36 high-res sprite (4-frame walk cycle).
const devRows = [
  "........hhhhhhhh........", // 0  hair top
  ".......hhhhhhhhhh.......", // 1  hair sides
  ".......hhSSSSSShh.......", // 2  forehead under hair
  "......hhSSSSSSSShh......", // 3  face top
  "......hSSKWWWWKSSh......", // 4  eyes with glasses (K=frame, W=lens)
  "......hSSKkWWkKSSh......", // 5  pupils (k=pupil)
  "......hSSSSSSSSSh.......", // 6  cheeks
  ".......sSMMMMSSs........", // 7  mouth area
  "........SSSSSSSS........", // 8  neck
  ".......BBBBBBBBBB.......", // 9  collar
  "......BBBBBBBBBBBB......", // 10 upper shoulders
  ".....SBBBBBBBBBBBBS.....", // 11 arms + hands
  ".....SBBBBBBBBBBBBS.....", // 12 arms
  "......BBBBBBBBBBBB......", // 13 torso
  "......BBBBBBBBBBBB......", // 14 torso
  "......BBBBBBBBBBBB......", // 15 torso lower
  "......JJJJJJJJJJJJ......", // 16 belt/waist (hips together)
  "......JJJJJJJJJJJJ......", // 17 upper legs together
  ".....JJJJJ..JJJJJ.......", // 18 legs split (5px each, 2px gap)
  ".....JJJJJ..JJJJJ.......", // 19
  ".....JJJJJ..JJJJJ.......", // 20
  ".....JJJJJ..JJJJJ.......", // 21
  ".....jjjjj..jjjjj.......", // 22 leg shadow
  ".....jjjjj..jjjjj.......", // 23
  ".....NNNNN..NNNNN.......", // 24 shoes dark
  ".....NNNNN..NNNNN.......", // 25
  ".....NNNNN..NNNNN.......", // 26
  ".....wwwww..wwwww.......", // 27 sneaker soles
  ".....wwwww..wwwww.......", // 28
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

// ── DEV walking frames — 29 rows (no padding), arm swing on rows 11-12 ──
const devWalkARows: string[] = [
  ...devRows.slice(0, 11),              // 0–10 head + upper torso
  "....SSBBBBBBBBBBBBS.....",           // 11 left arm swings fwd (+1 px left)
  "....SSBBBBBBBBBBBBS.....",           // 12
  ...devRows.slice(13, 18),             // 13–17 lower torso + waist
  "....JJJJJ....JJJJJ......",          // 18 stride A — legs wider
  "....JJJJJ....JJJJJ......",          // 19
  "....JJJJJ....JJJJJ......",          // 20
  "....JJJJJ....JJJJJ......",          // 21
  "....jjjjj....jjjjj......",          // 22 leg shadow
  "....jjjjj....jjjjj......",          // 23
  "....NNNNN....NNNNN......",          // 24 shoe
  "....NNNNN....NNNNN......",          // 25
  "....NNNNN....NNNNN......",          // 26
  "....wwwww....wwwww......",          // 27 sole
  "....wwwww....wwwww......",          // 28
];
const devWalkBRows: string[] = [
  ...devRows.slice(0, 11),              // 0–10 head + upper torso
  ".....SBBBBBBBBBBBSS.....",           // 11 right arm swings fwd (+1 px right)
  ".....SBBBBBBBBBBBSS.....",           // 12
  ...devRows.slice(13, 18),             // 13–17 lower torso + waist
  "......JJJJJ....JJJJJ....",          // 18 stride B — legs mirrored
  "......JJJJJ....JJJJJ....",          // 19
  "......JJJJJ....JJJJJ....",          // 20
  "......JJJJJ....JJJJJ....",          // 21
  "......jjjjj....jjjjj....",          // 22
  "......jjjjj....jjjjj....",          // 23
  "......NNNNN....NNNNN....",          // 24
  "......NNNNN....NNNNN....",          // 25
  "......NNNNN....NNNNN....",          // 26
  "......wwwww....wwwww....",          // 27
  "......wwwww....wwwww....",          // 28
];
const devSitRows: string[] = [
  ...devRows.slice(0, 16),
  "...JJJJJJJJJJJJJJ.......", // 16 thighs spread (14px)
  "....JJJJJ......JJJJJ....", // 17 knees apart
  "....NNN..........NNN....", // 18 shoe tops visible
  "....www..........www....", // 19 sole edges
  "........................", // 20-35 feet hidden under desk
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
];

// ── AI walking frames (arm swing on rows 11-12, heel shift on rows 18-21) ──
const aiWalkARows: string[] = [
  ...aiRows.slice(0, 11),
  ".SVVWWWWVVS.....",  // 11 left arm swings fwd (+1 px left)
  ".SVVVVVVVVS.....",  // 12
  ...aiRows.slice(13, 17),
  "....SSSSSS......", // 17 thigh row unchanged
  "....SS...SS.....", // 18 right leg +1 (3-dot gap)
  "....SS...SS.....", // 19
  "...XXX...XXX....", // 20 right heel +1
  "...XX.....XX....", // 21 right heel tip +1
];
const aiWalkBRows: string[] = [
  ...aiRows.slice(0, 11),
  "..SVVWWWWVVSS...",  // 11 right arm swings fwd (+1 px right)
  "..SVVVVVVVVSS...",  // 12
  ...aiRows.slice(13, 17),
  "....SSSSSS......", // 17
  "...SS...SS......", // 18 left leg -1 (3-dot gap)
  "...SS...SS......", // 19
  "..XXX...XXX.....", // 20 left heel -1
  "..XX.....XX.....", // 21 left heel tip -1
];
const aiSitRows: string[] = [
  ...aiRows.slice(0, 17),
  "....SSSSSSSS....", // 17 thighs spread wider
  "...SSS....SSS...", // 18 legs apart (4-dot gap)
  "...XXX....XXX...", // 19 heel tops visible
  "...XX......XX...", // 20 heel tips
  "................", // 21 feet hidden under desk
];

// ── AUTO walking frames (arm swing on rows 10-11, leg shift on rows 16-21) ──
const autoWalkARows: string[] = [
  ...autoRows.slice(0, 10),
  ".SOOOOOOOOS.....",  // 10 left arm swings fwd (+1 px left)
  ".SOOOOOOOOS.....",  // 11
  ...autoRows.slice(12, 16),
  "...GGG...GGG....", // 16 right leg +1 (3-dot gap)
  "...GGG...GGG....", // 17
  "...ggg...ggg....", // 18 shadow follows
  "..CCCC...CCCC...", // 19 right shoe +1
  "..CCCC...CCCC...", // 20
  "..wwww...wwww...", // 21
];
const autoWalkBRows: string[] = [
  ...autoRows.slice(0, 10),
  "..SOOOOOOOOSS...",  // 10 right arm swings fwd (+1 px right)
  "..SOOOOOOOOSS...",  // 11
  ...autoRows.slice(12, 16),
  "..GGG...GGG.....", // 16 left leg -1 (3-dot gap)
  "..GGG...GGG.....", // 17
  "..ggg...ggg.....", // 18
  ".CCCC...CCCC....", // 19 left shoe -1
  ".CCCC...CCCC....", // 20
  ".wwww...wwww....", // 21
];
const autoSitRows: string[] = [
  ...autoRows.slice(0, 15),
  "..GGGGGGGGGG....", // 15 thighs spread wider (10 px)
  ".GGGG....GGGG...", // 16 knees apart (4-dot gap)
  "..CCC....CCC....", // 17 shoe tops visible
  "..www....www....", // 18 sole edges
  "................", // 19
  "................", // 20
  "................", // 21
];

// ── AGENT walking frames (arm swing on rows 10-11, heel shift on rows 18-21) ──
const agentWalkARows: string[] = [
  ...agentRows.slice(0, 10),
  ".SRRRRRRRRS.....",  // 10 left arm swings fwd (+1 px left)
  ".SRRRRRRRRS.....",  // 11
  ...agentRows.slice(12, 18),
  "....SS...SS.....", // 18 right leg +1 (3-dot gap)
  "...XXX...XXX....", // 19 right heel +1
  "...XX.....XX....", // 20 right heel tip +1
  "................", // 21
];
const agentWalkBRows: string[] = [
  ...agentRows.slice(0, 10),
  "..SRRRRRRRRSS...",  // 10 right arm swings fwd (+1 px right)
  "..SRRRRRRRRSS...",  // 11
  ...agentRows.slice(12, 18),
  "...SS...SS......", // 18 left leg -1 (3-dot gap)
  "..XXX...XXX.....", // 19 left heel -1
  "..XX.....XX.....", // 20 left heel tip -1
  "................", // 21
];
const agentSitRows: string[] = [
  ...agentRows.slice(0, 18),
  "....SSSSSSSS....", // 18 thighs spread wider
  "...SSS....SSS...", // 19 legs apart (4-dot gap)
  "...XXX....XXX...", // 20 heel tops visible
  "...XX......XX...", // 21 heel tips
];

/* =========================================================================
   Character behavior state machine — waypoints the agent visits in a loop.
   Each waypoint defines: where to go, how long travel takes, and what pose
   to adopt while there (walk / sit / stand / idle / at-door).
   ========================================================================= */
type CharPose = "walking" | "sitting" | "standing" | "idle" | "at-door";
type Waypoint = {
  /** horizontal position inside the room (0–100 %) */
  leftPct: number;
  /** vertical position anchored from bottom (default) or top if topPct is set */
  bottomPct?: number;
  topPct?: number;
  pose: CharPose;
  /** ms the actor dwells at this waypoint after arriving */
  dwellMs: number;
  /** ms to travel from the previous waypoint (sets CSS transition duration) */
  travelMs: number;
  /** true = facing left (mirror sprite) */
  flip?: boolean;
  /** optional zIndex override (e.g. behind desk when sitting) */
  zIndex?: number;
};

/* Shared loop — 8 waypoints with X+Y movement for 3D depth illusion.
   bottomPct controls depth: low (near 3%) = front of room = larger scale;
   high (near 38%) = back of room near wall = smaller scale + higher zIndex layer. */
const DEFAULT_WAYPOINTS: Waypoint[] = [
  // 0 — stroll across mid-depth
  { leftPct: 70, bottomPct: 5,  pose: "walking",  dwellMs: 400,  travelMs: 3800, flip: false },
  // 1 — head toward back-left (desk area, going away from viewer)
  { leftPct: 28, bottomPct: 22, pose: "walking",  dwellMs: 300,  travelMs: 2800, flip: true  },
  // 2 — sit at desk (topPct anchors above desk, zIndex behind it)
  { leftPct: 26, topPct: 44,   pose: "sitting",   dwellMs: 7500, travelMs: 700,  flip: false, zIndex: 0 },
  // 3 — stand up, still near desk (back area)
  { leftPct: 30, bottomPct: 20, pose: "standing", dwellMs: 300,  travelMs: 450,  flip: false },
  // 4 — walk diagonally forward-right toward door opening
  { leftPct: 82, bottomPct: 2,  pose: "at-door",  dwellMs: 2600, travelMs: 2800, flip: false },
  // 5 — walk back toward front-centre (coming toward viewer)
  { leftPct: 44, bottomPct: 1,  pose: "walking",  dwellMs: 500,  travelMs: 2800, flip: true  },
  // 6 — wander to far corner (back-left, near plant)
  { leftPct: 8,  bottomPct: 24, pose: "idle",     dwellMs: 1800, travelMs: 3200, flip: true  },
  // 7 — come back forward
  { leftPct: 36, bottomPct: 4,  pose: "walking",  dwellMs: 400,  travelMs: 2600, flip: false },
];

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
  /** Terminal log lines shown in the TerminalLog panel */
  logs: string[];
  sprite: {
    rows: string[];
    walkA: string[];
    walkB: string[];
    sit: string[];
    palette: Palette;
  };
  /** Optional: when PNG sprite sheets are available, use these instead of SVG */
  imageSprite?: {
    walkSrc: string;      // path e.g. "/sprites/dev-walk.png"
    idleSrc?: string;     // path for idle animation
    sitSrc?: string;      // path for sitting
    frameW: number;       // single frame width in px
    frameH: number;       // single frame height in px
    walkFrames: number;   // frames in walk cycle
    idleFrames?: number;
    sitFrames?: number;
    fps?: number;
  };
  /** multiplier for waypoint durations (<1 faster, >1 slower) so rooms desync */
  paceFactor: number;
  /** initial waypoint index (staggers where each agent starts in the loop) */
  startIdx: number;
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
    logs: [
      "Analyzing stack requirements...",
      "npm install next@15 ✓",
      "FILE_EDIT: /app/page.tsx · +42 lines",
      "Build successful · Deploy ready ✓",
    ],
    sprite: { rows: devRows, walkA: devWalkARows, walkB: devWalkBRows, sit: devSitRows, palette: devPalette },
    paceFactor: 1.0,
    startIdx: 0,
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
    logs: [
      "Loading knowledge base vectors...",
      "RAG pipeline initialized ✓",
      "Multi-model router: OpenAI→Claude→fallback",
      "Response quality score: 94% ✓",
    ],
    sprite: { rows: aiRows, walkA: aiWalkARows, walkB: aiWalkBRows, sit: aiSitRows, palette: aiPalette },
    paceFactor: 1.15,
    startIdx: 2,
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
    logs: [
      "n8n workflow triggered ✓",
      "Webhook received: 3 events",
      "FILE_EDIT: pipeline.json · Processing...",
      "Emails dispatched · 100% success ✓",
    ],
    sprite: { rows: autoRows, walkA: autoWalkARows, walkB: autoWalkBRows, sit: autoSitRows, palette: autoPalette },
    paceFactor: 0.85,
    startIdx: 4,
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
    logs: [
      "Voice agent online · VAPI connected ✓",
      "CRM sync: Salesforce linked",
      "Memory context loaded: 2400 tokens",
      "Agent handoff: human-in-loop ready ✓",
    ],
    sprite: { rows: agentRows, walkA: agentWalkARows, walkB: agentWalkBRows, sit: agentSitRows, palette: agentPalette },
    paceFactor: 1.05,
    startIdx: 6,
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

/**
 * AnimatedPixelSprite — pre-renders all animation frames once via useMemo.
 * Frame switching only updates a single `display` attribute — no rect recreation,
 * no flicker. Two SVGs (walk / sit) are always in the DOM; one is hidden via CSS.
 */
function AnimatedPixelSprite({
  sprite,
  palette,
  walkFrame,
  pose,
  className,
}: {
  sprite: Service["sprite"];
  palette: Palette;
  walkFrame: 0 | 1 | 2 | 3;
  pose: CharPose;
  className?: string;
}) {
  // All four frame sets are module-level constants — these useMemos run once at mount.
  const idleRects  = useMemo(() => spriteRects(sprite.rows,  palette), [sprite.rows,  palette]);
  const walkARects = useMemo(() => spriteRects(sprite.walkA, palette), [sprite.walkA, palette]);
  const walkBRects = useMemo(() => spriteRects(sprite.walkB, palette), [sprite.walkB, palette]);
  const sitRects   = useMemo(() => spriteRects(sprite.sit,   palette), [sprite.sit,   palette]);

  const isSitting = pose === "sitting";
  const w = sprite.rows[0]?.length ?? 16;

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Walk / idle SVG — always mounted, hidden when sitting.
          preserveAspectRatio="xMidYMax meet" anchors sprite to container bottom
          so the feet always touch the floor regardless of container height. */}
      <svg
        viewBox={`0 0 ${w} ${sprite.rows.length}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMax meet"
        style={{ imageRendering: "pixelated", display: isSitting ? "none" : "block", position: "absolute", inset: 0 }}
        aria-hidden
      >
        <g display={walkFrame === 1 ? "none" : walkFrame === 3 ? "none" : "block"}>{idleRects}</g>
        <g display={walkFrame === 1 ? "block" : "none"}>{walkARects}</g>
        <g display={walkFrame === 3 ? "block" : "none"}>{walkBRects}</g>
      </svg>
      {/* Sit SVG — always mounted, visible only when sitting */}
      <svg
        viewBox={`0 0 ${w} ${sprite.sit.length}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMax meet"
        style={{ imageRendering: "pixelated", display: isSitting ? "block" : "none", position: "absolute", inset: 0 }}
        aria-hidden
      >
        {sitRects}
      </svg>
    </div>
  );
}

/**
 * ImageSprite — renders an animated PNG sprite sheet, scaling to fill its container.
 * The sprite strip is positioned as an <img> that is frameCount times wider than the
 * container; translateX(-frame/frameCount * 100%) clips to the correct frame.
 * row: which vertical row in the sheet (0 = top).
 */
function ImageSprite({
  src,
  frameCount,
  fps = 8,
  row = 0,
  style,
  className,
}: {
  src: string;
  frameW?: number;
  frameH?: number;
  frameCount: number;
  fps?: number;
  row?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frameCount);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [frameCount, fps]);

  // The img is frameCount× wider than the container; shift left by frame×100/frameCount%
  // to show the correct frame. translateX uses % of the img's own width so we need
  // to compute relative to the container: each frame = containerWidth, img = frameCount×containerWidth,
  // so shift = frame × containerWidth = frame × (1/frameCount) × imgWidth → frame/frameCount × 100% of img.
  return (
    <div
      className={className}
      style={{ overflow: "hidden", width: "100%", height: "100%", position: "relative", ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        style={{
          imageRendering: "pixelated",
          position: "absolute",
          left: `${-frame * 100}%`,
          top: `${-row * 100}%`,
          width: `${frameCount * 100}%`,
          height: "auto",
          display: "block",
        }}
      />
    </div>
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
      {/* Top highlight + side light */}
      <rect x="0"  y="0"  width="24" height="1"  fill="#8b6040" shapeRendering="crispEdges" />
      <rect x="0"  y="0"  width="1"  height="32" fill="#6a4828" shapeRendering="crispEdges" />
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
      {/* Top face + left highlight */}
      <rect x="0" y="0"  width="16" height="1"  fill="#3a3e4a" shapeRendering="crispEdges" />
      <rect x="0" y="0"  width="1"  height="32" fill="#25282e" shapeRendering="crispEdges" />
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
      {/* Top edge highlight */}
      <rect x="0"  y="0"  width="28" height="1"  fill="#5a5a74" shapeRendering="crispEdges" />
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
      {/* Top face + left highlight */}
      <rect x="0"  y="0"  width="14" height="1"  fill="#454a60" shapeRendering="crispEdges" />
      <rect x="0"  y="0"  width="1"  height="26" fill="#2d3145" shapeRendering="crispEdges" />
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
      <defs>
        {/* Bright inner glow at lamp bulb — warm white core */}
        <radialGradient id="lampBulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.0" />
          <stop offset="30%"  stopColor="#fffbe0" stopOpacity="0.9" />
          <stop offset="70%"  stopColor={accent}  stopOpacity="0.7" />
          <stop offset="100%" stopColor={accent}  stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Shade body — solid vivid accent fill */}
      <rect x="0"  y="0"  width="12" height="6"  fill={accent}  shapeRendering="crispEdges" />
      {/* Shade top edge highlight */}
      <rect x="1"  y="0"  width="10" height="1"  fill="#ffffff" opacity="0.45" shapeRendering="crispEdges" />
      {/* Shade inner warm-white band */}
      <rect x="1"  y="1"  width="10" height="2"  fill="#fffde8" opacity="0.65" shapeRendering="crispEdges" />
      {/* Shade lower rim glow */}
      <rect x="1"  y="4"  width="10" height="2"  fill="#ffffff" opacity="0.40" shapeRendering="crispEdges" />
      {/* Bulb warm glow visible through shade opening */}
      <rect x="3"  y="1"  width="6"  height="5"  fill="url(#lampBulbGlow)" shapeRendering="crispEdges" />
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

/* ─── Wall decorations — small pixel art poster / diagram per room type ─── */

/** Web room: terminal code snippet */
function WallDecoWeb({ accent }: { accent: string }) {
  const lines = ["#  app/page.tsx", "export default function Page() {", "  return <Hero />", "}", "$ npm run build ✓"];
  return (
    <svg viewBox="0 0 64 40" width="100%" height="100%" style={{ imageRendering:"pixelated" }} aria-hidden>
      <rect x="0" y="0" width="64" height="40" fill="#0d1117" shapeRendering="crispEdges"/>
      <rect x="0" y="0" width="64" height="1"  fill={accent} opacity="0.7" shapeRendering="crispEdges"/>
      {/* traffic lights */}
      {[4,10,16].map((x,i) => <rect key={i} x={x} y="3" width="3" height="2" fill={["#ff5f56","#ffbd2e","#27c93f"][i]} shapeRendering="crispEdges"/>)}
      {lines.map((l, i) => (
        <text key={i} x="3" y={12 + i * 6} fontSize="4" fill={i===0?"#8b949e":i===4?"#3fb950":accent} fontFamily="monospace">{l}</text>
      ))}
    </svg>
  );
}

/** AI room: neural network diagram */
function WallDecoAI({ accent }: { accent: string }) {
  const nodes: [number, number][] = [[8,8],[8,20],[8,32],[28,5],[28,14],[28,24],[28,33],[48,14],[48,26]];
  const edges: [number,number,number,number][] = [
    [8,8,28,5],[8,8,28,14],[8,20,28,14],[8,20,28,24],[8,32,28,24],[8,32,28,33],
    [28,5,48,14],[28,14,48,14],[28,24,48,26],[28,33,48,26],
  ];
  return (
    <svg viewBox="0 0 56 40" width="100%" height="100%" style={{ imageRendering:"pixelated" }} aria-hidden>
      <rect x="0" y="0" width="56" height="40" fill="#110a1e" shapeRendering="crispEdges"/>
      {edges.map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="0.5" strokeOpacity="0.5"/>)}
      {nodes.map(([x,y],i) => <rect key={i} x={x-2} y={y-2} width="4" height="4" fill={accent} shapeRendering="crispEdges"/>)}
      <text x="28" y="38" fontSize="3.5" fill={accent} opacity="0.6" fontFamily="monospace" textAnchor="middle">Neural Network</text>
    </svg>
  );
}

/** Auto room: workflow / flowchart */
function WallDecoAuto({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 56 40" width="100%" height="100%" style={{ imageRendering:"pixelated" }} aria-hidden>
      <rect x="0" y="0" width="56" height="40" fill="#1a0e06" shapeRendering="crispEdges"/>
      {/* boxes */}
      {([[4,3,20,9],[4,16,20,9],[4,29,20,9],[34,10,20,9],[34,23,20,9]] as [number,number,number,number][]).map(([x,y,w,h],i)=>(
        <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke={accent} strokeWidth="0.8" shapeRendering="crispEdges" opacity="0.8"/>
      ))}
      {/* arrows */}
      <line x1="14" y1="12" x2="14" y2="16" stroke={accent} strokeWidth="0.8" opacity="0.7"/>
      <line x1="14" y1="25" x2="14" y2="29" stroke={accent} strokeWidth="0.8" opacity="0.7"/>
      <line x1="24" y1="7"  x2="34" y2="14" stroke={accent} strokeWidth="0.8" opacity="0.7"/>
      <line x1="24" y1="21" x2="34" y2="27" stroke={accent} strokeWidth="0.8" opacity="0.7"/>
      {/* labels */}
      <text x="14" y="9"  fontSize="3" fill={accent} fontFamily="monospace" textAnchor="middle">TRIGGER</text>
      <text x="14" y="22" fontSize="3" fill={accent} fontFamily="monospace" textAnchor="middle">PROCESS</text>
      <text x="14" y="35" fontSize="3" fill={accent} fontFamily="monospace" textAnchor="middle">OUTPUT</text>
      <text x="44" y="16" fontSize="3" fill={accent} fontFamily="monospace" textAnchor="middle">n8n</text>
      <text x="44" y="29" fontSize="3" fill={accent} fontFamily="monospace" textAnchor="middle">API</text>
    </svg>
  );
}

/** Agents room: voice waveform */
function WallDecoAgents({ accent }: { accent: string }) {
  const wave = [4,8,14,20,16,10,6,12,18,22,16,10,6,10,14,18,12,8,4,8];
  return (
    <svg viewBox="0 0 56 40" width="100%" height="100%" style={{ imageRendering:"pixelated" }} aria-hidden>
      <rect x="0" y="0" width="56" height="40" fill="#061410" shapeRendering="crispEdges"/>
      {/* waveform bars */}
      {wave.map((h, i) => (
        <rect key={i} x={2 + i * 2.6} y={20 - h / 2} width="2" height={h} fill={accent} opacity={0.6 + i/wave.length*0.4} shapeRendering="crispEdges"/>
      ))}
      {/* centre line */}
      <line x1="2" y1="20" x2="54" y2="20" stroke={accent} strokeWidth="0.4" opacity="0.3"/>
      <text x="28" y="36" fontSize="3.5" fill={accent} opacity="0.7" fontFamily="monospace" textAnchor="middle">VOICE AGENT ONLINE</text>
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
        // Floor lamp — mid-right (with floor pool glow below it)
        {
          top: "34%", right: "14%", width: "5%", height: "26%",
          node: (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <PixelLamp accent={a} />
              {/* Floor pool glow — cast ~20px below lamp base onto floor */}
              <div aria-hidden style={{
                position: "absolute",
                left: "50%", top: "calc(100% + 4px)",
                transform: "translateX(-50%)",
                width: "240%", height: "60px",
                background: `radial-gradient(ellipse at 50% 10%, ${a}55 0%, ${a}22 40%, transparent 75%)`,
                filter: "blur(4px)",
                pointerEvents: "none",
              }} />
            </div>
          ),
        },
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

/* Badge config per pose */
function PoseBadge({ pose }: { pose: CharPose }) {
  const config: Record<CharPose, { dot: string; label: string }> = {
    walking:  { dot: "#f59e0b", label: "WALKING" },
    sitting:  { dot: "#60a5fa", label: "WORKING" },
    "at-door":{ dot: "#34d399", label: "BREAK"   },
    idle:     { dot: "#6b7280", label: "IDLE"     },
    standing: { dot: "#6b7280", label: "IDLE"     },
  };
  const { dot, label } = config[pose] ?? config.idle;
  return (
    <div
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        padding: "2px 5px",
        borderRadius: "999px",
        background: "rgba(0,0,0,0.42)",
        border: "1px solid rgba(255,255,255,0.10)",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        fontSize: "clamp(7px, 1.1vw, 9px)",
        color: "#e0e0e8",
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      <span style={{
        display: "inline-block",
        width: 5, height: 5,
        borderRadius: "50%",
        background: dot,
        boxShadow: `0 0 4px ${dot}`,
        flexShrink: 0,
      }} />
      {label}
    </div>
  );
}

/* =========================================================================
   TerminalLog — CRT-style activity log panel (replaces speech bubble)
   ========================================================================= */
function TerminalLog({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const allLines = service.logs;
  const fullText = allLines.map((l) => `> ${l}`).join("\n");

  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);

  // Reset when service changes (different room opened)
  useEffect(() => {
    idxRef.current = 0;
    setDisplayed("");
    setDone(false);
  }, [service.id]);

  // Typewriter: advance one character every 18ms
  useEffect(() => {
    if (done) return;
    if (idxRef.current >= fullText.length) {
      setDone(true);
      return;
    }
    const timer = setTimeout(() => {
      idxRef.current += 1;
      setDisplayed(fullText.slice(0, idxRef.current));
    }, 18);
    return () => clearTimeout(timer);
  }, [displayed, done, fullText]);

  return (
    <div
      role="dialog"
      aria-label={`${service.title} — terminal log`}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: "4%",
        right: "4%",
        top: "4%",
        height: "55%",
        background: "#0d0f14",
        border: `1px solid ${service.accent}`,
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 30,
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
        boxShadow: `0 0 18px ${service.accent}44, 0 4px 24px rgba(0,0,0,0.7)`,
      }}
    >
      {/* Scanline overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 8px",
          background: `${service.accent}1a`,
          borderBottom: `1px solid ${service.accent}55`,
          flexShrink: 0,
          zIndex: 2,
        }}
      >
        <span
          style={{
            color: "#4ade80",
            fontSize: "clamp(7px, 1.15vw, 10px)",
            letterSpacing: "0.05em",
            lineHeight: 1.2,
          }}
        >
          {`[AGENTE: ${service.title}] [ROLE: ${service.role}]`}
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "0.55em",
              height: "1.1em",
              background: "#4ade80",
              marginLeft: "3px",
              verticalAlign: "text-bottom",
              animation: "termCursorBlink 1s steps(1) infinite",
            }}
          />
        </span>
        <button
          onClick={onClose}
          aria-label="Cerrar terminal"
          style={{
            background: "transparent",
            border: `1px solid ${service.accent}88`,
            color: service.accent,
            fontFamily: "inherit",
            fontSize: "clamp(7px, 1.1vw, 9px)",
            padding: "1px 5px",
            cursor: "pointer",
            letterSpacing: "0.05em",
            lineHeight: 1,
            borderRadius: "2px",
          }}
        >
          [X]
        </button>
      </div>

      {/* Log body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <pre
          style={{
            margin: 0,
            color: "#a0e8a0",
            fontSize: "clamp(7px, 1.1vw, 9px)",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {displayed.split("\n").map((line, i) => {
            const accentPattern = /(✓|FILE_EDIT:[^\s·]+|[\d]+%)/g;
            const parts = line.split(accentPattern);
            return (
              <span key={i} style={{ display: "block" }}>
                {parts.map((part, j) =>
                  accentPattern.test(part) ? (
                    <span key={j} style={{ color: service.accent, fontWeight: "bold" }}>
                      {part}
                    </span>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </span>
            );
          })}
        </pre>
        {done && (
          <div
            style={{
              marginTop: "6px",
              color: "#4ade80",
              fontSize: "clamp(7px, 1.1vw, 9px)",
              fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
          >
            [TASK COMPLETE ✓]
          </div>
        )}

        {/* Capabilities list — shown after typewriter finishes */}
        {done && (
          <div style={{ marginTop: "10px", borderTop: `1px solid ${service.accent}33`, paddingTop: "8px" }}>
            <div style={{ color: service.accent, fontSize: "clamp(6px, 1vw, 8px)", letterSpacing: "0.08em", marginBottom: "5px" }}>
              {"// CAPABILITIES"}
            </div>
            {service.items.map((item, i) => (
              <div key={i} style={{ color: "#7ec8a0", fontSize: "clamp(6px, 1vw, 8px)", lineHeight: 1.7 }}>
                <span style={{ color: service.accent, marginRight: "5px" }}>→</span>{item}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes termCursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Room({
  service,
  active,
  onToggle,
  doorSides = [],
}: {
  service: Service;
  active: boolean;
  onToggle: () => void;
  doorSides?: Array<"right" | "bottom" | "left" | "top">;
}) {
  const charRef = useRef<HTMLButtonElement | null>(null);
  const [currentPose, setCurrentPose] = useState<CharPose>(
    DEFAULT_WAYPOINTS[service.startIdx % DEFAULT_WAYPOINTS.length].pose
  );

  const furniture = useMemo(() => getRoomFurniture(service), [service]);

  // Wall/floor split — taller wall shows more 3D volume
  const SPLIT = 38;

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
          ? `inset 0 0 0 2px ${service.accent}aa, inset 0 0 30px ${service.accent}22`
          : `inset 0 0 0 1px rgba(255,255,255,0.04)`,
        transition: "box-shadow .3s var(--ease)",
      }}
    >
      {/* Wall top face — bright band catching ceiling light (top of wall as seen from angle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "9px",
          background: `linear-gradient(180deg,
            rgba(255,255,255,0.55) 0%,
            rgba(255,255,255,0.32) 35%,
            rgba(255,255,255,0.10) 70%,
            rgba(0,0,0,0.45) 100%)`,
          borderBottom: `1px solid rgba(0,0,0,0.55)`,
          zIndex: 1,
        }}
      />

      {/* Wall vertical shading — gives the back wall solid mass with stronger 3D */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: "9px",
          height: `calc(${SPLIT}% - 9px)`,
          background: `linear-gradient(180deg,
            rgba(255,255,255,0.08) 0%,
            rgba(0,0,0,0.05) 30%,
            rgba(0,0,0,0.28) 80%,
            rgba(0,0,0,0.55) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Wall texture — subtle horizontal panel striping every ~8% of height */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: 0,
          height: `${SPLIT}%`,
          backgroundImage: `repeating-linear-gradient(
            180deg,
            transparent 0px,
            transparent calc(8% - 1px),
            rgba(0,0,0,0.10) calc(8% - 1px),
            rgba(0,0,0,0.10) 8%
          )`,
          zIndex: 2,
        }}
      />

      {/* Wall side-corner shadows (ambient occlusion) — thin triangular shadows at back corners */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-0"
        style={{ width: "8px", height: `${SPLIT}%`,
          background: "linear-gradient(90deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 50%, transparent 100%)",
          zIndex: 3 }} />
      <div aria-hidden className="pointer-events-none absolute top-0 right-0"
        style={{ width: "8px", height: `${SPLIT}%`,
          background: "linear-gradient(270deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.20) 50%, transparent 100%)",
          zIndex: 3 }} />

      {/* Floor ambient occlusion — wall casts shadow onto floor below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0"
        style={{ top: `${SPLIT}%`, height: "14px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
          zIndex: 1 }} />

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

      {/* Baseboard — chunky strip at wall/floor junction with accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: `calc(${SPLIT}% - 2px)`,
          height: "5px",
          background: `linear-gradient(180deg,
            ${service.accent}66 0%,
            ${service.accent}44 50%,
            rgba(0,0,0,0.4) 100%)`,
          boxShadow: `0 2px 8px ${service.accent}55, inset 0 1px 0 ${service.accent}88`,
          zIndex: 2,
        }}
      />

      {/* Floor — warm oak planks running left-right with perspective compression */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0"
        style={{ top:`${SPLIT}%`, bottom:0,
          backgroundImage:`
            linear-gradient(90deg,
              rgba(0,0,0,0.22) 1px, transparent 1px,
              transparent 27px,
              rgba(255,255,255,0.07) 27px, transparent 28px),
            linear-gradient(180deg,
              rgba(0,0,0,0.0) 0px,
              rgba(0,0,0,0.0) 8px,
              rgba(0,0,0,0.14) 9px,
              rgba(0,0,0,0.0) 10px)
          `,
          backgroundSize: "28px 10px",
        }} />
      {/* Floor vignette — brighter near wall, darker at front */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0"
        style={{ top:`${SPLIT}%`, bottom:0,
          background:`linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(0,0,0,0.18) 100%)` }} />

      {/* Per-room accent ambient tint — subtle coloured wash from room's identity colour */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0"
        style={{ top:`${SPLIT}%`, bottom:0,
          background: `${service.accent}10`,
          zIndex: 0 }} />

      {/* Sunlight beam from window — triangular warm cone on floor */}
      <div aria-hidden className="pointer-events-none absolute"
        style={{ right:"4%", top:`${SPLIT}%`, bottom:0, width:"42%",
          background:`linear-gradient(160deg, rgba(255,240,160,0.20) 0%, rgba(255,235,140,0.06) 50%, transparent 75%)`,
          clipPath:"polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%)",
          zIndex:0 }} />

      {/* Ceiling light fixture — rectangular glowing strip + warm light cone onto floor */}
      {/* Strip fixture on back wall */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "30%",
          height: "4px",
          background: `linear-gradient(90deg, transparent 0%, rgba(255,240,200,0.9) 20%, rgba(255,248,220,1) 50%, rgba(255,240,200,0.9) 80%, transparent 100%)`,
          boxShadow: `0 0 8px 2px rgba(255,235,180,0.7), 0 0 2px 1px ${service.accent}88`,
          borderRadius: "2px",
          zIndex: 2,
        }}
      />
      {/* Light cone fanning down from fixture — amber-white warm */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: `${SPLIT - 6}%`,
          background: `linear-gradient(180deg,
            rgba(255,235,160,0.22) 0%,
            rgba(255,235,160,0.10) 40%,
            rgba(255,235,160,0.04) 70%,
            transparent 100%)`,
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
          zIndex: 1,
        }}
      />
      {/* Floor illumination pool from overhead light */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: `${SPLIT}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "30%",
          background: `radial-gradient(ellipse at 50% 0%, rgba(255,235,160,0.18) 0%, ${service.accent}08 40%, transparent 75%)`,
          zIndex: 1,
        }}
      />

      {/* Window on back wall — sky-blue interior glow, visible cross-pane dividers */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: "22%",
          top: "6%",
          width: "20%",
          height: "25%",
          background: `linear-gradient(160deg, #b8e4f8cc 0%, #8fd0f099 35%, #6ec6ee66 70%, #3daee833 100%)`,
          border: `2px solid rgba(200,232,255,0.75)`,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.35), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 18px rgba(140,210,255,0.35), 0 0 4px rgba(140,210,255,0.5)`,
          zIndex: 2,
        }}
      >
        {/* Horizontal divider */}
        <div className="absolute inset-x-0" style={{ top: "48%", height: "2px", background: "rgba(180,220,255,0.7)", boxShadow: "0 0 3px rgba(180,220,255,0.5)" }} />
        {/* Vertical divider */}
        <div className="absolute inset-y-0" style={{ left: "48%", width: "2px", background: "rgba(180,220,255,0.7)", boxShadow: "0 0 3px rgba(180,220,255,0.5)" }} />
        {/* Window frame outer border highlight */}
        <div className="absolute inset-0" style={{ border: "1px solid rgba(255,255,255,0.25)", pointerEvents: "none" }} />
      </div>
      {/* Window highlight cast on wall below window */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          right: "20%",
          top: "31%",
          width: "24%",
          height: "8%",
          background: "linear-gradient(180deg, rgba(180,225,255,0.18) 0%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Wall decoration — pixel art poster on back wall, left of window */}
      <div className="absolute pointer-events-none" aria-hidden
        style={{ left:"4%", top:"7%", width:"20%", height:"22%",
          zIndex:2,
          border:`1px solid ${service.accent}44`,
          boxShadow:`0 0 8px ${service.accent}22, inset 0 0 4px rgba(0,0,0,0.4)`,
          borderRadius:"1px",
          overflow:"hidden",
        }}>
        {service.id === "web"    && <WallDecoWeb    accent={service.accent}/>}
        {service.id === "ai"     && <WallDecoAI     accent={service.accent}/>}
        {service.id === "auto"   && <WallDecoAuto   accent={service.accent}/>}
        {service.id === "agents" && <WallDecoAgents accent={service.accent}/>}
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

      {/* Agent state badge — top-right */}
      <div className="absolute right-2 top-2 z-10 pointer-events-none">
        <PoseBadge pose={currentPose} />
      </div>

      {/* Desk + dual monitors — sits just below wall zone (SPLIT=38%) */}
      <div
        className="absolute"
        style={{ left: "12%", top: "33%", width: "60%", height: "26%", zIndex: 1 }}
      >
        <DeskAndMonitor accent={service.accent} />
      </div>

      {/* Headset on desk (agents room only) */}
      {service.id === "agents" && (
        <div className="absolute" style={{ left: "56%", top: "42%", width: "8%", height: "10%", zIndex: 2 }}>
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
          {/* Floor shadow pooled below the item — elongated to sell 3D height */}
          <div
            style={{
              position: "absolute",
              left: "-10%", right: "-2%",
              bottom: "-10%",
              height: "24%",
              background:
                "radial-gradient(ellipse at 40% 100%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 45%, transparent 80%)",
              filter: "blur(3px)",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
            {f.node}
          </div>
        </div>
      ))}

      {/* Character — waypoint-driven state machine (walk / sit / stand / idle / at-door) */}
      <CharacterActor
        service={service}
        active={active}
        onToggle={onToggle}
        onPoseChange={setCurrentPose}
        ref={charRef}
      />

      {/* Terminal log panel */}
      {active && (
        <TerminalLog service={service} onClose={onToggle} />
      )}

      <style jsx>{`
        :global(.agent) {
          will-change: transform, left, top, bottom, height;
          cursor: pointer;
          position: absolute;
          outline: none;
          background: transparent;
          border: none;
          padding: 0;
        }
        :global(.agent-inner) {
          position: relative;
          width: 100%; height: 100%;
          display: block;
        }
        :global(.agent-body) {
          position: relative;
          width: 100%; height: 100%;
          display: block;
          /* Will-change so the bob animation doesn't stutter during horizontal travel */
          will-change: transform;
        }
        /* Walk cycle: syncs with JS 4-phase walk (140 ms × 4 = 560 ms total).
           Small vertical bob (contact phase sinks 0.5 px) + tiny horizontal sway. */
        :global(.agent-body.walk) {
          animation: walkCycle 560ms steps(1) infinite;
        }
        /* Idle bob: gentle up-down every 700 ms, no horizontal sway */
        :global(.agent-body.idle) {
          animation: idleBreath 1400ms ease-in-out infinite;
        }
        :global(.agent-body.still) { animation: none; }
        :global(.agent-shadow) {
          position: absolute;
          left: 20%; right: 20%; bottom: -3%;
          height: 6%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.70), transparent 65%);
          filter: blur(1.5px);
          transition: opacity .3s ease;
        }
        :global(.agent-foot-contact) {
          position: absolute;
          left: 25%; right: 25%; bottom: -1%;
          height: 3%;
          background: radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.45), transparent 70%);
          filter: blur(0.5px);
        }
        :global(.agent.is-sitting .agent-shadow) { opacity: 0; }
        :global(.agent.is-sitting .agent-foot-contact) { opacity: 0; }
        :global(.agent-sprite) {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%; height: 100%;
          filter: drop-shadow(0 2px 0 rgba(0,0,0,0.35));
        }
        :global(.agent:hover .agent-sprite) { filter: drop-shadow(0 3px 0 rgba(0,0,0,0.5)) brightness(1.08); }
        /* 4-phase walk cycle. Phases are 140 ms each, matching JS frame advance:
           0 = passing (both feet roughly under body)   → body up
           1 = contact right (right leg forward)        → body down + sway right
           2 = passing                                  → body up
           3 = contact left  (left leg forward)         → body down + sway left   */
        @keyframes walkCycle {
          0%   { transform: translate(0, -1px); }
          25%  { transform: translate(0.5px, 0); }
          50%  { transform: translate(0, -1px); }
          75%  { transform: translate(-0.5px, 0); }
          100% { transform: translate(0, -1px); }
        }
        @keyframes idleBreath {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-0.8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.agent-body.walk),
          :global(.agent-body.idle) { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* =========================================================================
   CharacterActor — waypoint-driven state machine
   Advances through DEFAULT_WAYPOINTS on a setTimeout chain. Pauses when
   the dialog is open (active=true). CSS transitions handle smooth travel.
   ========================================================================= */
const CharacterActor = React.forwardRef<HTMLButtonElement, {
  service: Service;
  active: boolean;
  onToggle: () => void;
  onPoseChange?: (pose: CharPose) => void;
}>(function CharacterActor({ service, active, onToggle, onPoseChange }, ref) {
  const [wpIdx, setWpIdx] = useState(service.startIdx % DEFAULT_WAYPOINTS.length);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 4-phase walk cycle: neutral → stride-A → neutral → stride-B → neutral → ...
  // Gives a proper "pass–contact–pass–contact" gait like in classic pixel games.
  const [walkFrame, setWalkFrame] = useState<0 | 1 | 2 | 3>(0);

  // Notify parent of pose changes
  useEffect(() => {
    onPoseChange?.(DEFAULT_WAYPOINTS[wpIdx].pose);
  }, [wpIdx, onPoseChange]);

  useEffect(() => {
    if (active) return; // pause state machine while dialog is open
    const wp = DEFAULT_WAYPOINTS[wpIdx];
    const total = Math.round((wp.travelMs + wp.dwellMs) * service.paceFactor);
    timerRef.current = setTimeout(() => {
      setWpIdx((p) => (p + 1) % DEFAULT_WAYPOINTS.length);
    }, total);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [wpIdx, active, service.paceFactor]);

  // Advance walk frame every 140 ms while in "walking" pose.
  // 4 phases × 140 ms = 560 ms per full stride — close to a natural walking pace.
  useEffect(() => {
    if (DEFAULT_WAYPOINTS[wpIdx].pose !== "walking") return;
    const interval = setInterval(() => {
      setWalkFrame(f => ((f + 1) % 4) as 0 | 1 | 2 | 3);
    }, 140);
    return () => clearInterval(interval);
  }, [wpIdx]);

  const wp = DEFAULT_WAYPOINTS[wpIdx];
  const isSitting = wp.pose === "sitting";
  const travelMs  = Math.round(wp.travelMs * service.paceFactor);

  // Depth scale: bottomPct near 0 = close (front) = large; near 38 = far (back) = small.
  // Clamped: front 1.12 → back 0.78. Also adjusts zIndex so nearer chars render on top.
  const rawBottom = wp.topPct !== undefined ? 18 : (wp.bottomPct ?? 4);
  const depthT    = Math.min(1, rawBottom / 36);           // 0 (close) → 1 (far)
  const depthScale = isSitting ? 1.0 : 1.12 - depthT * 0.34; // 1.12 (front) → 0.78 (back)
  const depthZ     = wp.zIndex ?? Math.round(5 - depthT * 3); // z 5 (front) → 2 (back)

  const positionStyle: React.CSSProperties = wp.topPct !== undefined
    ? { top: `${wp.topPct}%`,    bottom: "auto" }
    : { bottom: `${wp.bottomPct ?? 4}%`, top: "auto" };

  return (
    <button
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={`Abrir diálogo de ${service.title}`}
      className={`agent ${active ? "is-active" : ""} ${isSitting ? "is-sitting" : ""}`}
      style={{
        left: `${wp.leftPct}%`,
        ...positionStyle,
        width: "22%",
        height: isSitting ? "32%" : "52%",
        zIndex: depthZ,
        transition: `left ${travelMs}ms linear, top ${travelMs}ms ease-out, bottom ${travelMs}ms ease-out, height ${Math.min(travelMs, 600)}ms ease-out, transform ${Math.min(travelMs, 1200)}ms ease-out`,
      }}
    >
      <span
        className="agent-inner"
        style={{
          transform: `scaleX(${wp.flip ? -depthScale : depthScale}) scaleY(${depthScale})`,
          transformOrigin: "50% 100%",
          transition: "transform 0.25s ease-out",
        }}
      >
        <span className="agent-shadow" aria-hidden />
        <span className="agent-foot-contact" aria-hidden />
        <span
          className={
            "agent-body " +
            (wp.pose === "walking" ? "walk" :
             (wp.pose === "idle" || wp.pose === "standing") ? "idle" : "still")
          }
        >
          <AnimatedPixelSprite
            sprite={service.sprite}
            palette={service.sprite.palette}
            walkFrame={walkFrame}
            pose={wp.pose}
            className="agent-sprite"
          />
        </span>
      </span>
    </button>
  );
});

/* =========================================================================
   VCorridor — vertical strip (column) separating left room from right room
   ========================================================================= */
function VCorridor({ accentL, accentR }: { accentL: string; accentR: string }) {
  const DOOR = 32;
  const WALL = 8;
  const wallBg = "linear-gradient(180deg, #d8d2c6 0%, #a39d90 20%, #6f6860 55%, #3a3530 100%)";
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "#9e9890",
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.20) 1px, transparent 1px),
          linear-gradient(180deg, rgba(0,0,0,0.20) 1px, transparent 1px),
          radial-gradient(ellipse 50% 30% at 50% 50%, rgba(255,235,160,0.14), transparent 70%)
        `,
        backgroundSize: "16px 16px, 16px 16px, 100% 100%",
      }}
    >
      {/* Ceiling lamp strip in centre of corridor */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ left:"50%", top:0, transform:"translateX(-50%)",
          width:"30%", height:3,
          background:"linear-gradient(90deg, transparent, rgba(255,245,200,0.95) 30%, rgba(255,248,220,1) 50%, rgba(255,245,200,0.95) 70%, transparent)",
          boxShadow:"0 0 6px 2px rgba(255,230,150,0.6)", zIndex:3 }} />
      {/* Lamp cone down */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ left:"50%", top:0, transform:"translateX(-50%)",
          width:"90%", height:"100%",
          background:"radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,235,150,0.16) 0%, transparent 70%)",
          zIndex:2 }} />
      {/* Edge AO shadows from room walls */}
      <div aria-hidden className="absolute inset-y-0 left-0" style={{ width:6,
        background:"linear-gradient(90deg, rgba(0,0,0,0.35), transparent)", zIndex:4 }} />
      <div aria-hidden className="absolute inset-y-0 right-0" style={{ width:6,
        background:"linear-gradient(270deg, rgba(0,0,0,0.35), transparent)", zIndex:4 }} />
      {/* LEFT WALL — above door (with inner face highlight) */}
      <div style={{ position:"absolute", left:0, top:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`,
        background:wallBg,
        boxShadow:"inset -2px 0 0 rgba(0,0,0,0.55), inset 2px 0 0 rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.35)" }} />
      {/* LEFT door opening with door frame volume */}
      <div style={{
        position:"absolute", left:0, top:`calc(50% - ${DOOR/2}px)`, width:WALL, height:DOOR,
        background:`linear-gradient(90deg, ${accentL}88, ${accentL}30 60%, transparent)`,
        borderTop:`3px solid ${accentL}`, borderBottom:`3px solid ${accentL}`,
        boxShadow:`inset 3px 0 0 ${accentL}77, 0 0 12px ${accentL}55`,
      }} />
      {/* LEFT WALL — below door */}
      <div style={{ position:"absolute", left:0, bottom:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`,
        background:wallBg,
        boxShadow:"inset -2px 0 0 rgba(0,0,0,0.55), inset 2px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.55)" }} />

      {/* RIGHT WALL — above door */}
      <div style={{ position:"absolute", right:0, top:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`,
        background:wallBg,
        boxShadow:"inset 2px 0 0 rgba(0,0,0,0.55), inset -2px 0 0 rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.35)" }} />
      {/* RIGHT door opening */}
      <div style={{
        position:"absolute", right:0, top:`calc(50% - ${DOOR/2}px)`, width:WALL, height:DOOR,
        background:`linear-gradient(270deg, ${accentR}88, ${accentR}30 60%, transparent)`,
        borderTop:`3px solid ${accentR}`, borderBottom:`3px solid ${accentR}`,
        boxShadow:`inset -3px 0 0 ${accentR}77, 0 0 12px ${accentR}55`,
      }} />
      {/* RIGHT WALL — below door */}
      <div style={{ position:"absolute", right:0, bottom:0, width:WALL, height:`calc(50% - ${DOOR/2}px)`,
        background:wallBg,
        boxShadow:"inset 2px 0 0 rgba(0,0,0,0.55), inset -2px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.55)" }} />
    </div>
  );
}

/* =========================================================================
   HCorridor — horizontal strip (row) separating top room from bottom room
   ========================================================================= */
function HCorridor({ accentT, accentB }: { accentT: string; accentB: string }) {
  const DOOR = 34;
  const WALL = 8;
  const wallTopBg    = "linear-gradient(180deg, #d8d2c6 0%, #a39d90 30%, #6f6860 70%, #3a3530 100%)";
  const wallBottomBg = "linear-gradient(0deg,   #d8d2c6 0%, #a39d90 30%, #6f6860 70%, #3a3530 100%)";
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "#9e9890",
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.20) 1px, transparent 1px),
          linear-gradient(180deg, rgba(0,0,0,0.20) 1px, transparent 1px),
          radial-gradient(ellipse 30% 50% at 50% 50%, rgba(255,235,160,0.14), transparent 70%)
        `,
        backgroundSize: "16px 16px, 16px 16px, 100% 100%",
      }}
    >
      {/* Ceiling lamp strip in centre of corridor */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ top:"50%", left:0, right:0, transform:"translateY(-50%)",
          height:"12%",
          background:"radial-gradient(ellipse 50% 100% at 50% 50%, rgba(255,245,200,0.9) 0%, transparent 70%)",
          zIndex:3 }} />
      {/* Lamp glow down/up */}
      <div aria-hidden className="absolute pointer-events-none inset-0"
        style={{ background:"radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,235,150,0.16) 0%, transparent 70%)",
          zIndex:2 }} />
      {/* Edge AO from room ceilings */}
      <div aria-hidden className="absolute inset-x-0 top-0" style={{ height:6,
        background:"linear-gradient(180deg, rgba(0,0,0,0.35), transparent)", zIndex:4 }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0" style={{ height:6,
        background:"linear-gradient(0deg, rgba(0,0,0,0.35), transparent)", zIndex:4 }} />
      {/* TOP WALL — left of door (with bottom-edge shadow where wall meets floor) */}
      <div style={{ position:"absolute", top:0, left:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`,
        background:wallTopBg,
        boxShadow:"inset 0 -2px 0 rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.35)" }} />
      {/* TOP door opening with frame volume */}
      <div style={{
        position:"absolute", top:0, left:`calc(50% - ${DOOR/2}px)`, height:WALL, width:DOOR,
        background:`linear-gradient(180deg, ${accentT}88, ${accentT}30 60%, transparent)`,
        borderLeft:`3px solid ${accentT}`, borderRight:`3px solid ${accentT}`,
        boxShadow:`inset 0 3px 0 ${accentT}77, 0 0 12px ${accentT}55`,
      }} />
      {/* TOP WALL — right of door */}
      <div style={{ position:"absolute", top:0, right:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`,
        background:wallTopBg,
        boxShadow:"inset 0 -2px 0 rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.35)" }} />

      {/* BOTTOM WALL — left of door */}
      <div style={{ position:"absolute", bottom:0, left:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`,
        background:wallBottomBg,
        boxShadow:"inset 0 2px 0 rgba(0,0,0,0.55), inset 0 -2px 0 rgba(255,255,255,0.35)" }} />
      {/* BOTTOM door opening */}
      <div style={{
        position:"absolute", bottom:0, left:`calc(50% - ${DOOR/2}px)`, height:WALL, width:DOOR,
        background:`linear-gradient(0deg, ${accentB}88, ${accentB}30 60%, transparent)`,
        borderLeft:`3px solid ${accentB}`, borderRight:`3px solid ${accentB}`,
        boxShadow:`inset 0 -3px 0 ${accentB}77, 0 0 12px ${accentB}55`,
      }} />
      {/* BOTTOM WALL — right of door */}
      <div style={{ position:"absolute", bottom:0, right:0, height:WALL, width:`calc(50% - ${DOOR/2}px)`,
        background:wallBottomBg,
        boxShadow:"inset 0 2px 0 rgba(0,0,0,0.55), inset 0 -2px 0 rgba(255,255,255,0.35)" }} />
    </div>
  );
}

/* =========================================================================
   CoffeeArea — central break room (now proportional with vw-based corridors)
   ========================================================================= */
function CoffeeArea() {
  const amber = "#f59e0b";
  const amberD = "#c47d08";
  return (
    <div
      className="relative overflow-hidden"
      style={{
        /* Warm oak floor matching office rooms */
        background: "#c0a87a",
        backgroundImage:`
          linear-gradient(90deg, rgba(0,0,0,0.16) 1px, transparent 1px),
          linear-gradient(0deg, rgba(255,255,255,0.10) 1px, transparent 1px)
        `,
        backgroundSize:"8px 8px",
      }}
    >
      {/* Wall top-face (bright band — 3D depth) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height:6, background:"linear-gradient(180deg,rgba(255,255,255,0.5) 0%,rgba(0,0,0,0.3) 100%)",
          borderBottom:"1px solid rgba(0,0,0,0.4)", zIndex:1 }} />

      {/* Back wall zone (~35% of height) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0"
        style={{ height:"35%",
          background:`linear-gradient(180deg, ${amberD}dd 0%, ${amberD}aa 50%, rgba(0,0,0,0.30) 100%)`,
          zIndex:0 }} />

      {/* Floor AO below wall */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0"
        style={{ top:"35%", height:"10%",
          background:"linear-gradient(180deg,rgba(0,0,0,0.38) 0%,transparent 100%)", zIndex:1 }} />

      {/* Ceiling pendant glow */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ left:"50%", top:0, transform:"translateX(-50%)", width:"60%", height:"30%",
          background:`radial-gradient(ellipse at 50% 0%, ${amber}66 0%, transparent 70%)`, zIndex:2 }} />
      {/* Cord */}
      <div aria-hidden className="absolute" style={{ left:"50%", top:0, width:2, height:"22%", marginLeft:-1,
        background:"#3a3040", zIndex:3 }} />
      {/* Shade */}
      <div aria-hidden className="absolute"
        style={{ left:"50%", top:"18%", width:"16%", height:"7%", marginLeft:"-8%",
          background:`linear-gradient(180deg, ${amber} 0%, ${amberD} 100%)`,
          borderRadius:"0 0 50% 50%",
          boxShadow:`0 0 12px ${amber}cc, inset 0 -2px 0 rgba(0,0,0,0.3)`, zIndex:3 }} />

      {/* Round rug */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ left:"50%", bottom:"10%", transform:"translateX(-50%)", width:"72%", height:"48%",
          background:`radial-gradient(ellipse at 50% 60%, ${amber}38 0%, ${amber}18 45%, transparent 70%)`,
          border:`1px dashed ${amber}44`, borderRadius:"50%", zIndex:1 }} />

      {/* Coffee machine — top-left */}
      <div className="absolute" style={{ top:"6%", left:"4%", width:"30%", height:"44%", zIndex:2 }}>
        <PixelCoffeeMaker accent={amber} />
      </div>

      {/* Plant — top-right */}
      <div className="absolute" style={{ top:"3%", right:"3%", width:"24%", height:"42%", zIndex:2 }}>
        <PixelPlant />
      </div>

      {/* Round table */}
      <div className="absolute"
        style={{ bottom:"10%", left:"50%", transform:"translateX(-50%)", width:"52%", height:"36%", zIndex:2 }}>
        <PixelRoundTable accent={amber} />
      </div>

      {/* Stools — now pixel-art circles scaled to cell */}
      {[{l:"9%"},{r:"9%"}].map((pos,i) => (
        <div key={i} aria-hidden className="absolute"
          style={{ ...pos, bottom:"22%", width:"9%", aspectRatio:"1",
            background:`radial-gradient(circle at 35% 35%, #3a3c4e, #1d2030)`,
            borderRadius:"50%",
            boxShadow:`inset 0 0 0 1px ${amber}99, 0 3px 5px rgba(0,0,0,0.55)`, zIndex:2 }} />
      ))}

      {/* BREAK label */}
      <div className="absolute bottom-[2%] inset-x-0 text-center pointer-events-none"
        style={{ fontSize:"clamp(6px, 1.2vw, 9px)", color:`${amber}cc`,
          fontFamily:"ui-monospace,monospace", letterSpacing:"0.14em", fontWeight:"bold", zIndex:3 }}>
        ☕ BREAK ROOM
      </div>

      {/* Corner wall-join blocks */}
      {(["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"] as const).map(c => (
        <div key={c} aria-hidden className={`absolute ${c} w-[8px] h-[8px]`}
          style={{ background:"#605c58", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.3)", zIndex:5 }} />
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
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-3">
            Oficina Agéntica
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-2 max-w-2xl mx-auto">
            Cada sala es un{" "}
            <span className="text-[var(--text)] font-semibold">Bounded Context</span>{" "}
            autónomo con su propio agente especializado.
            Haz clic en cualquier agente para abrir su terminal.
          </p>
        </Reveal>

        <Reveal replay delayMs={120}>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-dim)] text-center mb-8">
            <span className="inline-block w-2 h-2 align-middle mr-2 rounded-sm bg-emerald-400 animate-pulse" />
            4 bounded contexts · 4 agentes online
          </p>
        </Reveal>

        {/* ── Connected office floor plan ── */}
        <Reveal replay delayMs={160}>
          {/* Scroll wrapper prevents floor-plan from squishing on narrow screens */}
          <div className="office-scroll">
          {/* Perspective wrapper — gives the top-down angle */}
          <div
            className="office-scene"
            style={{
              perspective: "1100px",
              perspectiveOrigin: "50% -10%",
              minWidth: "400px",
            }}
          >
            <div
              className="office-tilt"
              style={{
                transform: "rotateX(22deg)",
                transformOrigin: "center top",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {/* Outer building shell — thick pixel wall with 3D top cap */}
              <div
                className="office-shell relative"
                style={{
                  background: "linear-gradient(180deg, #e0dcd2 0%, #b8b4aa 30%, #807c74 100%)",
                  padding: "12px",
                  borderRadius: "3px",
                  boxShadow:
                    "inset 0 3px 0 rgba(255,255,255,0.55), " +   // top highlight (wall top face)
                    "inset 0 -3px 0 rgba(0,0,0,0.35), " +         // bottom shadow
                    "inset 3px 0 0 rgba(255,255,255,0.22), " +    // left wall catches light
                    "inset -3px 0 0 rgba(0,0,0,0.30), " +         // right wall shadow
                    "0 0 0 1px #504c48, " +
                    "0 80px 160px -20px rgba(0,0,0,0.75)",
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

                {/* Building nameplate — interior sign mounted on front wall */}
                <div
                  aria-hidden
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "8px",
                    padding: "4px 10px",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.20) 100%)",
                    border: "1px solid rgba(0,0,0,0.28)",
                    borderRadius: "2px",
                  }}
                >
                  <span style={{ color: "#f0ead8", fontFamily: "ui-monospace, monospace", fontSize: "clamp(7px, 1.1vw, 10px)", letterSpacing: "0.20em", textTransform: "uppercase" }}>
                    OFICINA AGÉNTICA
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "9px" }}>◈</span>
                  <span style={{ color: "#9a9490", fontFamily: "ui-monospace, monospace", fontSize: "clamp(6px, 0.95vw, 9px)", letterSpacing: "0.14em" }}>
                    PLANTA 1 · 4 BOUNDED CONTEXTS
                  </span>
                </div>

                {/*
                3 × 3 grid:
                [WEB]       [V-corridor]  [AI]
                [H-corridor][COFFEE]      [H-corridor]
                [AUTO]      [V-corridor]  [AGENTS]

                Corridors are proportional (clamp-based) so the CoffeeArea
                is a real room, not a microscopic 52×44 px cell.
              */}
                <div
                  className="floor-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr minmax(80px, 11vw) 1fr",
                    gridTemplateRows: "minmax(180px, 22vw) minmax(70px, 8vw) minmax(180px, 22vw)",
                    background: "#706c68",
                  }}
                >
                  {/* Row 1 */}
                  <Room service={services[0]}
                    active={activeId === services[0].id}
                    onToggle={() => setActiveId(p => p === services[0].id ? null : services[0].id)}
                    doorSides={["right","bottom"]} />

                  <VCorridor accentL={services[0].accent} accentR={services[1].accent} />

                  <Room service={services[1]}
                    active={activeId === services[1].id}
                    onToggle={() => setActiveId(p => p === services[1].id ? null : services[1].id)}
                    doorSides={["left","bottom"]} />

                  {/* Row 2 */}
                  <HCorridor accentT={services[0].accent} accentB={services[2].accent} />
                  <CoffeeArea />
                  <HCorridor accentT={services[1].accent} accentB={services[3].accent} />

                  {/* Row 3 */}
                  <Room service={services[2]}
                    active={activeId === services[2].id}
                    onToggle={() => setActiveId(p => p === services[2].id ? null : services[2].id)}
                    doorSides={["right","top"]} />

                  <VCorridor accentL={services[2].accent} accentR={services[3].accent} />

                  <Room service={services[3]}
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
          </div>{/* /office-scroll */}
        </Reveal>
      </div>

      <style jsx>{`
        /* ── Responsive tilt / perspective ─────────────────────────── */

        /* Tablet: softer angle */
        @media (max-width: 1023px) {
          .office-tilt { transform: rotateX(14deg) !important; }
        }
        /* Mobile: remove 3D tilt entirely */
        @media (max-width: 639px) {
          .office-tilt  { transform: none !important; }
          .office-scene { perspective: none !important; }
        }

        /* ── Scroll container on very narrow screens ────────────────── */
        /* Keeps the floor-plan from squishing below 420 px              */
        .office-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 540px) {
          .office-scroll { padding-bottom: 6px; }
          .floor-grid {
            grid-template-columns: 1fr minmax(54px, 11vw) 1fr !important;
            grid-template-rows:
              minmax(148px, 22vw)
              minmax(54px,  8vw)
              minmax(148px, 22vw) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;
