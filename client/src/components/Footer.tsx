"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside /dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="relative bg-black text-white select-none overflow-hidden border-t border-white/10">
      
      {/* ── Main Hero Footer Section ── */}
      <div className="relative py-10 sm:py-14 px-6 sm:px-10 lg:px-14 overflow-hidden">
        
        {/* High Visibility Gym Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.7] contrast-110 z-0 transition-all duration-300"
          style={{
            backgroundImage: "url('/image1.jpg.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-0" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-10">
          
          {/* Top Row: Compact "GO FOR IT!" Typography + Gym Location & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Left Column: Bold & Outlined "GO FOR IT!" Text */}
            <div className="lg:col-span-6 font-black uppercase leading-[0.85] tracking-tighter text-5xl sm:text-7xl xl:text-[7.5rem]">
              <div className="text-white">GO</div>
              <div
                className="text-transparent stroke-text"
                style={{ WebkitTextStroke: "2px white" }}
              >
                FOR
              </div>
              <div
                className="text-transparent stroke-text"
                style={{ WebkitTextStroke: "2px white" }}
              >
                IT!
              </div>
            </div>

            {/* Right Column: Mission Quote + Location Info + Directions Button */}
            <div className="lg:col-span-6 space-y-5 lg:pl-10 text-left lg:text-right flex flex-col lg:items-end justify-end">
              
              <p className="text-xs sm:text-sm text-gray-300 max-w-md font-medium leading-relaxed">
                Bangladesh's premier AI fitness platform. Serving fitness enthusiasts across all 64 districts with real-time workout tracking, AI coaching, and custom nutrition.
              </p>

              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Where are we?
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Fitora Tower, Gulshan-2, Dhaka 1212
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white/80">
                  64 Branches in Bangladesh
                </p>
              </div>

              {/* Get Directions Button (Pure White Pill) */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-extrabold text-xs hover:bg-gray-200 transition-all shadow-md active:scale-95 cursor-pointer w-fit"
              >
                <span>Get Directions</span>
                <FiMapPin className="w-3.5 h-3.5 text-black" />
              </a>
            </div>

          </div>

          {/* ── Middle Row: 3-Column Unique Non-Navbar Links Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-t border-white/15">
            
            {/* Column 1: AI Workouts & Nutrition */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                AI Fitness Hubs
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <Link href="/dashboard/user/nutrition" className="hover:text-white transition-colors">AI Nutrition & Meal Chart</Link>
                </li>
                <li>
                  <Link href="/dashboard/user/workout" className="hover:text-white transition-colors">Workout Log Studio</Link>
                </li>
                <li>
                  <Link href="/dashboard/user/recovery" className="hover:text-white transition-colors">Recovery & Stretch Hub</Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Fitora Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Fitora Highlights
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <Link href="/#why-choose" className="hover:text-white transition-colors">Why Choose Fitora</Link>
                </li>
                <li>
                  <Link href="/#coaches" className="hover:text-white transition-colors">Coaches & Mentors</Link>
                </li>
                <li>
                  <Link href="/#trainers" className="hover:text-white transition-colors">Certified Master Trainers</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Account & Locations */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Account & Portal
              </h4>
              <ul className="space-y-2 text-xs text-gray-300">
                <li>
                  <Link href="/profile" className="hover:text-white transition-colors">User Profile & Badges</Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">Free Trial Sign Up</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">User Login Portal</Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-white transition-colors">Bangladesh 64 Branches</Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Social Media Icons & Newsletter Bar */}
          <div className="pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={19} />
              </a>
            </div>

            {/* Newsletter Subscription Bar */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-3 w-full md:w-auto max-w-md border-b border-white/30 pb-1.5 focus-within:border-white transition-colors"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="bg-transparent text-xs text-white placeholder-gray-400 outline-none w-full font-medium"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-white hover:text-gray-300 transition-colors shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>
      </div>

      {/* ── Bottom Copyright Strip (Pure Black Theme) ── */}
      <div className="bg-black border-t border-white/10 py-4 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          
          {/* Left Side: Copyright & Developer Credit */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-medium">
            <span>FITORA GYM © {new Date().getFullYear()}</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>Design and Developed by DeveloperMoy</span>
          </div>

          {/* Right Side: FITORA Logo + Name */}
          <Link href="/" className="flex items-center gap-2 group select-none shrink-0">
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
