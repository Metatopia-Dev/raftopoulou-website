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

type ReadingPageProps = {
  params: Promise<{ slug: string }>;
};

function getReview(slug: string) {
  const reading = getDictionary(DEFAULT_LOCALE).home.reading;
  const review = reading.reviews.find((item) => item.slug === slug);
  return review ? { reading, review } : null;
}

export function generateStaticParams() {
  return getDictionary(DEFAULT_LOCALE).home.reading.reviews.map((review) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata({
  params,
}: ReadingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getReview(slug);

  if (!match) {
    return {};
  }

  const { reading, review } = match;
  const title = review.title.trim() || reading.title;
  const description = review.body.replace(/\s+/g, " ").trim().slice(0, 160);

  return { title, description };
}

export default async function ReadingReviewPage({ params }: ReadingPageProps) {
  const { slug } = await params;
  const match = getReview(slug);

  if (!match) {
    notFound();
  }

  const { reading, review } = match;
  const paragraphs = review.body
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-[100svh] overflow-hidden text-slate-900">
      <ReadingReveal className="min-h-[100svh] bg-[#f7f4ef]">
        <article className="mx-auto w-full max-w-3xl px-6 py-12 md:px-8 md:py-20">
          <BackLink
            label={reading.backLabel}
            href="/#reading"
            className="inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173] transition hover:text-[#1d1528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
          />
          {review.title.trim() ? (
            <h1
              className={`${headingFont.className} mt-3 text-balance text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.01em] text-[#1d1528]`}
            >
              {review.title}
            </h1>
          ) : null}

          <figure className="mt-8 overflow-hidden rounded-sm shadow-[0_22px_55px_rgba(29,21,40,0.16)]">
            <img
              src={review.imageSrc}
              alt={review.imageAlt}
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
        </article>
      </ReadingReveal>
    </main>
  );
}
