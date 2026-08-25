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
} from "lucide-react";

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
      <div className="relative w-full bg-black text-white overflow-hidden min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
        {/* ─── Centered max-w-7xl container to lock relative positions on Zoom & UltraWide ─── */}
        <div className="relative w-full max-w-7xl mx-auto h-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px]">
          {/* ─── Z-10: "Build Your Body" Title Case Serif Italic Headline ─── */}
          <div className="absolute z-10 top-4 sm:top-5 md:top-6 inset-x-0 flex justify-center pointer-events-none px-4">
            <h1
              className="text-white leading-none whitespace-nowrap select-none tracking-tight text-center"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(3rem, 7.5vw, 8rem)",
              }}
            >
              Build Your Body
            </h1>
          </div>

          {/* ─── Z-20: Athlete Cutout Image — Head overlapping text ─── */}
          <div className="absolute z-20 inset-x-0 bottom-0 top-1 sm:top-2 flex items-end justify-center pointer-events-none overflow-hidden">
            <div className="relative w-[380px] sm:w-[500px] md:w-[620px] lg:w-[720px] h-[96%] sm:h-full">
              <Image
                src="/hero.png"
                alt="Bodybuilder Athlete Cutout"
                fill
                priority
                sizes="(max-width: 768px) 500px, 720px"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          {/* ─── Z-30: Subtitle locked in LEFT-MIDDLE ─── */}
          <div className="absolute z-30 left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 max-w-[220px] sm:max-w-[250px]">
            <p
              className="text-gray-200 text-xs sm:text-[13px] md:text-sm leading-[1.65]"
              style={{ fontStyle: "italic" }}
            >
              Achieve your fitness goals with expert trainers, cutting-edge
              equipment, and a community that motivates you every step of the
              way.
            </p>
          </div>

          {/* ─── Z-30: Social Icons locked inside max-w-7xl at bottom left ─── */}
          <div className="absolute z-30 left-4 sm:left-6 md:left-8 bottom-5 sm:bottom-6 flex items-center gap-3.5 text-white/80">
            <Link
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </Link>
          </div>

          {/* ─── Z-30: "See Packages" Button locked in RIGHT-MIDDLE ─── */}
          <div className="absolute z-30 right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2">
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              <span>See Packages</span>
              <span className="bg-black text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              </span>
            </Link>
          </div>

          {/* ─── Z-40: Notch & Arrow Button ─── */}
          <div
            className="absolute z-40 bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-end"
            style={{ width: "180px", height: "65px" }}
          >
            <svg
              viewBox="0 -16 180 91"
              className="w-[180px] h-[65px] text-white fill-current block"
            >
              <path d="M 0 75 C 36 75 44 60 44 38 A 46 46 0 0 1 136 38 C 136 60 144 75 180 75 Z" />
            </svg>
            <a
              href="#stats"
              aria-label="Scroll Down"
              className="absolute z-50 left-1/2 -translate-x-1/2 top-[4px] w-13 h-13 sm:w-14 sm:h-14 bg-black text-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          STATS — White Strip (3 columns)
          ════════════════════════════════════════════════════════════ */}
      <div id="stats" className="bg-white text-black pt-10 pb-4 sm:pt-12 sm:pb-6 px-6">
        <div className="max-w-2xl mx-auto grid grid-cols-3 divide-x divide-gray-200 text-center">
          <div className="flex flex-col items-center px-2 sm:px-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
              <CountUp end={105} />+
            </span>
            <span className="text-gray-500 font-semibold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider mt-1">
              Expert Trainers
            </span>
          </div>
          <div className="flex flex-col items-center px-2 sm:px-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
              <CountUp end={970} />+
            </span>
            <span className="text-gray-500 font-semibold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider mt-1">
              Member Joined
            </span>
          </div>
          <div className="flex flex-col items-center px-2 sm:px-4">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
              <CountUp end={135} />+
            </span>
            <span className="text-gray-500 font-semibold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider mt-1">
              Fitness Programs
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
