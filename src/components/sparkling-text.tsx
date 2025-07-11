
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
  const text = typeof children === 'string' ? children : '';
  return (
    <div className={cn("relative w-full h-auto flex flex-col items-center justify-center", className)}>
      <div className={cn("w-full absolute inset-0", sparklesClassName)}>
        <SparklesCore
          particleCount={100}
          minSize={2.5}
          maxSize={4.0}
          className="w-full h-full"
        />
      </div>
      {/* The text itself */}
      <h1
        data-text={text}
        className="glitch text-4xl font-thin tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-saira
        bg-clip-text text-transparent 
        bg-gradient-to-r from-pink_accent via-violet_accent to-accent
        [filter:drop-shadow(0_0_10px_hsl(var(--accent)/0.7))]
      ">
        {children}
      </h1>
    </div>
  );
}
