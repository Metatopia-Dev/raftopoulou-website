import type { Dictionary } from "@/i18n/types";

export const en: Dictionary = {
  metadata: {
    title: "Christina Raftopoulou - Writer",
    description: "Minimal static site starter template",
  },
  home: {
    hero: {
      heading: "Christina Raftopoulou",
      tagline:
        "Contemporary fiction for dreamers, seekers, and late-night readers.",
      ctaLabel: "Explore the books",
      ctaHref: "#books",
      videoSrc: "/media/videos/video_hero.mp4",
    },
    quote: {
      textPrefix: "“Every person is three people:",
      textPartOne: "the one they think they are",
      textPartTwo: "the one others think they are",
      textPartThree: "and the one they truly are",
      author: "Jean-Paul Sartre",
      portraitSrc:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flickr_-_Government_Press_Office_%28GPO%29_-_Jean_Paul_Sartre_and_Simone_De_Beauvoir_welcomed_by_Avraham_Shlonsky_and_Leah_Goldberg_%28cropped%29.jpg/960px-Flickr_-_Government_Press_Office_%28GPO%29_-_Jean_Paul_Sartre_and_Simone_De_Beauvoir_welcomed_by_Avraham_Shlonsky_and_Leah_Goldberg_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    },
    about: {
      title: "about",
      body: "I was born (1994) in Thessaloniki, where I still live today. I studied Modern Greek Philology at Aristotle University of Thessaloniki and pursued postgraduate studies in Creative Writing. I work as a copywriter, editor, and creative writing teacher for children and adults. I wrote book reviews for the Kleidarotrypa column in Thraca magazine. My short stories have been published in Chartis, Frear, and Fractal, and have received awards in literary competitions. My theatrical monologue “We Are a Tangle” was presented at the Antiskino Theatre Festival in Cyprus.",
      imageSrc: "/media/img/photo_raftopoulou_rect.png",
      imageAlt: "Christina Raftopoulou",
    },
    works: {
      title: "works",
      introQuote:
        "“The word is your power. Writing is the proof that you existed.”",
      introAuthor: "Susan Sontag",
      backLabel: "back",
      cards: [
        {
          slug: "novel",
          label: "Short Story",
          source: "Fractal",
          title: "Novel",
          excerpt:
            "In your car, my feet do not reach the pedals and the backrest is too upright. I adjust the seat to my own height, as well as the rearview mirror where you have hung prayer ropes, a cross, and a vanilla car freshener.",
          readMoreLabel: "read more",
          imageSrc:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Novel work cover",
        },
        {
          slug: "short-stories",
          label: "Short Story",
          source: "Chartis",
          title: "Short Stories",
          excerpt:
            "If I had written a novel of 50,000 words, I would already have a complete book and I would be an author.",
          readMoreLabel: "read more",
          imageSrc:
            "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Short stories work cover",
        },
        {
          slug: "theatre",
          label: "Theatre",
          source: "Chartis",
          title: "Theatre",
          excerpt:
            "A five-year-old girl secretly watches her mother putting on makeup, wanting to ask her to stay.",
          readMoreLabel: "read more",
          imageSrc:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
          imageAlt: "Theatre work cover",
        },
      ],
    },
    reading: {
      title: "reading",
      introQuote: "“We read not to escape life, but to find it.”",
      introAuthor: "C.S. Lewis",
      readMoreLabel: "read more",
      backLabel: "back",
      reviews: [
        {
          slug: "giakarantes",
          title: "Review Image 1",
          body: "A review excerpt goes here.",
          imageSrc: "/media/img/giakarantes.png",
          imageAlt: "Review Image 1",
        },
        {
          slug: "magnites",
          title: "Review Image 2",
          body: "A review excerpt goes here.",
          imageSrc: "/media/img/magnites.png",
          imageAlt: "Review Image 2",
        },
        {
          slug: "elena",
          title: "Review Image 3",
          body: "A review excerpt goes here.",
          imageSrc: "/media/img/elena.png",
          imageAlt: "Review Image 3",
        },
      ],
    },
    teaching: {
      name: "christina raftopoulou",
      title: "teaching",
      introQuote:
        "“Creativity is not finding new ideas, but seeing with new eyes.”",
      introAuthor: "Marcel Proust",
      readMoreLabel: "read more",
      backLabel: "back",
      items: [
        {
          slug: "path-of-creativity",
          title: "The Path of Creativity",
          body: "A journey through the sources of inspiration and curiosity.",
        },
        {
          slug: "writing-stories",
          title: "Writing Stories",
          body: "Creative writing workshops focused on character, plot, dialogue, and structure.",
        },
        {
          slug: "bibliotherapy",
          title: "Bibliotherapy",
          body: "Using literature as a mirror for reflection, emotional processing, and perspective.",
        },
      ],
    },
    footer: {
      kicker: "let's stay in touch",
      title: "Stories continue after the final page.",
      blurb:
        "If you'd like to collaborate, invite Christina to a workshop, or simply share a thought, reach out.",
      quoteText: "“I am rooted, but I flow.”",
      quoteAuthor: "Virginia Woolf",
      navigationLabel: "navigation",
      navigation: [
        { label: "Works", href: "#books" },
        { label: "Reading", href: "#reading" },
        { label: "Teaching", href: "#teaching" },
      ],
      contactLabel: "contact",
      email: "x.m.raftopoulou@gmail.com",
      socialLabel: "social",
      socialLinks: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/christina.raftopoulou/",
        },
        {
          label: "Facebook",
          href: "https://www.facebook.com/xtiti.raftopoulou",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/christina-raftopoulou-394614129/",
        },
      ],
      copyright: "© 2026 Christina Raftopoulou. All rights reserved.",
    },
  },
};
