"use client";

import { useRef } from "react";
import type { WheelEvent } from "react";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";

export function Projects() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  const sectionRef = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const el = sectionRef.current;
    if (!el) return;

    if (el.scrollHeight <= el.clientHeight) {
      return;
    }

    const isScrollingUp = e.deltaY < 0;
    const isScrollingDown = e.deltaY > 0;
    const isAtTop = el.scrollTop === 0;
    const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1;

    if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    el.scrollTop += e.deltaY;
  };

  return (
    <motion.div
      ref={sectionRef}
      onWheel={onWheel}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="w-full h-screen overflow-y-auto py-24"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Featured Projects</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here are some of the projects I'm proud to have worked on. Each one represents a unique challenge and a learning opportunity.
            </p>
          </div>
        </motion.div>
        <div 
          className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 mt-12"
          style={{ perspective: "2000px" }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              variants={FADE_UP_ANIMATION_VARIANTS}
              custom={i}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.link}
                aiHint={project.aiHint}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
