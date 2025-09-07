"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Segment = { text: string; className?: string };

type Props = {
  segments: Segment[];          // partes del texto con clases para resaltar
  speed?: number;               // ms por carácter
  startDelay?: number;          // ms antes de empezar a escribir
  punctuationPauseMs?: number;  // pausa extra en .,;:!?
  cursor?: boolean;             // cursor parpadeante mientras escribe
  className?: string;           // clases del contenedor
  as?: React.ElementType;       // etiqueta/componente contenedor (por defecto "p")
  inViewMargin?: string;        // rootMargin del observer
};

export default function TypewriterText({
  segments,
  speed = 26,
  startDelay = 150,
  punctuationPauseMs = 120,
  cursor = true,
  className,
  as: Tag = "p",
  inViewMargin = "0px 0px -10% 0px",
}: Props) {
  // Sentinel para IO (no necesitamos ref en Tag → evitamos 'any')
  const ioRef = useRef<HTMLSpanElement | null>(null);

  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [prefersReduce, setPrefersReduce] = useState(false);

  // Aplanado de segmentos para indexado por char global
  const flat = useMemo(() => {
    const pieces: { text: string; className?: string; length: number }[] = [];
    for (const s of segments) {
      if (!s.text) continue;
      pieces.push({ text: s.text, className: s.className, length: s.text.length });
    }
    return pieces;
  }, [segments]);

  const total = useMemo(() => flat.reduce((acc, p) => acc + p.length, 0), [flat]);

  // Respeta prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefersReduce(mql.matches);
    handler();
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  // Arranca cuando el sentinel entra en viewport
  useEffect(() => {
    if (prefersReduce) { setStarted(true); setCount(total); return; }
    const sentinel = ioRef.current;
    if (!sentinel) return;

    let timer: number | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          timer = window.setTimeout(() => setStarted(true), startDelay);
          io.disconnect();
        }
      },
      { root: null, threshold: 0.05, rootMargin: inViewMargin }
    );

    io.observe(sentinel);
    return () => {
      io.disconnect();
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [prefersReduce, total, startDelay, inViewMargin]);

  // Próximo carácter (para calcular pausas en puntuación)
  const nextChar = useMemo(() => {
    let idx = count;
    for (const seg of flat) {
      if (idx < seg.length) return seg.text[idx];
      idx -= seg.length;
    }
    return "";
  }, [count, flat]);

  // Escritura carácter a carácter
  useEffect(() => {
    if (!started || prefersReduce) return;
    if (count >= total) return;
    const ch = nextChar;
    const isPunct = /[.,;:!?]/.test(ch);
    const delay = speed + (isPunct ? punctuationPauseMs : 0);
    const id = window.setTimeout(() => setCount((c) => Math.min(c + 1, total)), delay);
    return () => window.clearTimeout(id);
  }, [started, prefersReduce, count, total, speed, punctuationPauseMs, nextChar]);

  // Render: cortar cada segmento según contador global
  let rest = count;
  const children = flat.map((seg, i) => {
    const take = Math.max(0, Math.min(seg.length, rest));
    rest -= take;
    return (
      <span key={i} className={seg.className}>
        {take > 0 ? seg.text.slice(0, take) : null}
      </span>
    );
  });

  // Usamos Tag como React.ElementType (válido). El sentinel es un <span/> 0x0.
  const Component = Tag as React.ElementType;

  return (
    <Component className={className} aria-live="polite" aria-busy={count < total}>
      {/* Sentinel invisible para IntersectionObserver */}
      <span
        ref={ioRef}
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      />
      {children}
      {cursor && count < total && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.6ch",
            borderRight: "2px solid currentColor",
            transform: "translateY(2px)",
            animation: "twblink 1s steps(2, start) infinite",
            marginLeft: "1px",
          }}
        />
      )}
      <style jsx>{`
        @keyframes twblink { to { visibility: hidden; } }
      `}</style>
    </Component>
  );
}
