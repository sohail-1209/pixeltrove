'use client';

import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { useScroll, motion, useTransform, useSpring, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const sections = [
  { id: "hero", component: Hero, scrollFactor: 1.5 },
  { id: "projects", component: Projects, scrollFactor: 4 },
  { id: "about", component: About, scrollFactor: 1.5 },
  { id: "contact", component: Contact, scrollFactor: 1.5 },
];

const totalScrollFactor = sections.reduce((sum, s) => sum + s.scrollFactor, 0);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sectionProgressPoints = sections.reduce((acc, section, i) => {
    const prevEnd = i > 0 ? acc[i - 1].end : 0;
    const start = prevEnd;
    const end = start + section.scrollFactor / totalScrollFactor;
    acc.push({ start, end });
    return acc;
  }, [] as { start: number; end: number }[]);

  const heightFactor = isMobile ? 100 : 150;

  return (
    <div ref={containerRef} style={{ height: `${totalScrollFactor * heightFactor}vh` }} className="bg-background">
      <div className="sticky top-0 h-screen" style={{ perspective: '1200px' }}>
        {sections.map((section, i) => {
          const { start, end } = sectionProgressPoints[i];
          const sectionDuration = end - start;
          
          const transitionPoint = 0.5;
          const transitionDuration = sectionDuration * transitionPoint;

          const fadeInStart = start - transitionDuration;
          const fadeInEnd = start;
          const fadeOutStart = end - transitionDuration;
          const fadeOutEnd = end;

          const isFirst = i === 0;
          const isLast = i === sections.length - 1;

          const inputRange = [
            isFirst ? 0 : fadeInStart,
            fadeInEnd,
            fadeOutStart,
            isLast ? 1 : fadeOutEnd
          ];
          
          const opacity = useTransform(scrollYProgress, inputRange, [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]);
          const scale = useTransform(scrollYProgress, inputRange, [isFirst ? 1 : 0.8, 1, 1, isLast ? 1 : 0.8]);
          const z = useTransform(scrollYProgress, inputRange, [isFirst ? 0 : -800, 0, 0, isLast ? 0 : -800]);

          // Apply spring physics for smoother transitions
          const smoothOpacity = useSpring(opacity, { stiffness: 400, damping: 40 });
          const smoothScale = useSpring(scale, { stiffness: 400, damping: 40 });
          const smoothZ = useSpring(z, { stiffness: 400, damping: 40 });
          
          const zIndex = useTransform(opacity, (val) => val > 0.5 ? 20 : 0);
          
          const internalScrollProgress = useTransform(
            scrollYProgress,
            [fadeInEnd, fadeOutStart],
            [0, 1]
          );

          const SectionComponent = section.component;
          
          return (
            <motion.div
              key={section.id}
              id={section.id}
              className="absolute top-0 left-0 w-full h-screen"
              style={{
                opacity: smoothOpacity,
                scale: smoothScale,
                z: smoothZ,
                zIndex,
              }}
            >
              <SectionComponent {...(section.id === 'projects' ? { scrollProgress: internalScrollProgress } : {})} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
