
"use client";

import { useState, type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Pencil, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { WireframeBack } from './wireframe-back';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  aiHint: string;
  isAdmin?: boolean;
  onEdit?: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ title, description, image, tags, link, aiHint, isAdmin, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if clicking the button
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full [perspective:1000px]">
      <motion.div
        className="relative w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ minHeight: '450px' }}
      >
        {/* Front Face */}
        <div className="[backface-visibility:hidden]">
          <Card className="h-full flex flex-col group">
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
                <div className="flex items-center">
                  {isAdmin && (
                    <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit Project">
                      <Pencil className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleFlip} aria-label="Flip Card">
                    <RefreshCw className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="relative w-full h-full">
            <WireframeBack />
            <div className="absolute top-2 right-2 z-10">
              <Button variant="ghost" size="icon" onClick={handleFlip} aria-label="Flip Card Back">
                <RefreshCw className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
