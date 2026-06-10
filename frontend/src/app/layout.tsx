import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Dashboard | Saturday",
  description: "Build, deploy, and manage web projects — 100% free infrastructure. Agent-driven development with Saturday.",
  openGraph: {
    title: "Saturday — Project Dashboard",
    description: "Build any web project. 100% free infrastructure. Agent-driven.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
