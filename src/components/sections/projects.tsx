
"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { ProjectCard } from "@/components/project-card";
import { type Project } from "@/lib/data";
import { Shield, Plus, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { ProjectEditDialog } from "@/components/project-edit-dialog";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion, useTransform, type MotionValue, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function Projects({ scrollProgress }: { scrollProgress?: MotionValue<number> }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const hasAnimatedScroll = !!scrollProgress;

  useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current && contentRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
        setContentHeight(contentRef.current.scrollHeight);
      }
    };
    
    measure();
    const resizeObserver = new ResizeObserver(measure);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [projects, loading]);

  const scrollableDistance = Math.max(0, contentHeight - containerHeight);
  const internalY = hasAnimatedScroll && scrollProgress ? useTransform(scrollProgress, [0, 1], [0, -scrollableDistance]) : useMotionValue(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projectsCollection = collection(db, 'projects');
      const projectSnapshot = await getDocs(projectsCollection);
      const projectList = projectSnapshot.docs
        .map(doc => {
          if (!doc.exists()) return null;
          
          const data = doc.data();
          if (
            typeof data.title !== 'string' ||
            typeof data.description !== 'string' ||
            typeof data.image !== 'string' ||
            !Array.isArray(data.tags) ||
            typeof data.link !== 'string' ||
            typeof data.aiHint !== 'string'
          ) {
            console.warn(`Skipping malformed project document with id: ${doc.id}`);
            return null;
          }

          return { id: doc.id, ...data } as Project;
        })
        .filter((p): p is Project => p !== null);
      setProjects(projectList);
    } catch (error) {
      console.error("Error fetching projects: ", error);
      toast({
        variant: "destructive",
        title: "Failed to load projects",
        description: "Please check your Firestore security rules and browser console for more details.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
  };

  const handleAddNewProject = () => {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleDeleteInitiated = (project: Project) => {
    setDeletingProject(project);
  };

  const handleDeleteConfirmed = async () => {
    if (!deletingProject || !deletingProject.id) return;

    try {
        await deleteDoc(doc(db, 'projects', deletingProject.id));
        toast({ title: "Project deleted successfully!" });
        fetchProjects(); // Re-fetch to update list
    } catch (error) {
        console.error("Error deleting project: ", error);
        toast({
            variant: "destructive",
            title: "Failed to delete project",
            description: "An error occurred while deleting the project.",
        });
    } finally {
        setDeletingProject(null);
    }
  };
  
  const handleSubmitProject = async (submittedProjectData: Omit<Project, 'id'>) => {
    try {
      if (editingProject && editingProject.id) {
        const projectRef = doc(db, 'projects', editingProject.id);
        await updateDoc(projectRef, submittedProjectData);
        toast({ title: "Project updated successfully!" });
      } else {
        await addDoc(collection(db, 'projects'), submittedProjectData);
        toast({ title: "Project added successfully!" });
      }
    } catch (error) {
        console.error("Error saving project: ", error);
        toast({
          variant: "destructive",
          title: "Failed to save project",
          description: "An error occurred while saving the project.",
        });
    } finally {
        setEditingProject(null);
        setIsProjectFormOpen(false);
        fetchProjects();
    }
  };

  return (
    <section
      className="w-full h-screen bg-background flex flex-col"
    >
      <AdminLoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} onLoginSuccess={handleLoginSuccess} />
      <ProjectEditDialog 
        open={isProjectFormOpen} 
        onOpenChange={setIsProjectFormOpen}
        onSubmit={handleSubmitProject}
        project={editingProject}
      />
      <AlertDialog open={!!deletingProject} onOpenChange={(isOpen) => !isOpen && setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project "{deletingProject?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingProject(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirmed}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="flex-1 flex relative overflow-hidden">
        {/* Right-side container for Admin icon and scroll text */}
        <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-10 flex flex-col items-center gap-8 text-muted-foreground">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setIsLoginOpen(true)}>
            <Shield className="h-6 w-6" />
            <span className="sr-only">Admin Login</span>
            </Button>
            <div className="flex flex-col items-center gap-2">
                <span className="text-xs uppercase tracking-widest [writing-mode:vertical-rl] text-center">Scroll</span>
                <div className="h-24 w-px bg-current"></div>
                <ArrowDown className="h-5 w-5 animate-bounce"/>
            </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header section */}
          <div className="pt-12 pb-8">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Featured Projects</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Here are some of the projects I'm proud to have worked on. Each one represents a unique challenge and a learning opportunity.
                  </p>
                </div>
                {isAdmin && (
                  <Button onClick={handleAddNewProject}>
                    <Plus className="mr-2 h-4 w-4" /> Add Project
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Scrollable grid */}
          <div ref={containerRef} className={cn("flex-grow", hasAnimatedScroll ? "overflow-hidden" : "overflow-y-auto scrollbar-hide")}>
            <motion.div style={hasAnimatedScroll ? { y: internalY } : {}}>
              <div ref={contentRef} className="container px-4 md:px-6 pb-12">
                  <div 
                    className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2"
                  >
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                            <div className="flex flex-col h-full rounded-lg border bg-card shadow-sm p-6 space-y-4">
                              <Skeleton className="aspect-video w-full" />
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-5/6" />
                              <div className="flex flex-wrap gap-2 pt-4">
                                  <Skeleton className="h-6 w-1/4" />
                                  <Skeleton className="h-6 w-1/4" />
                              </div>
                            </div>
                        </div>
                      ))
                    ) : projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard
                              key={project.id}
                              {...project}
                              isAdmin={isAdmin}
                              onEdit={() => handleEditProject(project)}
                              onDelete={() => handleDeleteInitiated(project)}
                            />
                        ))
                    ) : (
                      <div
                        className="col-span-full text-center text-muted-foreground py-12"
                      >
                        <p>No projects found.</p>
                        <p className="text-sm mt-2">
                          {isAdmin ? "Click 'Add Project' to get started." : "Log in as an admin to add projects."}
                        </p>
                      </div>
                    )}
                  </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
