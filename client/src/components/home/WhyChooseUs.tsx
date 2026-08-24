"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, Dumbbell } from "lucide-react";

const features = [
  {
    title: "Expert Trainers",
    description:
      "Certified and experienced trainers provide personalized guidance and support to help you reach your goals.",
  },
  {
    title: "State-of-the-Art Equipment",
    description:
      "Train with the latest, high-quality equipment in a clean, modern, and motivating environment.",
  },
  {
    title: "Comprehensive Programs",
    description:
      "From weight loss to muscle gain and flexibility, our programs are tailored to your fitness goals.",
  },
];

const images = [
  {
    src: "/choose1.jpg.jpeg",
    alt: "Expert trainer helping a gym member",
  },
  {
    src: "/choose2.jpg.jpeg",
    alt: "Modern gym equipment",
  },
  {
    src: "/choose3.jpg.jpeg",
    alt: "Group fitness workout",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* ================= LEFT - IMAGES ================= */}
          <div className="grid grid-cols-2 gap-4">
            {/* Large Image */}
            <div className="relative col-span-2 h-70 overflow-hidden rounded-[28px] sm:h-85">
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 backdrop-blur-sm">
                Personal Training
              </div>
            </div>

            {/* Bottom Image 1 */}
            <div className="relative h-55 overflow-hidden rounded-[28px] sm:h-67.5">
              <Image
                src={images[1].src}
                alt={images[1].alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Bottom Image 2 */}
            <div className="relative h-55 overflow-hidden rounded-[28px] sm:h-67.5">
              <Image
                src={images[2].src}
                alt={images[2].alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>

          {/* ================= RIGHT - CONTENT ================= */}
          <div>
            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-0.5 w-10 bg-green-600" />

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
                Why Choose Us
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Why Choose{" "}
              <span className="text-green-600">FitLife Studio?</span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
              We are more than just a gym. FitLife Studio is your partner in
              building a stronger, healthier, and more confident version of
              yourself.
            </p>

            {/* Features */}
            <div className="mt-9 divide-y divide-gray-200">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex gap-5 py-6 first:pt-0 last:pb-7"
                >
                  {/* Check Icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 transition-all duration-300 group-hover:bg-green-600">
                    <Check className="h-7 w-7 text-green-600 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 sm:text-xl">
                      {feature.title}
                    </h3>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="group mt-2 flex w-full items-center justify-between rounded-2xl bg-gray-950 px-6 py-5 text-white transition-all duration-300 hover:bg-green-600 sm:px-7"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 transition-colors duration-300 group-hover:bg-white">
                  <Dumbbell className="h-5 w-5 text-white group-hover:text-green-600" />
                </span>

                <span className="text-base font-bold sm:text-lg">
                  Free Trial Today
                </span>
              </div>

              <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}