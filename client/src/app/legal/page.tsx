"use client";

import PrivacyPolicy from "@/components/Legal/PrivacyPolicy";
import TermsAndConditions from "@/components/Legal/Terms&Conditions";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Page Header */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
            Legal
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Legal Information
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Review our Privacy Policy and Terms &amp; Conditions below.
          </p>
        </div>

        {/* Privacy Policy Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">
            Privacy Policy
          </h2>
          <PrivacyPolicy />
        </section>

        {/* Divider */}
        <div className="border-t border-white/10 mb-12 sm:mb-16" />

        {/* Terms & Conditions Section */}
        <section id="TermsAndConditions" className="mb-10">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">
            Terms &amp; Conditions
          </h2>
          <TermsAndConditions />
        </section>

        {/* Footer note */}
        <p className="mt-10 text-[11px] text-white/25 text-center">
          © {new Date().getFullYear()} Fitora. All rights reserved.
        </p>
      </div>
    </main>
  );
}
