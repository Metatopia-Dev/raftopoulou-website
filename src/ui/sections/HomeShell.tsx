"use client";

import { GFS_Didot, Noto_Serif } from "next/font/google";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeroCursor } from "@/ui/components/HeroCursor";
import { HeroVideoRipple } from "@/ui/components/HeroVideoRipple";
import { Section } from "@/ui/components/Section";
import { Icon } from "@iconify/react";

const heroNameFont = Noto_Serif({
  weight: ["600", "700"],
  subsets: ["greek", "latin"],
});

const heroTitleFont = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
});

type HomeShellProps = {
  heroHeading: string;
  heroTagline: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroVideoSrc: string;
  quote: {
    text?: string;
    textPrefix: string;
    textPartOne: string;
    textPartTwo: string;
    textPartThree: string;
    author: string;
    portraitSrc: string;
  };
  about: {
    title: string;
    body: string;
    imageSrc: string;
    imageAlt: string;
  };
  works: {
    title: string;
    introQuote: string;
    introAuthor: string;
    cards: Array<{
      slug: string;
      label: string;
      source: string;
      title: string;
      excerpt: string;
      readMoreLabel: string;
      readMoreHref?: string;
      imageSrc: string;
      imageAlt: string;
    }>;
  };
  reading: {
    title: string;
    introQuote: string;
    introAuthor: string;
    readMoreLabel: string;
    reviews: Array<{
      slug: string;
      title: string;
      body: string;
      imageSrc: string;
      imageAlt: string;
    }>;
  };
  teaching: {
    name: string;
    title: string;
    introQuote: string;
    introAuthor: string;
    readMoreLabel: string;
    items: Array<{
      slug: string;
      title: string;
      body: string;
    }>;
  };
  footer: {
    kicker: string;
    title: string;
    blurb: string;
    quoteText: string;
    quoteAuthor: string;
    navigationLabel: string;
    navigation: Array<{
      label: string;
      href: string;
    }>;
    contactLabel: string;
    email: string;
    socialLabel: string;
    socialLinks: Array<{
      label: string;
      href: string;
    }>;
    copyright: string;
  };
};

