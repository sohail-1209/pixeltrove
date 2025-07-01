"use client";

import { cn } from "@/lib/utils";

export const WireframeBack = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 w-full h-full bg-card rounded-lg p-4 overflow-hidden border", className)}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 600 400">
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
              .circuit-path-4 {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: draw-circuit 7s linear infinite;
                animation-delay: -6s;
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
        
        {/* Static traces */}
        <g stroke="hsl(var(--accent) / 0.3)" strokeWidth="1" fill="none">
          <path d="M 20 20 L 80 20 L 80 60" />
          <path d="M 580 380 L 520 380 L 520 340" />
          <path d="M 20 200 L 100 200 L 100 250 L 150 250" />
          <path d="M 580 200 L 500 200 L 500 150 L 450 150" />
          <path d="M 300 20 L 300 100 L 250 100" />
          <path d="M 300 380 L 300 300 L 350 300" />
          <path d="M 20 320 L 80 320" />
          <path d="M 580 80 L 520 80" />
        </g>
        
        {/* Component pads and blocks */}
        <g fill="hsl(var(--accent) / 0.5)" className="pulse">
            <circle cx="20" cy="20" r="4" />
            <circle cx="80" cy="60" r="4" />
            <circle cx="580" cy="380" r="4" />
            <circle cx="520" cy="340" r="4" />
            <circle cx="20" cy="200" r="4" />
            <circle cx="150" cy="250" r="4" />
            <circle cx="580" cy="200" r="4" />
            <circle cx="450" cy="150" r="4" />
            <circle cx="250" cy="100" r="4" />
            <circle cx="350" cy="300" r="4" />
            <circle cx="80" cy="320" r="4" />
            <circle cx="520" cy="80" r="4" />
            <circle cx="300" cy="200" r="6" />

            <rect x="280" y="180" width="40" height="40" rx="4" />
            <rect x="180" y="140" width="60" height="20" rx="3" />
            <rect x="380" y="240" width="60" height="20" rx="3" />
            <rect x="480" y="290" width="40" height="30" rx="3" />
            <rect x="80" y="90" width="40" height="30" rx="3" />
        </g>

        {/* Animated traces */}
        <g stroke="hsl(var(--accent) / 0.9)" strokeWidth="1.5" fill="none">
            <path className="circuit-path" d="M 20 20 L 80 20 L 80 90" />
            <path className="circuit-path-2" d="M 580 380 L 520 380 L 520 340 L 480 340 L 480 320" />
            <path className="circuit-path-3" d="M 20 200 L 100 200 L 100 250 L 150 250 L 180 250 L 180 160" />
            <path className="circuit-path-4" d="M 580 200 L 500 200 L 500 150 L 450 150 L 420 150 L 420 240" />
            <path className="circuit-path-2" style={{animationDelay: '-1s'}} d="M 250 100 L 300 100 L 300 180" />
            <path className="circuit-path" style={{animationDelay: '-3s'}} d="M 350 300 L 300 300 L 300 220" />
            <path className="circuit-path-3" style={{animationDelay: '-5s'}} d="M 80 320 L 280 320 L 280 220" />
            <path className="circuit-path-4" style={{animationDelay: '-7s'}} d="M 520 80 L 440 80 L 440 240" />
            <path className="circuit-path" style={{animationDelay: '-6s'}} d="M 120 110 L 180 110 L 180 140" />
            <path className="circuit-path-2" style={{animationDelay: '-8s'}} d="M 380 260 L 380 280 L 480 280 L 480 290" />
        </g>
      </svg>
    </div>
  );
};
