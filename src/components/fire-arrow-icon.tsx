"use client";

import { cn } from "@/lib/utils";

export const FireArrowIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <style>
          {`
            @keyframes fire-flicker {
              0% { transform: translateY(0) scaleY(1); opacity: 1; }
              25% { transform: translateY(-1px) scaleY(1.05); opacity: 0.8; }
              50% { transform: translateY(0.5px) scaleY(0.95); opacity: 1; }
              75% { transform: translateY(-0.5px) scaleY(1.02); opacity: 0.7; }
              100% { transform: translateY(0) scaleY(1); opacity: 1; }
            }
            .fire-1 { animation: fire-flicker 1.2s ease-in-out infinite; animation-delay: 0.1s; fill: hsl(var(--pink-accent)); }
            .fire-2 { animation: fire-flicker 1.4s ease-in-out infinite; animation-delay: 0.3s; fill: hsl(var(--violet-accent)); }
            .fire-3 { animation: fire-flicker 1s ease-in-out infinite; animation-delay: 0.2s; fill: hsl(var(--accent)); }
          `}
        </style>
      </defs>
      {/* Arrow Shaft */}
      <line x1="0" y1="12" x2="36" y2="12" stroke="currentColor" strokeWidth="2" />
      {/* Arrow Head */}
      <path d="M34 8L40 12L34 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Fletching */}
      <line x1="0" y1="12" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="12" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="12" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="12" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Fire */}
      <g transform="translate(38, 12) scale(0.6)">
        <path className="fire-1" d="M0-10C5-15,10-5,10,0c0,5-5,15-10,10C-5,15-10,5-10,0C-10-5-5-15,0-10z" />
        <path className="fire-2" d="M0-6C3-9,6-3,6,0c0,3-3,9-6,6C-3,9-6,3-6,0C-6-3-3-9,0-6z" />
        <path className="fire-3" d="M0-3C1.5-4.5,3-1.5,3,0c0,1.5-1.5,4.5-3,3C-1.5,4.5-3,1.5-3,0C-3-1.5-1.5-4.5,0-3z" />
      </g>
    </svg>
  );
};
