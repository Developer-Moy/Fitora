"use client";

import Link from "next/link";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose"
      className="w-full pt-8 sm:pt-12 pb-20 sm:pb-24 px-6 sm:px-10 lg:px-16 bg-black text-white border-b border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* ── Left Side: 3 Stacked Rounded Workout Images ── */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden border border-white/15 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1000&q=80"
              alt="Battle Ropes Workout"
              className="w-full h-full object-cover filter brightness-90 contrast-110"
            />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
              alt="Gym Equipment Athlete"
              className="w-full h-full object-cover filter brightness-90 contrast-110"
            />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=600&q=80"
              alt="Outdoor Running Athlete"
              className="w-full h-full object-cover filter brightness-90 contrast-110"
            />
          </div>
        </div>

        {/* ── Right Side: Title & Feature Checklist ── */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
              Why Choose Fitora?
            </h2>
            <p
              className="text-gray-300 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
              style={{ fontStyle: "italic" }}
            >
              Discover the Benefits That Set Us Apart and Propel Your Fitness
              Journey Forward.
            </p>
          </div>

          {/* Checklist Items */}
          <div className="space-y-5 pt-2">
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Expert Trainers
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Our certified trainers provide personalized guidance and
                  expert advice to help you achieve your fitness goals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-extrabold text-white">
                  State-of-the-Art Equipment
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Work out with the latest and most advanced fitness equipment
                  to maximize your results and enhance your experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Comprehensive Programs
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Enjoy a variety of classes and programs tailored to all
                  fitness levels, from beginner to advanced.
                </p>
              </div>
            </div>
          </div>

          {/* Free Trial Button */}
          <div className="pt-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>Free Trial Today</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
