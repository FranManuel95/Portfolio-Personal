"use client";

import { useEffect, useRef } from "react";

export default function CursorHalo() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current!;
    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const state = { x: target.x, y: target.y };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const loop = () => {
      // Interpolación suave para seguir al ratón
      state.x += (target.x - state.x) * 0.12;
      state.y += (target.y - state.y) * 0.12;
      node.style.transform = `translate3d(${state.x - 200}px, ${state.y - 200}px, 0)`; // centrar halo
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[1] h-[400px] w-[400px] rounded-full opacity-20"
      style={{
        background:
          "radial-gradient(200px 200px at center, rgba(124,134,255,0.25), rgba(0,0,0,0))",
        mixBlendMode: "screen",
        filter: "blur(8px)",
      }}
    />
  );
}
