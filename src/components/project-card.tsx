
"use client";

import { useState, type FC, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, LoaderCircle, Pause, Pencil, RefreshCw, Trash2, Volume2, Wand2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { WireframeBack } from './wireframe-back';
import { ProjectExplanationDialog } from './project-explanation-dialog';
import { useToast } from '@/hooks/use-toast';
import { explainProject, type ExplainProjectOutput } from '@/ai/flows/explain-project-flow';
import { narrateProject } from '@/ai/flows/narrate-project-flow';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  aiHint: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ title, description, image, tags, link, aiHint, isAdmin, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();
  const [isExplainDialogOpen, setIsExplainDialogOpen] = useState(false);
  const [explanation, setExplanation] = useState<ExplainProjectOutput | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Narration state
  const [narrationStatus, setNarrationStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleExplainClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsExplainDialogOpen(true);
    // Don't re-fetch if we already have the explanation or if it's currently loading.
    if (explanation || isExplaining || narrationStatus === 'loading') {
      return;
    }

    setIsExplaining(true);
    setExplanation(null);

    try {
      const result = await explainProject({ projectUrl: link, title, description, tags });
      setExplanation(result);
    } catch (error) {
      console.error("Failed to get explanation:", error);
      toast({
        variant: "destructive",
        title: "AI Explanation Failed",
        description: "Could not generate an explanation for this project.",
      });
      setExplanation(null);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleNarrationClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Handle play/pause toggles for existing audio
    if (narrationStatus === 'playing') {
      audioElement.pause();
      setNarrationStatus('paused');
      return;
    }
    if (narrationStatus === 'paused') {
      audioElement.play();
      setNarrationStatus('playing');
      return;
    }

    // If another AI process is running, don't start a new one.
    if (narrationStatus === 'loading' || isExplaining) return;

    // If we have a ready-to-play audio URL, play it.
    if (audioUrl) {
      audioElement.play();
      setNarrationStatus('playing');
      return;
    }

    // --- Start new narration generation ---
    setNarrationStatus('loading');
    try {
      let explanationData = explanation;

      // Step 1: Get the explanation. If we don't have it, fetch it.
      if (!explanationData) {
        setIsExplaining(true); // Signal that we are fetching explanation data
        try {
          explanationData = await explainProject({ projectUrl: link, title, description, tags });
          setExplanation(explanationData);
        } finally {
          setIsExplaining(false); // Done fetching explanation
        }
      }

      if (!explanationData) {
        throw new Error("Could not retrieve project explanation.");
      }

      // Step 2: Use the explanation to generate narration.
      const textToNarrate = [
        explanationData.summary,
        "Key features include: " + explanationData.features.join(", and ") + ".",
        explanationData.techStack,
      ].join(" ");
      
      const narrationResult = await narrateProject(textToNarrate);
      setAudioUrl(narrationResult.audioDataUri);
      
    } catch (error) {
      console.error("Failed to narrate project:", error);
      toast({
        variant: "destructive",
        title: "AI Narration Failed",
        description: "Could not generate an explanation or narration for this project.",
      });
      setNarrationStatus('idle'); // Reset on error
      if (isExplaining) setIsExplaining(false); // Also reset if it was fetching explanation
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current && narrationStatus === 'loading') {
      audioRef.current.src = audioUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setNarrationStatus('playing');
        }).catch(error => {
          console.error("Audio play failed:", error);
          setNarrationStatus('idle');
        });
      }
    }
  }, [audioUrl, narrationStatus]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleEnded = () => setNarrationStatus('idle');
    audioElement.addEventListener('ended', handleEnded);
    return () => {
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if ((isFlipped || isExplainDialogOpen) && narrationStatus === 'playing' && audioRef.current) {
      audioRef.current.pause();
      setNarrationStatus('paused');
    }
  }, [isFlipped, isExplainDialogOpen, narrationStatus]);

  return (
    <>
      <ProjectExplanationDialog
        open={isExplainDialogOpen}
        onOpenChange={setIsExplainDialogOpen}
        projectName={title}
        explanation={explanation}
        isLoading={isExplaining}
      />
      <div className="w-full [perspective:1000px]">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="w-full h-full"
        >
          <motion.div
            className="relative w-full [transform-style:preserve-3d]"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ minHeight: '450px' }}
          >
            {/* Front Face */}
            <div className="[backface-visibility:hidden]">
              <Card className="h-full flex flex-col group">
                <CardContent className="p-6 flex-grow">
                  <div className="aspect-square overflow-hidden clip-decagon mb-4">
                    <Image
                      src={image}
                      alt={title}
                      width={600}
                      height={600}
                      data-ai-hint={aiHint}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
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
                      <audio ref={audioRef} className="hidden" />
                      {isAdmin && (
                        <>
                          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit Project">
                            <Pencil className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete Project">
                            <Trash2 className="h-5 w-5 text-muted-foreground transition-colors hover:text-destructive" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={handleNarrationClick} aria-label="Narrate with AI" disabled={narrationStatus === 'loading' || isExplaining}>
                        {narrationStatus === 'loading' && <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />}
                        {narrationStatus === 'playing' && <Pause className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />}
                        {(narrationStatus === 'idle' || narrationStatus === 'paused') && <Volume2 className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleExplainClick} aria-label="Explain with AI" disabled={isExplaining || narrationStatus === 'loading'}>
                        {isExplaining ? <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" /> : <Wand2 className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />}
                      </Button>
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
        </motion.div>
      </div>
    </>
  );
};
