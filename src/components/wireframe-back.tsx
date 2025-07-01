"use client";

import { cn } from "@/lib/utils";

export const WireframeBack = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 w-full h-full bg-card rounded-lg p-4 overflow-hidden border", className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="wireframe-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(var(--accent) / 0.1)"
              strokeWidth="1"
            />
          </pattern>
          <style>
            {`
              .wire-path {
                stroke-dasharray: 500;
                stroke-dashoffset: 500;
                animation: draw-wire 5s linear infinite;
              }

              @keyframes draw-wire {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}
          </style>
        </defs>
        <rect width="100%" height="100%" fill="url(#wireframe-grid)" />
        <path
          className="wire-path"
          d="M 0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40"
          stroke="hsl(var(--accent) / 0.7)"
          strokeWidth="1"
          fill="none"
        />
        <path
          className="wire-path"
          d="M 600 120 Q 550 150, 500 120 T 400 120 T 300 120 T 200 120 T 100 120 T 0 120"
          stroke="hsl(var(--accent) / 0.7)"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: "-2.5s" }}
        />
         <path
          className="wire-path"
          d="M 0 200 Q 50 230, 100 200 T 200 200 T 300 200 T 400 200 T 500 200 T 600 200"
          stroke="hsl(var(--accent) / 0.7)"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: "-1.2s" }}
        />
         <path
          className="wire-path"
          d="M 600 280 Q 550 250, 500 280 T 400 280 T 300 280 T 200 280 T 100 280 T 0 280"
          stroke="hsl(var(--accent) / 0.7)"
          strokeWidth="1"
          fill="none"
          style={{ animationDelay: "-3.8s" }}
        />
      </svg>
    </div>
  );
};
