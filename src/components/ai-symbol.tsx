"use client";

import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export function AiSymbol({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
        filter: [
          'drop-shadow(0 0 5px hsl(var(--accent)/0.5))',
          'drop-shadow(0 0 15px hsl(var(--accent)/0.8))',
          'drop-shadow(0 0 5px hsl(var(--accent)/0.5))',
        ],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      <BrainCircuit className="h-16 w-16 text-accent" />
    </motion.div>
  );
}
