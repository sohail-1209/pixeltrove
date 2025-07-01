
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SparklingText } from '../sparkling-text';
import { AiSymbol } from '../ai-symbol';
import { TypeAnimation } from 'react-type-animation';
import { generateResume } from '@/ai/flows/generate-resume-flow';
import { ResumeViewDialog } from '../resume-view-dialog';
import { useToast } from '@/hooks/use-toast';

export function Hero() {
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [resumeContent, setResumeContent] = useState<string | null>(null);
  const [isResuming, setIsResuming] = useState(false);
  const { toast } = useToast();

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  const handleGenerateResume = async () => {
    setIsResumeDialogOpen(true);
    setIsResuming(true);
    setResumeContent(null);

    try {
      const result = await generateResume();
      setResumeContent(result);
    } catch (error) {
      console.error("Failed to generate resume:", error);
      toast({
        variant: "destructive",
        title: "AI Resume Failed",
        description: "Could not generate a resume at this time.",
      });
      setResumeContent(null);
    } finally {
      setIsResuming(false);
    }
  };

  return (
    <>
      <ResumeViewDialog
        open={isResumeDialogOpen}
        onOpenChange={setIsResumeDialogOpen}
        resumeContent={resumeContent}
        isLoading={isResuming}
      />
      <motion.section
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-background"
      >
        <div className="container px-4 md:px-6 text-center">
          <div className="flex flex-col items-center space-y-6">
            <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <AiSymbol />
            </motion.div>
            <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <SparklingText>
                Creative Developer & Designer
              </SparklingText>
            </motion.div>
            <motion.div
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl min-h-[56px] flex items-center justify-center"
            >
              <TypeAnimation
                sequence={[
                  "I'm Sohail.",
                  3000,
                  "I'm a passionate developer.",
                  3000,
                  "I build beautiful and functional web applications.",
                  3000,
                  "I thrive on solving complex problems.",
                  3000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                cursor={true}
              />
            </motion.div>
            <motion.div
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="flex flex-wrap justify-center gap-4"
            >
               <Button asChild size="lg" className="font-bold">
                <Link href="/#projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" className="font-bold" variant="outline" onClick={handleGenerateResume}>
                AI Resume
                <FileText className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeInOut' }}
          className="absolute bottom-10 animate-bounce"
        >
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </motion.section>
    </>
  );
}
