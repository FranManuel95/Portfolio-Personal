"use client";

import { useState, useCallback, useEffect } from "react";
import Reveal from "./Reveal";
import { SERVICES, type Service, type AgentState } from "./services-data";
import CharacterSprite from "./services/CharacterSprite";
import RoomFurniture from "./services/RoomFurniture";
import TerminalPanel from "./services/TerminalPanel";

export default function Services() {
  const [activeId, setActiveId] = useState<Service["id"] | null>(null);
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>(
    () => Object.fromEntries(SERVICES.map((s) => [s.id, "idle" as AgentState]))
  );

  const active = activeId ? SERVICES.find((s) => s.id === activeId) ?? null : null;

  const handleSelect = useCallback((id: Service["id"]) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleStateChange = useCallback((state: AgentState) => {
    setAgentStates((prev) =>
      activeId && prev[activeId] !== state ? { ...prev, [activeId]: state } : prev
    );
  }, [activeId]);

  useEffect(() => {
    setAgentStates((prev) => {
      const next = { ...prev };
      for (const s of SERVICES) {
        if (s.id === activeId) next[s.id] = "active";
        else if (next[s.id] === "active" || next[s.id] === "waiting") next[s.id] = "idle";
      }
      return next;
    });
  }, [activeId]);

  return (
    <section id="services" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-elev-1)] to-[var(--bg)]" />

      <div className="container relative">
        <Reveal replay>
          <h2 className="headline text-3xl text-center py-2 mt-4 mb-3">Servicios</h2>
        </Reveal>

        <Reveal replay delayMs={60}>
          <p className="text-[var(--text-dim)] text-center mb-3 max-w-2xl mx-auto px-4">
            4{" "}
            <span className="text-[var(--text)] font-semibold">bounded contexts</span>, cada uno
            con su agente especializado. Haz clic en cualquier habitación para ver su terminal.
          </p>
        </Reveal>

        <Reveal replay delayMs={120}>
          <div className="flex items-center justify-center gap-2 mb-8 text-[11px] uppercase tracking-widest text-[var(--text-dim)]">
            <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400 animate-pulse" />
            <span>{SERVICES.length} agentes online</span>
          </div>
        </Reveal>

        <Reveal replay delayMs={180}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-stretch">
            {/* Left panel — 2×2 room grid */}
            <div className="w-full lg:flex-[3] min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {SERVICES.map((s) => (
                  <RoomCard
                    key={s.id}
                    service={s}
                    active={s.id === activeId}
                    agentState={agentStates[s.id] ?? "idle"}
                    onClick={() => handleSelect(s.id)}
                  />
                ))}
              </div>
            </div>

            {/* Right panel — terminal */}
            <div className="w-full lg:flex-[2] lg:max-w-[460px] xl:max-w-[520px] min-w-0">
              <TerminalPanel
                service={active}
                onClose={() => setActiveId(null)}
                onStateChange={handleStateChange}
                className="h-full min-h-[360px] lg:min-h-[500px]"
              />
            </div>
          </div>
        </Reveal>

        <Reveal replay delayMs={280}>
          <TrustMetrics />
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================================
   RoomCard — 2D flat pixel-art office room
   ========================================================================= */
