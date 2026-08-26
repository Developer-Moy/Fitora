"use client";

import { AlertDialog, Button } from "@heroui/react";

interface MealProps {
  id: string;
  name: string;
  ingredients: string[];
  calories: number;
  description: string;
  img: string;
}

interface MealDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  meal: MealProps | null;
}

const MealDetailsModal = ({ isOpen, onOpenChange, meal }: MealDetailsModalProps) => {
  if (!meal) return null;

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-125 bg-white text-black">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Heading className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                {meal.name}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="space-y-6 py-6">
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
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                className="w-full bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                slot="close"
              >
                Close
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default MealDetailsModal;
