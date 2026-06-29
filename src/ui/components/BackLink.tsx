"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

type BackLinkProps = {
  label: string;
  href: string;
  className?: string;
};

export function BackLink({ label, href, className }: BackLinkProps) {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modifier-clicks / middle-clicks open the href normally.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    // If the user arrived from within the site, go back so their previous
    // scroll position in the section is restored — and so we never stack a
    // second hash onto the URL. Otherwise the href handles it.
    if (window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      <Icon
        icon="streamline-ultimate:arrow-left-bold"
        className="text-[0.72rem]"
      />
      {label}
    </Link>
  );
}
