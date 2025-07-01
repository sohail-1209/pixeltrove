"use client";

import { cn } from "@/lib/utils";

export const WireframeBack = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 w-full h-full bg-card rounded-lg p-4 overflow-hidden border", className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--accent) / 0.1)" strokeWidth="0.5" />
          </pattern>
          <style>
            {`
              .circuit-path {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw-circuit 8s linear infinite;
              }
              .circuit-path-2 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw-circuit 6s linear infinite;
                animation-delay: -2s;
              }
              .circuit-path-3 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw-circuit 10s linear infinite;
                animation-delay: -4s;
              }
              .pulse {
                  animation: pulse-glow 2s ease-in-out infinite alternate;
              }

              @keyframes draw-circuit {
                to {
                  stroke-dashoffset: 0;
                }
              }
              @keyframes pulse-glow {
                  from {
                      filter: drop-shadow(0 0 2px hsl(var(--accent)));
                  }
                  to {
                      filter: drop-shadow(0 0 6px hsl(var(--accent)));
                  }
              }
            `}
          </style>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <g stroke="hsl(var(--accent) / 0.3)" strokeWidth="1" fill="none">
          {/* Static traces */}
          <path d="M 40 40 L 100 40 L 100 80" />
          <path d="M 300 200 L 300 150 L 350 150" />
          <path d="M 120 220 L 180 220 L 180 280 L 240 280" />
          <path d="M 500 80 L 450 80 L 450 40 L 400 40" />
          <path d="M 550 300 L 550 250 L 500 250" />
        </g>
        
        <g fill="hsl(var(--accent) / 0.5)" className="pulse">
            {/* Component pads */}
            <circle cx="40" cy="40" r="4" />
            <circle cx="100" cy="80" r="4" />
            <circle cx="300" cy="200" r="4" />
            <circle cx="350" cy="150" r="4" />
            <circle cx="120" cy="220" r="4" />
            <circle cx="240" cy="280" r="4" />
            <circle cx="500" cy="80" r="4" />
            <circle cx="400" cy="40" r="4" />
            <circle cx="550" cy="300" r="4" />
            <circle cx="500" cy="250" r="4" />

            <rect x="240" y="100" width="40" height="20" rx="3" />
            <rect x="80" y="160" width="40" height="20" rx="3" />
        </g>

        <g stroke="hsl(var(--accent) / 0.9)" strokeWidth="1.5" fill="none">
            {/* Animated traces */}
            <path className="circuit-path" d="M 40 40 L 100 40 L 100 80 L 80 80 L 80 160" />
            <path className="circuit-path-2" d="M 350 150 L 300 150 L 300 200 L 260 200 L 260 120" />
            <path className="circuit-path-3" d="M 500 80 L 450 80 L 450 40 L 400 40" />
            <path className="circuit-path-2" style={{animationDelay: '-1s'}} d="M 120 220 L 180 220 L 180 280 L 240 280" />
            <path className="circuit-path" style={{animationDelay: '-5s'}} d="M 550 300 L 550 250 L 500 250 L 500 80" />
        </g>
      </svg>
    </div>
  );
};
