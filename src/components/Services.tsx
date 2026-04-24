"use client";

import React, { useState, useCallback, useEffect } from "react";
import Reveal from "./Reveal";
import Character from "./services/Character";
import TerminalPanel from "./services/TerminalPanel";
import { SERVICES, type Service, type AgentState } from "./services-data";

/**
 * Services — "Oficina Agéntica" con dual-panel layout:
 * - Izquierda: 4 "habitaciones" (bounded contexts) con agentes pixel-art
 * - Derecha: Terminal de actividad del agente seleccionado
 *
 * Mobile (<sm): rooms apilados 1-col, terminal debajo cuando se selecciona
 * Tablet (sm-lg): rooms 2x2, terminal debajo a ancho completo
 * Desktop (lg+): rooms 2x2 a la izquierda, terminal fijo a la derecha
 */
export default function Services() {
  const [activeId, setActiveId] = useState<Service["id"] | null>(null);
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>(
    Object.fromEntries(SERVICES.map((s) => [s.id, "idle" as AgentState]))
  );

  const active = activeId ? SERVICES.find((s) => s.id === activeId) ?? null : null;

  const handleSelect = useCallback((id: Service["id"]) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleAgentStateChange = useCallback((id: Service["id"], state: AgentState) => {
    setAgentStates((prev) => (prev[id] === state ? prev : { ...prev, [id]: state }));
  }, []);

  // Active room marks its agent as "active", others return to idle
  useEffect(() => {
    setAgentStates((prev) => {
      const next: Record<string, AgentState> = { ...prev };
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
            4 <span className="text-[var(--text)] font-semibold">bounded contexts</span>, cada uno
            con su agente especializado. Haz clic en cualquier habitación para abrir su terminal
            de actividad.
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
            {/* Panel izquierdo: grid de habitaciones */}
            <div className="w-full lg:flex-[3] min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {SERVICES.map((s) => (
                  <RoomCard
                    key={s.id}
                    service={s}
                    active={s.id === activeId}
                    state={agentStates[s.id] ?? "idle"}
                    onClick={() => handleSelect(s.id)}
                  />
                ))}
              </div>
            </div>

            {/* Panel derecho: terminal */}
            <div className="w-full lg:flex-[2] lg:max-w-[460px] xl:max-w-[520px] min-w-0">
              <TerminalPanel
                service={active}
                onClose={() => setActiveId(null)}
                onStateChange={(st) => {
                  if (activeId) handleAgentStateChange(activeId, st);
                }}
                className="h-full min-h-[360px] lg:min-h-[500px]"
              />
            </div>
          </div>
        </Reveal>

        <Reveal replay delayMs={280}>
          <SocialProof />
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================================
   RoomCard — una habitación 2D flat (sin perspectiva 3D)
   ========================================================================= */
function RoomCard({
  service,
  active,
  state,
  onClick,
}: {
  service: Service;
  active: boolean;
  state: AgentState;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`${active ? "Cerrar" : "Abrir"} terminal de ${service.title}`}
      className="room-card group relative overflow-hidden rounded-lg text-left transition-all duration-300"
      style={{
        aspectRatio: "4 / 3",
        border: `2px solid ${active ? service.accent : "var(--line)"}`,
        background: `linear-gradient(180deg, ${service.bgTint} 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.55) 100%)`,
        boxShadow: active
          ? `0 0 0 1px ${service.accent}, 0 8px 28px ${service.accent}44, inset 0 0 40px ${service.accent}22`
          : "inset 0 0 22px rgba(0,0,0,0.45)",
      }}
    >
      {/* Back wall — subtle color band */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "42%",
          background: `linear-gradient(180deg, ${service.accent}14 0%, transparent 100%)`,
        }}
      />

      {/* Wall/floor baseline */}
      <div
        aria-hidden
        className="absolute inset-x-0 pointer-events-none"
        style={{
          top: "42%",
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${service.accent}88 50%, transparent 100%)`,
          boxShadow: `0 0 10px ${service.accent}88`,
        }}
      />

      {/* Floor — pixel tiles pattern */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          top: "42%",
          backgroundColor: `${service.accent}0a`,
          backgroundImage: `
            linear-gradient(90deg, rgba(0,0,0,0.22) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "clamp(14px, 4%, 22px) clamp(14px, 4%, 22px)",
        }}
      />

      {/* Scanline overlay for CRT feel */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Header: role + title */}
      <header className="absolute top-2.5 left-3 right-3 z-20 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div
            className="text-[9px] sm:text-[10px] uppercase font-semibold truncate"
            style={{ color: service.accent, letterSpacing: "0.14em" }}
          >
            {service.role}
          </div>
          <h3 className="text-sm sm:text-base font-bold truncate" style={{ color: "var(--text)" }}>
            {service.title}
          </h3>
        </div>
        <StateBadge state={state} />
      </header>

      {/* Tagline */}
      <p
        className="absolute top-[56px] sm:top-[60px] left-3 right-3 z-10 text-[10px] sm:text-[11px] leading-tight line-clamp-2"
        style={{ color: "var(--text-dim)" }}
      >
        {service.tagline}
      </p>

      {/* Character — pacing on the floor */}
      <div
        aria-hidden
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{ bottom: "6%", height: "42%" }}
      >
        <Character
          spriteUrl={service.spriteUrl}
          accent={service.accent}
          walking={true}
          className="h-full"
        />
      </div>

      {/* Click affordance */}
      <div
        className="absolute bottom-2 right-3 z-20 text-[9px] font-mono tracking-wider transition-opacity"
        style={{ color: service.accent, opacity: active ? 1 : 0.55 }}
      >
        {active ? "◉ terminal open" : "◌ click to inspect"}
      </div>
    </button>
  );
}

/* =========================================================================
   StateBadge — indicador visual del estado del agente
   ========================================================================= */
function StateBadge({ state }: { state: AgentState }) {
  const config: Record<AgentState, { color: string; label: string; pulse: boolean }> = {
    active: { color: "#10b981", label: "ACTIVE", pulse: true },
    waiting: { color: "#f59e0b", label: "WAITING", pulse: true },
    done: { color: "#60a5fa", label: "DONE", pulse: false },
    idle: { color: "#6b7280", label: "IDLE", pulse: false },
  };
  const cfg = config[state];
  return (
    <div
      className="flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono tracking-wider"
      style={{
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "#e0e0e8",
      }}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.pulse ? "animate-pulse" : ""}`}
        style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }}
      />
      <span>{cfg.label}</span>
    </div>
  );
}

/* =========================================================================
   SocialProof — métricas de confianza técnica (GitHub-like)
   ========================================================================= */
function SocialProof() {
  const metrics = [
    { label: "GitHub stars", value: "2.8k", icon: "★" },
    { label: "Forks", value: "400+", icon: "⑂" },
    { label: "Weekly downloads", value: "10k+", icon: "↓" },
    { label: "Changelog", value: "v2.4", icon: "◈" },
  ];
  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-md px-3 py-2 text-center border border-[var(--line)]"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="text-lg sm:text-xl font-bold text-[var(--text)]">
            <span className="mr-1 opacity-70">{m.icon}</span>
            {m.value}
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[var(--text-dim)]">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
