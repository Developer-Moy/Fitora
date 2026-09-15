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

export default function TermsAndConditions() {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
          Last updated: September 2026
        </span>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          By using Fitora, you agree to the following terms. Please read them
          carefully before accessing or using our platform.
        </p>
      </div>

      <Section title="Acceptance of Terms">
        <p>
          By creating an account or using any part of the Fitora platform, you
          agree to be bound by these Terms and Conditions. If you do not agree,
          you may not use Fitora.
        </p>
      </Section>

      <Section title="Account Usage">
        <p>
          You are responsible for maintaining the security of your account
          credentials. You must not share your account with others or use
          another person&apos;s account without permission. Fitora reserves the right
          to suspend accounts that violate these terms.
        </p>
      </Section>

      <Section title="Subscription and Payments">
        <p>
          Fitora offers free and paid subscription plans (Basic Pass, Pro
          Athlete, VIP Ultimate). Paid plans are billed on a monthly or annual
          cycle. Payments are processed via bKash, Nagad, or Stripe. All
          charges are non-refundable unless required by applicable law.
        </p>
        <p>
          Annual plans offer a discounted rate compared to monthly billing.
          Your subscription renews automatically unless cancelled before the
          billing date.
        </p>
      </Section>

      <Section title="Use of Fitora">
        <p>
          Fitora provides tools for fitness tracking, meal planning, workout
          logging, progress monitoring, and related health and wellness
          features. The platform is intended for personal, non-commercial use
          only.
        </p>
        <p>
          Content and recommendations provided by Fitora are for informational
          purposes and do not constitute medical advice. Consult a qualified
          professional before making significant changes to your diet or
          exercise routine.
        </p>
      </Section>

      <Section title="User Responsibilities">
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-1 text-white/55">
          <li>Use Fitora for any unlawful purpose</li>
          <li>Attempt to reverse-engineer, copy, or redistribute any part of the platform</li>
          <li>Submit false or misleading information</li>
          <li>Interfere with the platform&apos;s security or infrastructure</li>
        </ul>
      </Section>

      <Section title="Disclaimer">
        <p>
          Fitora is provided as-is without warranties of any kind. We do not
          guarantee uninterrupted service or that results from using Fitora
          will meet your individual expectations. Use the platform at your own
          discretion.
        </p>
      </Section>

      <Section title="Changes to Terms">
        <p>
          We may update these Terms from time to time. Continued use of Fitora
          after changes are posted constitutes your acceptance of the revised
          terms. We will notify users of significant changes via email or an
          in-app notice.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For questions about these Terms, contact us at{" "}
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