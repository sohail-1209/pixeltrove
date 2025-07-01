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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    // Increased height to give more scroll room for pauses
    <div ref={containerRef} style={{ height: `${sections.length * 250}vh` }} className="bg-background">
      <div className="sticky top-0 h-screen" style={{ perspective: '1200px' }}>
        {sections.map((section, i) => {
          const numSections = sections.length;
          
          // Each section's scroll is divided into a "transition" part and a "pause" part.
          // 0.5 means the transition takes up 50% of the section's scroll duration.
          // The other 50% is the pause.
          const transitionPoint = 0.5;
          const sectionScrollDuration = 1 / numSections;
          const transitionDuration = sectionScrollDuration * transitionPoint;

          // Points in the scroll progress (0 to 1) that define the animation
          const fadeInStart = i * sectionScrollDuration - transitionDuration;
          const fadeInEnd = i * sectionScrollDuration;
          const fadeOutStart = fadeInEnd + (sectionScrollDuration - transitionDuration);
          const fadeOutEnd = fadeOutStart + transitionDuration;

          const isFirst = i === 0;
          const isLast = i === numSections - 1;

          const inputRange = [
            isFirst ? 0 : fadeInStart,
            fadeInEnd,
            fadeOutStart,
            isLast ? 1 : fadeOutEnd
          ];
          
          const opacity = useTransform(scrollYProgress, inputRange, [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]);
          const scale = useTransform(scrollYProgress, inputRange, [isFirst ? 1 : 0.8, 1, 1, isLast ? 1 : 0.8]);
          const z = useTransform(scrollYProgress, inputRange, [isFirst ? 0 : -800, 0, 0, isLast ? 0 : -800]);
          const zIndex = useTransform(scrollYProgress, inputRange, [isFirst ? 20 : 0, 20, 20, isLast ? 20 : 0]);
          
          return (
            <motion.div
              key={section.id}
              id={section.id}
              className="absolute top-0 left-0 w-full h-screen"
              style={{
                opacity,
                scale,
                z,
                zIndex,
              }}
            >
              {section.component}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
