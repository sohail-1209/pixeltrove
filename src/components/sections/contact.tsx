"use client";

import { socialLinks } from '@/lib/data';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Contact() {
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
      className="w-full h-screen flex items-center justify-center bg-secondary"
    >
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Get in Touch</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </motion.div>
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="flex justify-center gap-4"
        >
          {socialLinks.map((link) => (
            <Link
              href={link.url}
              key={link.name}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground h-14 w-14 transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <link.icon className="h-6 w-6" />
              <span className="sr-only">{link.name}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
