import type { Metadata } from "next";
import { GFS_Didot } from "next/font/google";
import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n";
import { BackLink } from "@/ui/components/BackLink";
import { ReadingReveal } from "@/ui/components/ReadingReveal";

const headingFont = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
});

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

function getWork(slug: string) {
  const works = getDictionary(DEFAULT_LOCALE).home.works;
  const card = works.cards.find((item) => item.slug === slug);
  return card ? { works, card } : null;
}

export function generateStaticParams() {
  return getDictionary(DEFAULT_LOCALE).home.works.cards.map((card) => ({
    slug: card.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getWork(slug);

  if (!match) {
    return {};
  }

  const { card } = match;
  const description = card.excerpt.replace(/\s+/g, " ").trim().slice(0, 160);

  return { title: card.title, description };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const match = getWork(slug);

  if (!match) {
    notFound();
  }

  const { works, card } = match;
  const paragraphs = card.excerpt
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-[100svh] overflow-hidden text-slate-900">
      <ReadingReveal className="min-h-[100svh] bg-[#f7f4ef]">
        <article className="mx-auto w-full max-w-3xl px-6 py-12 md:px-8 md:py-20">
          <BackLink
            label={works.backLabel}
            href="/#books"
            className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173] transition hover:text-[#1d1528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
          />

          <p className="mt-10 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173]">
            {card.label} - {card.source}
          </p>
          <h1
            className={`${headingFont.className} mt-3 text-balance text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.01em] text-[#1d1528]`}
          >
            {card.title}
          </h1>

          <figure className="mt-8 overflow-hidden rounded-sm shadow-[0_22px_55px_rgba(29,21,40,0.16)]">
            <img
              src={card.imageSrc}
              alt={card.imageAlt}
              className="h-auto w-full object-cover"
            />
          </figure>

          <div className="mt-10 space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[1.06rem] leading-relaxed text-[#3f3850] md:text-[1.12rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {card.readMoreHref ? (
            <div className="mt-10 border-t border-[#d7cfc4] pt-8">
              <a
                href={card.readMoreHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-[#2f4461] transition hover:text-[#22324a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
              >
                {card.readMoreLabel}
                <Icon
                  icon="streamline-ultimate:arrow-up-right-bold"
                  className="text-[0.72rem]"
                />
              </a>
            </div>
          ) : null}
        </article>
      </ReadingReveal>
    </main>
  );
}
