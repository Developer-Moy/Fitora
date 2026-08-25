import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface MealProps {
  id: string;
  name: string;
  ingredients: string[];
  calories: number;
  description: string;
  img: string;
}

const MealCard = ({ name, calories, description, img }: MealProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://i.ibb.co.com/8g7PMCnQ/no-img.png";
  const displayImage = (!img || imageError) ? fallbackImage : img;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Meal Image */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col grow space-y-4">
        {/* Meal Name */}
        <h3 className="text-lg sm:text-xl font-black text-black tracking-tight leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 grow">
          {description}
        </p>

        {/* Calories and Button Row */}
        <div className="pt-2 flex items-center justify-between gap-4">
          {/* Calories */}
          <span className="text-sm font-bold text-black bg-gray-100 px-3 py-1.5 rounded-full">
            {calories} kcal
          </span>

          {/* View Details Button */}
          <button className="group inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl border border-gray-200">
            <span>View Details</span>
            <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;