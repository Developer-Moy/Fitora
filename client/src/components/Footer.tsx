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
      
      {/* ── Main Hero Footer Section (Compact Scaled-Down Original Layout) ── */}
      <div className="relative py-6 sm:py-8 px-6 sm:px-10 lg:px-14 overflow-hidden">
        
        {/* High Visibility Gym Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.5] contrast-110 z-0 transition-all duration-300"
          style={{
            backgroundImage: "url('/image1.jpg.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50 z-0" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          
          {/* Top Row: Compact Scaled "GO FOR IT!" Typography + Gym Location & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            
            {/* Left Column: Compact Outlined "GO FOR IT!" Text */}
            <div className="lg:col-span-6 font-black uppercase leading-[0.85] tracking-tighter text-3xl sm:text-4xl xl:text-5xl">
              <div className="text-white">GO</div>
              <div
                className="text-transparent stroke-text"
                style={{ WebkitTextStroke: "1.5px white" }}
              >
                FOR
              </div>
              <div
                className="text-transparent stroke-text"
                style={{ WebkitTextStroke: "1.5px white" }}
              >
                IT!
              </div>
            </div>

            {/* Right Column: Mission Quote + Location Info + Directions Button */}
            <div className="lg:col-span-6 space-y-3.5 lg:pl-10 text-left lg:text-right flex flex-col lg:items-end justify-end">
              
              <p className="text-xs text-gray-300 max-w-md font-medium leading-relaxed">
                Bangladesh's premier AI fitness platform. Serving fitness enthusiasts across all 64 districts with real-time workout tracking, AI coaching, and custom nutrition.
              </p>

              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Where are we?
                </p>
                <p className="text-xs font-semibold text-white">
                  Fitora Tower, Gulshan-2, Dhaka 1212
                </p>
                <p className="text-xs font-semibold text-white/80">
                  64 Branches in Bangladesh
                </p>
              </div>

              {/* Get Directions Button (Pure White Pill) */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black font-extrabold text-[11px] hover:bg-gray-200 transition-all shadow-md active:scale-95 cursor-pointer w-fit"
              >
                <span>Get Directions</span>
                <FiMapPin className="w-3 h-3 text-black" />
              </a>
            </div>

          </div>

          {/* Middle Row: Unique Non-Navbar Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs text-gray-300">
            <div>
              <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block mb-1">AI Fitness</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link href="/dashboard/user/nutrition" className="hover:text-white transition-colors">AI Nutrition</Link>
                <Link href="/dashboard/user/workout" className="hover:text-white transition-colors">Workout Log</Link>
                <Link href="/dashboard/user/recovery" className="hover:text-white transition-colors">Recovery Hub</Link>
              </div>
            </div>

            <div>
              <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block mb-1">Highlights</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link href="/#why-choose" className="hover:text-white transition-colors">Why Choose Us</Link>
                <Link href="/#coaches" className="hover:text-white transition-colors">Coaches & Mentors</Link>
                <Link href="/#trainers" className="hover:text-white transition-colors">Certified Trainers</Link>
              </div>
            </div>

            <div>
              <span className="font-extrabold text-white uppercase text-[10px] tracking-wider block mb-1">Account</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <Link href="/profile" className="hover:text-white transition-colors">User Profile</Link>
                <Link href="/register" className="hover:text-white transition-colors">Free Trial</Link>
                <Link href="/login" className="hover:text-white transition-colors">Login Portal</Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Social Media Icons + E-Newsletter Bar */}
          <div className="pt-4 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={15} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube size={17} />
              </a>
            </div>

            {/* Newsletter Subscription Bar */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-3 w-full md:w-auto max-w-md border-b border-white/30 pb-1 focus-within:border-white transition-colors"
            >
              <input
                type="email"
                placeholder="Enter your email address..."
                className="bg-transparent text-xs text-white placeholder-gray-400 outline-none w-full font-medium"
              />
              <button
                type="submit"
                className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-white hover:text-gray-300 transition-colors shrink-0 cursor-pointer"
              >
                <span>Subscribe</span>
                <FiArrowRight className="w-3 h-3" />
              </button>
            </form>

          </div>

        </div>
      </div>

      {/* ── Bottom Strip ── */}
      <div className="bg-black border-t border-white/10 py-3 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          
          {/* Left Side: Copyright & Developer Credit */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 font-medium">
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
