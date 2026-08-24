"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const REVIEWS = [
  {
    name: "Kerry Rohan",
    rating: 5,
    comment:
      "Fitora transformed my workout routine completely. The AI coaching tips and workout timer helped me add 15kg to my bench press in 2 months!",
  },
  {
    name: "Sarah Jenkins",
    rating: 5,
    comment:
      "The meal plans and calorie calculator are top notch! Extremely user friendly and clean interface. Best gym platform I have used.",
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment:
      "Real-time workout HUD and recovery metrics give me exact feedback after heavy squats. Highly recommended for any serious athlete!",
  },
];

export default function YourOpinionsTestimonials() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevReview = () => {
    setCurrentIdx((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIdx((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="reviews"
      className="w-full py-20 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Reviews
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              YOUR OPINIONS
            </h2>
          </div>

          <button
            onClick={() => alert("Thank you! Review submission modal opening.")}
            className="px-6 py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all cursor-pointer shadow-md"
          >
            + Your Opinion
          </button>
        </div>

        {/* Testimonials Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Avatar Circular Collage */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-white/15 bg-[#0E0F12] flex items-center justify-center p-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                alt="Reviewer Avatar Main"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-white shadow-2xl"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Reviewer Avatar Small 1"
                className="absolute top-2 left-4 w-14 h-14 rounded-full object-cover border border-white/30 shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                alt="Reviewer Avatar Small 2"
                className="absolute bottom-4 right-2 w-16 h-16 rounded-full object-cover border border-white/30 shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Reviewer Avatar Small 3"
                className="absolute top-8 right-2 w-12 h-12 rounded-full object-cover border border-white/30 shadow-lg"
              />
            </div>
          </div>

          {/* Right Column: Active Review Card + Navigation Arrows */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0E0F12] border border-white/15 space-y-4 shadow-2xl">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-white">
                {[...Array(REVIEWS[currentIdx].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-white" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
                "{REVIEWS[currentIdx].comment}"
              </p>

              {/* Reviewer Name */}
              <p className="text-base font-extrabold text-white pt-2">
                {REVIEWS[currentIdx].name}
              </p>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={prevReview}
                aria-label="Previous Review"
                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                aria-label="Next Review"
                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
