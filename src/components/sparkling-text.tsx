
import React from "react";
import { SparklesCore } from "./ui/sparkles-core";
import { cn } from "@/lib/utils";

export function SparklingText({
  children,
  className,
  sparklesClassName,
}: {
  children: React.ReactNode;
  className?: string;
  sparklesClassName?: string;
}) {
  return (
    <div className={cn("relative w-full h-auto flex flex-col items-center justify-center", className)}>
      <div className={cn("w-full absolute inset-0", sparklesClassName)}>
        <SparklesCore
          particleCount={100}
          minSize={0.4}
          maxSize={1}
          className="w-full h-full"
        />
      </div>
      {/* The text itself */}
      <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline
        bg-clip-text text-transparent 
        bg-gradient-to-r from-neutral-200 via-white to-neutral-200 
        animate-shine-light bg-[length:200%_auto] z-10
      ">
        {children}
      </h1>
    </div>
  );
}
