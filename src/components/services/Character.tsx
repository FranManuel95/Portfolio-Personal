"use client";

import { useState } from "react";

type CharacterProps = {
  spriteUrl: string;
  fallbackEmoji?: string;
  accent: string;
  walking: boolean;
  className?: string;
};

type SvgFallbackProps = {
  accent: string;
  walking: boolean;
};

function SvgFallback({ accent, walking }: SvgFallbackProps) {
  const skin = "#f4c8a0";
  const legs = "#1e3a8a";
  const shoes = "#000000";
  const eyes = "#000000";

  return (
    <div className="svg-fallback" aria-hidden="true">
      {/* Pose A (idle / contact) */}
      <svg
        className="pose pose-a"
        viewBox="0 0 16 22"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* head */}
        <rect x="5" y="1" width="6" height="6" fill={skin} />
        {/* eyes */}
        <rect x="6" y="3" width="1" height="1" fill={eyes} />
        <rect x="9" y="3" width="1" height="1" fill={eyes} />
        {/* body / shirt */}
        <rect x="4" y="7" width="8" height="7" fill={accent} />
        {/* arms */}
        <rect x="3" y="8" width="1" height="5" fill={accent} />
        <rect x="12" y="8" width="1" height="5" fill={accent} />
        {/* legs */}
        <rect x="5" y="14" width="2" height="5" fill={legs} />
        <rect x="9" y="14" width="2" height="5" fill={legs} />
        {/* shoes */}
        <rect x="5" y="19" width="2" height="2" fill={shoes} />
        <rect x="9" y="19" width="2" height="2" fill={shoes} />
      </svg>

      {/* Pose B (mid-stride) */}
      <svg
        className="pose pose-b"
        viewBox="0 0 16 22"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <rect x="5" y="1" width="6" height="6" fill={skin} />
        <rect x="6" y="3" width="1" height="1" fill={eyes} />
        <rect x="9" y="3" width="1" height="1" fill={eyes} />
        <rect x="4" y="7" width="8" height="7" fill={accent} />
        {/* arms swinging */}
        <rect x="3" y="9" width="1" height="5" fill={accent} />
        <rect x="12" y="7" width="1" height="5" fill={accent} />
        {/* legs in stride */}
        <rect x="4" y="14" width="2" height="5" fill={legs} />
        <rect x="10" y="14" width="2" height="5" fill={legs} />
        <rect x="4" y="19" width="2" height="2" fill={shoes} />
        <rect x="10" y="19" width="2" height="2" fill={shoes} />
      </svg>

      <style jsx>{`
        .svg-fallback {
          position: relative;
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
        }
        .pose {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .pose-a {
          opacity: 1;
        }
        .pose-b {
          opacity: 0;
        }
        ${walking
          ? `
          .pose-a { animation: poseA 560ms steps(1) infinite; }
          .pose-b { animation: poseB 560ms steps(1) infinite; }
        `
          : ""}
        @keyframes poseA {
          0%,
          49.99% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        @keyframes poseB {
          0%,
          49.99% {
            opacity: 0;
          }
          50%,
          100% {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pose-a,
          .pose-b {
            animation: none !important;
          }
          .pose-a {
            opacity: 1;
          }
          .pose-b {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default function Character({
  spriteUrl,
  fallbackEmoji,
  accent,
  walking,
  className = "",
}: CharacterProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={`character ${className}`}
      role="img"
      aria-label={fallbackEmoji ?? "character"}
    >
      {!error ? (
        <div
          className="sprite-sheet"
          style={{ backgroundImage: `url(${spriteUrl})` }}
        />
      ) : (
        <SvgFallback accent={accent} walking={walking} />
      )}

      {/* Hidden probe img solely to catch onError for missing PNG */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spriteUrl}
        alt=""
        onError={() => setError(true)}
        style={{ display: "none" }}
      />

      <style jsx>{`
        .character {
          position: absolute;
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          width: 64px;
          aspect-ratio: 1 / 1;
          ${walking
            ? `animation: pace 6s ease-in-out infinite alternate, flip 12s steps(1) infinite;`
            : ""}
        }
        .sprite-sheet {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 400% 100%;
          background-position: 0 0;
          image-rendering: pixelated;
          animation: walkCycle 560ms steps(4) infinite;
          animation-play-state: ${walking ? "running" : "paused"};
        }
        @keyframes walkCycle {
          from {
            background-position: 0 0;
          }
          to {
            background-position: -400% 0;
          }
        }
        @keyframes pace {
          0% {
            left: 10%;
          }
          100% {
            left: 65%;
          }
        }
        /* flip runs one full cycle = 2x pace duration; scaleX(-1) during the return leg */
        @keyframes flip {
          0%,
          49.99% {
            transform: translateY(-50%) scaleX(1);
          }
          50%,
          100% {
            transform: translateY(-50%) scaleX(-1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .character {
            animation: none !important;
            transform: translateY(-50%) !important;
          }
          .sprite-sheet {
            animation: none !important;
            background-position: 0 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
