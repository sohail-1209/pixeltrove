"use client";

import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";

export function Projects() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.section
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
      className="w-full h-screen flex items-center"
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
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 mt-12">
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
    </motion.section>
  );
}
