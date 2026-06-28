import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GraphOne — The Intelligence Layer for the AI Economy",
  description: "Discover, analyze, and track the fastest growing AI companies and investors in the ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#F7F3EC] text-[#1F1F1F] antialiased">
        {children}
      </body>
    </html>
  );
}
