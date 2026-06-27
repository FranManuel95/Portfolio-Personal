"use client";

import dynamic from "next/dynamic";

export { TechGalaxyProvider } from "./TechGalaxyContext";
export { default as TechGalaxyControls } from "./TechGalaxyControls";

// WebGL/Three.js needs window — load it client-side only
export const TechGalaxyBackground = dynamic(
  () => import("./TechGalaxyScene").then((m) => m.TechGalaxyBackgroundLayer),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)]">
          ◆ Cargando sistema solar...
        </p>
      </div>
    ),
  }
);

// Legacy no-op default export so any stale import of <TechGalaxy /> still compiles.
export default function TechGalaxy() {
  return null;
}
