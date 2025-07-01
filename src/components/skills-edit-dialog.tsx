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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const skillsSchema = z.object({
  skills: z.string().min(1, "Skills are required (comma-separated)"),
});

type SkillsSchema = z.infer<typeof skillsSchema>;

interface SkillsEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (skills: string[]) => void;
  initialSkills: string[];
}

export function SkillsEditDialog({ open, onOpenChange, onSubmit, initialSkills }: SkillsEditDialogProps) {
  const form = useForm<SkillsSchema>({
    resolver: zodResolver(skillsSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        skills: initialSkills.join(", "),
      });
    }
  }, [initialSkills, open, form]);

  const handleFormSubmit = (data: SkillsSchema) => {
    const skillsArray = data.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    onSubmit(skillsArray);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>
            Edit your skills list. Separate each skill with a comma. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} placeholder="e.g. Next.js, TypeScript, Firebase" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
