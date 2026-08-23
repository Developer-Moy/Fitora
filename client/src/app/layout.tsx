import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Fitora — AI-Powered Realtime Fitness Planner Platform",
    template: "%s | Fitora Fitness",
  },
  description:
    "Fitora is an AI-powered fitness planner platform providing real-time workout tracking, AI coach studio, BMI & nutrition calculators, and personalized meal planning.",
  keywords: [
    "Fitness Planner",
    "AI Fitness Coach",
    "Workout Timer",
    "Nutrition Tracker",
    "BMI Calculator",
    "Next.js Fitness App",
  ],
  authors: [{ name: "Developer-Moy Team" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
  openGraph: {
    title: "Fitora — AI-Powered Realtime Fitness Planner Platform",
    description:
      "Track your workouts in real time with audio gym timer, AI coaching, calorie calculator, and personalized meal plans.",
    url: "https://fitora-fitness.vercel.app",
    siteName: "Fitora Fitness",
    images: [
      {
        url: "https://fitora-fitness.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fitora Fitness Planner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fitora — AI-Powered Fitness Planner",
    description:
      "Track workouts with real-time HUD, AI Coach studio, and nutrition analytics.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased min-h-screen flex flex-col justify-between`}>
        <Providers>
          <Navbar />
          <div className="pt-14 flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}