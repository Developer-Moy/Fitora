"use client"

import { useState } from 'react';
import { CircleCheckBig, Star, ChevronLeft, ChevronRight } from 'lucide-react'


// Types Definition
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
export interface StarRating {
    rating: number;
}
export interface ReviewCard {
    content: ReviewCard;
}

const plans = [
    {
        name: "Beginner Plan",
        monthlyPrice: 10,
        yearlyPrice: 100,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, illo",
        features: [
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
        ],
        featured: false,
    },
    {
        name: "Premium Plan",
        monthlyPrice: 15,
        yearlyPrice: 150,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, illo",
        features: [
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
        ],
        featured: true,
    },
    {
        name: "Pro Plan",
        monthlyPrice: 20,
        yearlyPrice: 200,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat, illo",
        features: [
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
            "Lorem ipsum dolor sit amet.",
        ],
        featured: false,
    },
];


const avatars = [
  { id: 1, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop', top: '-24px', left: '-24px', size: 'w-20 h-20', zIndex: 'z-10' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop', top: '32px', left: '80px', size: 'w-32 h-32', zIndex: 'z-0' },
  { id: 3, src: 'https://images.unsplash.com/photo-1581382575275-97901c2635b7?q=80&w=256&auto=format&fit=crop', top: '112px', left: '-16px', size: 'w-24 h-24', zIndex: 'z-10' },
  { id: 4, src: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=256&auto=format&fit=crop', top: '128px', left: '176px', size: 'w-28 h-28', zIndex: 'z-0' },
];


const cardContent = {
  name: 'Kerry Rohan',
  rating: 4.5,
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};


const StarRating = ({ rating }: ReviewContent) => {
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
        <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />
      ))}
    </div>
  );
};


const ReviewCard = ({ content }: ReviewCard) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex-1">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.name}</h3>
    <StarRating rating={content.rating} />
    <p className="text-sm text-gray-600 leading-relaxed">{content.text}</p>
  </div>
);

export default function PricingAndReviews() {
    const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

    return (
        <section className="w-full mx-auto bg-white px-6 py-20 md:px-10 lg:px-16">
            {/* Plans  */}
            <div>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <span className="text-gray-400 text-xs font-semibold tracking-wider block mb-1">
                            Pricing plan
                        </span>
                        <h2 className="text-3xl font-black text-slate-800 tracking-wide">JOIN TODAY</h2>
                    </div>

                    {/* Billing Toggle Switch  */}

                    <div className="bg-white/80 backdrop-blur p-1 rounded-2xl flex items-center space-x-1 border border-gray-200/80 shadow-xs self-start md:self-auto">
                        <button type="button" onClick={() => setBilling("monthly")}
                            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${billing === "monthly" ? "bg-zinc-800 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>Monthly</button>
                        <button type="button" onClick={() => setBilling("yearly")}
                            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${billing === "yearly" ? "bg-black text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>Yearly</button>
                    </div>
                </div>

                {/* Pricing Card  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan) => {
                        const currentPrice =
                            billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

                        return (
                            <div
                                key={plan.name}
                                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 ${plan.featured
                                        ? "bg-black/95 text-white shadow-2xl scale-[1.02]"
                                        : "bg-white text-gray-800 shadow-sm border border-gray-100"
                                    }`}
                            >
                                <div>
                                    {/* Plan Name */}
                                    <h3
                                        className={`text-xs font-semibold mb-3 ${plan.featured ? "text-gray-300" : "text-gray-400"
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>
                                    {/* Dynamic Price Display */}
                                    <div className="flex items-baseline mb-4">
                                        <span
                                            className={`text-3xl font-black tracking-tight ${plan.featured ? "text-white" : "text-slate-900"
                                                }`}
                                        >
                                            ${currentPrice}
                                        </span>
                                        <span
                                            className={`ml-1 text-xs font-bold ${plan.featured ? "text-gray-400" : "text-gray-500"
                                                }`}
                                        >
                                            /{billing === "monthly" ? "Month" : "Year"}
                                        </span>
                                    </div>

                                    {/* Plan Description */}
                                    <p
                                        className={`text-[11px] leading-relaxed mb-6 ${plan.featured ? "text-gray-300" : "text-gray-400"
                                            }`}
                                    >
                                        {plan.description}
                                    </p>

                                    {/* Features List */}
                                    <ul className="space-y-3.5 mb-8">
                                        {plan.features.map((feature, fIdx) => (
                                            <li
                                                key={fIdx}
                                                className="flex items-center space-x-2.5 text-xs font-semibold"
                                            >
                                                <CircleCheckBig className={`${plan.featured}`} />
                                                <span
                                                    className={
                                                        plan.featured
                                                            ? "text-gray-200"
                                                            : "text-gray-500"
                                                    }
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Choose Plan Button */}
                                <button
                                    type="button"
                                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${plan.featured
                                            ? "bg-white text-zinc-900 hover:bg-gray-100"
                                            : "bg-black text-white hover:bg-[#323236]"
                                        }`}
                                >
                                    Choose Plan
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reviews  */}

            <div className="max-w-full mx-auto pt-16">
                <span className="text-gray-400 text-xs font-semibold tracking-wider block mb-1">
                            Reviews
                        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-10">YOUR OPINIONS</h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Avatar Cluster */}
          <div className="relative w-full md:w-1/3 h-64 shrink-0">
            {avatars.map((avatar) => (
              <img
                key={avatar.id}
                src={avatar.src}
                alt={`Avatar ${avatar.id}`}
                className={`absolute rounded-full border-4 border-white object-cover ${avatar.size} ${avatar.zIndex}`}
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
        <div className="mt-10 flex gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white shadow-md transition hover:bg-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 shadow-sm transition hover:bg-gray-300">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
        </section>

    )
}