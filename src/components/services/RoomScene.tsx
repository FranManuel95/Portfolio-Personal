"use client";

/**
 * RoomScene — dibuja el interior de una habitación en pixel-art SVG:
 * mobiliario + personaje específico según el servicio.
 * Sin dependencias de PNG — todo dibujado con <rect>.
 *
 * Tres capas con z-index implícito por orden de renderizado:
 *   1. Mobiliario de fondo (pared): monitores, servidores, pizarra, estantería
 *   2. Suelo: mobiliario de pie (silla, escritorio, planta) → pintado detrás del personaje
 *   3. Personaje: único que "camina" (pacing animation)
 */

import React from "react";

type ServiceId = "web" | "ai" | "auto" | "agents";

type RoomSceneProps = {
  serviceId: ServiceId;
  accent: string;
  walking: boolean;
  className?: string;
};

/* ==========================================================================
   Mobiliario — cada pieza es un <g> posicionable, viewBox compartido 200x120
   Unit: 1 viewBox unit ≈ 1 px pixel-art.
   ========================================================================== */

const Desk = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    {/* Superficie */}
    <rect x={0} y={10} width="60" height="6" fill="#8b6040" />
    <rect x={0} y={16} width="60" height="2" fill="#6a4828" />
    {/* Patas */}
    <rect x={2} y={18} width="3" height="12" fill="#6a4828" />
    <rect x={55} y={18} width="3" height="12" fill="#6a4828" />
    {/* Monitor */}
    <rect x={12} y={0} width="18" height="10" fill="#15161c" />
    <rect x={13} y={1} width="16" height="8" fill={accent} opacity="0.22" />
    <rect x={14} y={2} width="10" height="1" fill={accent} />
    <rect x={14} y={4} width="13" height="1" fill={accent} opacity="0.65" />
    <rect x={14} y={6} width="8" height="1" fill={accent} opacity="0.85" />
    <rect x={14} y={8} width="11" height="1" fill={accent} opacity="0.5" />
    {/* Segundo monitor */}
    <rect x={34} y={0} width="18" height="10" fill="#15161c" />
    <rect x={35} y={1} width="16" height="8" fill={accent} opacity="0.18" />
    <rect x={36} y={2} width="13" height="1" fill={accent} />
    <rect x={36} y={4} width="9" height="1" fill={accent} opacity="0.7" />
    <rect x={36} y={6} width="11" height="1" fill={accent} opacity="0.85" />
    {/* Teclado */}
    <rect x={18} y={12} width="24" height="2" fill="#2a2840" />
    <rect x={19} y={13} width="22" height="1" fill={accent} opacity="0.3" />
  </g>
);

const Chair = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    {/* Respaldo */}
    <rect x={2} y={0} width="10" height="9" fill="#1d2030" />
    <rect x={3} y={1} width="8" height="7" fill={accent} opacity="0.2" />
    {/* Asiento */}
    <rect x={1} y={9} width="12" height="4" fill="#1d2030" />
    <rect x={2} y={10} width="10" height="2" fill={accent} opacity="0.15" />
    {/* Base */}
    <rect x={6} y={13} width="2" height="3" fill="#0d0e13" />
    <rect x={3} y={16} width="8" height="1" fill="#0d0e13" />
  </g>
);

const ServerRack = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width="16" height="34" fill="#0d0e13" />
    <rect x={1} y={1} width="14" height="32" fill="#15161c" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <rect x={2} y={3 + i * 5} width="12" height="3" fill="#1d1f2a" />
        <rect x={3} y={4 + i * 5} width="5" height="1" fill={accent} opacity="0.7" />
        <rect x={13} y={4 + i * 5} width="1" height="1" fill={i % 2 === 0 ? "#30d060" : accent} />
      </g>
    ))}
  </g>
);

