import { DEFAULT_LOCALE, getDictionary } from "@/i18n";
import { HomeShell } from "@/ui/sections/HomeShell";

export default function Home() {
  const dictionary = getDictionary(DEFAULT_LOCALE);

  return (
    <HomeShell
      heroHeading={dictionary.home.hero.heading}
      heroTagline={dictionary.home.hero.tagline}
      heroCtaLabel={dictionary.home.hero.ctaLabel}
      heroCtaHref={dictionary.home.hero.ctaHref}
      heroVideoSrc={dictionary.home.hero.videoSrc}
      quote={dictionary.home.quote}
      about={dictionary.home.about}
      works={dictionary.home.works}
      reading={dictionary.home.reading}
      teaching={dictionary.home.teaching}
      footer={dictionary.home.footer}
    />
  );
}
