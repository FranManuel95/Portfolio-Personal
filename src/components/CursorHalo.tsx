"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type CursorHaloProps = {
  size?: number;
  mobileSize?: number;
  color?: string;             // si no se pasa, lee --accent
  opacity?: number;           // 0..1
  follow?: number;            // 0.15 muy suave, 0.35 más reactivo
  blur?: number;              // px
  zIndex?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  enabled?: boolean;
  children?: React.ReactNode; // por si alguien lo usa con children; se ignoran
};

export default function CursorHalo({
  size = 620,
  mobileSize = 340,
  color,
  opacity = 0.22,
  follow = 0.2,
  blur = 10,
  zIndex = 60,
  mixBlendMode = "normal",
  enabled = true,
}: CursorHaloProps) {
  const reduce = useReducedMotion();
  const haloRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const x = useRef(0);
  const y = useRef(0);
  const tx = useRef(0);
  const ty = useRef(0);
  const visible = useRef(false);
  const diameter = useRef(size);

  const readAccent = (): string | undefined => {
    if (typeof window === "undefined") return undefined;
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    return v || undefined;
  };

  useEffect(() => {
    if (!enabled || reduce) return;

    const el = haloRef.current;
    if (!el) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    diameter.current = coarse ? mobileSize : size;

    const baseColor = color ?? readAccent() ?? "rgb(124 134 255)";
    const d = diameter.current;

    // Estilos (sin assertions)
    el.style.position = "fixed";
    el.style.left = "0px";
    el.style.top = "0px";
    el.style.width = `${d}px`;
    el.style.height = `${d}px`;
    el.style.transform = "translate3d(-9999px,-9999px,0)";
    el.style.pointerEvents = "none";
    el.style.zIndex = String(zIndex);
    el.style.borderRadius = "9999px";
    el.style.opacity = "0";
    el.style.willChange = "transform, opacity";
    el.style.setProperty("mix-blend-mode", mixBlendMode ?? "normal");
    el.style.background = `radial-gradient(50% 50% at 50% 50%, ${baseColor} 12%, rgba(124,134,255,0) 70%)`;
    el.style.setProperty("filter", `blur(${blur}px)`);

    const show = () => {
      if (!visible.current) {
        visible.current = true;
        el.style.opacity = String(opacity);
      }
    };
    const hide = () => {
      visible.current = false;
      el.style.opacity = "0";
    };

    // Destino con mouse/touch (tipados)
    const handleMouseMove = (e: MouseEvent) => {
      tx.current = e.clientX - d / 2;
      ty.current = e.clientY - d / 2;
      show();
    };
    const handleMouseLeave = () => hide();

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      tx.current = t.clientX - d / 2;
      ty.current = t.clientY - d / 2;
      show();
    };
    const handleTouchEnd = () => hide();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") hide();
    };

    // rAF loop con lerp
    const loop = () => {
      x.current += (tx.current - x.current) * follow;
      y.current += (ty.current - y.current) * follow;
      el.style.transform = `translate3d(${x.current}px, ${y.current}px, 0)`;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // Listeners (passive)
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, reduce, size, mobileSize, color, opacity, follow, blur, zIndex, mixBlendMode]);

  if (!enabled || reduce) return null;
  return <div ref={haloRef} aria-hidden />;
}