const Plant = ({ x = 0, y = 0 }: { x?: number; y?: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={2} y={2} width="5" height="5" fill="#2d7a30" />
    <rect x={6} y={0} width="5" height="5" fill="#3a9a40" />
    <rect x={4} y={5} width="6" height="4" fill="#4ab050" />
    <rect x={6} y={9} width="2" height="4" fill="#2d7a30" />
    <rect x={2} y={13} width="10" height="2" fill="#7a4a28" />
    <rect x={3} y={15} width="8" height="6" fill="#5a3820" />
    <rect x={4} y={15} width="6" height="2" fill="#2a1a08" />
  </g>
);

const Whiteboard = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width="34" height="22" fill="#2a2a3a" />
    <rect x={1} y={1} width="32" height="20" fill="#eeeef6" />
    {/* Diagrama */}
    <rect x={4} y={4} width="8" height="5" fill={accent} opacity="0.5" />
    <rect x={14} y={4} width="8" height="5" fill={accent} opacity="0.3" />
    <rect x={24} y={4} width="8" height="5" fill={accent} opacity="0.5" />
    <rect x={11} y={9} width="1" height="3" fill="#88889a" />
    <rect x={21} y={9} width="1" height="3" fill="#88889a" />
    <rect x={4} y={13} width="26" height="1" fill="#88889a" opacity="0.5" />
    <rect x={4} y={16} width="18" height="1" fill="#88889a" opacity="0.4" />
  </g>
);

const Bookshelf = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width="22" height="36" fill="#2a1a0e" />
    <rect x={2} y={2} width="18" height="32" fill="#1a0f08" />
    <rect x={1} y={12} width="20" height="2" fill="#2a1a0e" />
    <rect x={1} y={23} width="20" height="2" fill="#2a1a0e" />
    {/* Libros arriba */}
    <rect x={3} y={3} width="3" height="9" fill="#d23030" />
    <rect x={6} y={4} width="2" height="8" fill="#2a8cd2" />
    <rect x={8} y={3} width="3" height="9" fill="#d2a030" />
    <rect x={11} y={5} width="2" height="7" fill="#602a8c" />
    <rect x={13} y={3} width="3" height="9" fill={accent} />
    <rect x={16} y={4} width="4" height="8" fill="#c06020" />
    {/* Libros medio */}
    <rect x={3} y={14} width="4" height="9" fill="#d2a030" />
    <rect x={7} y={15} width="3" height="8" fill="#d23030" />
    <rect x={10} y={14} width="2" height="9" fill="#c06020" />
    <rect x={12} y={15} width="4" height="8" fill={accent} opacity="0.9" />
    <rect x={16} y={14} width="3" height="9" fill="#602a8c" />
    {/* Libros abajo */}
    <rect x={3} y={25} width="5" height="8" fill="#2a8cd2" />
    <rect x={8} y={26} width="3" height="7" fill="#2a8c50" />
    <rect x={11} y={25} width="4" height="8" fill="#d23030" />
    <rect x={15} y={26} width="5" height="7" fill={accent} opacity="0.7" />
  </g>
);

const Headset = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={2} y={0} width="12" height="2" fill="#1d1f2a" />
    <rect x={0} y={1} width="4" height="6" fill={accent} opacity="0.9" />
    <rect x={12} y={1} width="4" height="6" fill={accent} opacity="0.9" />
    <rect x={1} y={2} width="2" height="4" fill={accent} opacity="0.5" />
    <rect x={13} y={2} width="2" height="4" fill={accent} opacity="0.5" />
    <rect x={4} y={5} width="3" height="1" fill="#1d1f2a" />
    <rect x={4} y={6} width="2" height="4" fill="#1d1f2a" />
    <rect x={3} y={10} width="3" height="2" fill={accent} />
  </g>
);

const FilingCabinet = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={0} y={0} width="14" height="28" fill="#1d2030" />
    <rect x={1} y={1} width="12" height="12" fill="#252840" />
    <rect x={1} y={14} width="12" height="12" fill="#252840" />
    <rect x={5} y={5} width="4" height="2" fill={accent} opacity="0.7" />
    <rect x={5} y={18} width="4" height="2" fill={accent} opacity="0.7" />
    <rect x={0} y={13} width="14" height="1" fill="#0d0e13" />
  </g>
);

