"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

export default function BuildBodyHero() {
  return (
    <section className="relative bg-black text-white select-none overflow-hidden pt-12 pb-16 px-6 sm:px-10 lg:px-16 border-b border-white/10">
      {/* ── Top Hero Card (Black Card with Large Headline & Bodybuilder Image) ── */}
      <div className="max-w-7xl mx-auto bg-[#0E0F12] rounded-3xl border border-white/15 p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Side: Headline & Mission */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-5xl sm:text-7xl xl:text-[5.5rem] font-black uppercase tracking-tight leading-[0.95] text-white">
              Build Your <br />
              <span className="text-white">Body</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-md font-medium leading-relaxed">
              Achieve your fitness goals with expert trainers, cutting-edge
              equipment, and a community that motivates you every step of the
              way.
            </p>

            {/* See Packages Pill Button */}
            <div className="pt-2">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black font-black text-xs sm:text-sm hover:bg-gray-200 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <span>See Packages</span>
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Side: Athlete Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80"
                alt="Bodybuilder Athlete"
                className="w-full h-full object-cover filter contrast-110 brightness-95"
              />
            </div>
          </div>
        </div>

        {/* Bottom Social Icons Row inside Hero Box */}
        <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-6 text-gray-400">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="TikTok"
          >
            <FaTiktok size={18} />
          </a>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <FaYoutube size={20} />
          </a>
        </div>
      </div>

      {/* ── Center Arrow Badge ── */}
      <div className="-mt-7 flex justify-center relative z-20">
        <Link
          href="#why-choose"
          className="w-14 h-14 rounded-full bg-white text-black border-4 border-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        >
          <ArrowUpRight className="w-7 h-7" />
        </Link>
      </div>

      {/* ── Live Stats Counter Row ── */}
      <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        <div className="pt-4 sm:pt-0">
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            105+
          </h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
            Expert Trainers
          </p>
        </div>

        <div className="pt-4 sm:pt-0">
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            970+
          </h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
            Member Joined
          </p>
        </div>

        <div className="pt-4 sm:pt-0">
          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            135+
          </h3>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
            Fitness Programs
          </p>
        </div>
      </div>
    </section>
  );
}
