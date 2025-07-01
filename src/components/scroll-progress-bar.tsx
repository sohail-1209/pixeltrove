"use client";

import { useScroll, motion } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-1.5 bg-pink_accent origin-top z-50 animate-pulse-glow-pink"
      style={{ scaleY: scrollYProgress }}
    />
  );
}
