"use client";
import Image from "next/image";

import { ArrowUpRight, X, Flame, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";

interface MealProps {
  id: string;
  name: string;
  ingredients: string[];
  calories: number;
  description: string;
  img: string;
}

const MealCard = (meal: MealProps) => {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fallbackImage = "https://i.ibb.co.com/8g7PMCnQ/no-img.png";
  const displayImage = !meal.img || imageError ? fallbackImage : meal.img;

  const handleCopyRecipe = async () => {
    const recipeText = `FITORA MEAL PLAN: ${meal.name}
Calories: ${meal.calories} kcal
Description: ${meal.description}
Key Ingredients: ${meal.ingredients.join(", ")}`;

    try {
      await navigator.clipboard.writeText(recipeText);
      toast.success(`${meal.name} recipe & macros copied!`);
    } catch {
      toast.error("Failed to copy recipe.");
    }
  };

  return (
    <>
      {/* ── Meal Card Grid Item ── */}
      <div className="group relative bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-white/30 transition-all duration-500 flex flex-col h-full select-none">
        {/* Meal Image */}
        <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-neutral-900">
          <img
            src={displayImage}
            alt={meal.name}
            className="w-full h-full object-cover brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImageError(true)}
          />

          {/* Top Calorie Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-black text-white shadow-lg">
              <Flame className="w-3 h-3 text-white" />
              <span>{meal.calories} kcal</span>
            </span>
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col grow space-y-3 -mt-2 relative z-10 bg-neutral-950">
          {/* Meal Name */}
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight uppercase font-sans line-clamp-1">
            {meal.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 grow font-medium">
            {meal.description}
          </p>

          {/* Ingredients Preview Tags */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {meal.ingredients.slice(0, 3).map((ing, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full"
              >
                {ing}
              </span>
            ))}
            {meal.ingredients.length > 3 && (
              <span className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                +{meal.ingredients.length - 3} more
              </span>
            )}
          </div>

          {/* Action Button Footer */}
          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4">
            {/* Add to My Daily Plan */}
            <button
              type="button"
              className="group/btn inline-flex items-center gap-1.5 sm:gap-2 bg-neutral-900 text-white border border-white/20 font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-4 py-2 rounded-full uppercase tracking-wider hover:bg-neutral-800 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer shadow-xl shrink-0"
            >
              <span>Daily Plan</span>
              <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center group-hover/btn:rotate-90 group-hover/btn:scale-110 transition-all duration-300 shadow-md shrink-0">
                <FaPlus className="w-3 h-3 stroke-[2.5]" />
              </span>
            </button>

            {/* View Details Signature Pill Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group/btn inline-flex items-center gap-1.5 sm:gap-2 bg-white text-black border border-white font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-4 py-2 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer shrink-0"
            >
              <span>View Details</span>
              <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center group-hover/btn:rotate-45 group-hover/btn:scale-110 transition-all duration-300 shadow-md shrink-0">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Responsive Dark Glassmorphism Modal ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 select-none"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

          {/* ========================================================
              MOBILE & TABLET MODAL LAYOUT (< md) - Compact Vertical Card
          ======================================================== */}
          <div
            className="md:hidden relative bg-neutral-950 border border-white/15 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-white my-auto max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-white hover:text-black transition-colors z-20 cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Mobile Top Image */}
            <div className="relative w-full h-44 sm:h-52 shrink-0 overflow-hidden bg-neutral-900">
              <Image src={displayImage} alt={meal.name} fill className="w-full h-full object-cover brightness-95 contrast-105" />
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-black text-white shadow-lg">
                  🔥 {meal.calories} kcal
                </span>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-transparent to-transparent" />
            </div>

            {/* Mobile Modal Details */}
            <div className="p-5 sm:p-6 space-y-3.5 flex-1 overflow-y-auto">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">
                  FITORA RECIPE DETAILS
                </span>
                <h2 className="text-xl font-black text-white tracking-tight uppercase font-sans leading-tight">
                  {meal.name}
                </h2>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed font-medium">
                {meal.description}
              </p>

              {/* Mobile Ingredients */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block">
                  Key Ingredients & Macros
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {meal.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-block text-[11px] font-bold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/15"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 text-white border border-white/20 font-extrabold hover:bg-neutral-800 transition-all py-2.5 rounded-full uppercase text-xs tracking-wider cursor-pointer shadow-lg active:scale-95"
                >
                  <FaPlus className="w-3.5 h-3.5" />
                  <span>Add to Daily Plan</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyRecipe}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-extrabold hover:bg-gray-100 transition-all py-2.5 rounded-full uppercase text-xs tracking-wider cursor-pointer shadow-lg active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Recipe</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              DESKTOP / PC MODAL LAYOUT (>= md) - Wide 2-Column Split
          ======================================================== */}
          <div
            className="hidden md:block relative bg-neutral-950 border border-white/15 rounded-[2.5rem] shadow-2xl max-w-3xl lg:max-w-4xl w-full overflow-hidden text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:bg-white hover:text-black transition-colors z-20 cursor-pointer shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Desktop 2 Columns Split */}
            <div className="grid grid-cols-12 items-stretch min-h-95 lg:min-h-105">
              {/* Left Column: Full-Height Image (5/12 Width) */}
              <div className="relative col-span-5 h-full overflow-hidden bg-neutral-900">
                <Image src={displayImage} alt={meal.name} fill className="w-full h-full object-cover brightness-95 contrast-105" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-lg">
                    🔥 {meal.calories} kcal
                  </span>
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-neutral-950/80" />
              </div>

              {/* Right Column: Details & Ingredients (7/12 Width) */}
              <div className="col-span-7 p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-sans leading-tight">
                    {meal.name}
                  </h2>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-medium">
                    {meal.description}
                  </p>
                </div>

                {/* Key Ingredients */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">
                    Key Ingredients & Macros
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-block text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/15"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyRecipe}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black font-extrabold hover:bg-gray-100 transition-all px-5 py-2.5 rounded-full uppercase text-xs tracking-wider cursor-pointer shadow-xl active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Recipe</span>
                  </button>

                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-900 text-white border border-white/20 font-extrabold hover:bg-neutral-800 transition-all px-5 py-2.5 rounded-full uppercase text-xs tracking-wider cursor-pointer shadow-xl active:scale-95"
                  >
                    <FaPlus className="w-3.5 h-3.5" />
                    <span>Add to Daily Plan</span>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealCard;
