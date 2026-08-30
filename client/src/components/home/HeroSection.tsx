"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Dumbbell,
  Users,
  Trophy,
} from "lucide-react";
import FloatingAiWidget from "@/components/home/FloatingAiWidget";

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.896-2.896c.148 0 .292.012.434.034V9.332a6.334 6.334 0 1 0 5.908 6.34V9.43a8.188 8.188 0 0 0 4.769 1.51v-3.51a4.832 4.832 0 0 1-1.000-.744z" />
  </svg>
);

const CountUp = ({
  end,
  duration = 2000,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const stepTime = Math.abs(Math.floor(duration / end));
          const timer = setInterval(
            () => {
              start += 1;
              setCount(start);
              if (start >= end) {
                setCount(end);
                clearInterval(timer);
              }
            },
            Math.max(stepTime, 10),
          );
        }
      },
      { threshold: 0.2 },
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={countRef}>{count}</span>;
};

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden select-none">
      {/* ════════════════════════════════════════════════════════════
          HERO CONTAINER — Locked Centered Layout (Zoom & Ultrawide Proof)
          ════════════════════════════════════════════════════════════ */}
      <div className="relative w-full bg-black text-white overflow-x-clip min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[620px]">
        {/* ─── Centered max-w-7xl container to lock relative positions on Zoom & UltraWide ─── */}
        <div className="relative w-full max-w-7xl mx-auto h-full min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[620px]">
          {/* ─── Z-10: "Build Your Body" Title Case Serif Italic Headline ─── */}
          <div className="absolute z-10 top-5 sm:top-8 md:top-10 inset-x-0 flex flex-col items-center pointer-events-none px-2 sm:px-4">
            <h1
              className="text-white leading-none whitespace-nowrap select-none tracking-tight text-center font-sans uppercase font-black"
              style={{
                fontSize: "clamp(1.75rem, 6.8vw, 5.8rem)",
              }}
            >
              Build Your Body
            </h1>

            {/* Mobile Social Icons centered directly under Build Your Body (No BG) */}
            <div className="flex sm:hidden items-center justify-center gap-3 text-white/80 mt-2 pointer-events-auto">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ─── Z-20: Athlete Cutout Image — Head overlapping text (10% Larger & Mobile Optimized) ─── */}
          <div className="absolute z-20 inset-x-0 bottom-0 top-0 flex items-end justify-center pointer-events-none overflow-hidden">
            <div className="relative w-[340px] xs:w-[440px] sm:w-[570px] md:w-[700px] lg:w-[815px] h-[92%] sm:h-full scale-[1.12] sm:scale-[1.08] origin-bottom">
              <Image
                src="/hero.png"
                alt="Bodybuilder Athlete Cutout"
                fill
                priority
                sizes="(max-width: 768px) 550px, 850px"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          {/* ─── Z-30: Subtitle locked in LEFT-MIDDLE ─── */}
          <div className="absolute z-30 left-2.5 xs:left-5 sm:left-6 md:left-8 top-[48%] sm:top-1/2 -translate-y-1/2 max-w-[125px] xs:max-w-[180px] sm:max-w-[260px]">
            <p
              className="text-gray-200 text-[10px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.5] xs:leading-[1.6] sm:leading-[1.7] font-medium"
              style={{ fontStyle: "italic" }}
            >
              Achieve your fitness goals with expert trainers, cutting-edge
              equipment, and a community that motivates you every step of the
              way.
            </p>
          </div>

          {/* ─── Z-30: Desktop Social Icons locked at bottom left (No BG) ─── */}
          <div className="hidden sm:flex absolute z-30 left-6 md:left-8 bottom-6 items-center gap-3.5 text-white/80">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors cursor-pointer"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          {/* ─── Z-30: "See Packages" Button locked in RIGHT-MIDDLE ─── */}
          <div className="absolute z-30 right-2.5 xs:right-5 sm:right-6 md:right-8 top-[48%] sm:top-1/2 -translate-y-1/2">
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-1.5 sm:gap-2 bg-white text-black border border-white font-bold text-[11px] xs:text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>See Packages</span>
              <span className="bg-black text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
              </span>
            </Link>
          </div>

          {/* ─── Z-40: Notch SVG Background Arc (Decorative) ─── */}
          <div className="absolute z-40 bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-[65px] pointer-events-none">
            <svg
              viewBox="0 -16 180 91"
              className="absolute inset-0 w-[180px] h-[65px] text-white fill-current block pointer-events-none"
            >
              <path d="M 0 75 C 36 75 44 60 44 38 A 46 46 0 0 1 136 38 C 136 60 144 75 180 75 Z" />
            </svg>
          </div>

          {/* ─── Z-50: Morphing Floating AI Widget (Un-nested for pure fixed viewport positioning) ─── */}
          <FloatingAiWidget />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          STATS — Premium Card Grid with Icon Badges
          ════════════════════════════════════════════════════════════ */}
      <div
        id="stats"
        className="bg-white text-black py-10 sm:py-12 px-6 border-b border-gray-100"
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Stat 1 */}
          <div className="group flex items-center justify-center sm:justify-start gap-4 p-4 sm:p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 hover:border-black/30 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black leading-none font-sans">
                <CountUp end={105} />+
              </span>
              <span className="text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1.5">
                Expert Trainers
              </span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="group flex items-center justify-center sm:justify-start gap-4 p-4 sm:p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 hover:border-black/30 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black leading-none font-sans">
                <CountUp end={970} />+
              </span>
              <span className="text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1.5">
                Members Joined
              </span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="group flex items-center justify-center sm:justify-start gap-4 p-4 sm:p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 hover:border-black/30 hover:bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black leading-none font-sans">
                <CountUp end={135} />+
              </span>
              <span className="text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-wider mt-1.5">
                Fitness Programs
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
