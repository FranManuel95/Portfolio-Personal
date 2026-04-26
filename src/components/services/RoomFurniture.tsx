"use client";

// 2D side-view furniture for each service room.
// Each piece is an SVG drawn to a 100×80 viewBox (wall-level furniture)
// or 100×60 (floor-level).

function DevFurniture({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {/* === Desk (right side) === */}
      {/* Desk top surface */}
      <rect x="112" y="40" width="76" height="5" fill="#8B6914" />
      {/* Desk body */}
      <rect x="116" y="45" width="68" height="28" fill="#A0791A" />
      {/* Desk legs */}
      <rect x="116" y="73" width="6" height="7" fill="#8B6914" />
      <rect x="178" y="73" width="6" height="7" fill="#8B6914" />
      {/* Desk drawer */}
      <rect x="136" y="50" width="28" height="16" fill="#8B6914" />
      <rect x="148" y="57" width="4" height="3" fill="#C8A84B" />

      {/* === Dual monitors === */}
      {/* Monitor 1 stand */}
      <rect x="122" y="26" width="4" height="14" fill="#555" />
      <rect x="118" y="36" width="12" height="4" fill="#555" />
      {/* Monitor 1 screen */}
      <rect x="112" y="14" width="24" height="14" fill="#111" />
      <rect x="113" y="15" width="22" height="12" fill="#1a1a2e" />
      {/* Code on screen 1 */}
      <rect x="114" y="16" width="10" height="1" fill={accent} opacity="0.8" />
      <rect x="114" y="18" width="16" height="1" fill="#60a5fa" opacity="0.6" />
      <rect x="114" y="20" width="8" height="1" fill="#34d399" opacity="0.6" />
      <rect x="114" y="22" width="14" height="1" fill={accent} opacity="0.5" />

      {/* Monitor 2 stand */}
      <rect x="152" y="26" width="4" height="14" fill="#555" />
      <rect x="148" y="36" width="12" height="4" fill="#555" />
      {/* Monitor 2 screen */}
      <rect x="142" y="14" width="24" height="14" fill="#111" />
      <rect x="143" y="15" width="22" height="12" fill="#0f172a" />
      {/* Browser on screen 2 */}
      <rect x="143" y="15" width="22" height="3" fill="#1e293b" />
      <rect x="144" y="16" width="8" height="1" fill="#475569" />
      <rect x="143" y="19" width="22" height="7" fill="#0f172a" />
      <rect x="144" y="20" width="14" height="1" fill="#64748b" opacity="0.6" />
      <rect x="144" y="22" width="10" height="1" fill="#64748b" opacity="0.4" />
      <rect x="144" y="24" width="18" height="1" fill="#64748b" opacity="0.4" />

      {/* Keyboard */}
      <rect x="120" y="41" width="42" height="4" fill="#2d2d2d" rx="1" />
      <rect x="121" y="41" width="40" height="3" fill="#3a3a3a" />

      {/* === Chair (front of desk) === */}
      <rect x="130" y="62" width="28" height="18" fill="#1e3a8a" />
      <rect x="130" y="60" width="28" height="6" fill="#1e3a8a" />
      <rect x="128" y="58" width="32" height="5" fill="#2563eb" />
      {/* Chair back */}
      <rect x="128" y="43" width="6" height="18" fill="#2563eb" />
      <rect x="154" y="43" width="6" height="18" fill="#2563eb" />
      <rect x="128" y="43" width="32" height="5" fill="#2563eb" />
      {/* Chair legs */}
      <rect x="130" y="78" width="4" height="5" fill="#374151" />
      <rect x="154" y="78" width="4" height="5" fill="#374151" />

      {/* === Plant (left corner) === */}
      {/* Pot */}
      <rect x="10" y="60" width="20" height="18" fill="#a16207" />
      <rect x="8"  y="58" width="24" height="4"  fill="#ca8a04" />
      {/* Soil */}
      <rect x="10" y="60" width="20" height="4" fill="#451a03" />
      {/* Stems */}
      <rect x="19" y="42" width="2" height="18" fill="#15803d" />
      <rect x="12" y="48" width="2" height="12" fill="#15803d" />
      <rect x="26" y="50" width="2" height="10" fill="#15803d" />
      {/* Leaves */}
      <rect x="14" y="40" width="12" height="8" fill="#16a34a" />
      <rect x="10" y="46" width="10" height="6" fill="#15803d" />
      <rect x="22" y="46" width="10" height="6" fill="#16a34a" />
      <rect x="16" y="35" width="8"  height="8" fill="#22c55e" />
    </svg>
  );
}

