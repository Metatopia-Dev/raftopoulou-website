"use client";

import Lenis from "lenis";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type LenisOptions = ConstructorParameters<typeof Lenis>[0];

const LENIS_DEFAULT_OPTIONS: NonNullable<LenisOptions> = {
  duration: 1.1,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.2,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

type SmoothScrollProviderProps = {
  children: ReactNode;
  enabled?: boolean;
  options?: LenisOptions;
};

export function SmoothScrollProvider({
  children,
  enabled = true,
  options,
}: SmoothScrollProviderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const mergedOptions = useMemo(
    () => ({
      ...LENIS_DEFAULT_OPTIONS,
      ...options,
    }),
    [options],
  );

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis(mergedOptions);
    let rafId = 0;

    const animate = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled, prefersReducedMotion, mergedOptions]);

  return <>{children}</>;
}

export { LENIS_DEFAULT_OPTIONS };
