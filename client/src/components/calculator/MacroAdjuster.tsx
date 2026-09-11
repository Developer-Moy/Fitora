"use client";

import { Lock, SlidersHorizontal, ArrowUpRight } from "lucide-react";

type MacroAdjusterProps = {
  isPremium: boolean;
  protein: number;
  carbs: number;
  fats: number;
  onChange: (macro: "protein" | "carbs" | "fats", value: number) => void;
};

export default function MacroAdjuster({
  isPremium,
  protein,
  carbs,
  fats,
  onChange,
}: MacroAdjusterProps) {
  const total = protein + carbs + fats;

  const handleChange = (macro: "protein" | "carbs" | "fats", value: number) => {
    if (!isPremium) return;

    const remaining = 100 - value;

    if (macro === "protein") {
      const otherTotal = carbs + fats;

      if (otherTotal <= 0) {
        onChange("protein", value);
        return;
      }

      const newCarbs = Math.round((carbs / otherTotal) * remaining);
      const newFats = 100 - value - newCarbs;

      onChange("protein", value);
      onChange("carbs", newCarbs);
      onChange("fats", Math.max(newFats, 0));
      return;
    }

    if (macro === "carbs") {
      const otherTotal = protein + fats;

      if (otherTotal <= 0) {
        onChange("carbs", value);
        return;
      }

      const newProtein = Math.round((protein / otherTotal) * remaining);
      const newFats = 100 - value - newProtein;

      onChange("protein", newProtein);
      onChange("carbs", value);
      onChange("fats", Math.max(newFats, 0));
      return;
    }

    const otherTotal = protein + carbs;

    if (otherTotal <= 0) {
      onChange("fats", value);
      return;
    }

    const newProtein = Math.round((protein / otherTotal) * remaining);
    const newCarbs = 100 - value - newProtein;

    onChange("protein", newProtein);
    onChange("carbs", Math.max(newCarbs, 0));
    onChange("fats", value);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black p-4 sm:p-5 shadow-xl mt-2">
      {!isPremium && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/75 backdrop-blur-[3px]">
          <div className="mx-4 max-w-sm rounded-2xl border border-white/15 bg-black p-4 text-center shadow-2xl">
            <div className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
              <Lock className="h-3.5 w-3.5" />
            </div>

            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              Premium Feature
            </p>

            <h4 className="text-xs font-black uppercase text-white">
              Unlock Custom Macros
            </h4>

            <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400">
              Premium members can customize their protein, carbs and fat ratios
              for a personalized nutrition target.
            </p>

            <a
              href="/pricing"
              className="group mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider text-black transition hover:bg-gray-200 shadow-md"
            >
              <span>Upgrade to Pro</span>
              <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 shadow-sm">
                <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            </a>
          </div>
        </div>
      )}

      <div className={!isPremium ? "opacity-40" : ""}>
        <div className="mb-3.5 flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-white" />

              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
                PRO ATHLETE CONTROL
              </span>
            </div>

            <h3 className="mt-1 text-base sm:text-lg font-black uppercase tracking-tight text-white">
              Custom Macro Ratio
            </h3>

            <p className="mt-0.5 text-[11px] text-gray-500">
              Adjust your daily protein, carbs and fat distribution.
            </p>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] font-black text-gray-300">
            {total}%
          </div>
        </div>

        <div className="space-y-3.5">
          {/* Protein */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-white">
                  Protein
                </p>

                <p className="text-[9px] text-gray-500">
                  Muscle repair & recovery
                </p>
              </div>

              <span className="text-sm font-black text-white">{protein}%</span>
            </div>

            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={protein}
              disabled={!isPremium}
              onChange={(e) => handleChange("protein", Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white disabled:cursor-not-allowed"
            />
          </div>

          {/* Carbs */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-white">Carbs</p>

                <p className="text-[9px] text-gray-500">
                  Training & daily energy
                </p>
              </div>

              <span className="text-sm font-black text-white">{carbs}%</span>
            </div>

            <input
              type="range"
              min={10}
              max={70}
              step={1}
              value={carbs}
              disabled={!isPremium}
              onChange={(e) => handleChange("carbs", Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white disabled:cursor-not-allowed"
            />
          </div>

          {/* Fats */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-white">Fats</p>

                <p className="text-[9px] text-gray-500">
                  Hormones & essential functions
                </p>
              </div>

              <span className="text-sm font-black text-white">{fats}%</span>
            </div>

            <input
              type="range"
              min={10}
              max={50}
              step={1}
              value={fats}
              disabled={!isPremium}
              onChange={(e) => handleChange("fats", Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
            <p className="text-[8px] font-black uppercase text-gray-500">
              Protein
            </p>
            <p className="mt-1 text-sm font-black text-white">{protein}%</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
            <p className="text-[8px] font-black uppercase text-gray-500">
              Carbs
            </p>
            <p className="mt-1 text-sm font-black text-white">{carbs}%</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
            <p className="text-[8px] font-black uppercase text-gray-500">
              Fats
            </p>
            <p className="mt-1 text-sm font-black text-white">{fats}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
