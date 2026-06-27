"use client";

import dynamic from "next/dynamic";
import React from "react";

const TechGalaxyScene = dynamic(() => import("./TechGalaxyScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-[780px] mx-auto flex items-center justify-center">
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)]">
        ◆ Cargando sistema solar...
      </p>
    </div>
  ),
});

export default function TechGalaxy() {
  return <TechGalaxyScene />;
}
