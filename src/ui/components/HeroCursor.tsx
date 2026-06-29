"use client";

import { useEffect, useRef, type RefObject } from "react";

type HeroCursorProps = {
  containerRef: RefObject<HTMLElement | null>;
};

export function HeroCursor({ containerRef }: HeroCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cursorRef.current || !containerRef.current) {
      return;
    }

    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const container = containerRef.current;
    let rafId = 0;
    let isVisible = false;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;
    let x = targetX;
    let y = targetY;
    let scale = 1;
    let targetScale = 1;

    const animate = () => {
      x += (targetX - x) * 0.28;
      y += (targetY - y) * 0.28;
      scale += (targetScale - scale) * 0.2;

      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      rafId = window.requestAnimationFrame(animate);
    };

    const setVisible = (visible: boolean) => {
      if (isVisible === visible) {
        return;
      }

      isVisible = visible;
      cursor.style.opacity = visible ? "1" : "0";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      const rect = container.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      setVisible(isInside);
      if (!isInside) {
        return;
      }

      targetX = event.clientX;
      targetY = event.clientY;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      targetScale = 0.86;
    };

    const onPointerUp = () => {
      targetScale = 1;
    };

    const hideCursor = () => {
      setVisible(false);
      targetScale = 1;
    };

    cursor.style.opacity = "0";
    rafId = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, [containerRef]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 h-7 w-7 -translate-x-1/2 -translate-y-1/2 opacity-0"
    >
      <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#231a30]/45 shadow-[0_0_0_1px_rgba(248,246,242,0.65)]" />
      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#231a30]/80" />
    </div>
  );
}
