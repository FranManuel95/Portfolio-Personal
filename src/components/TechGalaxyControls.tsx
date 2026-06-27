"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, useTechGalaxy } from "./TechGalaxyContext";

export default function TechGalaxyControls() {
  const {
    selected,
    setSelected,
    setHoveredCategory,
    filterCategory,
    setFilterCategory,
    manualPause,
    setManualPause,
    speedMul,
    setSpeedMul,
  } = useTechGalaxy();

  return (
    <div className="mt-8 max-w-2xl mx-auto relative pointer-events-auto" style={{ zIndex: 10 }}>
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={`${selected.category.name}-${selected.tech}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center"
          >
            <p
              className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2"
              style={{ color: selected.category.brand }}
            >
              {selected.category.name}
            </p>
            <h4
              className="font-black uppercase tracking-tight"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                letterSpacing: "-0.03em",
                color: "var(--text)",
              }}
            >
              {selected.tech}
            </h4>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-[10px] font-mono uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
            >
              × Cerrar · Reanudar órbitas
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-dim)]"
          >
            ◆ Arrastra para rotar · Scroll para zoom · Pulsa un planeta
          </motion.p>
        )}
      </AnimatePresence>

      {/* Action bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setManualPause((p) => !p)}
          className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-[var(--line)] bg-[var(--bg)]/60 backdrop-blur-sm text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-all"
        >
          {manualPause ? "▶ Reanudar" : "❚❚ Pausar"}
        </button>
        {[
          { label: "0.5×", value: 0.5 as const },
          { label: "1×", value: 1 as const },
          { label: "2×", value: 2 as const },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setSpeedMul(s.value)}
            className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border backdrop-blur-sm transition-all"
            style={{
              borderColor: speedMul === s.value ? "var(--accent)" : "var(--line)",
              color: speedMul === s.value ? "var(--accent)" : "var(--text-dim)",
              background:
                speedMul === s.value ? "rgba(0,255,135,0.10)" : "rgba(8,8,8,0.55)",
            }}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => {
            setSelected(null);
            setFilterCategory(null);
            setManualPause(false);
            setSpeedMul(1);
          }}
          className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-[var(--line)] bg-[var(--bg)]/60 backdrop-blur-sm text-[var(--text-dim)] hover:text-[var(--accent-2)] hover:border-[var(--accent-2)]/40 transition-all"
        >
          ↺ Reset
        </button>
      </div>

      {/* Category filter legend — click to isolate */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {CATEGORIES.map((c) => {
          const active = filterCategory === c.name;
          const otherActive = filterCategory !== null && filterCategory !== c.name;
          return (
            <button
              key={c.name}
              onMouseEnter={() => setHoveredCategory(c.name)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => setFilterCategory(active ? null : c.name)}
              className="flex items-center gap-2 px-2 py-1 text-[10px] font-mono uppercase tracking-widest transition-all border"
              style={{
                color: c.brand,
                borderColor: active ? c.brand : "transparent",
                background: active ? `${c.brand}10` : "transparent",
                opacity: otherActive ? 0.3 : 1,
              }}
              title={active ? "Mostrar todas" : "Aislar esta categoría"}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: c.brand,
                  boxShadow: `0 0 8px ${c.brand}`,
                }}
              />
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
