"use client";

import type { FC, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { motion, useMotionValue, useSpring, useTransform, useAnimation } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  aiHint: string;
}

const MotionCard = motion(Card);

export const ProjectCard: FC<ProjectCardProps> = ({ title, description, image, tags, link, aiHint }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 15, restDelta: 0.001 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 15, restDelta: 0.001 });

  const rotateX = useTransform(mouseY, [-150, 150], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseX, [-150, 150], ["-8deg", "8deg"]);

  const controls = useAnimation();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - left - width / 2);
    y.set(e.clientY - top - height / 2);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    controls.start({
      rotateY: '360deg',
      transition: { duration: 0.8, ease: "easeInOut" },
    }).then(() => {
      controls.set({ rotateY: '0deg' });
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="h-full w-full"
    >
      <MotionCard
        animate={controls}
        className="flex flex-col overflow-hidden h-full group shadow-md"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(1px)' }}
      >
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <Image
              src={image}
              alt={title}
              width={600}
              height={400}
              data-ai-hint={aiHint}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="mb-2 text-xl font-bold font-headline">{title}</CardTitle>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <Link href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
            View Project
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </CardFooter>
      </MotionCard>
    </motion.div>
  );
};
