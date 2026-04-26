"use client";

// PNG sprite sheet: 256×48 (8 frames × 32px wide, 48px tall)
// Display at 2× pixel-perfect scaling → 64×96px per frame
const FRAME_W = 32;
const FRAME_H = 48;
const FRAMES = 8;
const SCALE = 2;

const DW = FRAME_W * SCALE;   // 64
const DH = FRAME_H * SCALE;   // 96
const SW = FRAME_W * FRAMES * SCALE; // 512 (full sheet scaled)

export default function CharacterSprite({ src }: { src: string }) {
  return (
    <div className="char-wrap" aria-hidden="true">
      <div
        className="char-sprite"
        style={{ backgroundImage: `url(${src})` }}
      />
      <style jsx>{`
        .char-wrap {
          position: absolute;
          bottom: 4px;
          left: 8%;
          width: ${DW}px;
          height: ${DH}px;
          image-rendering: pixelated;
          animation: pace 7s ease-in-out infinite alternate,
                     flip 14s steps(1) infinite;
        }
        .char-sprite {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: ${SW}px ${DH}px;
          background-position: 0 0;
          image-rendering: pixelated;
          animation: walk 640ms steps(${FRAMES}, end) infinite;
        }
        @keyframes walk {
          from { background-position: 0px 0; }
          to   { background-position: -${SW}px 0; }
        }
        @keyframes pace {
          0%   { left: 8%; }
          100% { left: 58%; }
        }
        @keyframes flip {
          0%, 49.99% { transform: scaleX(1); }
          50%, 100%  { transform: scaleX(-1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .char-wrap   { animation: none !important; left: 30% !important; }
          .char-sprite { animation: none !important; background-position: 0 0 !important; }
        }
      `}</style>
    </div>
  );
}
