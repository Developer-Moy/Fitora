"use client";

import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="border border-white/10 rounded-xl p-5 sm:p-6 space-y-2 bg-white/2">
      <h2 className="text-sm font-black uppercase tracking-widest text-white">
        {title}
      </h2>
      <div className="text-sm text-white/60 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
          Last updated: September 2026
        </span>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          Fitora is committed to protecting your privacy. This policy explains
          what data we collect, how we use it, and your rights.
        </p>
      </div>

      <Section title="Information We Collect">
        <p>
          When you create an account, we collect your name, email address, and
          password. During onboarding, we may also collect fitness-related data
          you provide such as age, weight, height, goal type, and activity
          level to personalize your experience.
        </p>
        <p>
          If you subscribe to a paid plan, payment details are processed
          securely by our payment partners (bKash, Nagad, Stripe). We do not
          store raw card numbers or mobile wallet credentials.
        </p>
      </Section>

      <Section title="How We Use Information">
        <p>We use your data to:</p>
        <ul className="list-disc list-inside space-y-1 text-white/55">
          <li>Provide and personalize Fitora features (meal plans, workout tracking, progress logs)</li>
          <li>Manage your account and subscription status</li>
          <li>Send important account notifications and service updates</li>
          <li>Improve platform performance and user experience</li>
        </ul>
        <p className="pt-1">We do not sell your personal data to third parties.</p>
      </Section>

      <Section title="Data Protection">
        <p>
          All data transmitted between your device and Fitora servers is
          encrypted using industry-standard TLS/SSL. Account passwords are
          stored as secure hashes. We apply access controls to limit internal
          data access.
        </p>
      </Section>

      <Section title="Payments and Third-Party Services">
        <p>
          Subscription payments are handled by third-party gateways including
          bKash, Nagad, and Stripe. Each provider operates under its own
          privacy policy. Fitora receives only a confirmation of payment
          success, not your raw payment credentials.
        </p>
      </Section>

      <Section title="User Rights">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1 text-white/55">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw consent for non-essential data usage</li>
        </ul>
        <p className="pt-1">To exercise these rights, contact us at the address below.</p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this Privacy Policy? Reach us at{" "}
          <a
            href="mailto:support@fitora.app"
            className="text-white underline underline-offset-2 hover:text-white/80 transition-colors"
          >
            support@fitora.app
          </a>
        </p>
      </Section>
    </div>
  );
}