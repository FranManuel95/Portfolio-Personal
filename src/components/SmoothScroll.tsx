"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      // Skip Lenis for any node that has data-lenis-prevent OR is inside one.
      // This lets WebGL canvases (OrbitControls scroll-zoom, etc.) receive
      // native wheel events instead of being hijacked for page scroll.
      prevent: (node) =>
        node.hasAttribute?.("data-lenis-prevent") ||
        !!node.closest?.("[data-lenis-prevent]"),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keep anchor links working
    const handleAnchor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      e.preventDefault();
      const id = anchor.getAttribute("href")!.slice(1);
      const el = document.getElementById(id);
      if (el) lenis.scrollTo(el, { offset: -80 });
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchor);
    };
  }, []);

  return null;
}
