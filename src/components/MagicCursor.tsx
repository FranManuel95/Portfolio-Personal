"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function MagicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let raf: number;
    let hovering = false;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const el = document.elementFromPoint(mx, my);
      const isHover = el?.closest("a,button,[data-cursor]") !== null;
      if (isHover !== hovering) {
        hovering = isHover;
        ring.style.width  = isHover ? "72px" : "40px";
        ring.style.height = isHover ? "72px" : "40px";
        ring.style.opacity = isHover ? "0.7" : "1";
      }
    };

    const loop = () => {
      // Dot: very fast (lerp 0.85)
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      {/* Precision dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "white",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          transition: "width 0.35s cubic-bezier(.22,1,.36,1), height 0.35s cubic-bezier(.22,1,.36,1), opacity 0.25s",
          opacity: 1,
        }}
      />
    </>
  );
}
