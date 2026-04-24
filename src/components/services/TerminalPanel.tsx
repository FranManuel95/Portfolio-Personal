"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { AgentState, LogLine, Service } from "../services-data";

type TerminalPanelProps = {
  service: Service | null;
  onClose?: () => void;
  onStateChange?: (state: AgentState) => void;
  className?: string;
};

const CHAR_MS = 15;
const LINE_PAUSE_MS = 150;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasWaitingKeyword(text: string): boolean {
  const t = text.toLowerCase();
  return t.includes("approval") || t.includes("human-in-the-loop");
}

/**
 * Highlights ✓, percentages (e.g. 42%) and FILE_EDIT:... tokens inside a log
 * line by wrapping them in <span class="hi">. Other text is kept as-is.
 */
function renderHighlighted(text: string): React.ReactNode {
  // Combined regex for: ✓, NN% or NN.NN%, FILE_EDIT:<non-space-until-space-or-end>
  const regex = /(✓|\d+(?:\.\d+)?%|FILE_EDIT:\S+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={`hi-${key++}`} className="hi">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function LogLineView({
  line,
  accent,
  typed,
  showCursor,
}: {
  line: LogLine;
  accent: string;
  typed?: string;
  showCursor?: boolean;
}) {
  const content = typed !== undefined ? typed : line.text;

  if (line.phase === "thinking") {
    return (
      <div className="row thinking">
        <span className="prefix dim">[AGENT] &gt; </span>
        <span className="icon dim">○</span>{" "}
        <span className="text-thinking">
          {renderHighlighted(content)}
          {showCursor && <span className="cursor">▌</span>}
        </span>
        <style jsx>{`
          .row {
            padding: 2px 0;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.5;
          }
          .prefix {
            color: #7d8596;
          }
          .dim {
            color: #7d8596;
          }
          .icon {
            color: ${accent}aa;
            margin-right: 2px;
          }
          .text-thinking {
            color: ${accent}dd;
          }
          .cursor {
            display: inline-block;
            margin-left: 1px;
            color: ${accent};
            animation: blink 1s steps(1) infinite;
          }
        `}</style>
      </div>
    );
  }

  if (line.phase === "executing") {
    return (
      <div className="row exec">
        <span className="prefix">$ </span>
        <span className="icon">▸</span>{" "}
        <span className="text-exec">
          {renderHighlighted(content)}
          {showCursor && <span className="cursor">▌</span>}
        </span>
        <style jsx>{`
          .row {
            padding: 2px 0;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.5;
            font-family: ui-monospace, Menlo, Consolas, monospace;
          }
          .prefix {
            color: #7ee787;
            font-weight: 700;
          }
          .icon {
            color: #7ee787;
            margin-right: 2px;
          }
          .text-exec {
            color: #b7f3bd;
          }
          .cursor {
            display: inline-block;
            margin-left: 1px;
            color: #7ee787;
            animation: blink 1s steps(1) infinite;
          }
        `}</style>
      </div>
    );
  }

  // notify
  const isWarning =
    /\b(warn|warning|error|fail|failed|approval|human-in-the-loop)\b/i.test(
      line.text
    );
  const icon = isWarning ? "⚠" : "✓";
  return (
    <div className="row notify">
      <span className="icon">{icon}</span>
      <span className="text-notify">
        {renderHighlighted(content)}
        {showCursor && <span className="cursor">▌</span>}
      </span>
      <style jsx>{`
        .row {
          padding: 6px 10px;
          margin: 6px 0;
          border-radius: 4px;
          background: ${accent}1f;
          border-left: 2px solid ${accent};
          font-weight: 700;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.5;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .icon {
          color: ${accent};
          flex-shrink: 0;
        }
        .text-notify {
          color: #e8eaed;
        }
        .cursor {
          display: inline-block;
          margin-left: 1px;
          color: ${accent};
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}

export default function TerminalPanel({
  service,
  onClose,
  onStateChange,
  className,
}: TerminalPanelProps) {
  // Index of next log line to stream (0-based). When it equals logs.length,
  // the stream has finished.
  const [lineIndex, setLineIndex] = useState<number>(0);
  // The typed characters of the currently-streaming line.
  const [currentTyped, setCurrentTyped] = useState<string>("");
  const [streamDone, setStreamDone] = useState<boolean>(false);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStateRef = useRef<AgentState>("idle");

  const logs: LogLine[] = useMemo(
    () => (service ? service.logs : []),
    [service]
  );

  const accent = service?.accent ?? "#60a5fa";

  // Notify parent of state transitions (guarded to fire once per change).
  const emitState = (next: AgentState) => {
    if (lastStateRef.current !== next) {
      lastStateRef.current = next;
      onStateChange?.(next);
    }
  };

  // Reset stream whenever the service changes (or is cleared).
  useEffect(() => {
    if (charTimerRef.current) {
      clearTimeout(charTimerRef.current);
      charTimerRef.current = null;
    }
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    setLineIndex(0);
    setCurrentTyped("");
    setStreamDone(false);

    if (!service) {
      emitState("idle");
      return;
    }

    // If reduced motion is preferred, skip the typewriter entirely.
    if (prefersReducedMotion()) {
      setLineIndex(service.logs.length);
      setCurrentTyped("");
      setStreamDone(true);
      return;
    }

    emitState("active");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  // Drive the typewriter animation.
  useEffect(() => {
    if (!service) return;
    if (streamDone) return;
    if (lineIndex >= logs.length) {
      setStreamDone(true);
      return;
    }

    const currentLine = logs[lineIndex];
    const targetText = currentLine.text;

    // If the line is already fully typed, pause then advance.
    if (currentTyped.length >= targetText.length) {
      pauseTimerRef.current = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCurrentTyped("");
      }, LINE_PAUSE_MS);
      return () => {
        if (pauseTimerRef.current) {
          clearTimeout(pauseTimerRef.current);
          pauseTimerRef.current = null;
        }
      };
    }

    // Otherwise, type the next character.
    charTimerRef.current = setTimeout(() => {
      setCurrentTyped(targetText.slice(0, currentTyped.length + 1));
    }, CHAR_MS);

    return () => {
      if (charTimerRef.current) {
        clearTimeout(charTimerRef.current);
        charTimerRef.current = null;
      }
    };
  }, [service, logs, lineIndex, currentTyped, streamDone]);

  // Track "waiting" transitions based on the text of completed / current line.
  useEffect(() => {
    if (!service) return;
    if (streamDone) {
      const last = logs[logs.length - 1];
      if (last && last.phase === "notify") {
        emitState("done");
      } else if (logs.length > 0) {
        emitState("done");
      }
      return;
    }
    // During streaming: check if any already-shown text contains waiting keywords.
    const completedTexts = logs.slice(0, lineIndex).map((l) => l.text);
    const currentTextSoFar =
      lineIndex < logs.length ? logs[lineIndex].text : "";
    const anyWaiting =
      completedTexts.some(hasWaitingKeyword) ||
      hasWaitingKeyword(currentTextSoFar);
    emitState(anyWaiting ? "waiting" : "active");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, lineIndex, streamDone, logs]);

  // Auto-scroll to bottom as new content arrives.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lineIndex, currentTyped, streamDone]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (charTimerRef.current) clearTimeout(charTimerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Derived display state for the header badge.
  const displayState: AgentState = service
    ? streamDone
      ? "done"
      : lastStateRef.current === "waiting"
        ? "waiting"
        : "active"
    : "idle";

  const stateLabel: Record<AgentState, { dot: string; label: string }> = {
    active: { dot: "●", label: "ACTIVE" },
    waiting: { dot: "⚠", label: "WAITING" },
    done: { dot: "✓", label: "DONE" },
    idle: { dot: "○", label: "IDLE" },
  };

  const wrapStyle: CSSProperties = {
    borderColor: `${accent}44`,
    boxShadow: `0 0 0 1px ${accent}22, 0 0 24px ${accent}22`,
  };

  const overlayStyle: CSSProperties = {
    background: `${accent}14`,
  };

  // Empty state.
  if (!service) {
    return (
      <div
        className={`tp-wrap tp-empty ${className ?? ""}`}
        style={wrapStyle}
      >
        <div className="tp-scanlines" aria-hidden="true" />
        <div className="tp-empty-msg">
          Selecciona una habitación para ver la actividad del agente
        </div>
        <style jsx>{`
          .tp-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            min-height: 400px;
            border-radius: 6px;
            border: 1px solid rgba(125, 133, 150, 0.25);
            background: #0a0d14;
            font-family: ui-monospace, Menlo, Consolas, monospace;
            color: #c8cbd3;
            overflow: hidden;
          }
          .tp-empty-msg {
            opacity: 0.45;
            font-size: clamp(11px, 1.2vw, 14px);
            text-align: center;
            padding: 24px;
          }
          .tp-scanlines {
            pointer-events: none;
            position: absolute;
            inset: 0;
            background: repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.03) 0px,
              rgba(255, 255, 255, 0.03) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: overlay;
          }
          @media (max-width: 640px) {
            .tp-wrap {
              min-height: 220px;
              max-height: 50vh;
            }
          }
        `}</style>
      </div>
    );
  }

  const renderedLines: React.ReactNode[] = [];
  // Fully completed lines.
  for (let i = 0; i < Math.min(lineIndex, logs.length); i++) {
    renderedLines.push(
      <LogLineView
        key={`done-${i}`}
        line={logs[i]}
        accent={accent}
        showCursor={false}
      />
    );
  }
  // Currently-streaming line (if any).
  if (!streamDone && lineIndex < logs.length) {
    renderedLines.push(
      <LogLineView
        key={`cur-${lineIndex}`}
        line={logs[lineIndex]}
        accent={accent}
        typed={currentTyped}
        showCursor={true}
      />
    );
  }

  const badge = stateLabel[displayState];

  return (
    <div className={`tp-wrap ${className ?? ""}`} style={wrapStyle}>
      <div className="tp-tint" style={overlayStyle} aria-hidden="true" />
      <div className="tp-scanlines" aria-hidden="true" />

      {/* Header */}
      <div className="tp-header">
        <div className="tp-dots" aria-hidden="true">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="tp-title">
          <span className="title-main">
            [AGENT · {service.title}]
          </span>
          <span className="title-sep"> · </span>
          <span className="title-role">{service.role}</span>
        </div>
        <div className={`tp-state state-${displayState}`}>
          <span className="state-dot">{badge.dot}</span>
          <span className="state-label">{badge.label}</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="tp-close"
            aria-label="Cerrar terminal"
            onClick={onClose}
          >
            [X]
          </button>
        )}
      </div>

      {/* Body */}
      <div className="tp-body" ref={bodyRef}>
        <div className="tp-tagline">{service.tagline}</div>
        {renderedLines}

        {streamDone && service.items.length > 0 && (
          <div className="tp-caps">
            <div className="tp-sep" />
            <div className="tp-caps-label">{"// CAPABILITIES"}</div>
            <ul className="tp-caps-list">
              {service.items.map((item, i) => (
                <li key={i} className="tp-caps-item">
                  <span className="arrow">→</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style jsx>{`
        .tp-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 400px;
          height: 100%;
          border-radius: 6px;
          border: 1px solid ${accent}44;
          background: #0a0d14;
          font-family: ui-monospace, Menlo, Consolas, monospace;
          color: #c8cbd3;
          overflow: hidden;
        }
        .tp-tint {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .tp-scanlines {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.035) 0px,
            rgba(255, 255, 255, 0.035) 1px,
            transparent 1px,
            transparent 3px
          );
          mix-blend-mode: overlay;
        }
        .tp-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-bottom: 1px solid ${accent}22;
          background: rgba(0, 0, 0, 0.25);
          font-size: clamp(10px, 1.2vw, 12px);
        }
        .tp-dots {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .tp-dots .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .tp-dots .red {
          background: #ff5f57;
        }
        .tp-dots .yellow {
          background: #febc2e;
        }
        .tp-dots .green {
          background: #28c840;
        }
        .tp-title {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #dfe2ea;
        }
        .title-main {
          color: ${accent};
          font-weight: 700;
        }
        .title-sep {
          color: #5b6274;
        }
        .title-role {
          color: #b9bdc9;
        }
        .tp-state {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: clamp(9px, 1vw, 11px);
          font-weight: 700;
          letter-spacing: 0.06em;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .state-active {
          color: ${accent};
        }
        .state-active .state-dot {
          animation: pulse 1.2s ease-in-out infinite;
        }
        .state-waiting {
          color: #febc2e;
        }
        .state-done {
          color: #7ee787;
        }
        .state-idle {
          color: #7d8596;
        }
        .tp-close {
          background: transparent;
          border: 1px solid ${accent}44;
          color: ${accent};
          font-family: inherit;
          font-size: clamp(9px, 1vw, 11px);
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .tp-close:hover {
          background: ${accent}22;
        }
        .tp-body {
          position: relative;
          z-index: 1;
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          font-size: clamp(10px, 1.2vw, 13px);
          line-height: 1.5;
          scrollbar-width: thin;
          scrollbar-color: ${accent}44 transparent;
        }
        .tp-body::-webkit-scrollbar {
          width: 6px;
        }
        .tp-body::-webkit-scrollbar-thumb {
          background: ${accent}44;
          border-radius: 3px;
        }
        .tp-tagline {
          color: #8990a0;
          font-style: italic;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px dashed ${accent}22;
        }
        .tp-caps {
          margin-top: 14px;
        }
        .tp-sep {
          border-top: 1px dashed ${accent}33;
          margin-bottom: 10px;
        }
        .tp-caps-label {
          color: ${accent};
          font-weight: 700;
          letter-spacing: 0.08em;
          font-size: clamp(9px, 1vw, 11px);
          margin-bottom: 6px;
        }
        .tp-caps-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tp-caps-item {
          font-size: clamp(8px, 1vw, 10px);
          color: #b9bdc9;
          line-height: 1.6;
        }
        .tp-caps-item .arrow {
          color: ${accent};
          font-weight: 700;
          margin-right: 4px;
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.15);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .state-active .state-dot {
            animation: none;
          }
        }
        @media (max-width: 640px) {
          .tp-wrap {
            min-height: 260px;
            max-height: 50vh;
          }
          .tp-header {
            padding: 6px 8px;
            gap: 6px;
          }
          .tp-body {
            padding: 8px 8px;
            font-size: clamp(10px, 2.6vw, 12px);
          }
          .tp-caps-item {
            font-size: clamp(9px, 2.2vw, 10px);
          }
        }
      `}</style>
      <style jsx global>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
      {/* Global highlight style for log tokens rendered by LogLineView */}
      <style jsx>{`
        :global(.hi) {
          color: ${accent};
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
