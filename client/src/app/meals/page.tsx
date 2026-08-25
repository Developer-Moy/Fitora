"use client";

import { MealsData } from "@/Data/MealsData";
import MealCard from "@/components/Meal/MealCard";

const page = () => {
  return (
    <section className="w-full py-16 sm:py-24 px-6 sm:px-10 lg:px-16 bg-white text-black select-none font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-black tracking-tight leading-[1.15]">
            Healthy Meals
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Discover our curated collection of nutritious, protein-packed meals designed to fuel your fitness journey and support your health goals.
          </p>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MealsData.map((meal) => (
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
      </div>
    </section>
  );
};

export default page;