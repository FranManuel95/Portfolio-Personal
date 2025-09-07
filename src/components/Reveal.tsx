"use client";
import React from "react";
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
  
  className,
  
}: RevealProps) {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();

  // Targets (sin variants para evitar tipos conflictivos)
  const hidden: Target = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y };
  const visible: Target = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      animate={controls}
      viewport={{ amount, margin: "0px 0px -12% 0px", once: !replay }}
      onViewportEnter={() => controls.start(visible)}
      onViewportLeave={() => {
        if (replay) controls.start(hidden);
      }}
      
      transition={{
  duration: reduce ? 0 : 0.85,          // progresivo pero razonable
  ease: [0.39, 0.575, 0.565, 1],        // easeOutSine suave y natural
  delay: (reduce ? 0 : (delayMs + 120)) / 1000
}}
    >
      {children}
    </motion.div>
  );
}
