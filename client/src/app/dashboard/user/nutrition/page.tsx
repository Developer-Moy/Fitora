import { MealChartCard } from "@/components/MealChartCard";
import HydrationTracker from "@/components/dashboard/HydrationTracker";
import { FiHeart } from "react-icons/fi";

const page = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <FiHeart className="w-3.5 h-3.5 animate-pulse" />
          <span>Your AI Nutrition Coach</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Smart Nutrition & Wellness Tracker
        </h2>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
          Track your daily hydration, manage your meals, and stay on top of your
          nutrition goals with personalized insights from Fitora AI.
        </p>
      </div>

      <HydrationTracker />

      <MealChartCard />
    </div>
  );
};

export default page;