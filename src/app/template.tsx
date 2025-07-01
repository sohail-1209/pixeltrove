'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const pages = ['/', '/projects', '/about', '/contact'];
const animationDuration = 800; // sum of exit and animate durations

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    const handleWheel = (event: globalThis.WheelEvent) => {
      if (!pages.includes(pathname)) return;

      event.preventDefault();

      if (isNavigatingRef.current) {
        return;
      }

      const currentIndex = pages.indexOf(pathname);
      let nextIndex = -1;

      if (event.deltaY > 5) {
        if (currentIndex < pages.length - 1) {
          nextIndex = currentIndex + 1;
        }
      } else if (event.deltaY < -5) {
        if (currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }
      }

      if (nextIndex !== -1 && nextIndex !== currentIndex) {
        isNavigatingRef.current = true;
        router.push(pages[nextIndex]);
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, animationDuration);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [pathname, router]);

  const variants = {
    initial: {
      opacity: 0,
      scale: 1.1,
      z: 50,
    },
    animate: {
      opacity: 1,
      scale: 1,
      z: 0,
      transition: {
        ease: 'circOut',
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      z: -50,
      transition: {
        ease: 'circIn',
        duration: 0.3,
      },
    },
  };

  return (
    <div style={{ perspective: '1000px', height: '100%', overflow: 'hidden' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ height: '100%' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
