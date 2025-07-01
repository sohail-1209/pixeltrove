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
    <div ref={containerRef} style={{ height: `${sections.length * 120}vh` }} className="bg-background">
      <div className="sticky top-0 h-screen" style={{ perspective: '1200px' }}>
        {sections.map((section, i) => {
          const numSections = sections.length;
          
          const sectionStart = i / numSections;
          const sectionEnd = (i + 1) / numSections;
          const prevSectionStart = (i - 1) / numSections;
          
          const inputRange = [prevSectionStart, sectionStart, sectionEnd];

          const opacity = useTransform(scrollYProgress, inputRange, [0, 1, 0]);
          const scale = useTransform(scrollYProgress, inputRange, [0.8, 1, 0.8]);
          const z = useTransform(scrollYProgress, inputRange, [-800, 0, -800]);
          
          return (
            <motion.div
              key={section.id}
              id={section.id}
              className="absolute top-0 left-0 w-full h-screen"
              style={{
                opacity,
                scale,
                z,
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
