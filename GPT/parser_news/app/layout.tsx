import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";

import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "PulseReader",
  description: "Client-side news intelligence terminal for real-time open-web monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${newsreader.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-text antialiased">
        {children}
      </body>
    </html>
  );
}
