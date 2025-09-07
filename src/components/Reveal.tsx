"use client";
import React, { useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useAnimationControls,
  type Target,
} from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  delayMs?: number;
  y?: number;
  /** true = anima también al salir (repite al hacer scroll arriba/abajo) */
  replay?: boolean;
  /** 0..1 o "some"/"all": cuánta parte debe ser visible */
  amount?: number | "some" | "all";
  /** rootMargin: usa valores negativos para disparar más tarde */
  margin?: string;
  className?: string;
  /** duración en segundos */
  duration?: number;
};

export default function Reveal({
  children,
  delayMs = 0,
  y = 12,
  replay = false,
  amount = 0,
  margin = "0px 0px -10% 0px",
  className,
  duration = 0.45,
}: RevealProps) {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();

  // Evita start() antes/después del montaje
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      controls.stop(); // por si quedara alguna animación pendiente
    };
  }, [controls]);

  // Targets (sin variants para evitar tipos conflictivos)
  const hidden: Target = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y };
  const visible: Target = { opacity: 1, y: 0 };

  const handleEnter = () => {
    if (!mountedRef.current) return;
    controls.start(visible);
  };

  const handleLeave = () => {
    if (!replay) return;
    if (!mountedRef.current) return;
    controls.start(hidden);
  };

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={controls}
      viewport={{ amount, margin, once: !replay }}
      onViewportEnter={handleEnter}
      onViewportLeave={handleLeave}
      transition={{
        duration: reduce ? 0 : duration,
        ease: [0.59, 0.575, 0.565, 1],
        delay: (reduce ? 0 : (delayMs + 120)) / 1000, // opcional: +120ms de aire
      }}
    >
      {children}
    </motion.div>
  );
}
