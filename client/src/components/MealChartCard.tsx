"use client";

import { authClient } from "@/lib/auth-client";
import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import {
    Button,
    Description,
    Input,
    Label,
    Radio,
    RadioGroup,
    Separator,
    TextArea,
} from "@heroui/react";
import {
    FaAppleWhole,
    FaBolt,
    FaBowlFood,
    FaCalendarDays,
    FaCheck,
    FaCircleInfo,
    FaDrumstickBite,
    FaDumbbell,
    FaHeartCrack,
    FaListOl,
    FaPersonRunning,
    FaPlateWheat,
    FaShieldHalved,
    FaUserAstronaut,
    FaUtensils,
    FaVenusMars,
    FaWandMagicSparkles,
    FaWeightScale,
} from "react-icons/fa6";
import {
    ACTIVITY_LEVELS,
    DIET_TYPES,
    FITNESS_GOALS,
} from "@/types/MealTypes&Data/mealData";
import type {
    DietaryPreferencesData,
    Gender,
    GoalsLifestyleData,
    MealPlannerFormData,
    MealStructureData,
    UserProfileData,
} from "@/types/MealTypes&Data/mealTypes";

const GENDERS: Gender[] = ["Male", "Female", "Other"];
const WEIGHT_QUICK_SELECT = [50, 70, 90];
const MEAL_QUICK_SELECT = [2, 3, 4, 5, 6];

const EMPTY_FORM: MealPlannerFormData = {
    profile: {
        age: 0,
        gender: "",
        weight: 0,
    },
    goals: {
        fitnessGoal: "",
        customGoal: "",
        activityLevel: "",
    },
    dietary: {
        dietType: "" as DietaryPreferencesData["dietType"],
        allergies: "",
    },
    structure: {
        mealsPerDay: 0,
        dislikes: "",
        preferredCuisine: "",
    },
};

const DIET_DESCRIPTIONS: Record<string, string> = {
    Omnivore: "Everything — meat, fish, dairy and plants.",
    Vegetarian: "Plant foods plus eggs and dairy.",
    Vegan: "100% plant-based, no animal products.",
    Keto: "Very low-carb, high-fat approach.",
    Paleo: "Whole foods, no grains or legumes.",
    "Gluten-Free": "No wheat, barley or rye.",
    Pescetarian: "Plants and fish, no other meat.",
};

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

interface SectionProps {
    step: string;
    icon: ReactNode;
    title: string;
    description: string;
    accent: "teal" | "scarlet";
    children: ReactNode;
}

