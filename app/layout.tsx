import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-display" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Bedtime Story Maker",
  description: "Create cozy AI bedtime stories for kids aged 3-5."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${nunito.variable}`}>
      <body className="font-body text-ink antialiased">
        <div className="min-h-screen bg-gradient-to-br from-butter via-sky/40 to-mint/50">
          <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
