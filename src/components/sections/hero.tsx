
"use client";

import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SparklingText } from '../sparkling-text';
import { AiSymbol } from '../ai-symbol';

export function Hero() {
  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
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
          <motion.p
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
          >
            Building elegant digital experiences with a focus on clean code and user-centric design.
          </motion.p>
          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="flex justify-center"
          >
             <Button asChild size="lg" className="font-bold">
              <Link href="/#projects">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
  );
}