function Section({
    step,
    icon,
    title,
    description,
    accent,
    children,
}: SectionProps) {
    const teal = accent === "teal";

    return (
        <section
            className={`card-premium relative overflow-hidden rounded-2xl sm:rounded-3xl border ${teal
                ? "border-emerald-500/20 bg-slate-900/60 hover:border-emerald-500/35"
                : "border-rose-500/20 bg-slate-900/60 hover:border-rose-500/35"
                } backdrop-blur-xl p-4 sm:p-6 md:p-8 transition-all duration-300 shadow-xl shadow-slate-950/40`}
        >
            {/* Dynamic Ambient Background Glows */}
            <div
                className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-all duration-500 ${teal ? "bg-emerald-500/10" : "bg-rose-500/10"
                    }`}
            />
            <div
                className={`pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full blur-3xl transition-all duration-500 ${teal ? "bg-teal-500/5" : "bg-amber-500/5"
                    }`}
            />

            <div className="relative mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xl sm:h-13 sm:w-13 sm:text-2xl transition-transform duration-300 hover:scale-105 ${teal
                            ? "border-emerald-400/40 bg-linear-to-br from-emerald-500/20 via-emerald-400/10 to-teal-500/20 text-emerald-300 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            : "border-rose-500/40 bg-linear-to-br from-rose-500/20 via-rose-400/10 to-amber-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                            }`}
                    >
                        {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div
                            className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.2em] ${teal
                                ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                                : "bg-rose-500/10 text-rose-300 border border-rose-500/25"
                                }`}
                        >
                            {step}
                        </div>

                        <h2
                            className={`text-lg font-black uppercase tracking-wide sm:text-xl md:text-2xl ${teal ? "text-gradient-hero" : "text-gradient-flame"
                                }`}
                        >
                            {title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400 sm:text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <Separator
                className={`mb-5 h-px sm:mb-6 ${teal
                    ? "bg-linear-to-r from-emerald-500/40 via-teal-500/20 to-transparent"
                    : "bg-linear-to-r from-rose-500/40 via-amber-500/20 to-transparent"
                    }`}
            />

            <div className="grid gap-5 sm:gap-6">{children}</div>
        </section>
    );
}

function FieldLabel({
    icon,
    color,
    children,
}: {
    icon: ReactNode;
    color: string;
    children: ReactNode;
}) {
    return (
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            {icon && <span className={`text-sm ${color}`}>{icon}</span>}
            <span>{children}</span>
        </label>
    );
}

export function MealChartCard() {
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const USER_ID = user?.id;

    const [profile, setProfile] = useState<UserProfileData>(
        EMPTY_FORM.profile,
    );
    const [goals, setGoals] = useState<GoalsLifestyleData>(EMPTY_FORM.goals);
    const [dietary, setDietary] = useState<DietaryPreferencesData>(
        EMPTY_FORM.dietary,
    );
    const [structure, setStructure] = useState<MealStructureData>(
        EMPTY_FORM.structure,
    );
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const handleGenerate = useCallback(async () => {
        const errors: string[] = [];

        if (!profile.age || profile.age < 1) {
            errors.push("Age is required");
        }

        if (!profile.gender) {
            errors.push("Gender is required");
        }

        if (!profile.weight || profile.weight < 1) {
            errors.push("Current Weight is required");
        }

        if (!goals.fitnessGoal) {
            errors.push("Fitness Goal is required");
        }

        if (!goals.activityLevel) {
            errors.push("Activity Level is required");
        }

        if (!dietary.dietType) {
            errors.push("Diet Type is required");
        }

        if (!dietary.allergies.trim()) {
            errors.push("Allergies / Health Restrictions is required");
        }

        if (!structure.mealsPerDay || structure.mealsPerDay < 1) {
            errors.push("Meals Per Day is required");
        }

        if (!structure.dislikes.trim()) {
            errors.push("Dislikes is required");
        }

        if (!structure.preferredCuisine.trim()) {
            errors.push("Preferred Cuisine is required");
        }

        if (errors.length > 0) {
            setValidationErrors(errors);
            toast.error("Please complete all required fields.");
            return;
        }

        setValidationErrors([]);

        const formData: MealPlannerFormData = {
            profile,
            goals,
            dietary,
            structure,
        };

        const payload = {
            userId: USER_ID,
            ...formData,
        };


        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/meal-charts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error("Failed to save meal plan");
            }

            toast.success("Meal planner data saved successfully!");

            console.log("Saved meal plan:");
        } catch (error) {
            console.error("Meal planner error:");

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save meal planner data",
            );
        }
    }, [profile, goals, dietary, structure]);

    const hasCustomGoal =
        goals.fitnessGoal !== "Weight Loss" &&
        goals.fitnessGoal !== "Muscle Gain" &&
        goals.fitnessGoal !== "Maintain" &&
        goals.fitnessGoal !== "Performance";

    return (
        <main className="relative min-h-screen px-2 sm:px-4">
            <header className="relative mb-6 text-center sm:mb-8 md:mb-12 pt-4 sm:pt-6">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="bg-grid absolute inset-0 opacity-40" />
                    <div className="absolute left-1/2 top-0 h-56 w-[85%] -translate-x-1/2 rounded-full bg-linear-to-b from-emerald-400/15 via-teal-500/10 to-transparent blur-3xl" />
                </div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-emerald-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-transform hover:scale-105">
                    <FaBolt className="text-amber-300 animate-pulse" size={13} />
                    <span>Fitora AI Engine</span>
                </div>

                <h1 className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 px-2 text-2xl font-black uppercase leading-tight tracking-tight sm:gap-x-3 sm:text-4xl md:text-5xl lg:text-6xl">

                    <span className="text-gradient-hero animate-gradient-x bg-size-[200%_200%]">
                        Meal Planning Assistant
                    </span>


                </h1>

                <p className="mx-auto mt-3 max-w-2xl px-4 text-xs leading-relaxed text-slate-400 sm:mt-5 sm:px-0 sm:text-sm md:text-base">
                    Feed your body a fully personalized, macro-balanced 7-day
                    meal chart — engineered by AI from your health profile,
                    fitness goals and dietary preferences.
                </p>
            </header>

            <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-8 pb-24">
                {/* SECTION 01: User Profile */}
                <Section
                    step="Section 01"
                    icon={<FaUserAstronaut />}
                    title="User Profile"
                    description="Foundational biometrics that calibrate your daily targets."
                    accent="teal"
                >
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        {/* Age */}
                        <div className="space-y-2">
                            <FieldLabel
                                icon={
                                    <FaCalendarDays className="text-emerald-400" />
                                }
                                color=""
                            >
                                Age
                            </FieldLabel>

                            <div className="relative">
                                <FaCalendarDays className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500" />

                                <Input
                                    type="number"
                                    aria-label="Age"
                                    min={1}
                                    max={150}
                                    value={
                                        profile.age ? String(profile.age) : ""
                                    }
                                    onChange={(e) => {
                                        const v = e.target.value;

                                        setProfile({
                                            ...profile,
                                            age: v
                                                ? Math.round(
                                                    clamp(
                                                        Number(v),
                                                        1,
                                                        150,
                                                    ),
                                                )
                                                : 0,
                                        });
                                    }}
                                    placeholder="e.g. 25"
                                    className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                />
                            </div>

                            <Description className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                <FaCircleInfo className="text-slate-600 shrink-0" size={10} />
                                Acceptable range: 1-150
                            </Description>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <FieldLabel
                                icon={
                                    <FaVenusMars className="text-emerald-400" />
                                }
                                color=""
                            >
                                Gender
                            </FieldLabel>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 mr-1">
                                    Quick Select:
                                </span>
                                {GENDERS.map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() =>
                                            setProfile({
                                                ...profile,
                                                gender: g,
                                            })
                                        }
                                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${profile.gender === g
                                            ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_14px_rgba(34,211,238,0.3)] scale-[1.02]"
                                            : "border-slate-700/60 bg-slate-950/50 text-slate-400 hover:border-emerald-500/40 hover:text-slate-200"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Current Weight */}
                        <div className="space-y-2 sm:col-span-2">
                            <FieldLabel
                                icon={
                                    <FaWeightScale className="text-emerald-400" />
                                }
                                color=""
                            >
                                Current Weight
                            </FieldLabel>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="relative w-full sm:max-w-xs">
                                    <FaWeightScale className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500" />

                                    <Input
                                        type="number"
                                        aria-label="Current weight"
                                        min={1}
                                        max={500}
                                        value={
                                            profile.weight
                                                ? String(profile.weight)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            const v = e.target.value;

                                            setProfile({
                                                ...profile,
                                                weight: v
                                                    ? Math.round(
                                                        clamp(
                                                            Number(v),
                                                            1,
                                                            500,
                                                        ),
                                                    )
                                                    : 0,
                                            });
                                        }}
                                        placeholder="e.g. 60"
                                        className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-14 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                    />

                                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                        KG
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400 mr-1">
                                        Quick Select:
                                    </span>
                                    {WEIGHT_QUICK_SELECT.map((w) => (
                                        <button
                                            key={w}
                                            type="button"
                                            onClick={() =>
                                                setProfile({
                                                    ...profile,
                                                    weight: w,
                                                })
                                            }
                                            className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${profile.weight === w
                                                ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_14px_rgba(34,211,238,0.3)] scale-[1.02]"
                                                : "border-slate-700/60 bg-slate-950/50 text-slate-400 hover:border-emerald-500/40 hover:text-slate-200"
                                                }`}
                                        >
                                            {w} kg
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* SECTION 02: Goals & Lifestyle */}
                <Section
                    step="Section 02"
                    icon={<FaDumbbell />}
                    title="Goals & Lifestyle"
                    description="Define your objective and daily movement level."
                    accent="scarlet"
                >
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        {/* Fitness Goal */}
                        <div className="space-y-2">
                            <FieldLabel
                                icon={
                                    <FaPersonRunning className="text-rose-400" />
                                }
                                color=""
                            >
                                Fitness Goal
                            </FieldLabel>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 mr-1">
                                    Quick Select:
                                </span>
                                {FITNESS_GOALS.map((g) => (
                                    <button
                                        key={g.value}
                                        type="button"
                                        onClick={() =>
                                            setGoals({
                                                ...goals,
                                                fitnessGoal: g.value,
                                            })
                                        }
                                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${goals.fitnessGoal === g.value
                                            ? "border-rose-400/60 bg-rose-500/20 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.3)] scale-[1.02]"
                                            : "border-slate-700/60 bg-slate-950/50 text-slate-400 hover:border-rose-500/40 hover:text-slate-200"
                                            }`}
                                    >
                                        {g.value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Activity Level */}
                        <div className="space-y-2">
                            <FieldLabel
                                icon={<FaDumbbell className="text-rose-400" />}
                                color=""
                            >
                                Activity Level
                            </FieldLabel>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 mr-1">
                                    Quick Select:
                                </span>
                                {ACTIVITY_LEVELS.map((a) => (
                                    <button
                                        key={a.value}
                                        type="button"
                                        onClick={() =>
                                            setGoals({
                                                ...goals,
                                                activityLevel: a.value,
                                            })
                                        }
                                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${goals.activityLevel === a.value
                                            ? "border-rose-400/60 bg-rose-500/20 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.3)] scale-[1.02]"
                                            : "border-slate-700/60 bg-slate-950/50 text-slate-400 hover:border-rose-500/40 hover:text-slate-200"
                                            }`}
                                    >
                                        {a.value}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Goal */}
                        {hasCustomGoal && (
                            <div className="space-y-2 sm:col-span-2">
                                <FieldLabel
                                    icon={
                                        <FaDumbbell className="text-rose-400" />
                                    }
                                    color=""
                                >
                                    Custom Goal
                                </FieldLabel>

                                <TextArea
                                    aria-label="Custom goal"
                                    placeholder="Describe your custom objective in your own words..."
                                    maxLength={100}
                                    rows={3}
                                    value={goals.customGoal}
                                    onChange={(e) =>
                                        setGoals({
                                            ...goals,
                                            customGoal: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 p-3.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                                />

                                <div className="flex justify-end">
                                    <Description className="text-[11px] font-medium text-slate-500">
                                        {goals.customGoal.length}/100 characters
                                    </Description>
                                </div>
                            </div>
                        )}
                    </div>
                </Section>

                {/* SECTION 03: Dietary Preferences */}
                <Section
                    step="Section 03"
                    icon={<FaBowlFood />}
                    title="Dietary Preferences"
                    description="Tell the AI how you eat — and what it must strictly avoid."
                    accent="scarlet"
                >
                    {/* Diet Type */}
                    <div className="space-y-3">
                        <FieldLabel
                            icon={<FaAppleWhole className="text-rose-400" />}
                            color=""
                        >
                            Diet Type
                        </FieldLabel>

                        <RadioGroup
                            aria-label="Diet type"
                            value={dietary.dietType}
                            onChange={(value) =>
                                setDietary({
                                    ...dietary,
                                    dietType:
                                        value as DietaryPreferencesData["dietType"],
                                })
                            }
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                        >
                            {DIET_TYPES.map((diet) => (
                                <Radio
                                    key={diet}
                                    value={diet}
                                    className="m-0 w-full cursor-pointer rounded-2xl border border-slate-700/70 bg-slate-950/60 p-3.5 sm:p-4 transition-all duration-200 hover:border-rose-500/50 hover:bg-slate-900/80 data-[selected=true]:border-rose-500/80 data-[selected=true]:bg-rose-500/10 data-[selected=true]:shadow-[0_0_18px_rgba(244,63,94,0.25)]"
                                >
                                    <Radio.Content className="flex w-full items-start gap-3">
                                        <Radio.Control className="mt-0.5">
                                            <Radio.Indicator />
                                        </Radio.Control>

                                        <div className="flex min-w-0 flex-col">
                                            <Label className="text-sm font-bold text-slate-100">
                                                {diet}
                                            </Label>

                                            <Description className="text-[11px] text-slate-400 mt-1 leading-normal">
                                                {DIET_DESCRIPTIONS[diet]}
                                            </Description>
                                        </div>
                                    </Radio.Content>
                                </Radio>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-2">
                        <FieldLabel
                            icon={
                                <FaShieldHalved className="text-rose-400" />
                            }
                            color=""
                        >
                            Allergies / Health Restrictions
                        </FieldLabel>

                        <TextArea
                            aria-label="Allergies"
                            placeholder="e.g. Lactose intolerant, shellfish allergy"
                            maxLength={250}
                            rows={3}
                            value={dietary.allergies}
                            onChange={(e) =>
                                setDietary({
                                    ...dietary,
                                    allergies: e.target.value,
                                })
                            }
                            className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 p-3.5 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-rose-500/50 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                        />

                        <div className="flex justify-end">
                            <Description className="text-[11px] font-medium text-slate-500">
                                {dietary.allergies.length}/250 characters
                            </Description>
                        </div>
                    </div>
                </Section>

                {/* SECTION 04: Meal Structure */}
                <Section
                    step="Section 04"
                    icon={<FaListOl />}
                    title="Meal Structure & Customization"
                    description="Shape the day and steer flavor direction."
                    accent="teal"
                >
                    {/* Meals Per Day */}
                    <div className="space-y-3">
                        <FieldLabel
                            icon={<FaListOl className="text-emerald-400" />}
                            color=""
                        >
                            Meals Per Day
                        </FieldLabel>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-xs">
                                <FaListOl className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500" />

                                <Input
                                    type="number"
                                    aria-label="Meals per day"
                                    min={1}
                                    max={10}
                                    value={
                                        structure.mealsPerDay
                                            ? String(structure.mealsPerDay)
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const v = e.target.value;

                                        setStructure({
                                            ...structure,
                                            mealsPerDay: v
                                                ? Math.round(
                                                    clamp(
                                                        Number(v),
                                                        1,
                                                        10,
                                                    ),
                                                )
                                                : 0,
                                        });
                                    }}
                                    placeholder="e.g. 4"
                                    className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 mr-1">
                                    Presets:
                                </span>
                                {MEAL_QUICK_SELECT.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() =>
                                            setStructure({
                                                ...structure,
                                                mealsPerDay: m,
                                            })
                                        }
                                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 ${structure.mealsPerDay === m
                                            ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_14px_rgba(34,211,238,0.3)] scale-[1.02]"
                                            : "border-slate-700/60 bg-slate-950/50 text-slate-400 hover:border-emerald-500/40 hover:text-slate-200"
                                            }`}
                                    >
                                        {m} meals
                                    </button>
                                ))}
                            </div>

                            {structure.mealsPerDay > 0 && (
                                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-2 text-xs font-black text-emerald-300 shadow-[0_0_14px_rgba(34,211,238,0.25)] sm:ml-auto">
                                    <FaCheck size={12} className="text-emerald-400" />
                                    {structure.mealsPerDay} meal
                                    {structure.mealsPerDay === 1 ? "" : "s"} / day
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        {/* Dislikes */}
                        <div className="space-y-2">
                            <FieldLabel
                                icon={
                                    <FaHeartCrack className="text-emerald-400" />
                                }
                                color=""
                            >
                                Dislikes
                            </FieldLabel>

                            <div className="relative">
                                <FaHeartCrack className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500" />

                                <Input
                                    aria-label="Dislikes"
                                    placeholder="e.g. Mushrooms, eggplant"
                                    maxLength={150}
                                    value={structure.dislikes}
                                    onChange={(e) =>
                                        setStructure({
                                            ...structure,
                                            dislikes: e.target.value.slice(
                                                0,
                                                150,
                                            ),
                                        })
                                    }
                                    className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Description className="text-[11px] font-medium text-slate-500">
                                    {structure.dislikes.length}/150 characters
                                </Description>
                            </div>
                        </div>

                        {/* Preferred Cuisine */}
                        <div className="space-y-2">
                            <FieldLabel
                                icon={
                                    <FaPlateWheat className="text-emerald-400" />
                                }
                                color=""
                            >
                                Preferred Cuisine
                            </FieldLabel>

                            <div className="relative">
                                <FaUtensils className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-500" />

                                <Input
                                    aria-label="Preferred cuisine"
                                    placeholder="e.g. Mediterranean"
                                    maxLength={50}
                                    value={structure.preferredCuisine}
                                    onChange={(e) =>
                                        setStructure({
                                            ...structure,
                                            preferredCuisine:
                                                e.target.value.slice(0, 50),
                                        })
                                    }
                                    className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 pl-11 pr-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 hover:border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Description className="text-[11px] font-medium text-slate-500">
                                    {structure.preferredCuisine.length}/50
                                    characters
                                </Description>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                    <div className="rounded-2xl border border-rose-500/60 bg-rose-500/10 p-4 sm:p-5 shadow-[0_0_25px_rgba(244,63,94,0.25)] backdrop-blur-xl">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                <FaShieldHalved size={18} />
                            </div>

                            <div className="flex-1">
                                <div className="mb-2 text-sm font-extrabold text-rose-300 tracking-wide uppercase">
                                    Please complete all required fields ({validationErrors.length})
                                </div>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {validationErrors.map((error, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2 text-xs text-rose-200/90 font-medium"
                                        >
                                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Generate Button Floating Footer */}
                <div className="sticky bottom-4 z-30 sm:bottom-6">
                    <div className="card-premium relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-700/70 bg-slate-900/85 backdrop-blur-xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />

                        <div className="flex items-center gap-3.5 text-center sm:text-left">
                            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                <FaDrumstickBite size={22} />
                            </div>

                            <div>
                                <div className="text-base font-extrabold text-slate-100 tracking-tight">
                                    Ready to generate your meal chart?
                                </div>
                                <div className="text-xs text-slate-400">
                                    AI will calculate personalized macros and tailored recipes.
                                </div>
                            </div>
                        </div>

                        <Button
                            onPress={handleGenerate}
                            size="lg"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-r from-emerald-400 via-emerald-400 to-emerald-400 bg-size-[200%_200%] font-black uppercase tracking-wider text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.45)] hover:shadow-[0_0_45px_rgba(34,211,238,0.7)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                        >
                            <FaWandMagicSparkles size={18} />
                            <span>Generate Meal Chart</span>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
import { FiCoffee, FiZap } from "react-icons/fi";

export interface MealChartCardProps {
    title?: string;
    caloriesTotal?: number;
    proteinGrams?: number;
    carbsGrams?: number;
    fatsGrams?: number;
    category?: string;
}

export default function MealChartCardDisplay({
    title = "High Protein Muscle Fuel",
    caloriesTotal = 650,
    proteinGrams = 48,
    carbsGrams = 62,
    fatsGrams = 18,
    category = "Lunch / Recovery",
}: MealChartCardProps) {
    return (
        <div className="w-full bg-[#141416] border border-white/8 rounded-2xl p-5 shadow-xl hover:border-white/20 transition-all duration-300 group">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-white/6">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <FiCoffee size={14} />
                    <span>{category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/30 px-2.5 py-1 rounded-full">
                    <FiZap size={12} className="animate-pulse" />
                    <span>{caloriesTotal} kcal</span>
                </div>
            </div>

            {/* Meal Title */}
            <div className="py-3">
                <h3 className="font-bold text-white text-base tracking-wide group-hover:text-emerald-400 transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-white/40 mt-1">
                    Optimized macro distribution for optimal muscle recovery and energy balance.
                </p>
            </div>

            {/* Macro Badges Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
                {/* Protein Badge */}
                <div className="bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl text-center">
                    <span className="block text-[11px] text-emerald-300 font-medium uppercase tracking-wider">
                        Protein
                    </span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">
                        {proteinGrams}g
                    </span>
                </div>

                {/* Carbs Badge */}
                <div className="bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl text-center">
                    <span className="block text-[11px] text-amber-300 font-medium uppercase tracking-wider">
                        Carbs
                    </span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">
                        {carbsGrams}g
                    </span>
                </div>

                {/* Fats Badge */}
                <div className="bg-blue-950/40 border border-blue-800/40 p-2.5 rounded-xl text-center">
                    <span className="block text-[11px] text-blue-300 font-medium uppercase tracking-wider">
                        Fats
                    </span>
                    <span className="text-base font-extrabold text-white mt-0.5 block">
                        {fatsGrams}g
                    </span>
                </div>
            </div>
        </div>
    );
}