const CoffeeMaker = ({ x = 0, y = 0, accent }: { x?: number; y?: number; accent: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={1} y={1} width="12" height="10" fill="#1d1f2a" />
    <rect x={2} y={2} width="10" height="3" fill={accent} opacity="0.5" />
    <rect x={3} y={3} width="4" height="1" fill={accent} />
    <rect x={2} y={6} width="2" height="2" fill={accent} />
    <rect x={5} y={6} width="2" height="2" fill="#30d060" />
    <rect x={8} y={6} width="2" height="2" fill="#d03030" />
    <rect x={4} y={9} width="6" height="2" fill="#252838" />
    <rect x={3} y={11} width="8" height="5" fill="#2a1a08" />
    <rect x={4} y={12} width="6" height="2" fill={accent} opacity="0.6" />
  </g>
);

/* ==========================================================================
   Personajes — SVG pixel-art 24x32, distintos por servicio
   ========================================================================== */

type CharVariant = {
  hair: string;
  skin: string;
  top: string;
  bottom: string;
  shoes: string;
  glasses?: boolean;
  longHair?: boolean;
  headset?: boolean;
};

const CHAR_VARIANTS: Record<ServiceId, CharVariant> = {
  web:    { hair: "#4a2c15", skin: "#f4c8a0", top: "#2563eb", bottom: "#1e3a5c", shoes: "#151515", glasses: true },
  ai:     { hair: "#1c1208", skin: "#f4c8a0", top: "#2a2a44", bottom: "#14142a", shoes: "#0a0a12", longHair: true },
  auto:   { hair: "#6a401c", skin: "#f4c8a0", top: "#ea580c", bottom: "#3e4030", shoes: "#5a3a20" },
  agents: { hair: "#5a2a14", skin: "#f4c8a0", top: "#d23844", bottom: "#14141e", shoes: "#0a0a12", longHair: true, headset: true },
};

function PixelPerson({
  variant,
  pose,
}: {
  variant: CharVariant;
  pose: "a" | "b"; // walk cycle
}) {
  const { hair, skin, top, bottom, shoes, glasses, longHair, headset } = variant;
  const legL = pose === "a" ? 10 : 9;
  const legR = pose === "a" ? 14 : 15;
  return (
    <svg viewBox="0 0 24 32" shapeRendering="crispEdges" width="100%" height="100%">
      {/* Pelo (trasero) si long hair */}
      {longHair && <rect x={4} y={2} width="16" height="12" fill={hair} />}
      {/* Cabeza */}
      <rect x={8} y={2} width="8" height="2" fill={hair} />
      <rect x={7} y={4} width="10" height="1" fill={hair} />
      <rect x={7} y={5} width="2" height="3" fill={hair} />
      <rect x={15} y={5} width="2" height="3" fill={hair} />
      <rect x={9} y={5} width="6" height="4" fill={skin} />
      {/* Ojos */}
      {glasses ? (
        <>
          <rect x={9} y={6} width="2" height="2" fill="#f5f1e8" />
          <rect x={13} y={6} width="2" height="2" fill="#f5f1e8" />
          <rect x={10} y={7} width="1" height="1" fill="#000" />
          <rect x={14} y={7} width="1" height="1" fill="#000" />
          <rect x={9} y={5} width="6" height="1" fill="#1a1a1a" />
          <rect x={11} y={6} width="2" height="1" fill="#1a1a1a" />
        </>
      ) : (
        <>
          <rect x={10} y={6} width="1" height="1" fill="#000" />
          <rect x={13} y={6} width="1" height="1" fill="#000" />
        </>
      )}
      {/* Headset */}
      {headset && (
        <>
          <rect x={6} y={4} width="2" height="4" fill="#222" />
          <rect x={16} y={4} width="2" height="4" fill="#222" />
          <rect x={8} y={3} width="8" height="1" fill="#222" />
          <rect x={16} y={8} width="1" height="2" fill="#222" />
          <rect x={15} y={10} width="2" height="1" fill="#30d060" />
        </>
      )}
      {/* Boca */}
      <rect x={11} y={8} width="2" height="1" fill="#8a4030" />
      {/* Cuello */}
      <rect x={10} y={9} width="4" height="1" fill={skin} />
      {/* Torso (camiseta) */}
      <rect x={7} y={10} width="10" height="8" fill={top} />
      {/* Mangas/brazos */}
      <rect x={6} y={11} width="1" height="6" fill={top} />
      <rect x={17} y={11} width="1" height="6" fill={top} />
      {/* Manos */}
      <rect x={6} y={17} width="1" height="1" fill={skin} />
      <rect x={17} y={17} width="1" height="1" fill={skin} />
      {/* Cinturón */}
      <rect x={7} y={18} width="10" height="1" fill="#0a0a12" />
      {/* Piernas — pose A/B (stride) */}
      <rect x={8} y={19} width="3" height={legL - 19 + 3} fill={bottom} />
      <rect x={13} y={19} width="3" height={legR - 19 + 3} fill={bottom} />
      <rect x={8} y={legL + 3} width="3" height={27 - (legL + 3) + 1} fill={bottom} opacity="0.7" />
      <rect x={13} y={legR + 3} width="3" height={27 - (legR + 3) + 1} fill={bottom} opacity="0.7" />
      {/* Zapatos */}
      <rect x={8} y={27} width="3" height="3" fill={shoes} />
      <rect x={13} y={27} width="3" height="3" fill={shoes} />
    </svg>
  );
}

function AnimatedCharacter({
  variant,
  walking,
}: {
  variant: CharVariant;
  walking: boolean;
}) {
  return (
    <div className="char-anim">
      <div className="char-layer char-pose-a">
        <PixelPerson variant={variant} pose="a" />
      </div>
      <div className="char-layer char-pose-b">
        <PixelPerson variant={variant} pose="b" />
      </div>
      <style jsx>{`
        .char-anim {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .char-layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .char-pose-a {
          opacity: ${walking ? "1" : "1"};
          animation: ${walking ? "poseA 560ms steps(1) infinite" : "none"};
        }
        .char-pose-b {
          opacity: 0;
          animation: ${walking ? "poseB 560ms steps(1) infinite" : "none"};
        }
        @keyframes poseA {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes poseB {
          0%, 49% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .char-pose-a, .char-pose-b { animation: none !important; }
          .char-pose-a { opacity: 1 !important; }
          .char-pose-b { opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
}

/* ==========================================================================
   RoomScene — pega mobiliario + personaje según servicio
   ========================================================================== */

export default function RoomScene({ serviceId, accent, walking, className }: RoomSceneProps) {
  const variant = CHAR_VARIANTS[serviceId];

  return (
    <div className={`room-scene ${className ?? ""}`}>
      {/* Capa de mobiliario SVG (absolute, fills parent) */}
      <svg
        className="furniture"
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMax meet"
        shapeRendering="crispEdges"
      >
        {serviceId === "web" && (
          <>
            <Bookshelf x={5} y={42} accent={accent} />
            <Plant x={32} y={64} />
            <Desk x={70} y={54} accent={accent} />
            <CoffeeMaker x={170} y={72} accent={accent} />
            <Chair x={95} y={88} accent={accent} />
          </>
        )}
        {serviceId === "ai" && (
          <>
            <ServerRack x={8} y={44} accent={accent} />
            <Plant x={30} y={64} />
            <Whiteboard x={56} y={40} accent={accent} />
            <Desk x={100} y={64} accent={accent} />
            <Chair x={125} y={98} accent={accent} />
          </>
        )}
        {serviceId === "auto" && (
          <>
            <FilingCabinet x={4} y={46} accent={accent} />
            <Plant x={24} y={64} />
            <Desk x={60} y={54} accent={accent} />
            <CoffeeMaker x={170} y={72} accent={accent} />
            <Chair x={85} y={88} accent={accent} />
          </>
        )}
        {serviceId === "agents" && (
          <>
            <Whiteboard x={6} y={44} accent={accent} />
            <Plant x={48} y={64} />
            <Desk x={74} y={54} accent={accent} />
            {/* Headset sobre el escritorio */}
            <Headset x={120} y={42} accent={accent} />
            <Chair x={100} y={88} accent={accent} />
          </>
        )}
      </svg>

      {/* Capa del personaje (pacing animation) */}
      <div className="char-wrap" aria-hidden="true">
        <AnimatedCharacter variant={variant} walking={walking} />
      </div>

      <style jsx>{`
        .room-scene {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .furniture {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
          pointer-events: none;
        }
        .char-wrap {
          position: absolute;
          left: 0;
          bottom: 4%;
          width: 14%;
          height: 48%;
          animation: ${walking ? "pace 7s ease-in-out infinite alternate" : "none"};
          pointer-events: none;
          z-index: 2;
        }
        @keyframes pace {
          0%   { left: 34%;  transform: scaleX(1);  }
          49%  { left: 60%;  transform: scaleX(1);  }
          50%  { left: 60%;  transform: scaleX(-1); }
          100% { left: 34%;  transform: scaleX(-1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .char-wrap { animation: none !important; left: 45% !important; }
        }
      `}</style>
    </div>
  );
}
