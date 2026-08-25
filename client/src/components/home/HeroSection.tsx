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
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(Math.floor(easeOutQuad(progress) * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [started, end, duration]);

  return <span ref={ref}>{count}</span>;
};

export default function HeroSection() {
  return (
    <section className="relative bg-black text-white select-none overflow-hidden pt-16 sm:pt-20">
      {/* Outer wrapper to set exact container bounds */}
      <div className="w-full relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] lg:min-h-[520px] max-h-[580px] flex items-end justify-center">
        {/* Centered max-w-7xl relative container to anchor Left/Right elements on zoom */}
        <div className="relative w-full max-w-7xl h-full mx-auto px-4 sm:px-6 md:px-8">
          
          {/* ─── Z-10: Single Line Serif Headline "Build Your Body" ─── */}
          <div className="absolute z-10 inset-x-0 top-3 sm:top-5 md:top-6 text-center whitespace-nowrap overflow-hidden">
            <h1
              className="font-serif font-black italic tracking-tight text-white/90 drop-shadow-2xl inline-block"
              style={{
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

          {/* ─── Z-30: Left Side — Subtitle & "See Packages" Button ─── */}
          <div className="absolute z-30 left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 max-w-[220px] sm:max-w-[260px] space-y-4">
            <p
              className="text-gray-200 text-xs sm:text-[13px] md:text-sm leading-[1.65]"
              style={{ fontStyle: "italic" }}
            >
              Achieve your fitness goals with expert trainers, cutting-edge
              equipment, and a community that motivates you every step of the
              way.
            </p>

            <div>
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
          </div>

          {/* ─── Z-30: Right Side — 3 Stats Counters Floating Glass Stack ─── */}
          <div className="absolute z-30 right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 space-y-2.5 hidden sm:flex sm:flex-col items-end">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <Dumbbell className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="text-right">
                <span className="text-sm sm:text-base font-black text-white leading-none block font-sans">
                  <CountUp end={105} />+
                </span>
                <span className="text-[9px] text-gray-300 uppercase tracking-wider font-semibold">
                  Trainers
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="text-right">
                <span className="text-sm sm:text-base font-black text-white leading-none block font-sans">
                  <CountUp end={970} />+
                </span>
                <span className="text-[9px] text-gray-300 uppercase tracking-wider font-semibold">
                  Members
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="text-right">
                <span className="text-sm sm:text-base font-black text-white leading-none block font-sans">
                  <CountUp end={135} />+
                </span>
                <span className="text-[9px] text-gray-300 uppercase tracking-wider font-semibold">
                  Programs
                </span>
              </div>
            </div>

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
              href="#why-choose"
              aria-label="Scroll Down"
              className="absolute z-50 left-1/2 -translate-x-1/2 top-[4px] w-13 h-13 sm:w-14 sm:h-14 bg-black text-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
