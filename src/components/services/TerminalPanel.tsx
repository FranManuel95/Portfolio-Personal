"use client";

import { useEffect, useRef, useState } from "react";
import type { Service, AgentState, LogLine } from "../services-data";

type Props = {
  service: Service | null;
  onClose: () => void;
  onStateChange: (state: AgentState) => void;
  className?: string;
};

const CHAR_DELAY = 18;    // ms per character
const LINE_PAUSE = 200;   // ms between lines

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

type RenderedLine = LogLine & { text: string; partial: boolean };

export default function TerminalPanel({ service, onClose, onStateChange, className = "" }: Props) {
  const [lines, setLines] = useState<RenderedLine[]>([]);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Reset & stream when service changes
  useEffect(() => {
    if (!service) {
      setLines([]);
      setDone(false);
      return;
    }

    setLines([]);
    setDone(false);
    onStateChange("active");

    if (reduced) {
      // Show everything instantly
      setLines(service.logs.map((l) => ({ ...l, partial: false })));
      setDone(true);
      onStateChange("done");
      return;
    }

    let cancelled = false;
    let lineIdx = 0;
    let charIdx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;

      const log = service!.logs;

      if (lineIdx >= log.length) {
        setDone(true);
        onStateChange("done");
        return;
      }

      const currentLine = log[lineIdx];
      charIdx++;

      if (charIdx <= currentLine.text.length) {
        setLines((prev) => {
          const next = [...prev];
          if (next.length <= lineIdx) {
            next.push({ ...currentLine, text: currentLine.text.slice(0, charIdx), partial: true });
          } else {
            next[lineIdx] = { ...currentLine, text: currentLine.text.slice(0, charIdx), partial: charIdx < currentLine.text.length };
          }
          return next;
        });
        timeoutId = setTimeout(tick, CHAR_DELAY);
      } else {
        // Line complete — pause then advance
        setLines((prev) => {
          const next = [...prev];
          next[lineIdx] = { ...currentLine, text: currentLine.text, partial: false };
          return next;
        });
        lineIdx++;
        charIdx = 0;
        timeoutId = setTimeout(tick, LINE_PAUSE);
      }
    }

    timeoutId = setTimeout(tick, 200);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service?.id, reduced]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const isEmpty = !service;

  return (
    <div
      className={`terminal-panel flex flex-col ${className}`}
      style={{
        background: "#0d0d1a",
        border: `1px solid ${service ? service.accent + "44" : "var(--line)"}`,
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        boxShadow: service
          ? `0 0 0 1px ${service.accent}22, 0 8px 32px ${service.accent}18`
          : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{
          background: "#111126",
          borderBottom: `1px solid ${service ? service.accent + "30" : "#ffffff14"}`,
        }}
      >
        {/* Traffic-light dots */}
        <div className="flex gap-1.5">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full transition-opacity hover:opacity-70"
            style={{ background: "#ef4444" }}
            aria-label="Cerrar terminal"
          />
          <span className="w-3 h-3 rounded-full" style={{ background: "#eab308" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
        </div>
        <span
          className="flex-1 text-center text-[10px] truncate"
          style={{ color: service ? service.accent : "#4b5563" }}
        >
          {service ? `${service.role} · activity log` : "terminal — selecciona una habitación"}
        </span>
        {service && (
          <span
            className="text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded"
            style={{
              background: done ? "#1a2e1a" : "#1a1a2e",
              color: done ? "#34d399" : service.accent,
              border: `1px solid ${done ? "#34d39944" : service.accent + "44"}`,
            }}
          >
            {done ? "DONE" : "ACTIVE"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0" style={{ scrollbarWidth: "none" }}>
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Service header */}
            <div className="mb-3">
              <div
                className="text-[9px] uppercase tracking-widest mb-0.5"
                style={{ color: service.accent }}
              >
                {service.role}
              </div>
              <div className="text-sm font-bold" style={{ color: "#f1f5f9" }}>
                {service.title}
              </div>
              <div className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>
                {service.tagline}
              </div>
            </div>

            <div
              className="mb-3 pb-2"
              style={{ borderBottom: `1px solid ${service.accent}22` }}
            />

            {/* Log lines */}
            <div className="space-y-1.5">
              {lines.map((line, i) => (
                <LogLineRow
                  key={i}
                  line={line}
                  accent={service.accent}
                  isLast={i === lines.length - 1}
                />
              ))}
              {!done && lines.length < service.logs.length && (
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: service.accent }}
                  />
                  <span className="text-[9px]" style={{ color: "#4b5563" }}>
                    procesando...
                  </span>
                </div>
              )}
            </div>

            {/* Capabilities */}
            {done && (
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${service.accent}22` }}>
                <div
                  className="text-[8px] uppercase tracking-widest mb-2"
                  style={{ color: service.accent }}
                >
                  {"// capacidades"}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {service.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <span style={{ color: service.accent }}>◆</span>
                      <span style={{ color: "#94a3b8" }}>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
}

function LogLineRow({
  line,
  accent,
  isLast,
}: {
  line: RenderedLine;
  accent: string;
  isLast: boolean;
}) {
  const cursor = isLast && line.partial;

  if (line.type === "thinking") {
    return (
      <div className="flex items-start gap-2 text-[10px]">
        <span className="mt-0.5 flex-shrink-0" style={{ color: "#6b7280" }}>
          ◌
        </span>
        <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
          {line.text}
          {cursor && <span className="cursor-blink" style={{ color: accent }}>▋</span>}
        </span>
        <style jsx>{`
          .cursor-blink { animation: blink 700ms steps(1) infinite; }
          @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        `}</style>
      </div>
    );
  }

  if (line.type === "notify") {
    return (
      <div
        className="flex items-start gap-2 text-[10px] px-2 py-1 rounded"
        style={{ background: accent + "14", border: `1px solid ${accent}30` }}
      >
        <span className="flex-shrink-0 mt-0.5" style={{ color: accent }}>
          ✓
        </span>
        <span style={{ color: accent, fontWeight: 600 }}>
          {line.text}
          {cursor && <span className="cursor-blink">▋</span>}
        </span>
        <style jsx>{`
          .cursor-blink { animation: blink 700ms steps(1) infinite; }
          @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        `}</style>
      </div>
    );
  }

  // executing
  return (
    <div className="flex items-start gap-2 text-[10px]">
      <span className="flex-shrink-0 mt-0.5" style={{ color: "#4ade80" }}>
        $
      </span>
      <span style={{ color: "#d1fae5" }}>
        {line.text}
        {cursor && <span className="cursor-blink" style={{ color: "#4ade80" }}>▋</span>}
      </span>
      <style jsx>{`
        .cursor-blink { animation: blink 700ms steps(1) infinite; }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 py-8">
      <div
        className="text-4xl opacity-20"
        style={{ fontFamily: "monospace", lineHeight: 1 }}
      >
        {"{ }"}
      </div>
      <p className="text-[10px] text-center leading-relaxed" style={{ color: "#374151", maxWidth: "160px" }}>
        Selecciona una habitación para activar el terminal del agente
      </p>
      <div className="flex gap-1 mt-1">
        {["w", "e", "b", "_", "a", "i", "_", "↓"].map((c, i) => (
          <span
            key={i}
            className="text-[8px] font-mono"
            style={{ color: "#1f2937", animationDelay: `${i * 100}ms` }}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
