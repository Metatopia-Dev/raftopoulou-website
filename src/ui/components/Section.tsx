import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section">;

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { children, className, ...props },
  ref,
) {
  return (
    <section ref={ref} className={cn("py-12 md:py-16", className)} {...props}>
      {children}
    </section>
  );
});
