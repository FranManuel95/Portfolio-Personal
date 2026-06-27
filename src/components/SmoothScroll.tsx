"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      // ROOT-CAUSE FIX for the galaxy zoom/scroll conflict:
      // Lenis registers a global non-passive wheel/touch listener and hijacks
      // every event for page scroll — which fights drei OrbitControls' own wheel
      // listener over the 3D canvas. `prevent` makes Lenis skip (not smooth-scroll)
      // any event whose target is inside an element flagged [data-galaxy-canvas].
      // The galaxy only sets that attribute while it is in interactive "LIVE" mode,
      // so: AMBIENT → no attribute → wheel scrolls the page normally; LIVE →
      // attribute present → wheel/touch go entirely to OrbitControls (zoom/rotate).
      // Declarative routing — if a state transition is ever missed the page still
      // scrolls, so this can never freeze the page (unlike lenis.stop()).
      prevent: (node) =>
        node.nodeType === 1 &&
        !!(node as HTMLElement).closest?.("[data-galaxy-canvas]"),
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
