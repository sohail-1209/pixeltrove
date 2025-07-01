"use client";

import type { FC, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Rotate3d } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import { Button } from './ui/button';
import { WireframeBack } from './wireframe-back';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  aiHint: string;
}

export const ProjectCard: FC<ProjectCardProps> = ({ title, description, image, tags, link, aiHint }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 15, restDelta: 0.001 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 15, restDelta: 0.001 });

  const rotateX = useTransform(mouseY, [-150, 150], ["30deg", "-30deg"]);
  const rotateY = useTransform(mouseX, [-150, 150], ["-30deg", "30deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFlip = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "2000px" }}
      className="w-full h-full"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* FRONT OF CARD - Stays in the document flow to define height */}
          <div className="w-full h-full [backface-visibility:hidden]">
            <Card className="h-full flex flex-col group">
              <div>
                <CardHeader className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
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
              </div>
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
                <div className="flex justify-between items-center w-full mt-auto">
                  <Link href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-accent hover:underline">
                    View Project
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleFlip} aria-label="Rotate Card">
                    <Rotate3d className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* BACK OF CARD - Positioned absolutely to overlay the front */}
          <div className="absolute top-0 left-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <WireframeBack />
            <Button variant="ghost" size="icon" onClick={handleFlip} aria-label="Rotate Card" className="absolute bottom-4 right-4 z-10">
              <Rotate3d className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
