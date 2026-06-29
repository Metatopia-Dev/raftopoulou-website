import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import { DEFAULT_LOCALE, getDictionary } from "@/i18n";
import { AppProviders } from "@/app/providers";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["greek", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dictionary = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dictionary.metadata.title,
  description: dictionary.metadata.description,
  icons: {
    icon: "/media/noto--open-book.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${notoSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
