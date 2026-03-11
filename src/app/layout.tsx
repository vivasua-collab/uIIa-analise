import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Аналитический портал ИИ в России",
  description: "Интерактивная презентация-аналитика российского рынка искусственного интеллекта. Анализ 50+ компаний, On-Premise решения, риски ИИ-пузыря.",
  keywords: ["ИИ", "AI", "Россия", "аналитика", "LLM", "генеративный ИИ", "Deep Learning"],
  authors: [{ name: "UIIA Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
