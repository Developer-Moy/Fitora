"use client";

type AthleteHealthAssessmentCardProps = {
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  goal: "bulking" | "cutting" | "maintenance";
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  macroPercentages: {
    protein: number;
    carbs: number;
    fats: number;
  };
};

export default function AthleteHealthAssessmentCard({
  age,
  gender,
  height,
  weight,
  bmi,
  bmr,
  tdee,
  targetCalories,
  goal,
  macros,
  macroPercentages,
}: AthleteHealthAssessmentCardProps) {
  const bmiCategory =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Healthy"
        : bmi < 30
          ? "Overweight"
          : "Obesity";

  const goalLabel =
    goal === "bulking"
      ? "Bulking"
      : goal === "cutting"
        ? "Cutting"
        : "Maintenance";

  return (
    <div
      id="athlete-health-assessment-card"
      className="mx-auto w-full overflow-hidden rounded-2xl border border-white/15 bg-black text-white shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
              Fitora Performance Report
            </p>

            <h2 className="mt-1 text-lg font-black uppercase tracking-tight sm:text-xl">
              Athlete Health{" "}
              <span className="font-normal text-gray-400">Assessment Card</span>
            </h2>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Personalized metabolic & nutrition summary
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white text-xs font-black text-black">
            F
          </div>
        </div>
      </div>

      {/* Profile - Horizontal */}
      <div className="grid grid-cols-2 border-b border-white/10 bg-white/10 sm:grid-cols-4">
        <div className="bg-black p-3 sm:p-3.5">
          <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
            Age
          </p>

          <p className="mt-0.5 text-base sm:text-lg font-black">{age}</p>
        </div>

        <div className="bg-black p-3 sm:p-3.5">
          <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
            Gender
          </p>

          <p className="mt-0.5 text-base sm:text-lg font-black capitalize">
            {gender}
          </p>
        </div>

        <div className="bg-black p-3 sm:p-3.5">
          <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
            Height
          </p>

          <p className="mt-0.5 text-base sm:text-lg font-black">
            {height}
            <span className="ml-1 text-[11px] text-gray-500">cm</span>
          </p>
        </div>

        <div className="bg-black p-3 sm:p-3.5">
          <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
            Weight
          </p>

          <p className="mt-0.5 text-base sm:text-lg font-black">
            {weight}
            <span className="ml-1 text-[11px] text-gray-500">kg</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5">
        {/* Metabolic Overview */}
        <div>
          <p className="mb-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
            Metabolic Overview
          </p>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <MetricCard
              label="BMI"
              value={bmi.toFixed(1)}
              subLabel={bmiCategory}
            />

            <MetricCard
              label="BMR"
              value={bmr.toLocaleString()}
              subLabel="kcal/day"
            />

            <MetricCard
              label="TDEE"
              value={tdee.toLocaleString()}
              subLabel="kcal/day"
            />
          </div>
        </div>

        {/* Target + Goal - Horizontal */}
        <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:p-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                Daily Target
              </p>

              <p className="mt-0.5 text-xl sm:text-2xl font-black">
                {targetCalories.toLocaleString()}
                <span className="ml-1 text-xs font-bold text-gray-500">
                  kcal
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">
                Goal
              </span>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-300">
                  {goalLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Distribution */}
        <div className="mt-4">
          <div className="mb-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
              Macro Distribution
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Daily nutrition targets
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <MacroCard
              label="Protein"
              grams={macros.protein}
              percentage={macroPercentages.protein}
            />

            <MacroCard
              label="Carbs"
              grams={macros.carbs}
              percentage={macroPercentages.carbs}
            />

            <MacroCard
              label="Fats"
              grams={macros.fats}
              percentage={macroPercentages.fats}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-gray-600">
              Fitora • Athlete Health Assessment
            </p>

            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-gray-700">
              Live Report
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subLabel,
}: {
  label: string;
  value: string;
  subLabel: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <span className="text-[8px] font-bold uppercase text-gray-500">
          {subLabel}
        </span>
      </div>

      <p className="mt-1 text-lg sm:text-xl font-black">{value}</p>
    </div>
  );
}

function MacroCard({
  label,
  grams,
  percentage,
}: {
  label: string;
  grams: number;
  percentage: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <p className="text-[9px] font-bold text-gray-400">{percentage}%</p>
      </div>

      <p className="mt-1 text-lg sm:text-xl font-black">
        {grams}
        <span className="ml-1 text-[9px] text-gray-500">g</span>
      </p>
    </div>
  );
}
