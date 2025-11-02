"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TemplateProps {
  children: ReactNode;
}

export default function BillingTemplate({ children }: TemplateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="w-full h-full"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.2,
          delay: 0.1,
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
