
"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function AiSymbol({ className }: { className?: string }) {
  const orbits = [
    {
      radius: 20,
      duration: 6,
      color: 'hsl(var(--pink-accent))',
      size: 5,
    },
    {
      radius: 30,
      duration: 8,
      color: 'hsl(var(--violet-accent))',
      size: 7,
    },
    {
      radius: 42,
      duration: 10,
      color: 'hsl(var(--accent))',
      size: 6,
    },
  ];

  return (
    <div className={cn("relative h-24 w-24 flex items-center justify-center", className)}>
      {/* Central glowing element */}
      <motion.div
        className="h-3 w-3 rounded-full bg-primary-foreground"
        animate={{
          scale: [1, 1.5, 1],
          boxShadow: [
            '0 0 10px 2px hsl(var(--accent)/0.7)',
            '0 0 15px 4px hsl(var(--violet-accent)/0.7)',
            '0 0 10px 2px hsl(var(--pink-accent)/0.7)',
            '0 0 10px 2px hsl(var(--accent)/0.7)',
          ],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />

      {/* Orbiting elements */}
      {orbits.map((orbit, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2"
          style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: orbit.duration,
            ease: 'linear',
            repeat: Infinity,
            delay: i * -2, // stagger the start
          }}
        >
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-sm"
            style={{
              width: orbit.size,
              height: orbit.size,
              backgroundColor: orbit.color,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
