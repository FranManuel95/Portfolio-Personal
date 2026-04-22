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
   Character sprites (Simpsons-inspired pixel art)
   Grid: 16 wide × 22 tall.
   Shared codes:
     . transparent    Y yellow skin    W white    K black
     H brown hair     D dark navy      P purple   B brown shoe
     L blue           O orange         G green    R red
     N belt brown     T tan (wood)     E emerald book    C red book
     x red detail
   ========================================================================= */

// --- DEV (Homer-esque dad) ---------------------------------------------
const devRows = [
  "................", // 0
  "....HHHH........", // 1
  "...HHHHHH.......", // 2
  "..HHYYYYHH......", // 3
  "...YYYYYYH......", // 4
  "..YYYYYYYY......", // 5
  "..YWKYYWKY......", // 6 eyes
  "..YYYYYYYY......", // 7
  "...YKKKYY.......", // 8 mouth
  "....YYYY........", // 9 neck
  "...WWWWWWW......", // 10 shirt
  "..YWWWWWWWY.....", // 11 arms
  "..YWWWWWWWY.....", // 12
  "...WWWWWWW......", // 13
  "...NNNNNNN......", // 14 belt
  "...LLLLLLL......", // 15 pants
  "...LLL.LLL......", // 16
  "...LLL.LLL......", // 17
  "...LLL.LLL......", // 18
  "...LLL.LLL......", // 19
  "..BBBB.BBBB.....", // 20 shoes
  "..BBBB.BBBB.....", // 21
];
const devPalette: Palette = {
  Y: "#FFD90F",
  H: "#4A2A10",
  W: "#F5F5F7",
  K: "#101014",
  N: "#3A2410",
  L: "#2A5CC4",
  B: "#3A2410",
};

// --- AI (elegant woman with tall bouffant) -----------------------------
const aiRows = [
  "....DDDD........", // 0 bouffant top
  "...DDDDDD.......", // 1
  "..DDDDDDDD......", // 2
  "..DDDDDDDD......", // 3
  "..DDxxxxDD......", // 4 green hair band
  "..DYYYYYYD......", // 5 head
  "..DYWKYWKY......", // 6 eyes
  "..YYYYYYYY......", // 7
  "..YYYxxYY.......", // 8 red lips
  "...YYWWYY.......", // 9 neck + pearls
  "..GGGGGGGG......", // 10 dress top
  "..GGGWGGGG......", // 11 belt accent
  "..YGGGGGGY......", // 12 arms out
  "...GGGGGG.......", // 13 waist
  "...GGGGGG.......", // 14
  "....GGGG........", // 15 skirt
  "....GGGG........", // 16
  "....YGGY........", // 17 legs
  "....YGGY........", // 18
  "....YYYY........", // 19
  "...GGG.GGG......", // 20 heels
  "...GG...GG......", // 21
];
const aiPalette: Palette = {
  Y: "#FFD90F",
  D: "#1C1A30",
  W: "#F5F5F7",
  K: "#101014",
  G: "#2E8C54",
  x: "#D23030",
};

// --- AUTOMATION (Bart-like kid with slingshot) --------------------------
const autoRows = [
  "..H.H.H.........", // 0 spikes
  "..HHHHH.........", // 1
  ".HHHHHHH........", // 2
  "..YYYYYYH.......", // 3 head
  "..YYYYYYY.......", // 4
  "..YWKYYWKY......", // 5 eyes
  "..YYYYYYYY......", // 6
  "...YKKKKY.......", // 7 big grin
  "....YYYY........", // 8 neck
  "...OOOOOO.......", // 9 orange shirt
  "..YOOOOOOY.T....", // 10 arm + slingshot stick
  "..YOOOOOOY.TT...", // 11
  "..YOOOOOOY.T....", // 12
  "...OOOOOO.......", // 13
  "...LLLLLL.......", // 14 blue shorts
  "...LLL.LLL......", // 15
  "...LLL.LLL......", // 16
  "....YY.YY.......", // 17 legs (bare yellow)
  "....YY.YY.......", // 18
  "....YY.YY.......", // 19
  "...WWW.WWW......", // 20 sneakers
  "...LLL.LLL......", // 21 sole stripe
];
const autoPalette: Palette = {
  Y: "#FFD90F",
  H: "#6A3A10",
  W: "#F5F5F7",
  K: "#101014",
  O: "#E86418",
  L: "#2A5CC4",
  T: "#9A6A30",
};

