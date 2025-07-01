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
import { Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeContent: string | null;
  isLoading: boolean;
}

export function ResumeViewDialog({ open, onOpenChange, resumeContent, isLoading }: ResumeViewDialogProps) {
  const { toast } = useToast();

  const resumeStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
    
    .resume-container {
      font-family: 'Inter', sans-serif;
      color: #333;
      line-height: 1.6;
      font-size: 10pt;
    }
    .resume-header {
      text-align: center;
      border-bottom: 2px solid #ccc;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .resume-header h1 {
      font-size: 22pt;
      margin: 0;
      font-weight: 700;
      color: #111;
    }
    .resume-header h2 {
      font-size: 13pt;
      margin: 5px 0;
      font-weight: 500;
      color: #444;
    }
    .contact-info p {
      margin: 2px 0;
      font-size: 9pt;
      color: #555;
    }
    a, a:visited {
      color: hsl(var(--accent));
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .resume-section {
      margin-bottom: 20px;
    }
    .resume-section h3 {
      font-size: 12pt;
      font-weight: 700;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .resume-section .item {
      margin-bottom: 10px;
    }
    .resume-section h4 {
      font-size: 11pt;
      font-weight: 700;
      margin: 0 0 2px 0;
    }
    .resume-section p {
      margin: 0 0 5px 0;
    }
    ul, ol {
      padding-left: 20px;
      margin-top: 5px;
    }
    .skills-list {
      list-style: none;
      padding: 0;
      columns: 3;
      gap: 10px;
    }
    .skills-list li {
      background-color: #f0f0f0;
      border-radius: 4px;
      padding: 2px 8px;
      margin-bottom: 5px;
      display: inline-block;
      font-size: 9pt;
      color: #333;
    }
    .languages-list span {
      margin-right: 15px;
    }
  `;

  const handlePrint = () => {
    if (!resumeContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume</title>
            <style>${resumeStyles}</style>
          </head>
          <body>
            ${resumeContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      toast({
        variant: "destructive",
        title: "Print Failed",
        description: "Please allow pop-ups for this site to print the resume.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI-Generated Resume</DialogTitle>
          <DialogDescription>
            This is a professionally formatted resume. You can print it or save it as a PDF.
          </DialogDescription>
        </DialogHeader>
        <style>{resumeStyles}</style>
        <ScrollArea className="h-[60vh] rounded-md border p-4 bg-white">
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
            <div dangerouslySetInnerHTML={{ __html: resumeContent }} />
          ) : (
             <div className="text-center text-muted-foreground py-8">
                Sorry, there was an error generating the resume. Please try again.
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="gap-2 sm:justify-end">
            <Button onClick={handlePrint} disabled={isLoading || !resumeContent}>
                <Printer className="mr-2 h-4 w-4"/>
                Print / Save as PDF
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