function AiFurniture({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {/* === Server rack (right) === */}
      <rect x="148" y="10" width="44" height="70" fill="#1e1e2e" />
      <rect x="150" y="12" width="40" height="66" fill="#262638" />
      {/* Server units */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x="151" y={13 + i * 10} width="38" height="8" fill="#1a1a2e" />
          <rect x="151" y={13 + i * 10} width="38" height="2" fill="#252540" />
          {/* LED indicators */}
          <rect x="153" y={15 + i * 10} width="2" height="2" fill={i % 3 === 0 ? "#ef4444" : "#22c55e"} />
          <rect x="157" y={15 + i * 10} width="2" height="2" fill="#22c55e" />
          {/* Drive bays */}
          <rect x="164" y={14 + i * 10} width="22" height="5" fill="#111" />
          <rect x="165" y={15 + i * 10} width="4" height="3" fill="#1e1e1e" />
          <rect x="171" y={15 + i * 10} width="4" height="3" fill="#1e1e1e" />
          <rect x="177" y={15 + i * 10} width="4" height="3" fill="#1e1e1e" />
        </g>
      ))}
      {/* Rack screws */}
      <rect x="151" y="12" width="3" height="3" fill="#374151" />
      <rect x="186" y="12" width="3" height="3" fill="#374151" />
      <rect x="151" y="75" width="3" height="3" fill="#374151" />
      <rect x="186" y="75" width="3" height="3" fill="#374151" />

      {/* === Whiteboard (left) === */}
      <rect x="8"  y="6"  width="64" height="48" fill="#e2e8f0" />
      <rect x="10" y="8"  width="60" height="44" fill="#f8fafc" />
      {/* Neural net diagram */}
      {/* Input nodes */}
      {[12, 22, 32].map((y, i) => (
        <rect key={i} x="14" y={y} width="6" height="6" fill={accent} rx="3" />
      ))}
      {/* Hidden nodes */}
      {[9, 17, 25, 33].map((y, i) => (
        <rect key={i} x="32" y={y} width="6" height="6" fill="#818cf8" rx="3" />
      ))}
      {/* Output nodes */}
      {[15, 25].map((y, i) => (
        <rect key={i} x="50" y={y} width="6" height="6" fill="#34d399" rx="3" />
      ))}
      {/* Connections (simplified lines) */}
      <line x1="20" y1="15" x2="32" y2="12" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="20" y1="15" x2="32" y2="20" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="20" y1="25" x2="32" y2="20" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="20" y1="25" x2="32" y2="28" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="20" y1="35" x2="32" y2="28" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="20" y1="35" x2="32" y2="36" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="38" y1="12" x2="50" y2="18" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="38" y1="20" x2="50" y2="18" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="38" y1="28" x2="50" y2="28" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="38" y1="36" x2="50" y2="28" stroke="#94a3b8" strokeWidth="0.8" />
      {/* Legend */}
      <rect x="11" y="43" width="14" height="2" fill={accent} opacity="0.7" />
      <rect x="11" y="47" width="10" height="2" fill="#818cf8" opacity="0.7" />
      {/* Board frame */}
      <rect x="8"  y="6"  width="64" height="4" fill="#94a3b8" />
      <rect x="8"  y="50" width="64" height="4" fill="#94a3b8" />
      <rect x="8"  y="6"  width="4"  height="48" fill="#94a3b8" />
      <rect x="68" y="6"  width="4"  height="48" fill="#94a3b8" />
      {/* Board legs */}
      <rect x="22" y="54" width="4" height="10" fill="#94a3b8" />
      <rect x="46" y="54" width="4" height="10" fill="#94a3b8" />
      <rect x="18" y="62" width="36" height="4" fill="#94a3b8" />

      {/* === Coffee machine === */}
      <rect x="86" y="46" width="22" height="28" fill="#374151" />
      <rect x="88" y="48" width="18" height="10" fill="#1f2937" />
      <rect x="90" y="50" width="14" height="6" fill="#111827" />
      {/* Display */}
      <rect x="91" y="51" width="6" height="4" fill={accent} opacity="0.7" />
      {/* Buttons */}
      <rect x="99" y="51" width="3" height="3" fill="#4b5563" />
      <rect x="99" y="55" width="3" height="3" fill="#4b5563" />
      {/* Drip tray */}
      <rect x="88" y="62" width="18" height="6" fill="#1f2937" />
      <rect x="90" y="64" width="14" height="2" fill="#111827" />
      {/* Cup */}
      <rect x="92" y="68" width="10" height="6" fill="#f3f4f6" />
      <rect x="92" y="68" width="10" height="2" fill="#e5e7eb" />
    </svg>
  );
}

