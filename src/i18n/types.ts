export const locales = ["en", "el"] as const;

export type Locale = (typeof locales)[number];

export type Dictionary = {
  metadata: {
    title: string;
    description: string;
  };
  home: {
    hero: {
      heading: string;
      tagline: string;
      ctaLabel: string;
      ctaHref: string;
      videoSrc: string;
    };
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
      backLabel: string;
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
      backLabel: string;
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
      backLabel: string;
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
};
