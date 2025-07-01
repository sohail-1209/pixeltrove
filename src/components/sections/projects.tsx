
"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { type Project } from "@/lib/data";
import { motion } from "framer-motion";
import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { ProjectEditDialog } from "@/components/project-edit-dialog";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function Projects() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

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
  
  const handleSubmitProject = async (submittedProjectData: Omit<Project, 'id'>) => {
    try {
      if (editingProject && editingProject.id) {
        const projectRef = doc(db, 'projects', editingProject.id);
        await updateDoc(projectRef, submittedProjectData);
      } else {
        await addDoc(collection(db, 'projects'), submittedProjectData);
      }
    } catch (error) {
        console.error("Error saving project: ", error);
    } finally {
        setEditingProject(null);
        setIsProjectFormOpen(false);
        fetchProjects();
    }
  };

  return (
    <motion.div
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
      className="relative w-full min-h-screen bg-background"
    >
      <AdminLoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} onLoginSuccess={handleLoginSuccess} />
      <ProjectEditDialog 
        open={isProjectFormOpen} 
        onOpenChange={setIsProjectFormOpen}
        onSubmit={handleSubmitProject}
        project={editingProject}
      />
      
      <div className="absolute top-8 right-4 md:right-8 flex flex-col items-center gap-4 text-muted-foreground z-10">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={() => setIsLoginOpen(true)}>
          <Shield className="h-6 w-6" />
          <span className="sr-only">Admin Login</span>
        </Button>
      </div>

      <div className="container px-4 md:px-6 py-24">
          <motion.div
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="flex flex-col items-center justify-center space-y-4 text-center z-20 relative"
          >
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
          </motion.div>
          <div 
            className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 mt-12 relative z-20"
          >
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
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
  );
}
