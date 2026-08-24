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
      
      {/* ── Main Hero Footer Section (Compact Height + Dedicated Gym Image) ── */}
      <div className="relative py-10 sm:py-14 px-6 sm:px-10 lg:px-14 overflow-hidden">
        
        {/* High Visibility Gym Background Image (Using image1.jpg.jpeg, NOT hero image) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.7] contrast-110 z-0 transition-all duration-300"
          style={{
            backgroundImage: "url('/image1.jpg.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30 z-0" />

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
                Achieve your peak physical potential with real-time workout tracking, AI coaching, and personalized nutrition plans. Master your strength today.
              </p>

              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Where are we?
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white max-w-xs">
                  Banashankari Stage II, Bengaluru, Karnataka 560070
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

          {/* Middle Row: Social Media Icons + E-Newsletter Bar */}
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

      {/* ── Bottom Strip (Pure Black Theme) ── */}
      <div className="bg-black border-t border-white/10 py-4 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          
          {/* Left Side: Copyright & Legal */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-medium">
            <span>Fitora Gym © {new Date().getFullYear()}</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>Designed by Developer-Moy</span>
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