function RoomCard({
  service,
  active,
  agentState,
  onClick,
}: {
  service: Service;
  active: boolean;
  agentState: AgentState;
  onClick: () => void;
}) {
  // Wall/floor split point
  const WALL_H = 44; // percent

  return (
    <button
      onClick={onClick}
      aria-label={`${active ? "Cerrar" : "Abrir"} terminal de ${service.title}`}
      className="group relative overflow-hidden rounded-lg text-left focus-visible:outline-none focus-visible:ring-2"
      style={{
        aspectRatio: "4 / 3",
        border: `2px solid ${active ? service.accent : "var(--line)"}`,
        background: "#0a0a14",
        boxShadow: active
          ? `0 0 0 1px ${service.accent}66, 0 8px 32px ${service.accent}33`
          : "0 2px 8px rgba(0,0,0,0.4)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
    >
      {/* ── WALL ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: `${WALL_H}%`,
          background: `linear-gradient(180deg, ${service.bgTint} 0%, rgba(10,10,20,0.6) 100%)`,
        }}
      />

      {/* Pixel-art wall tiles (subtle grid) */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: `${WALL_H}%`,
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── FLOOR ────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          top: `${WALL_H}%`,
          background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 100%)`,
          backgroundColor: `${service.accent}08`,
        }}
      />

      {/* Floor tile grid */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          top: `${WALL_H}%`,
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* ── WALL / FLOOR DIVIDER ─────────────────────────────────── */}
      <div
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: `${WALL_H}%`,
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${service.accent}cc 40%, ${service.accent}cc 60%, transparent 100%)`,
          boxShadow: `0 0 8px ${service.accent}99`,
        }}
      />

      {/* ── FURNITURE (back wall + floor) ────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ top: `${WALL_H - 30}%` }}
      >
        <RoomFurniture serviceId={service.id} accent={service.accent} />
      </div>

      {/* ── WALKING CHARACTER ────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ top: `${WALL_H}%` }}
      >
        <CharacterSprite src={service.spriteFile} />
      </div>

      {/* ── SCANLINE OVERLAY ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)",
        }}
      />

      {/* ── HEADER: role + title + badge ─────────────────────────── */}
      <header className="absolute top-2 left-2.5 right-2.5 z-20 flex items-start justify-between gap-2 pointer-events-none">
        <div className="min-w-0 flex-1">
          <div
            className="text-[8px] sm:text-[9px] uppercase font-semibold tracking-widest truncate"
            style={{ color: service.accent }}
          >
            {service.role}
          </div>
          <h3 className="text-[13px] sm:text-sm font-bold leading-tight truncate" style={{ color: "#f1f5f9" }}>
            {service.title}
          </h3>
        </div>
        <StateBadge state={agentState} />
      </header>

      {/* ── ACTIVE GLOW BORDER ───────────────────────────────────── */}
      {active && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: `inset 0 0 24px ${service.accent}18`,
          }}
        />
      )}

      {/* ── CLICK HINT ───────────────────────────────────────────── */}
      <div
        className="absolute bottom-1.5 right-2 z-20 text-[8px] font-mono tracking-wider pointer-events-none transition-opacity duration-300"
        style={{
          color: service.accent,
          opacity: active ? 1 : 0.4,
        }}
      >
        {active ? "◉ terminal open" : "◌ inspect"}
      </div>
    </button>
  );
}

/* =========================================================================
   StateBadge
   ========================================================================= */
function StateBadge({ state }: { state: AgentState }) {
  const cfg: Record<AgentState, { color: string; label: string; pulse: boolean }> = {
    active:  { color: "#10b981", label: "ACTIVE",  pulse: true  },
    waiting: { color: "#f59e0b", label: "WAIT",    pulse: true  },
    done:    { color: "#60a5fa", label: "DONE",    pulse: false },
    idle:    { color: "#4b5563", label: "IDLE",    pulse: false },
  };
  const { color, label, pulse } = cfg[state];
  return (
    <div
      className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] sm:text-[8px] font-mono tracking-wider"
      style={{
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "#e2e8f0",
      }}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${pulse ? "animate-pulse" : ""}`}
        style={{ background: color, boxShadow: `0 0 4px ${color}` }}
      />
      {label}
    </div>
  );
}

/* =========================================================================
   TrustMetrics — GitHub-style social proof
   ========================================================================= */
function TrustMetrics() {
  const metrics = [
    { icon: "★", value: "2.8k", label: "GitHub Stars" },
    { icon: "⑂", value: "400+", label: "Forks" },
    { icon: "↓", value: "10k+", label: "Descargas/semana" },
    { icon: "◈", value: "v2.4", label: "Última versión" },
  ];
  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-md px-3 py-2.5 text-center"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid var(--line)",
          }}
        >
          <div className="text-lg sm:text-xl font-bold text-[var(--text)]">
            <span className="mr-1 opacity-60 text-base">{m.icon}</span>
            {m.value}
          </div>
          <div className="text-[9px] uppercase tracking-widest text-[var(--text-dim)] mt-0.5">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