// --- AGENT (Lisa-like studious girl with book) --------------------------
const agentRows = [
  "....PPPP..PP....", // 0 ponytail
  "...PPPPPPPPP....", // 1
  "..PPYYYYYYPP....", // 2 bangs
  "..PYYYYYYYP.....", // 3
  "..YYWKYYWKY.....", // 4 eyes with glasses
  "..YKYYKYYKY.....", // 5 glasses bridges
  "..YYYYYYYYY.....", // 6
  "...YYxxYYY......", // 7 lips
  "....YYYY........", // 8 neck
  "...RRRWRRR......", // 9 collar
  "..RRRRRRRRR.EE..", // 10 dress + book
  "..YRRRRRRRYEEE..", // 11
  "..YRRRRRRRYEE...", // 12
  "..RRRRRRRRR.....", // 13
  "...RRRRRRR......", // 14
  "...RRRRRRR......", // 15 skirt
  "...YYR.RYY......", // 16 legs
  "...WYR.RYW......", // 17 socks
  "...WYY.YYW......", // 18
  "...WWW.WWW......", // 19
  "..KKKK.KKKK.....", // 20 mary janes
  "..KKKK.KKKK.....", // 21
];
const agentPalette: Palette = {
  Y: "#FFD90F",
  P: "#6A2F8C",
  W: "#F5F5F7",
  K: "#101014",
  R: "#D22A2A",
  E: "#2FAE72",
  x: "#9A2020",
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
    wallA: "#18355f",
    wallB: "#0e1f3a",
    floorA: "#1a2a44",
    floorB: "#12223a",
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
    wallA: "#3a2464",
    wallB: "#241542",
    floorA: "#2e1e50",
    floorB: "#201238",
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
    wallA: "#5a3212",
    wallB: "#3a1e08",
    floorA: "#4a2a10",
    floorB: "#2f1a06",
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
    wallA: "#0f4a3a",
    wallB: "#08301f",
    floorA: "#0e3a2a",
    floorB: "#072416",
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
   Simple pixel desk + monitor (inline SVG, themed)
   ========================================================================= */
function DeskAndMonitor({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      width="100%"
      height="100%"
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    >
      {/* Monitor */}
      <rect x="10" y="2" width="20" height="12" fill="#15161c" shapeRendering="crispEdges" />
      <rect x="11" y="3" width="18" height="10" fill={accent} opacity="0.18" shapeRendering="crispEdges" />
      <rect x="12" y="4" width="10" height="1" fill={accent} shapeRendering="crispEdges" />
      <rect x="12" y="6" width="14" height="1" fill={accent} opacity="0.7" shapeRendering="crispEdges" />
      <rect x="12" y="8" width="8" height="1" fill={accent} opacity="0.85" shapeRendering="crispEdges" />
      <rect x="12" y="10" width="12" height="1" fill={accent} opacity="0.55" shapeRendering="crispEdges" />
      {/* Monitor stand */}
      <rect x="18" y="14" width="4" height="3" fill="#0d0e13" shapeRendering="crispEdges" />
      <rect x="14" y="17" width="12" height="1" fill="#0d0e13" shapeRendering="crispEdges" />
      {/* Desk */}
      <rect x="4" y="18" width="32" height="3" fill="#2a1a0e" shapeRendering="crispEdges" />
      <rect x="4" y="21" width="32" height="1" fill="#1a0f08" shapeRendering="crispEdges" />
      <rect x="5" y="22" width="2" height="2" fill="#1a0f08" shapeRendering="crispEdges" />
      <rect x="33" y="22" width="2" height="2" fill="#1a0f08" shapeRendering="crispEdges" />
    </svg>
  );
}

/* =========================================================================
   Room (one office)
   ========================================================================= */
function Room({
  service,
  active,
  onToggle,
  idx,
}: {
  service: Service;
  active: boolean;
  onToggle: () => void;
  idx: number;
}) {
  const charRef = useRef<HTMLButtonElement | null>(null);

  // Typewriter segments: title in accent + items joined
  const segments = useMemo(
    () => [
      { text: `— ${service.role} —\n`, className: "font-bold" },
      ...service.items.map((it) => ({ text: `• ${it}\n` })),
    ],
    [service]
  );

  return (
    <div
      className="room relative overflow-hidden rounded-2xl border border-[var(--line)]"
      style={{
        background: `linear-gradient(180deg, ${service.wallA} 0%, ${service.wallB} 62%, ${service.floorA} 62%, ${service.floorB} 100%)`,
        aspectRatio: "16 / 11",
        boxShadow: active
          ? `0 0 0 1px ${service.accent}55, 0 20px 60px -20px ${service.accent}55`
          : undefined,
        transition: "box-shadow .35s var(--ease)",
      }}
    >
      {/* Floor tile grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: "62%",
          bottom: 0,
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.22) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "28px 14px, 28px 14px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Wall plaque with title */}
      <div className="absolute left-3 top-3 flex items-center gap-2 z-10">
        <span
          className="inline-block w-2 h-2 rounded-sm"
          style={{ background: service.accent, boxShadow: `0 0 8px ${service.accent}` }}
        />
        <span
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: service.accent, letterSpacing: "0.08em" }}
        >
          {service.title}
        </span>
      </div>

      {/* "Window" pattern on back wall (decor) */}
      <div
        aria-hidden
        className="absolute"
        style={{
          right: "8%",
          top: "12%",
          width: "22%",
          height: "28%",
          background: `linear-gradient(180deg, ${service.accent}22, ${service.accent}08)`,
          border: `2px solid ${service.accent}44`,
          boxShadow: `inset 0 0 0 2px #00000033`,
        }}
      />

      {/* Desk + monitor */}
      <div
        className="absolute"
        style={{ left: "8%", top: "38%", width: "34%", height: "28%" }}
      >
        <DeskAndMonitor accent={service.accent} />
      </div>

      {/* Character (clickable) */}
      <button
        ref={charRef}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label={`Abrir diálogo de ${service.title}`}
        className={`agent group absolute focus:outline-none ${active ? "is-active" : ""}`}
        style={
          {
            left: 0,
            bottom: "4%",
            width: "16%",
            height: "46%",
            "--walk-duration": `${service.walkDuration}s`,
            "--bob-delay": `${idx * 0.3}s`,
          } as React.CSSProperties
        }
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
          className="bubble absolute z-20"
          style={{
            left: "4%",
            right: "4%",
            top: "6%",
            background: "#f7f7fa",
            color: "#111218",
            border: `3px solid ${service.accent}`,
            boxShadow: `0 10px 0 -2px #00000040, 0 0 0 3px #00000080`,
            padding: "12px 14px 14px",
            borderRadius: "10px",
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            fontSize: "12px",
            lineHeight: 1.35,
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
              left: "12%",
              bottom: -14,
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: `14px solid ${service.accent}`,
            }}
          />
          <span
            aria-hidden
            className="absolute"
            style={{
              left: "12%",
              marginLeft: 2,
              bottom: -9,
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: `10px solid #f7f7fa`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        .agent {
          animation: walk var(--walk-duration, 9s) linear infinite;
          will-change: transform;
          cursor: pointer;
        }
        .agent.is-active {
          animation-play-state: paused;
        }
        .agent-bob {
          animation: bob 0.55s steps(2) infinite;
          animation-delay: var(--bob-delay, 0s);
        }
        .agent.is-active .agent-bob {
          animation-play-state: paused;
        }
        .agent-shadow {
          position: absolute;
          left: 14%;
          right: 14%;
          bottom: -4%;
          height: 8%;
          background: radial-gradient(
            50% 50% at 50% 50%,
            rgba(0, 0, 0, 0.55),
            transparent 70%
          );
          filter: blur(1px);
        }
        .agent-sprite {
          position: relative;
          z-index: 1;
          display: block;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.35));
          transition: transform 0.2s var(--ease);
        }
        .agent:hover .agent-sprite {
          transform: translateY(-2px) scale(1.04);
        }
        @keyframes walk {
          0% {
            left: 2%;
            transform: scaleX(1);
          }
          48% {
            left: 78%;
            transform: scaleX(1);
          }
          50% {
            left: 78%;
            transform: scaleX(-1);
          }
          98% {
            left: 2%;
            transform: scaleX(-1);
          }
          100% {
            left: 2%;
            transform: scaleX(1);
          }
        }
        @keyframes bob {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .agent,
          .agent-bob {
            animation: none !important;
          }
          .agent {
            left: 40% !important;
          }
        }
      `}</style>
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
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]" />
      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-4 mt-6 mb-6">
            ¿En qué puedo ayudarte?
          </h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-3 max-w-2xl mx-auto">
            Bienvenido a mi <span className="text-[var(--text)] font-semibold">oficina agéntica</span>.
            Cada agente trabaja en su despacho — haz clic para escuchar lo que hace.
          </p>
        </Reveal>

        <Reveal replay delayMs={120}>
          <p className="text-[11px] uppercase tracking-widest text-[var(--text-dim)] text-center mb-8">
            <span className="inline-block w-2 h-2 align-middle mr-2 rounded-sm bg-emerald-400 animate-pulse" />
            4 agentes online · click para interactuar
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {services.map((s, i) => (
            <Reveal replay key={s.id} delayMs={80 + i * 60}>
              <Room
                service={s}
                idx={i}
                active={activeId === s.id}
                onToggle={() =>
                  setActiveId((prev) => (prev === s.id ? null : s.id))
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
