"use client";

import { useState } from "react";
import { CircleCheckBig, Star, ChevronLeft, ChevronRight } from "lucide-react";

export type BillingCycle = "monthly" | "yearly";

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  featured: boolean;
}

export interface ReviewContent {
  name: string;
  rating: number;
  text: string;
}

export interface StarRatingProps {
  rating: number;
}

export interface ReviewCardProps {
  content: ReviewContent;
}

const plans = [
  {
    id: "beginner",
    name: "Beginner Plan",
    monthlyPrice: 10,
    yearlyPrice: 100,
    description:
      "Ideal for starting your fitness journey with basic equipment access.",
    features: [
      "Access to basic workout equipment",
      "Locker room & shower access",
      "Mobile app workout timer",
      "Community forum support",
    ],
    featured: false,
  },
  {
    id: "premium",
    name: "Premium Plan",
    monthlyPrice: 15,
    yearlyPrice: 150,
    description:
      "Our most popular plan for dedicated athletes seeking AI guidance.",
    features: [
      "All Beginner Plan features",
      "AI Personal Trainer Studio",
      "Custom Macro & Meal Plans",
      "24/7 Unlimited Gym Access",
    ],
    featured: true,
  },
  {
    id: "pro",
    name: "Pro Plan",
    monthlyPrice: 20,
    yearlyPrice: 200,
    description: "Complete elite package with 1-on-1 coaching & sauna pass.",
    features: [
      "All Premium Plan features",
      "1-on-1 Personal Master Coach",
      "Sauna & Spa Recovery Pass",
      "Custom Supplement Advice",
    ],
    featured: false,
  },
];

const avatars = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    size: "w-28 h-28",
    top: "10%",
    left: "30%",
    zIndex: "z-30",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    size: "w-20 h-20",
    top: "0%",
    left: "10%",
    zIndex: "z-20",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    size: "w-20 h-20",
    top: "50%",
    left: "60%",
    zIndex: "z-20",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    size: "w-16 h-16",
    top: "60%",
    left: "15%",
    zIndex: "z-10",
  },
];

const cardContent: ReviewContent = {
  name: "Kerry Rohan",
  rating: 4.5,
  text: "Fitora transformed my workout routine completely. The AI coaching tips and workout timer helped me add 15kg to my bench press in 2 months!",
};

const StarRating = ({ rating }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-1 text-yellow-400 mb-4">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-current" />
      ))}
      {halfStar && (
        <div className="relative w-5 h-5">
          <Star className="w-5 h-5 absolute top-0 left-0 text-gray-300 fill-current" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300 fill-current"
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ content }: ReviewCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex-1 border border-gray-100">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.name}</h3>
    <StarRating rating={content.rating} />
    <p className="text-sm text-gray-600 leading-relaxed">{content.text}</p>
  </div>
);

export default function PricingAndReviews() {
  const [billing, setBilling] = useState<BillingCycle>("yearly");

  return (
    <section className="w-full mx-auto bg-white px-6 py-20 md:px-10 lg:px-16 text-black select-none">
      {/* Plans Section */}
      <div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-gray-400 text-xs font-semibold tracking-wider block mb-1">
              PRICING PLAN
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              JOIN TODAY
            </h2>
          </div>

          {/* Toggle Switch */}
          <div className="bg-gray-100 p-1 rounded-full flex items-center w-fit border border-gray-200">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billing === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                billing === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? "bg-gray-900 text-white shadow-xl scale-105 z-10"
                  : "bg-white text-gray-900 border border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold">
                    $
                    {billing === "monthly"
                      ? plan.monthlyPrice
                      : plan.yearlyPrice}
                  </span>
                  <span
                    className={`text-xs font-semibold ${plan.featured ? "text-gray-400" : "text-gray-500"}`}
                  >
                    / {billing === "monthly" ? "Month" : "Year"}
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed mb-6 ${plan.featured ? "text-gray-300" : "text-gray-600"}`}
                >
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-xs font-medium"
                    >
                      <CircleCheckBig
                        className={`w-4 h-4 shrink-0 ${plan.featured ? "text-white" : "text-gray-900"}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  plan.featured
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 pt-16 border-t border-gray-200">
        <span className="text-gray-400 text-xs font-semibold tracking-wider block mb-1">
          REVIEWS
        </span>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">
          YOUR OPINIONS
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Avatar Cluster */}
          <div className="relative w-full md:w-1/3 h-64 shrink-0">
            {avatars.map((avatar) => (
              <img
                key={avatar.id}
                src={avatar.src}
                alt={`Avatar ${avatar.id}`}
                className={`absolute rounded-full border-4 border-white object-cover shadow-md ${avatar.size} ${avatar.zIndex}`}
                style={{ top: avatar.top, left: avatar.left }}
              />
            ))}
          </div>

          {/* Cards */}
          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-6">
            <ReviewCard content={cardContent} />
            <ReviewCard content={cardContent} />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex gap-4 justify-end">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition hover:bg-gray-800 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 shadow-sm transition hover:bg-gray-300 cursor-pointer">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
