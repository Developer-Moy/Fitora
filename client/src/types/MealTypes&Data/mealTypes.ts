export type Gender = "Male" | "Female" | "Other";

export type DietType =
    | "Omnivore"
    | "Vegetarian"
    | "Vegan"
    | "Keto"
    | "Paleo"
    | "Gluten-Free"
    | "Pescetarian";

export interface UserProfileData {
    age: number;
    gender: Gender | "";
    weight: number;
}

export interface GoalsLifestyleData {
    fitnessGoal: string;
    customGoal: string;
    activityLevel: string;
}

export interface DietaryPreferencesData {
    dietType: DietType;
    allergies: string;
}

export interface MealStructureData {
    mealsPerDay: number;
    dislikes: string;
    preferredCuisine: string;
}

export interface MealPlannerFormData {
    profile: UserProfileData;
    goals: GoalsLifestyleData;
    dietary: DietaryPreferencesData;
    structure: MealStructureData;
}
