'use client';

import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";

const sections = [
  { id: "hero", component: <Hero /> },
  { id: "projects", component: <Projects /> },
  { id: "about", component: <About /> },
  { id: "contact", component: <Contact /> },
];

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // This creates a stepped progress, e.g., for 4 sections: 0, 0.25, 0.5, 0.75
  const sectionProgress = useTransform(scrollYProgress, (latest) => {
    const numSections = sections.length;
    return Math.floor(latest * numSections) / numSections;
  });

  return (
    <div ref={containerRef} style={{ perspective: '1000px' }}>
      <div style={{ height: `${sections.length * 100}vh` }} />
      {sections.map((section, i) => {
        const progressStart = i / sections.length;
        const progressEnd = (i + 1) / sections.length;

        const scale = useTransform(
          scrollYProgress,
          [progressStart, progressEnd],
          [1, 0.5]
        );
        const opacity = useTransform(
          scrollYProgress,
          [progressStart, progressEnd],
          [1, 0]
        );
        const zIndex = useTransform(scrollYProgress, (latest) =>
          latest >= progressStart && latest < progressEnd ? 1 : 0
        );

        // For the incoming slide
        const incomingScale = useTransform(
          scrollYProgress,
          [progressStart - 0.1, progressStart],
          [0.5, 1]
        );
        const incomingOpacity = useTransform(
          scrollYProgress,
          [progressStart - 0.1, progressStart],
          [0, 1]
        );

        const currentScale = useTransform(scrollYProgress, (latest) =>
          latest >= progressStart ? scale.get() : incomingScale.get()
        );
        const currentOpacity = useTransform(scrollYProgress, (latest) =>
          latest >= progressStart ? opacity.get() : incomingOpacity.get()
        );
        
        return (
          <motion.div
            key={section.id}
            id={section.id}
            className="fixed top-0 left-0 w-full h-screen"
            style={{
              scale: currentScale,
              opacity: currentOpacity,
              zIndex,
            }}
          >
            {section.component}
          </motion.div>
        );
      })}
    </div>
  );
}
