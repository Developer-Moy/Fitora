"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer inside /dashboard routes matching design reference
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }
  return (
    <footer className="relative bg-gradient-to-r from-red-950/20 via-[#0a0a0a] to-emerald-950/20 border-t border-white/[0.08] text-white pt-12 pb-8 px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Brand Logo & Description ── */}
        <div className="md:col-span-4 space-y-3">
          <Link href="/" className="flex items-center gap-2 select-none group w-fit">
            <img
              src="/logo.svg"
              alt="Fitora logo"
              className="w-7 h-7 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-xl font-bold tracking-wide text-red-500">
              Fi<span className="text-white">tora</span>
            </span>
          </Link>
          <p className="text-sm text-white/60 leading-relaxed max-w-sm">
            <span className="text-red-400 font-medium">Fitora:</span> Your ultimate data-driven fitness companion. We turn every workout into insights and data.
          </p>
        </div>

        {/* ── Middle Column: Heading & Social Links ── */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-white/80 leading-snug">
            COMPLETE,
            <br />
            COMPREHENSIVE
            <br />
            FOOTER
          </h4>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-1">
            <SocialIcon href="https://facebook.com" ariaLabel="Facebook">
              <FaFacebookF size={14} />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" ariaLabel="Instagram">
              <FaInstagram size={15} />
            </SocialIcon>
            <SocialIcon href="https://x.com" ariaLabel="Twitter / X">
              <FaXTwitter size={14} />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" ariaLabel="YouTube">
              <FaYoutube size={15} />
            </SocialIcon>
          </div>
        </div>

        {/* ── Right Column: Navigation Links ── */}
        <div className="md:col-span-5 grid grid-cols-3 gap-6 text-sm">
          {/* Column 1 */}
          <ul className="space-y-2.5">
            <FooterLink href="/" label="Dashboard" />
            <FooterLink href="/workouts" label="Workouts" />
            <FooterLink href="/plans" label="Plans" />
            <FooterLink href="/support" label="Support" />
          </ul>

          {/* Column 2 */}
          <ul className="space-y-2.5">
            <FooterLink href="/pricing" label="Pricing" />
            <FooterLink href="/about" label="About Us" />
            <FooterLink href="/careers" label="Careers" />
            <FooterLink href="/contact" label="Contact" />
          </ul>

          {/* Column 3 */}
          <ul className="space-y-2.5">
            <FooterLink href="/terms" label="Terms of Service" />
            <FooterLink href="/privacy" label="Privacy Policy" />
          </ul>
        </div>
      </div>

      {/* ── Bottom Copyright Bar ── */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/30">
          Crafted for high performance fitness.
        </p>
        <p className="text-xs text-emerald-500/80 font-medium tracking-wide">
          © {new Date().getFullYear()} Fitora Fitness, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─── Helpers ─── */
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/60 hover:text-white transition-colors duration-200 font-medium text-xs sm:text-sm"
      >
        {label}
      </Link>
    </li>
  );
}

function SocialIcon({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 shadow-lg shadow-red-950/50 transition-all duration-200"
    >
      {children}
    </a>
  );
}
