import type { Metadata } from "next";
import { Geist, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { DISCORD_INVITE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "RMR Open",
  description: "Weekly Puck tournaments — assemble a team and compete for glory.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="flex flex-col items-center gap-3 border-t border-steel-dark/40 py-6 text-center text-xs tracking-[0.2em] text-muted uppercase">
          <span>RMR Open — Weekly Puck Tournaments</span>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-steel underline underline-offset-4 transition-colors hover:text-steel-bright"
          >
            Join the Discord
          </a>
        </footer>
      </body>
    </html>
  );
}
