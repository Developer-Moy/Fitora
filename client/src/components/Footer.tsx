"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import { MapPin as FiMapPin, ArrowRight as FiArrowRight } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside /dashboard, /login, and /register routes
  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="relative bg-black text-white select-none overflow-hidden border-t border-white/10">
      {/* ── Main Hero Footer Section (Crystal Clear Gym BG & Polished Bold Design) ── */}
      <div className="relative py-10 sm:py-12 px-6 sm:px-10 lg:px-14 overflow-hidden">
        {/* Crystal Clear High Visibility Gym Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.85] contrast-115 z-0 transition-all duration-300"
          style={{
            backgroundImage: "url('/image1.jpg.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-0 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* Top Row: Bold Outlined "GO FOR IT!" Typography + Gym HQ Location & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Left Column: Bold & Outlined "GO FOR IT!" Text */}
            <div className="lg:col-span-6 font-black uppercase leading-[0.85] tracking-tighter text-4xl sm:text-6xl xl:text-7xl drop-shadow-2xl">
              <div className="text-white drop-shadow-md">GO</div>
              <div
                className="text-transparent stroke-text"
                style={{ WebkitTextStroke: "2.5px white" }}
              >
                FOR
              </div>
              <div
                className="text-transparent stroke-text"
                style={{ WebkitTextStroke: "2.5px white" }}
              >
                IT!
              </div>
            </div>

            {/* Right Column: Mission Quote + Location Info + Directions Button */}
            <div className="lg:col-span-6 space-y-4 lg:pl-10 text-left lg:text-right flex flex-col lg:items-end justify-end">
              <p className="text-xs sm:text-sm text-gray-200 max-w-md font-semibold leading-relaxed drop-shadow-md">
                Bangladesh's premier AI fitness platform. Serving fitness
                enthusiasts across all 64 districts with real-time workout
                tracking, AI coaching, and custom nutrition.
              </p>

              <div className="space-y-1 drop-shadow-md">
                <p className="text-[11px] font-extrabold text-gray-300 uppercase tracking-widest">
                  Where are we?
                </p>
                <p className="text-sm font-black text-white">
                  Fitora Tower, Gulshan-2, Dhaka 1212
                </p>
                <p className="text-xs font-extrabold text-white/90">
                  64 Branches in Bangladesh
                </p>
              </div>

              {/* Get Directions Button (Pure White Pill) */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-black text-xs hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 active:scale-95 cursor-pointer w-fit"
              >
                <span>Get Directions</span>
                <FiMapPin className="w-4 h-4 text-black stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Middle Row: Unique Non-Navbar Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/20 text-xs text-gray-200">
            <div>
              <span className="font-black text-white uppercase text-[11px] tracking-wider block mb-2">
                Fitness Hubs
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-semibold">
                <Link
                  href="/meals"
                  className="hover:text-white transition-colors"
                >
                  Meal Plans
                </Link>
                <Link
                  href="/exercises"
                  className="hover:text-white transition-colors"
                >
                  Exercise Directory
                </Link>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Athlete Dashboard
                </Link>
              </div>
            </div>

            <div>
              <span className="font-black text-white uppercase text-[11px] tracking-wider block mb-2">
                Fitora Highlights
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-semibold">
                <Link
                  href="/#why-choose"
                  className="hover:text-white transition-colors"
                >
                  Why Choose Us
                </Link>
                <Link
                  href="/#coaches"
                  className="hover:text-white transition-colors"
                >
                  Coaches & Mentors
                </Link>
                <Link
                  href="/#trainers"
                  className="hover:text-white transition-colors"
                >
                  Certified Trainers
                </Link>
              </div>
            </div>

            <div>
              <span className="font-black text-white uppercase text-[11px] tracking-wider block mb-2">
                Account & Portal
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 font-semibold">
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  User Profile
                </Link>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Free Trial
                </Link>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Login Portal
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Social Media Icons + E-Newsletter Bar */}
          <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={19} />
              </a>
            </div>

            {/* Newsletter Subscription Bar */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-3 w-full md:w-auto max-w-md border-b-2 border-white/40 pb-1.5 focus-within:border-white transition-colors"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="bg-transparent text-xs text-white placeholder-gray-300 outline-none w-full font-semibold"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 text-[11px] font-black uppercase text-white hover:text-gray-200 transition-colors shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <FiArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom Copyright Strip ── */}
      <div className="bg-black border-t border-white/10 py-4 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          {/* Left Side: Copyright & Developer Credit */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-semibold">
            <span>FITORA GYM © {new Date().getFullYear()}</span>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>Design and Developed by DeveloperMoy</span>
          </div>

          {/* Right Side: FITORA Logo + Name */}
          <Link
            href="/"
            className="flex items-center gap-2 group select-none shrink-0"
          >
            <img
              src="/logo.svg"
              alt="Fitora logo"
              className="w-4 h-4 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
            />
            <span className="font-black text-xs tracking-wider uppercase text-white font-sans">
              FITORA
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
