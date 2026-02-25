import type { Metadata } from "next";
import Providers from "@/components/Providers";
import TransitionProvider from "@/components/TransitionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelLearn – Master Coding with AI-Powered Learning",
  description:
    "Build real programming skills through interactive coding environments, structured courses, and AI-powered career intelligence. Practice-first learning for developers.",
  keywords: [
    "coding education",
    "learn programming",
    "AI career guidance",
    "interactive coding",
    "SaaS learning platform",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <TransitionProvider>
          <Providers>{children}</Providers>
        </TransitionProvider>
      </body>
    </html>
  );
}

