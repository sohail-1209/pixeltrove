
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
import { useEffect } from "react";

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
          image: "https://placehold.co/100x100.png",
          tags: "",
          link: "#",
          aiHint: "",
        });
      }
    }
  }, [project, open, form]);

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
          <DialogTitle>{project ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Make changes to your project here." : "Fill in the details for your new project."} Click save when you're done.
          </DialogDescription>
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
