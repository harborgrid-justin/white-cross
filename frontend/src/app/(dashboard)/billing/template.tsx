"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useReducedMotion, getTransition } from "@/hooks/useReducedMotion";

interface TemplateProps {
  children: ReactNode;
}

/**
 * Billing Template with Page Transitions
 *
 * Respects prefers-reduced-motion for accessibility (WCAG 2.1 AAA - 2.3.3)
 */
export default function BillingTemplate({ children }: TemplateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -20 }}
      transition={getTransition(shouldReduceMotion, 0.3)}
      className="w-full h-full"
    >
      <motion.div
        initial={{
          scale: shouldReduceMotion ? 1 : 0.95
        }}
        animate={{ scale: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : 0.2,
          delay: shouldReduceMotion ? 0 : 0.1,
          ease: shouldReduceMotion ? "linear" : "easeOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
