"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeContent: string | null;
  isLoading: boolean;
}

export function ResumeViewDialog({ open, onOpenChange, resumeContent, isLoading }: ResumeViewDialogProps) {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    if (resumeContent) {
      navigator.clipboard.writeText(resumeContent);
      setHasCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (resumeContent) {
      const blob = new Blob([resumeContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Generated Resume</DialogTitle>
          <DialogDescription>
            Here is a resume generated in Markdown format. You can copy it or download it as a .md file.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-6 space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
               <div className="pt-6 space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ) : resumeContent ? (
            <pre className="text-sm whitespace-pre-wrap font-mono">{resumeContent}</pre>
          ) : (
             <div className="text-center text-muted-foreground py-8">
                Sorry, there was an error generating the resume. Please try again.
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={handleCopy} disabled={isLoading || !resumeContent}>
                {hasCopied ? <Check className="mr-2"/> : <Copy className="mr-2"/>}
                {hasCopied ? "Copied!" : "Copy Markdown"}
            </Button>
            <Button onClick={handleDownload} disabled={isLoading || !resumeContent}>
                <Download className="mr-2"/>
                Download .md
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
