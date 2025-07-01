
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Project } from "@/lib/data";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { refineProject } from "@/ai/flows/refine-project-flow";
import { LoaderCircle, Wand2 } from "lucide-react";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  tags: z.string().min(1, "Tags are required (comma-separated)"),
  link: z.string().url("Must be a valid URL").min(1, "Project link is required"),
  aiHint: z.string().min(1, "AI hint is required"),
});

type ProjectSchema = z.infer<typeof projectSchema>;

interface ProjectEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  project: Project | null;
}

export function ProjectEditDialog({ open, onOpenChange, onSubmit, project }: ProjectEditDialogProps) {
  const form = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
  });
  const [isImprovising, setIsImprovising] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (project) {
        form.reset({
          ...project,
          tags: project.tags.join(", "),
        });
      } else {
        form.reset({
          title: "",
          description: "",
          image: "https://placehold.co/50x50.png",
          tags: "",
          link: "#",
          aiHint: "",
        });
      }
    }
  }, [project, open, form]);

  const handleImproviseWithAI = async () => {
    setIsImprovising(true);
    try {
      const currentData = form.getValues();
      const tagsArray = currentData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const refinedData = await refineProject({
        title: currentData.title,
        description: currentData.description,
        tags: tagsArray,
      });
      
      form.setValue('title', refinedData.refinedTitle, { shouldValidate: true });
      form.setValue('description', refinedData.refinedDescription, { shouldValidate: true });
      form.setValue('tags', refinedData.refinedTags.join(', '), { shouldValidate: true });

      toast({
        title: "Content improvised!",
        description: "AI has improved the project details.",
      });

    } catch (error) {
      console.error("AI improvisation failed:", error);
      toast({
        variant: "destructive",
        title: "AI Improvisation Failed",
        description: error instanceof Error ? error.message : "Could not improvise the content. Please try again.",
      });
    } finally {
      setIsImprovising(false);
    }
  };
  
  const handleFormSubmit = (data: ProjectSchema) => {
    const projectDataForFirestore = {
      title: data.title,
      description: data.description,
      image: data.image,
      tags: data.tags.split(',').map(tag => tag.trim()),
      link: data.link,
      aiHint: data.aiHint,
    };
    onSubmit(projectDataForFirestore);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
              <DialogDescription>
                {project ? "Make changes to your project here." : "Fill in the details for your new project."} Click save when you're done.
              </DialogDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleImproviseWithAI} disabled={isImprovising} className="shrink-0">
              {isImprovising ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Improvise with AI
            </Button>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="aiHint" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image AI Hint</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. 'abstract technology'" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Next.js, TypeScript" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="link" render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
