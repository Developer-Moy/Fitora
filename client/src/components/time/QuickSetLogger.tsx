"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Dumbbell, X, Save } from "lucide-react";

export interface QuickSetLoggerProps {
  isOpen: boolean;
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  onClose: () => void;
  onSave: (data: { weight: number; reps: number }) => void;
}

const QuickSetLogger: React.FC<QuickSetLoggerProps> = ({
  isOpen,
  exerciseName,
  currentSet,
  totalSets,
  onClose,
  onSave,
}) => {
  const [weight, setWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [errors, setErrors] = useState<{ weight?: string; reps?: string }>({});
  const weightInputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = useCallback(() => {
    setWeight("");
    setReps("");
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => weightInputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { weight?: string; reps?: string } = {};
    const parsedWeight = Number(weight);
    const parsedReps = Number(reps);

    if (!weight.trim()) newErrors.weight = "Weight is required";
    else if (isNaN(parsedWeight) || parsedWeight <= 0)
      newErrors.weight = "Enter a valid weight";
    else if (parsedWeight > 1000) newErrors.weight = "Max is 1000 kg";

    if (!reps.trim()) newErrors.reps = "Reps are required";
    else if (isNaN(parsedReps) || !Number.isInteger(parsedReps) || parsedReps < 1)
      newErrors.reps = "Enter a valid rep count";
    else if (parsedReps > 1000) newErrors.reps = "Max is 1000 reps";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }
    onSave({ weight: Number(weight), reps: Number(reps) });
    setWeight("");
    setReps("");
    setErrors({});
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick set logger"
        className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#232836] bg-[#12141a] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:p-6"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">
                Log Set {currentSet}
                <span className="text-zinc-500 font-medium">/{totalSets}</span>
              </p>
              <p className="text-[11px] text-zinc-400 truncate">{exerciseName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            title="Close"
            aria-label="Close quick set logger"
            className="shrink-0 w-8 h-8 rounded-lg bg-[#181a1f] hover:bg-[#22262e] border border-[#2b313d] text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3">
            {/* Weight */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="quick-log-weight"
                className="text-xs font-semibold text-zinc-300"
              >
                Weight (KG)
              </label>
              <input
                id="quick-log-weight"
                ref={weightInputRef}
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="e.g. 40"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={`w-full rounded-lg border bg-[#111214] px-3 py-2.5 text-sm font-mono text-white outline-none transition focus:border-white ${
                  errors.weight ? "border-white/70" : "border-[#303136]"
                }`}
              />
              {errors.weight && (
                <p className="text-xs text-white pl-1">{errors.weight}</p>
              )}
            </div>

            {/* Reps */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="quick-log-reps"
                className="text-xs font-semibold text-zinc-300"
              >
                Reps
              </label>
              <input
                id="quick-log-reps"
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                placeholder="e.g. 12"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={`w-full rounded-lg border bg-[#111214] px-3 py-2.5 text-sm font-mono text-white outline-none transition focus:border-white ${
                  errors.reps ? "border-white/70" : "border-[#303136]"
                }`}
              />
              {errors.reps && (
                <p className="text-xs text-white pl-1">{errors.reps}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-[#2b313d] bg-[#181a1f] px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-[#22262e] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-white hover:bg-gray-100 text-black px-4 py-2.5 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Set</span>
            </button>
          </div>
        </form>

        <p className="mt-3 text-center text-[10px] text-zinc-500">
          Timer keeps running while you log
        </p>
      </div>
    </>
  );
};

export default QuickSetLogger;
