"use client";

import { Badge } from "@/components/ui/badge";
import { skills } from "@/lib/data";
import { motion } from "framer-motion";

export function About() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <motion.section
      id="about"
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
      className="w-full py-12 md:py-24 lg:py-32 bg-secondary"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">About Me</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I'm a passionate developer with a knack for creating beautiful and functional web applications. With a background in both design and engineering, I bridge the gap between aesthetics and technology to deliver exceptional user experiences. I thrive on solving complex problems and continuously learning new skills.
            </p>
          </motion.div>
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col items-start space-y-4">
             <h3 className="text-2xl font-bold tracking-tighter font-headline">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill}
                  custom={i}
                  variants={FADE_UP_ANIMATION_VARIANTS}
                >
                  <Badge variant="default" className="text-sm py-1 px-3">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
