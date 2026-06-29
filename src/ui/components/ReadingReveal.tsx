"use client";

import { useEffect, useState, type ReactNode } from "react";

type ReadingRevealProps = {
  children: ReactNode;
  className?: string;
};

export function ReadingReveal({ children, className }: ReadingRevealProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`transition-all duration-[1000ms] ease-out will-change-[transform,opacity] motion-reduce:transition-none ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-[100vh] opacity-0"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
