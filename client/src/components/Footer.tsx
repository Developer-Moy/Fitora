"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside /dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="relative bg-black text-white select-none overflow-hidden border-t border-white/10">
      
      {/* ── Main Compact Footer Section ── */}
      <div className="relative py-8 sm:py-10 px-6 sm:px-10 lg:px-14 overflow-hidden">
        
        {/* High Visibility Gym Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.4] contrast-110 z-0"
          style={{
            backgroundImage: "url('/image1.jpg.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-0" />

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          
          {/* Row 1: Brand Headline & Newsletter Subscription */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/15">
            
            {/* Left: Compact "GO FOR IT!" + Subtitle */}
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                GO FOR IT! <span className="text-gray-400 font-serif italic text-2xl sm:text-3xl font-bold">#FitoraGym</span>
              </h2>
              <p className="text-xs text-gray-300 max-w-md font-medium">
                Bangladesh's premier AI fitness platform across all 64 districts.
              </p>
            </div>

            {/* Right: Newsletter Subscription Bar */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-3 w-full lg:w-auto max-w-md border-b border-white/30 pb-2 focus-within:border-white transition-colors"
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

          {/* Row 2: 3-Column Compact Links & HQ Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            
            {/* Column 1: AI Fitness Hubs */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                AI Fitness Hubs
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-300 font-medium">
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

            {/* Column 2: Fitora Portal */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                Fitora Portal
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-300 font-medium">
                <li>
                  <Link href="/profile" className="hover:text-white transition-colors">User Profile & Badges</Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">Free Trial Sign Up</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">User Login Portal</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Dhaka HQ & Socials */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                Dhaka HQ & Socials
              </h4>
              <p className="text-xs text-white font-semibold">
                Fitora Tower, Gulshan-2, Dhaka 1212 (64 Branches)
              </p>
              <div className="flex items-center gap-4 pt-1">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram">
                  <FaInstagram size={16} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                  <FaFacebookF size={15} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
                  <FaLinkedinIn size={15} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors" aria-label="YouTube">
                  <FaYoutube size={17} />
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Bottom Copyright Strip ── */}
      <div className="bg-black border-t border-white/10 py-3.5 px-6 sm:px-10 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          
          {/* Left Side: Copyright & Developer Credit */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-medium">
            <span>FITORA GYM © {new Date().getFullYear()}</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
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
