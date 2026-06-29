import type { Metadata } from "next";
import { GFS_Didot } from "next/font/google";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n";
import { BackLink } from "@/ui/components/BackLink";
import { ReadingReveal } from "@/ui/components/ReadingReveal";

const headingFont = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
});

type TeachingPageProps = {
  params: Promise<{ slug: string }>;
};

function getItem(slug: string) {
  const teaching = getDictionary(DEFAULT_LOCALE).home.teaching;
  const item = teaching.items.find((entry) => entry.slug === slug);
  return item ? { teaching, item } : null;
}

export function generateStaticParams() {
  return getDictionary(DEFAULT_LOCALE).home.teaching.items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: TeachingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getItem(slug);

  if (!match) {
    return {};
  }

  const { item } = match;
  const description = item.body.replace(/\s+/g, " ").trim().slice(0, 160);

  return { title: item.title, description };
}

export default async function TeachingItemPage({ params }: TeachingPageProps) {
  const { slug } = await params;
  const match = getItem(slug);

  if (!match) {
    notFound();
  }

  const { teaching, item } = match;
  const paragraphs = item.body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-[100svh] overflow-hidden text-slate-900">
      <ReadingReveal className="min-h-[100svh] bg-[#f7f4ef]">
        <article className="mx-auto w-full max-w-3xl px-6 py-12 md:px-8 md:py-20">
          <BackLink
            label={teaching.backLabel}
            href="/#teaching"
            className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173] transition hover:text-[#1d1528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
          />

          <p className="mt-10 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173]">
            {teaching.title}
          </p>
          <h1
            className={`${headingFont.className} mt-3 text-balance text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.01em] text-[#1d1528]`}
          >
            {item.title}
          </h1>

          <div className="mt-8 space-y-6">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-[1.06rem] leading-relaxed text-[#3f3850] md:text-[1.12rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </ReadingReveal>
    </main>
  );
}
