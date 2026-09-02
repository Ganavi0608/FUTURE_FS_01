import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://ganavi0608.github.io"),
  title: "Ganavi | Full-Stack Developer Portfolio",
  description:
    "Professional portfolio of Ganavi, a Computer Science student and full-stack developer building practical, user-focused web applications.",
  keywords: [
    "Ganavi",
    "full-stack developer",
    "React developer",
    "Next.js developer",
    "portfolio",
    "CSE student",
    "web developer",
  ],
  authors: [{ name: "Ganavi" }],
  openGraph: {
    title: "Ganavi | Full-Stack Developer",
    description: "Projects, skills, experience and contact information.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}