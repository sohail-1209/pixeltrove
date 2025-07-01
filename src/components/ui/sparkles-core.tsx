
"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const SparklesCore = ({
  particleCount = 100,
  minSize = 0.5,
  maxSize = 1.2,
  className,
}: {
  particleCount?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}) => {
  const [sparkles, setSparkles] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const newSparkles = Array.from({ length: particleCount }).map(() => {
        return {
          id: Math.random(),
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize - minSize) + minSize,
          opacity: Math.random() * 0.5 + 0.2,
          // Random cool colors: blue, purple, pink
          color: `hsl(${Math.random() * 120 + 220}, 100%, 70%)` 
        };
      });
      setSparkles(newSparkles);
    }
  }, [particleCount, minSize, maxSize]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          style={{
            position: "absolute",
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            borderRadius: "50%",
            backgroundColor: sparkle.color,
            boxShadow: `0 0 5px 0px ${sparkle.color}`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            x: [0, (Math.random() - 0.5) * 20, 0],
            y: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0, sparkle.opacity, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
