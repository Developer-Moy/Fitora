"use client";

import { useState, useMemo } from "react";
import { MealsData } from "@/data/MealsData";
import MealCard from "@/components/meals/MealCard";
import { Search, Utensils, ChevronLeft, ChevronRight } from "lucide-react";

export default function MealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const categories = [
    { id: "all", label: "All Meals" },
    { id: "high-protein", label: "High Protein" },
    { id: "low-calorie", label: "Under 500 kcal" },
    { id: "fat-loss", label: "Fat Loss & Lean" },
  ];

  const filteredMeals = useMemo(() => {
    return MealsData.filter((meal) => {
      const matchesSearch =
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      if (!matchesSearch) return false;

      if (selectedCategory === "high-protein") {
        return meal.calories >= 450;
      }
      if (selectedCategory === "low-calorie") {
        return meal.calories < 500;
      }
      if (selectedCategory === "fat-loss") {
        return meal.calories < 450;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);

  const paginatedMeals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMeals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMeals, currentPage]);

  return (
    <main className="w-full min-h-screen bg-black text-white pt-24 sm:pt-28 lg:pt-32 pb-20 px-6 sm:px-10 lg:px-16 select-none font-sans border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            Healthy Meals Catalog
          </h1>

          <p
            className="text-gray-300 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium"
            style={{ fontStyle: "italic" }}
          >
            Discover our curated collection of protein-packed, macro-balanced
            meals designed to fuel your fitness transformation and support your
            health targets.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search meals by name or ingredients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-5 py-3.5 rounded-full bg-neutral-950 border border-white/15 text-white text-xs sm:text-sm placeholder-gray-400 outline-none focus:border-white transition-all shadow-xl font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    isActive
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]"
                      : "bg-neutral-950 hover:bg-neutral-900 text-gray-300 border-white/10 hover:border-white/30"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meals Count Summary */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-white" />
            <span>Showing {filteredMeals.length} Nutritious Meals</span>
          </span>

          <span className="text-xs font-bold text-gray-400">
            All 64 Districts Supported
          </span>
        </div>

        {/* Meals Grid & Pagination */}
        {paginatedMeals.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  id={meal.id}
                  name={meal.name}
                  ingredients={meal.ingredients}
                  calories={meal.calories}
                  description={meal.description}
                  img={meal.img}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10 pb-4 select-none">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(p - 1, 1));
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-xs font-bold text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 200, behavior: "smooth" });
                        }}
                        className={`w-9 h-9 rounded-full text-xs font-extrabold transition cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-white text-black font-black shadow-lg scale-105"
                            : "bg-neutral-900 text-gray-400 hover:text-white border border-white/10 hover:border-white/30"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-xs font-bold text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 space-y-3 bg-neutral-950 border border-white/10 rounded-3xl p-8">
            <Utensils className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-xl font-black uppercase text-white">
              No Meals Found
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No meal recipe matches "{searchQuery}". Try searching for another
              keyword or select "All Meals".
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