export function HomeShell({
  heroHeading,
  heroTagline,
  heroCtaLabel,
  heroCtaHref,
  heroVideoSrc,
  quote,
  about,
  works,
  reading,
  teaching,
  footer,
}: HomeShellProps) {
  const getSocialIcon = (href: string) => {
    const normalized = href.toLowerCase();
    if (normalized.includes("instagram.com")) {
      return "mdi:instagram";
    }
    if (normalized.includes("facebook.com")) {
      return "mdi:facebook";
    }
    if (normalized.includes("linkedin.com")) {
      return "mdi:linkedin";
    }
    return "streamline-ultimate:arrow-up-right-bold";
  };

  const heroRef = useRef<HTMLElement | null>(null);
  const quoteRef = useRef<HTMLElement | null>(null);
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [firstName, ...restName] = heroHeading.trim().split(/\s+/);
  const lastName = restName.join(" ");

  const navItems = [
    { id: "about", label: about.title },
    { id: "books", label: works.title },
    { id: "reading", label: reading.title },
    { id: "teaching", label: teaching.title },
    { id: "contact", label: footer.contactLabel },
  ];
  const getExcerptPreview = (text: string) =>
    text.length > 220 ? `${text.slice(0, 220).trimEnd()}...` : text;

  useEffect(() => {
    const section = quoteRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsQuoteVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ids = ["about", "books", "reading", "teaching", "contact"];
    let frame = 0;

    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.5;
      let current = "";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <main className="relative bg-[#f7f4ef] text-slate-900">
      <nav
        aria-label="Πλοήγηση ενοτήτων"
        className="fixed right-3 top-1/2 z-[100] hidden -translate-y-1/2 flex-col items-center gap-1 rounded-full bg-[#f7f4ef]/30 px-2.5 py-3 shadow-[0_8px_30px_rgba(29,21,40,0.08)] ring-1 ring-[#1d1528]/5 backdrop-blur-md md:flex lg:right-5"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={item.label}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex items-center py-1.5"
            >
              <span
                className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#f7f4ef]/85 px-2.5 py-1 text-[0.72rem] tracking-[0.04em] text-[#1d1528] shadow-sm backdrop-blur-sm transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 opacity-100"
                    : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block shrink-0 rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-2.5 w-2.5 bg-[#1d1528] ring-[3px] ring-[#1d1528]/15"
                    : "h-1.5 w-1.5 bg-[#1d1528]/40 group-hover:bg-[#1d1528]/70"
                }`}
              />
            </a>
          );
        })}
      </nav>
      <Section
        ref={heroRef}
        className="sticky top-0 z-0 h-[100svh] overflow-hidden px-0 py-0 md:h-[100dvh] md:cursor-none"
      >
        <HeroVideoRipple src={heroVideoSrc} />
        <HeroCursor containerRef={heroRef} />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#f8f6f2]/78 via-[#f8f6f2]/42 to-[#f8f6f2]/18 md:from-[#f8f6f2]/62 md:via-[#f8f6f2]/24 md:to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1f1b28]/10 via-[#1f1b28]/2 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 flex h-full items-center justify-start px-6 text-left md:px-12 lg:px-16">
          <div className="w-full max-w-2xl">
            <h1
              className={`${heroTitleFont.className} text-balance text-[clamp(3.4rem,6.4vw,6.6rem)] leading-[0.95] tracking-[-0.01em] text-[#1d1528]`}
            >
              <span className="block">{firstName}</span>
              {lastName ? <span className="block">{lastName}</span> : null}
            </h1>
            <p className="mt-6 max-w-[42ch] text-[1.16rem] leading-relaxed text-[#4f475c] md:mt-8 md:text-[1.24rem]">
              {heroTagline}
            </p>
            <a
              href={heroCtaHref}
              className="group mt-8 inline-flex items-center gap-3 text-[0.92rem] font-bold uppercase tracking-[0.22em] text-[#2f4461] transition hover:text-[#22324a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35 md:mt-10 md:text-[1rem]"
            >
              <span>{heroCtaLabel}</span>
              <Icon icon="streamline-ultimate:arrow-right-bold" />
            </a>
          </div>
        </div>
      </Section>
      <Section
        ref={quoteRef}
        className="sticky top-0 z-20 flex h-[100svh] items-center bg-[#f6f1e9] px-6 py-8 md:h-[100dvh] md:px-12 md:py-0 lg:px-16"
      >
        <div
          className={`relative mx-auto w-full max-w-7xl transition-all duration-1000 ease-out ${
            isQuoteVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div
            className="pointer-events-none absolute right-0 top-[40%] -z-10 hidden -translate-y-1/2 md:block lg:right-4"
            aria-hidden="true"
          >
            <img
              src={quote.portraitSrc}
              alt=""
              className="h-60 rounded-sm object-cover opacity-20 grayscale contrast-95 saturate-0 blur-[0.35px] lg:h-64 lg:w-48"
              loading="lazy"
            />
          </div>
          <blockquote className="relative z-10 space-y-8 text-left md:space-y-10">
            <p
              className={`${heroNameFont.className} text-balance text-[clamp(2rem,4.6vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.01em] text-[#1d1528]`}
            >
              {quote.text ? (
                quote.text
              ) : (
                <>
                  {quote.textPrefix}{" "}
                  <span className="text-[#6f4d8c]">{quote.textPartOne}</span>,{" "}
                  <span className="text-[#3b5f8a]">{quote.textPartTwo}</span>,
                  κι{" "}
                  <span className="text-[#2f735f]">{quote.textPartThree}</span>
                  .»
                </>
              )}
            </p>
            <footer className="text-[0.92rem] font-semibold uppercase tracking-[0.14em] text-[#4f475c] md:text-[1rem]">
              — {quote.author}
            </footer>
          </blockquote>
        </div>
      </Section>
      <Section
        id="about"
        className="sticky top-0 z-30 flex h-[100svh] items-start bg-[#efe7dc] px-6 py-8 md:h-[100dvh] md:items-center md:px-12 md:py-0 lg:px-16"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1.35fr_0.65fr] md:gap-14 lg:gap-20">
          <div className="space-y-6 md:space-y-7">
            <h2
              className={`${heroTitleFont.className} text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] tracking-[-0.01em] text-[#1d1528]`}
            >
              {about.title}
            </h2>
            <p className="max-w-[68ch] text-[1rem] leading-relaxed text-[#4f475c] md:text-[1.08rem]">
              {about.body}
            </p>
          </div>
          <div className="mx-auto w-full max-w-[320px] md:max-w-none">
            <img
              src={about.imageSrc}
              alt={about.imageAlt}
              className="w-full rounded-full object-cover shadow-[0_22px_55px_rgba(29,21,40,0.16)]"
              loading="lazy"
            />
          </div>
        </div>
      </Section>
      <Section
        id="books"
        className="sticky top-0 z-40 flex h-[100svh] items-start overflow-hidden bg-[#f3ece2] px-6 py-8 md:h-[100dvh] md:items-center md:px-12 md:py-0 lg:px-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-7 md:mb-9">
            <h2
              className={`${heroTitleFont.className} text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] tracking-[-0.01em] text-[#1d1528]`}
            >
              {works.title}
            </h2>
            <p className="mt-5 max-w-4xl text-[1.06rem] leading-relaxed text-[#4f475c] md:text-[1.12rem]">
              {works.introQuote}
            </p>
            <p className="mt-2 text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-[#6b6277]">
              — {works.introAuthor}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {works.cards.map((card) => (
              <article
                key={`${card.source}-${card.title}`}
                className="group overflow-hidden rounded-sm bg-[#f6f0e7] md:h-60 md:overflow-visible md:bg-transparent md:[perspective:1200px]"
              >
                <Link
                  href={card.readMoreHref ?? `/works/${card.slug}`}
                  target={card.readMoreHref ? "_blank" : undefined}
                  rel={card.readMoreHref ? "noreferrer" : undefined}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35 md:h-full"
                >
                  <div className="relative h-full w-full rounded-sm md:transition-transform md:duration-700 md:[transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)]">
                    <div className="relative h-56 overflow-hidden rounded-sm md:absolute md:inset-0 md:h-auto md:[backface-visibility:hidden]">
                      <img
                        src={card.imageSrc}
                        alt={card.imageAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d1528]/78 via-[#1d1528]/40 to-transparent px-4 pb-4 pt-12">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#f7f4ef]/90">
                          {card.label} - {card.source}
                        </p>
                        <h3 className="mt-1 text-base font-semibold text-[#f7f4ef] md:text-lg">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex rounded-sm bg-[#f6f0e7] p-5 md:absolute md:inset-0 md:[backface-visibility:hidden] md:[transform:rotateY(180deg)]">
                      <div className="flex h-full flex-col">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#746b7f]">
                          {card.label} - {card.source}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[#231a30] md:text-lg">
                          {card.title}
                        </h3>
                        <p className="mt-2 line-clamp-4 text-[0.85rem] leading-relaxed text-[#4f475c]">
                          {getExcerptPreview(card.excerpt)} {card.readMoreLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <Section
        id="reading"
        className="sticky top-0 z-50 flex h-[100svh] items-start bg-[#e9dfd2] px-6 py-8 md:h-[100dvh] md:items-center md:px-12 md:py-0 lg:px-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-7 md:mb-9">
            <h2
              className={`${heroTitleFont.className} text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] tracking-[-0.01em] text-[#1d1528]`}
            >
              {reading.title}
            </h2>
            <p className="mt-5 max-w-4xl text-[1.06rem] leading-relaxed text-[#4f475c] md:text-[1.12rem]">
              {reading.introQuote}
            </p>
            <p className="mt-2 text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-[#6b6277]">
              — {reading.introAuthor}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {reading.reviews.map((review, index) => (
              <Link
                key={`${review.slug}-${index}`}
                href={`/reading/${review.slug}`}
                className="group flex flex-col overflow-hidden rounded-sm bg-[#f6f0e7] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(29,21,40,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
              >
                <div className="h-32 w-full overflow-hidden md:h-36">
                  <img
                    src={review.imageSrc}
                    alt={review.imageAlt}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  {review.title.trim() ? (
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#231a30]">
                      {review.title}
                    </h3>
                  ) : null}
                  <p
                    className={`${review.title.trim() ? "mt-2" : "mt-0"} line-clamp-4 text-[0.85rem] leading-relaxed text-[#4f475c]`}
                  >
                    {review.body}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#2f4461]">
                    {reading.readMoreLabel}
                    <Icon
                      icon="streamline-ultimate:arrow-right-bold"
                      className="text-[0.72rem] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <Section
        id="teaching"
        className="sticky top-0 z-60 flex h-[100svh] items-start bg-[#f1e8dc] px-6 py-8 md:h-[100dvh] md:items-center md:px-12 md:py-0 lg:px-16"
      >
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173]">
            {teaching.name}
          </p>
          <h2
            className={`${heroTitleFont.className} mt-3 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.95] tracking-[-0.01em] text-[#1d1528]`}
          >
            {teaching.title}
          </h2>
          <p className="mt-6 max-w-5xl text-[1.06rem] leading-relaxed text-[#4f475c] md:text-[1.12rem]">
            {teaching.introQuote}
          </p>
          <p className="mt-2 text-[0.86rem] font-semibold uppercase tracking-[0.14em] text-[#6b6277]">
            — {teaching.introAuthor}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {teaching.items.map((item) => (
              <Link
                key={item.slug}
                href={`/teaching/${item.slug}`}
                className="group flex flex-col rounded-sm border border-[#d7cfc4] bg-[#f6f0e7] px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-[#c3b8a8] hover:shadow-[0_18px_40px_rgba(29,21,40,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
              >
                <h3
                  className={`${heroTitleFont.className} line-clamp-2 text-[1.34rem] leading-tight text-[#231a30]`}
                >
                  {item.title}
                </h3>
                <p className="mt-3 line-clamp-5 text-[0.95rem] leading-relaxed text-[#4f475c]">
                  {item.body}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#2f4461]">
                  {teaching.readMoreLabel}
                  <Icon
                    icon="streamline-ultimate:arrow-right-bold"
                    className="text-[0.72rem] transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>
      <Section
        id="contact"
        className="sticky top-0 z-70 flex h-[100svh] items-start overflow-hidden bg-[#e8ded1] px-6 py-8 text-[#1f1828] md:h-[100dvh] md:items-center md:px-12 md:py-0 lg:px-16"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(157,132,98,0.18),transparent_52%),radial-gradient(circle_at_82%_18%,rgba(95,113,132,0.14),transparent_54%),linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.08))]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-7xl">
          {footer.kicker.trim() ? (
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#64596f]">
              {footer.kicker}
            </p>
          ) : null}
          <h2
            className={`${heroTitleFont.className} ${footer.kicker.trim() ? "mt-4" : "mt-0"} max-w-3xl text-balance text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.01em] text-[#1d1528]`}
          >
            {footer.title}
          </h2>
          {!footer.quoteText.trim() && footer.quoteAuthor.trim() ? (
            <p className="mt-3 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#5f546d]">
              — {footer.quoteAuthor}
            </p>
          ) : null}
          {footer.quoteText.trim() ? (
            <blockquote className="mt-6 max-w-3xl border-l border-[#bca88f]/45 pl-5">
              <p
                className={`${heroTitleFont.className} text-[clamp(1.28rem,2.15vw,1.72rem)] leading-tight tracking-[-0.01em] text-[#2d213a]`}
              >
                {footer.quoteText}
              </p>
              {footer.quoteAuthor.trim() ? (
                <footer className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[#5f546d]">
                  — {footer.quoteAuthor}
                </footer>
              ) : null}
            </blockquote>
          ) : null}
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-[#4f475c] md:text-[1.06rem]">
            {footer.blurb}
          </p>

          <div className="mt-12 grid gap-10 border-t border-[#bdaea0]/45 pt-10 md:grid-cols-3">
            <div>
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173]">
                {footer.navigationLabel}
              </h3>
              <ul className="mt-4 space-y-3">
                {footer.navigation.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <a
                      href={item.href}
                      className="inline-flex items-center gap-2 text-[0.98rem] text-[#271d34] transition hover:text-[#2f4461] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
                    >
                      <span>{item.label}</span>
                      <Icon
                        icon="streamline-ultimate:arrow-right-bold"
                        className="text-[0.82rem]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173]">
                {footer.contactLabel}
              </h3>
              <a
                href={`mailto:${footer.email}`}
                className="mt-4 inline-flex items-center gap-2 text-[1rem] text-[#271d34] underline-offset-4 transition hover:text-[#2f4461] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
              >
                <Icon icon="mdi:email-outline" className="text-[1.08rem]" />
                {footer.email}
              </a>
            </div>
            <div>
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#6a6173]">
                {footer.socialLabel}
              </h3>
              <ul className="mt-4 space-y-3">
                {footer.socialLinks.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[0.98rem] text-[#271d34] transition hover:text-[#2f4461] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
                    >
                      <Icon
                        icon={getSocialIcon(item.href)}
                        className="text-[1rem]"
                      />
                      <span>{item.label}</span>
                      <Icon
                        icon="streamline-ultimate:arrow-up-right-bold"
                        className="text-[0.72rem]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-[#bdaea0]/45 pt-6 text-[0.74rem] uppercase tracking-[0.14em] text-[#6a6173] md:flex-row md:items-start md:justify-between">
            <p>{footer.copyright}</p>
            <p className="text-left md:text-right">
              <span className="inline-flex items-center gap-1.5">
                <span>made with</span>
                <Icon icon="twemoji:red-heart" className="text-[0.95rem]" />
                <span>by</span>
              </span>{" "}
              <a
                href="https://archontis.gr"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 transition hover:text-[#2f4461] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f4461]/35"
              >
                Archo
              </a>
            </p>
          </div>
        </div>
      </Section>
      <div
        className="relative z-80 h-[12vh] min-h-16 bg-[#e8ded1]"
        aria-hidden="true"
      />
    </main>
  );
}
