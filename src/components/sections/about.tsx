
"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { skills as defaultSkills } from "@/lib/data";
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { SkillsEditDialog } from '../skills-edit-dialog';

export function About() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndFetchSkills = async () => {
      let adminStatus = false;
      try {
        if (localStorage.getItem('isAdmin') === 'true') {
          setIsAdmin(true);
          adminStatus = true;
        }
      } catch (error) {
        console.warn('Could not read admin status from localStorage', error);
      }

      setLoading(true);
      try {
        const skillsDocRef = doc(db, 'about', 'skillsData');
        const docSnap = await getDoc(skillsDocRef);
        if (docSnap.exists() && docSnap.data().list) {
          setSkills(docSnap.data().list);
        } else {
          setSkills(defaultSkills);
          if (adminStatus) {
            await setDoc(skillsDocRef, { list: defaultSkills });
          }
        }
      } catch (error) {
        console.error("Error fetching skills: ", error);
        setSkills(defaultSkills);
        toast({
          variant: "destructive",
          title: "Failed to load skills",
          description: "Using default skills list.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAndFetchSkills();

    const handleAdminStatusChange = () => {
      try {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
      } catch (error) {
        console.warn('Could not read admin status from localStorage', error);
      }
    };

    window.addEventListener('admin-status-change', handleAdminStatusChange);

    return () => {
      window.removeEventListener('admin-status-change', handleAdminStatusChange);
    };
  }, [toast]);

  const handleSkillsSubmit = async (newSkills: string[]) => {
    try {
      const skillsDocRef = doc(db, 'about', 'skillsData');
      await setDoc(skillsDocRef, { list: newSkills });

      // Re-fetch the data to ensure consistency
      const docSnap = await getDoc(skillsDocRef);
      if (docSnap.exists() && docSnap.data().list) {
        setSkills(docSnap.data().list);
      }

      setIsDialogOpen(false);
      toast({
        title: "Skills updated successfully!",
      });
    } catch (error) {
      console.error("Error updating skills: ", error);
      toast({
        variant: "destructive",
        title: "Failed to update skills",
      });
    }
  };

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  return (
    <>
      {isAdmin && (
        <SkillsEditDialog 
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialSkills={skills}
          onSubmit={handleSkillsSubmit}
        />
      )}
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
        className="w-full h-screen flex items-center bg-secondary"
      >
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">About Me</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I'm a passionate developer with a knack for creating beautiful and functional web applications. With a background in both design and engineering, I bridge the gap between aesthetics and technology to deliver exceptional user experiences. I thrive on solving complex problems and continuously learning new skills.
              </p>
            </motion.div>
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col items-start space-y-4">
               <div className="flex items-center gap-4 w-full">
                 <h3 className="text-2xl font-bold tracking-tighter font-headline">My Skills</h3>
                 {isAdmin && (
                   <Button variant="outline" size="icon" onClick={() => setIsDialogOpen(true)}>
                     <Pencil className="h-4 w-4" />
                     <span className="sr-only">Edit Skills</span>
                   </Button>
                 )}
               </div>
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-7 w-24 rounded-full" />)
                ) : skills.length > 0 ? (
                  skills.map((skill, i) => (
                    <motion.div
                      key={skill}
                      custom={i}
                      variants={FADE_UP_ANIMATION_VARIANTS}
                    >
                      <Badge variant="default" className="text-sm py-1 px-3">
                        {skill}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No skills listed. {isAdmin && "Click the edit button to add some!"}</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