function AutoFurniture({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {/* === Wide desk with triple monitors === */}
      <rect x="40" y="42" width="148" height="5" fill="#6b3a1f" />
      <rect x="44" y="47" width="140" height="24" fill="#7c4522" />
      <rect x="44" y="71" width="6"   height="9"  fill="#6b3a1f" />
      <rect x="178" y="71" width="6"  height="9"  fill="#6b3a1f" />

      {/* Monitor 1 (left) */}
      <rect x="48"  y="26" width="3" height="16" fill="#374151" />
      <rect x="44"  y="38" width="10" height="4" fill="#374151" />
      <rect x="38"  y="12" width="22" height="16" fill="#111" />
      <rect x="39"  y="13" width="20" height="14" fill="#0f172a" />
      {/* n8n workflow diagram */}
      <rect x="40" y="14" width="5" height="4" fill="#ea580c" opacity="0.8" rx="1" />
      <rect x="47" y="14" width="5" height="4" fill="#f97316" opacity="0.8" rx="1" />
      <rect x="54" y="14" width="5" height="4" fill="#fb923c" opacity="0.8" rx="1" />
      <line x1="45" y1="16" x2="47" y2="16" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="52" y1="16" x2="54" y2="16" stroke="#94a3b8" strokeWidth="0.8" />
      <rect x="40" y="20" width="5" height="4" fill="#2563eb" opacity="0.8" rx="1" />
      <rect x="47" y="20" width="5" height="4" fill="#7c3aed" opacity="0.8" rx="1" />
      <line x1="45" y1="22" x2="47" y2="22" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="42" y1="18" x2="42" y2="20" stroke="#94a3b8" strokeWidth="0.8" />

      {/* Monitor 2 (center) */}
      <rect x="98" y="26" width="3" height="16" fill="#374151" />
      <rect x="94" y="38" width="10" height="4" fill="#374151" />
      <rect x="82" y="8"  width="30" height="20" fill="#111" />
      <rect x="83" y="9"  width="28" height="18" fill="#0c1222" />
      {/* Dashboard bars */}
      <rect x="84" y="10" width="26" height="4" fill="#1e293b" />
      <rect x="84" y="10" width="18" height="2" fill={accent} opacity="0.7" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={84 + i * 7} y="16" width="5" height={6 + i * 2} fill={accent} opacity={0.5 + i * 0.1} />
        </g>
      ))}
      <rect x="84" y="24" width="26" height="2" fill="#1e293b" />
      <rect x="84" y="25" width="14" height="1" fill="#34d399" opacity="0.6" />

      {/* Monitor 3 (right) */}
      <rect x="148" y="26" width="3" height="16" fill="#374151" />
      <rect x="144" y="38" width="10" height="4" fill="#374151" />
      <rect x="134" y="12" width="28" height="18" fill="#111" />
      <rect x="135" y="13" width="26" height="16" fill="#0a0a1a" />
      {/* Terminal */}
      <rect x="136" y="14" width="24" height="14" fill="#0a1628" />
      <rect x="137" y="15" width="8" height="1" fill="#22c55e" opacity="0.8" />
      <rect x="137" y="17" width="16" height="1" fill="#4ade80" opacity="0.6" />
      <rect x="137" y="19" width="12" height="1" fill="#4ade80" opacity="0.5" />
      <rect x="137" y="21" width="18" height="1" fill="#22c55e" opacity="0.7" />
      <rect x="137" y="23" width="6" height="1" fill="#22c55e" opacity="0.9" />
      <rect x="144" y="23" width="2" height="1" fill="#22c55e" />

      {/* Keyboard */}
      <rect x="82" y="43" width="78" height="4" fill="#2d2d2d" />
      <rect x="83" y="43" width="76" height="3" fill="#3a3a3a" />
      <rect x="84" y="43" width="2" height="2" fill="#4a4a4a" />

      {/* === Filing cabinet (left) === */}
      <rect x="8"  y="30" width="28" height="50" fill="#374151" />
      <rect x="10" y="32" width="24" height="22" fill="#4b5563" />
      <rect x="12" y="34" width="20" height="18" fill="#374151" />
      <rect x="18" y="42" width="8" height="2" fill="#9ca3af" />
      <rect x="10" y="56" width="24" height="22" fill="#4b5563" />
      <rect x="12" y="58" width="20" height="18" fill="#374151" />
      <rect x="18" y="66" width="8" height="2" fill="#9ca3af" />
      {/* Label holders */}
      <rect x="11" y="54" width="22" height="3" fill="#6b7280" />
      <rect x="11" y="30" width="22" height="3" fill="#6b7280" />
    </svg>
  );
}

