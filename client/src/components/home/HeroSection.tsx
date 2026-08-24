"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle
} from "lucide-react";

// TikTok icon SVG component
const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 1 1-2.896-2.896c.148 0 .292.012.434.034V9.332a6.334 6.334 0 1 0 5.908 6.34V9.43a8.188 8.188 0 0 0 4.769 1.51v-3.51a4.832 4.832 0 0 1-1.000-.744z" />
  </svg>
);

// Animated Live Counter Component
const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
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
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            }
          }, Math.max(stepTime, 10));
        }
      },
      { threshold: 0.2 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={countRef}>{count}</span>;
};

export const Banner = () => {
  return (
    <section className="relative w-full bg-white text-black overflow-hidden select-none">
      {/* Dark Hero Section */}
      <div className="relative w-full bg-black text-white min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between pt-16 pb-24 px-6 md:px-16 overflow-hidden">

        {/* Full-bleed Background Athlete Image */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Image
            src="/hero.jpg.jpeg"
            alt="Hero Athlete Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top md:object-center brightness-90"
          />
          {/* Subtle dark gradient overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Top: Big Centered Headline */}
        <div className="relative z-10 w-full max-w-7xl mx-auto text-center pt-4 md:pt-8">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-extrabold tracking-tight uppercase leading-none text-white drop-shadow-lg">
            Build Your Body
          </h1>
        </div>

        {/* Middle: Content Grid (Left Subtitle & Right CTA) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-end pb-12 my-auto">
          {/* Left Column: Subtitle & Social Links */}
          <div className="md:col-span-5 space-y-6 text-center md:text-left">
            <p className="text-gray-200 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0 drop-shadow-md">
              Achieve your fitness goals with expert trainers, cutting-edge equipment, and a community that motivates you every step of the way.
            </p>

            {/* Social Icons Bar */}
            <div className="flex items-center justify-center md:justify-start gap-4 text-white/90 pt-2">
              <Link href="#" className="hover:text-white transition-colors p-1" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors p-1" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors p-1" aria-label="TikTok">
                <TikTokIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors p-1" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors p-1" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Pill Action Button */}
          <div className="md:col-span-7 flex justify-center md:justify-end">
            <Link
              href="#packages"
              className="group inline-flex items-center gap-3 bg-white text-black font-bold px-6 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl"
            >
              <span className="text-sm md:text-base">See Packages</span>
              <span className="bg-black text-white p-1.5 rounded-full group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Center Circular Arrow Cutout Notch */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-24 h-12 bg-white rounded-t-full flex items-center justify-center relative">
            <button className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center border-4 border-white -mt-6 hover:scale-105 transition-transform duration-300 shadow-xl">
              <ArrowUpRight className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Stats Counter Strip */}
      <div className="bg-white text-black pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 gap-8 md:gap-0 text-center">

          {/* Stat 1 */}
          <div className="flex flex-col items-center py-4 md:py-0 md:px-6">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black">
              <CountUp end={105} />+
            </span>
            <span className="text-gray-500 font-semibold text-xs md:text-sm uppercase tracking-wider mt-2">
              Expert Trainers
            </span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center py-4 md:py-0 md:px-6">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black">
              <CountUp end={970} />+
            </span>
            <span className="text-gray-500 font-semibold text-xs md:text-sm uppercase tracking-wider mt-2">
              Member Joined
            </span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center py-4 md:py-0 md:px-6">
            <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black">
              <CountUp end={135} />+
            </span>
            <span className="text-gray-500 font-semibold text-xs md:text-sm uppercase tracking-wider mt-2">
              Fitness Programs
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Banner;