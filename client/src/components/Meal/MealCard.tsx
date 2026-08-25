import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";

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
  const displayImage = (!meal.img || imageError) ? fallbackImage : meal.img;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Meal Image */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
          <img
            src={displayImage}
            alt={meal.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6 flex flex-col grow space-y-4">
          {/* Meal Name */}
          <h3 className="text-lg sm:text-xl font-black text-black tracking-tight leading-tight line-clamp-2">
            {meal.name}
          </h3>

          {/* Short Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 grow">
            {meal.description}
          </p>

          {/* Calories and Button Row */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {/* Calories */}
            <span className="text-sm font-bold text-black bg-gray-100 px-3 py-1.5 rounded-full">
              {meal.calories} kcal
            </span>

            {/* View Details Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl border border-gray-200"
            >
              <span>View Details</span>
              <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Meal Name */}
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                {meal.name}
              </h2>

              {/* Calories Badge */}
              <div>
                <span className="inline-block text-sm font-bold text-black bg-gray-100 px-4 py-2 rounded-full">
                  {meal.calories} kcal
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-2">
                  Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {meal.description}
                </p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="text-sm font-bold text-black uppercase tracking-wide mb-3">
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meal.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-block text-xs font-medium text-black bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-black text-white font-bold hover:bg-gray-800 transition-colors px-6 py-3 rounded-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MealCard;