function AgentsFurniture({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      width="100%"
      height="100%"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {/* === Desk (center-right) === */}
      <rect x="80"  y="44" width="108" height="5" fill="#1a3a2a" />
      <rect x="84"  y="49" width="100" height="22" fill="#1e4434" />
      <rect x="84"  y="71" width="6"   height="9"  fill="#1a3a2a" />
      <rect x="178" y="71" width="6"   height="9"  fill="#1a3a2a" />

      {/* === Wide monitor === */}
      <rect x="110" y="26" width="4"  height="18" fill="#374151" />
      <rect x="104" y="40" width="16" height="4"  fill="#374151" />
      <rect x="88"  y="10" width="48" height="26" fill="#111" />
      <rect x="89"  y="11" width="46" height="24" fill="#0f172a" />
      {/* Call interface UI */}
      <rect x="90" y="12" width="44" height="6" fill="#1e293b" />
      <rect x="91" y="13" width="10" height="4" fill={accent} opacity="0.3" rx="1" />
      <rect x="103" y="13" width="6" height="4" fill="#374151" rx="1" />
      <rect x="111" y="13" width="22" height="4" fill="#374151" rx="1" />
      {/* Waveform */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
        const h = [3, 6, 9, 5, 12, 8, 6, 10, 4, 7, 3][i] ?? 4;
        return (
          <rect
            key={i}
            x={91 + i * 4}
            y={24 - h / 2}
            width="2"
            height={h}
            fill={accent}
            opacity="0.7"
          />
        );
      })}
      {/* Status bar */}
      <rect x="90" y="30" width="44" height="4" fill="#0f1e14" />
      <rect x="91" y="31" width="6" height="2" fill={accent} opacity="0.8" />
      <rect x="99" y="31" width="20" height="2" fill="#4b5563" />
      <rect x="121" y="31" width="4" height="2" fill="#22c55e" />
      {/* Keyboard */}
      <rect x="90" y="45" width="48" height="4" fill="#2d2d2d" />

      {/* === Headset on desk stand === */}
      <rect x="160" y="32" width="2"  height="14" fill="#6b7280" />
      <rect x="156" y="30" width="10" height="4"  fill="#374151" rx="2" />
      {/* Earcup left */}
      <rect x="154" y="18" width="8" height="10" fill="#1f2937" rx="3" />
      <rect x="155" y="19" width="6" height="8"  fill="#374151" rx="2" />
      {/* Headband */}
      <rect x="158" y="14" width="6" height="6" fill="#4b5563" rx="3" />
      {/* Earcup right */}
      <rect x="166" y="18" width="8" height="10" fill="#1f2937" rx="3" />
      <rect x="167" y="19" width="6" height="8"  fill="#374151" rx="2" />
      {/* Mic boom */}
      <rect x="162" y="26" width="2"  height="8"  fill="#6b7280" />
      <rect x="158" y="34" width="8"  height="2"  fill="#6b7280" />
      <rect x="156" y="34" width="4"  height="4"  fill={accent} opacity="0.8" rx="1" />

      {/* === Bookshelf (left) === */}
      <rect x="8" y="14" width="58" height="66" fill="#292524" />
      <rect x="10" y="16" width="54" height="6" fill="#1c1917" />
      {/* Books row 1 */}
      {[
        { x: 10, w: 8, color: "#dc2626" },
        { x: 19, w: 6, color: "#d97706" },
        { x: 26, w: 10, color: "#2563eb" },
        { x: 37, w: 7, color: "#7c3aed" },
        { x: 45, w: 5, color: "#059669" },
        { x: 51, w: 8, color: "#db2777" },
      ].map(({ x, w, color }, i) => (
        <rect key={i} x={x} y="23" width={w} height="18" fill={color} opacity="0.9" />
      ))}
      {/* Shelf divider */}
      <rect x="10" y="40" width="54" height="3" fill="#44403c" />
      {/* Books row 2 */}
      {[
        { x: 10, w: 10, color: "#0891b2" },
        { x: 21, w: 7, color: "#65a30d" },
        { x: 29, w: 8, color: "#d97706" },
        { x: 38, w: 6, color: "#dc2626" },
        { x: 45, w: 9, color: "#6d28d9" },
        { x: 55, w: 6, color: "#0f766e" },
      ].map(({ x, w, color }, i) => (
        <rect key={i} x={x} y="44" width={w} height="16" fill={color} opacity="0.9" />
      ))}
      {/* Shelf divider */}
      <rect x="10" y="60" width="54" height="3" fill="#44403c" />
      {/* Books row 3 */}
      {[
        { x: 10, w: 7, color: "#7c3aed" },
        { x: 18, w: 9, color: "#b45309" },
        { x: 28, w: 6, color: "#0284c7" },
        { x: 35, w: 8, color: "#15803d" },
        { x: 44, w: 5, color: "#dc2626" },
        { x: 50, w: 9, color: "#6d28d9" },
      ].map(({ x, w, color }, i) => (
        <rect key={i} x={x} y="64" width={w} height="14" fill={color} opacity="0.9" />
      ))}
    </svg>
  );
}

export default function RoomFurniture({
  serviceId,
  accent,
}: {
  serviceId: string;
  accent: string;
}) {
  switch (serviceId) {
    case "web":
      return <DevFurniture accent={accent} />;
    case "ai":
      return <AiFurniture accent={accent} />;
    case "auto":
      return <AutoFurniture accent={accent} />;
    case "agents":
      return <AgentsFurniture accent={accent} />;
    default:
      return null;
  }
}
