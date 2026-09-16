"use client";

import Image from "next/image";


function ExerciseCard({
  exercise,
  index,
  locked,
  onClick,
}: {
  exercise: Exercise;
  index: number;
  locked: boolean;
  onClick: () => void;
}) {
  const validCategoryImages: Record<string, string> = {
    CHEST:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
    BACK: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    LEGS: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80",
    ARMS: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    SHOULDERS:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
    CORE: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
    GLUTES:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80",
    "FULL BODY":
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    CARDIO:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1000&q=80",
    MOBILITY:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80",
    FUNCTIONAL:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
  };

  const defaultFallback =
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80";
  const initialImg =
    exercise.image || validCategoryImages[exercise.category] || defaultFallback;
  const [imgSrc, setImgSrc] = useState(initialImg);

  return (
    <article
      onClick={onClick}
      className={`group relative h-[280px] sm:h-[310px] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-xl select-none ${
        locked
          ? "border-white/10 cursor-pointer"
          : "border-white/10 hover:border-white/30 cursor-pointer"
      }`}
    >
      {/* Image */}
      <Image
        src={imgSrc}
        alt=""
        width={400}
        height={300}
        aria-hidden="true"
        onError={() => {
          if (imgSrc !== defaultFallback) {
            setImgSrc(defaultFallback);
          }
        }}
        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700 brightness-105 contrast-105"
      />

      {/* Subtle Gradient Overlay for High Contrast Text Reading */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      {locked && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-wider text-white">
                Premium Workout
              </p>

              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-1">
                Upgrade to unlock
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Number */}
      <div className="absolute top-4 left-4">
        <span className="bg-white text-black px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Play */}
      <div className="absolute top-4 right-4">
        <div className="relative w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md">
          {/* Circular loader ring on hover */}
          <span className="absolute -inset-1 rounded-full border-2 border-transparent border-t-white border-r-white/60 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-300 pointer-events-none" />
          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full border border-white/20 bg-black/60 text-[9px] font-bold tracking-wider">
            {exercise.category}
          </span>

          <span className="px-2.5 py-0.5 rounded-full border border-white/20 bg-black/60 text-[9px] font-bold tracking-wider">
            {exercise.difficulty}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight line-clamp-1">
          {exercise.name}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3 text-white/60 text-[10px] font-bold">
            <span className="flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" />
              {exercise.duration}
            </span>

            <span className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5" />
              {exercise.equipment}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white hover:underline">
            TECHNIQUE
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </article>
  );
}

{
  /* EXERCISE MODAL */
}

type WorkoutLog = {
  _id: string;
  exerciseName: string;
  setsCount: number;
  repsCount: number;
  weight: number;
  notes?: string;
  caloriesBurned?: number;
  date: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
  const [history, setHistory] = useState<WorkoutLog[]>([]);
  const [sets, setSets] = useState<string>("0");
  const [reps, setReps] = useState<string>("0");
  const [weight, setWeight] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing workout logs for this exercise from API
  useEffect(() => {
    let active = true;
    async function loadExerciseHistory() {
      try {
        let userId = "guest_user";
        if (typeof window !== "undefined") {
          try {
            const userStr = localStorage.getItem("fitora_user");
            if (userStr) {
              const u = JSON.parse(userStr);
              if (u.id || u._id) userId = u.id || u._id;
            }
          } catch {}
        }
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("fitora_token") ||
              localStorage.getItem("fitora_auth_token")
            : null;
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(
          `${API_BASE_URL}/workouts/log?userId=${encodeURIComponent(userId)}&limit=50`,
          { headers },
        );
        if (res.ok) {
          const json = await res.json();
          const items: WorkoutLog[] = json?.data || [];
          const filtered = items.filter(
            (item: any) =>
              item.exerciseName?.toLowerCase() === exercise.name.toLowerCase(),
          );
          if (active && filtered.length > 0) {
            setHistory(filtered);
          }
        }
      } catch {}
    }
    loadExerciseHistory();
    return () => {
      active = false;
    };
  }, [exercise.name]);

  // Modal-scoped stopwatch state
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [swElapsedMs, setSwElapsedMs] = useState<number>(0);
  const swStartedAtRef = useRef<number | null>(null);
  const swTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (swTickRef.current) clearInterval(swTickRef.current);
    };
  }, []);

  const startStopwatch = () => {
    if (swRunning) return;
    swStartedAtRef.current = Date.now() - swElapsedMs;
    swTickRef.current = setInterval(() => {
      setSwElapsedMs(Date.now() - (swStartedAtRef.current ?? Date.now()));
    }, 100);
    setSwRunning(true);
  };

  const pauseStopwatch = () => {
    if (!swRunning) return;
    if (swTickRef.current) clearInterval(swTickRef.current);
    swTickRef.current = null;
    setSwRunning(false);
  };

  const resetStopwatch = () => {
    if (swTickRef.current) clearInterval(swTickRef.current);
    swTickRef.current = null;
    swStartedAtRef.current = null;
    setSwElapsedMs(0);
    setSwRunning(false);
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centi = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centi).padStart(2, "0")}`;
  };

  const validate = (): string | null => {
    const s = Number(sets);
    const r = Number(reps);
    const w = Number(weight);
    if (!sets || isNaN(s) || s <= 0 || !Number.isInteger(s)) {
      return "Sets must be a positive whole number";
    }
    if (!reps || isNaN(r) || r <= 0 || !Number.isInteger(r)) {
      return "Reps must be a positive whole number";
    }
    if (weight === "" || isNaN(w) || w < 0) {
      return "Weight must be 0 or a positive number";
    }
    if (notes.length > 280) {
      return "Notes must be 280 characters or fewer";
    }
    return null;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);

    let userId = "guest_user";
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("fitora_user");
        if (userStr) {
          const u = JSON.parse(userStr);
          if (u.id || u._id) userId = u.id || u._id;
        }
      } catch {}
    }

    const payload = {
      exerciseName: exercise.name,
      setsCount: Number(sets),
      repsCount: Number(reps),
      weight: Number(weight),
      notes: notes.trim(),
      date: new Date().toISOString(),
      userId,
    };

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("fitora_token") ||
            localStorage.getItem("fitora_auth_token")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/workouts/log`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = `Request failed with status ${response.status}`;
        try {
          const data = await response.json();
          message = (data && (data.message || data.error)) || message;
        } catch {
          // ignore non-JSON response
        }
        throw new Error(message);
      }

      const result = await response.json();
      const created: WorkoutLog = (result?.data ||
        result?.payload ||
        result) as WorkoutLog;

      const normalized: WorkoutLog = {
        _id: created._id ?? `local-${Date.now()}`,
        exerciseName: created.exerciseName ?? exercise.name,
        setsCount: Number(created.setsCount ?? payload.setsCount),
        repsCount: Number(created.repsCount ?? payload.repsCount),
        weight: Number(created.weight ?? payload.weight),
        notes: created.notes ?? payload.notes,
        caloriesBurned: Number(created.caloriesBurned ?? 0),
        date: created.date ?? payload.date,
      };

      setHistory((prev) => [normalized, ...prev]);
      setNotes("");
      toast.success(
        `${exercise.name} logged: ${normalized.setsCount} × ${normalized.repsCount} @ ${normalized.weight}kg`,
        { duration: 3000 },
      );
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Failed to log workout";
      setError(message);
      toast.error(message, { duration: 3500 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        bg-black/90 backdrop-blur-xl
        flex items-center justify-center
        p-0 sm:p-4 md:p-6
        pt-16 sm:pt-20 lg:pt-24
        select-none
      "
      onClick={onClose}
    >
      <div
        className="
          relative w-full h-full sm:h-auto sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-[88vh]
          max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-5xl
          overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          bg-neutral-950 border border-white/15
          rounded-none sm:rounded-3xl
          shadow-[0_0_50px_rgba(0,0,0,0.9)]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Mobile Sticky Header */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-neutral-950/95 backdrop-blur-md border-b border-white/10 sm:hidden">
          <div className="flex items-center gap-2 truncate pr-4">
            <span className="px-2.5 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wider shrink-0">
              {exercise.category}
            </span>
            <span className="text-xs font-black truncate text-white uppercase tracking-wider">
              {exercise.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop & Tablet Close Button */}
        <button
          onClick={onClose}
          className="
            hidden sm:flex absolute z-50
            top-4 right-4 sm:top-5 sm:right-5 lg:top-6 lg:right-6
            w-9 h-9 sm:w-10 sm:h-10 rounded-full
            bg-white text-black flex items-center justify-center
            hover:bg-gray-200 transition-all duration-300 shadow-xl cursor-pointer
          "
          aria-label="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-14 lg:pt-16">
          {/* ========================================================
              RESPONSIVE LAYOUT:
              Mobile (< lg): Order 1 (Video) -> Order 2 (Stopwatch) -> Order 3 (Log Form) -> Order 4 (Title & Tips) -> Order 5 (History)
              Desktop (>= lg): 2 Columns (Left: Video, InfoBoxes, Stopwatch, History; Right: Title, Badges, Tips, Log Form)
          ======================================================== */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN */}
            <div className="contents lg:flex lg:flex-col lg:gap-4 lg:w-full">
              {/* 1. Video & Metadata -> order-1 on mobile */}
              <div className="order-1 lg:order-none flex flex-col gap-2 w-full">
                {/* YouTube Video Player */}
                <div className="relative w-full aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-black border border-white/10 shadow-2xl">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${exercise.videoId}?rel=0`}
                    title={`${exercise.name} exercise tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* 3 Metadata Cards (Duration, Equipment, Target) under Video */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                  <InfoBox
                    icon={<Clock3 />}
                    label="DURATION"
                    value={exercise.duration}
                  />
                  <InfoBox
                    icon={<Dumbbell />}
                    label="EQUIPMENT"
                    value={exercise.equipment}
                  />
                  <InfoBox
                    icon={<Target />}
                    label="TARGET"
                    value={exercise.muscle}
                  />
                </div>
              </div>

              {/* 2. Modal Stopwatch -> order-2 on mobile */}
              <div className="order-2 lg:order-none w-full bg-neutral-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                      <Clock3 className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      REST STOPWATCH
                    </h3>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                    {swRunning
                      ? "RUNNING"
                      : swElapsedMs > 0
                        ? "PAUSED"
                        : "READY"}
                  </span>
                </div>

                <div className="flex items-center justify-center w-full py-1">
                  <span
                    className={`block w-full text-center font-black tracking-tight tabular-nums text-4xl sm:text-5xl ${
                      swRunning ? "text-white" : "text-white/80"
                    }`}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatStopwatch(swElapsedMs)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {!swRunning ? (
                    <FitoraPillButton
                      variant="white"
                      onClick={startStopwatch}
                      className="col-span-2 gap-1.5 text-[10px] px-3 py-2"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>{swElapsedMs > 0 ? "Resume" : "Start"}</span>
                    </FitoraPillButton>
                  ) : (
                    <FitoraPillButton
                      variant="white"
                      onClick={pauseStopwatch}
                      className="col-span-2 gap-1.5 text-[10px] px-3 py-2"
                    >
                      <Pause className="w-3 h-3 fill-black" />
                      <span>Pause</span>
                    </FitoraPillButton>
                  )}
                  <FitoraPillButton
                    variant="black"
                    onClick={resetStopwatch}
                    disabled={swElapsedMs === 0 && !swRunning}
                    className="gap-1.5 text-[10px] px-3 py-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </FitoraPillButton>
                </div>
              </div>

              {/* 5. History List (Under Stopwatch!) -> order-5 on mobile */}
              <div className="order-5 lg:order-none w-full">
                <HistoryList logs={history} />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="contents lg:flex lg:flex-col lg:gap-5 lg:w-full">
              {/* 3. Log This Exercise Form -> order-3 on mobile, order-3 on desktop */}
              <form
                onSubmit={handleSubmit}
                className="order-3 lg:order-3 bg-neutral-900/80 border border-white/10 rounded-2xl p-5 space-y-4 w-full"
                noValidate
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    LOG THIS EXERCISE
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <NumberField
                    label="SETS"
                    value={sets}
                    onChange={setSets}
                    min={1}
                  />
                  <NumberField
                    label="REPS"
                    value={reps}
                    onChange={setReps}
                    min={1}
                  />
                  <NumberField
                    label="WEIGHT (KG)"
                    value={weight}
                    onChange={setWeight}
                    min={0}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black tracking-[0.2em] text-white/40 mb-2">
                    NOTES (OPTIONAL)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={2}
                    maxLength={280}
                    placeholder="How did this set feel?"
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white transition resize-none"
                  />
                </div>

                {error && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <FitoraPillButton
                    variant="white"
                    type="submit"
                    disabled={submitting}
                    className="group flex-1 gap-2.5 text-xs sm:text-sm px-5 py-3.5"
                  >
                    <span>
                      {submitting ? "LOGGING..." : "FINISH & LOG SET"}
                    </span>
                    <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </FitoraPillButton>
                </div>
              </form>

              {/* 4. Badges, Title, Description, Tips -> order-4 on mobile, order-1 on desktop */}
              <div className="order-4 lg:order-1 space-y-5 w-full">
                {/* Category & Difficulty Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-wider">
                    {exercise.category}
                  </span>
                  <span className="px-3 py-1 rounded-full border border-white/20 text-white/60 text-[9px] font-black uppercase tracking-wider">
                    {exercise.difficulty}
                  </span>
                </div>

                {/* Exercise Title & Description */}
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-4xl font-black uppercase tracking-tight leading-[0.95] text-white">
                    {exercise.name}
                  </h2>

                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed mt-3">
                    {exercise.description}
                  </p>
                </div>

                {/* Key Technique Tips Box */}
                <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      KEY TECHNIQUE TIPS
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {exercise.tips.map((tip, index) => (
                      <div
                        key={tip}
                        className="flex items-start gap-3 border-b border-white/5 pb-2.5 last:border-none"
                      >
                        <span className="shrink-0 text-white/30 text-xs font-black pt-0.5">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-xs text-white/75 leading-relaxed">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INFO BOX

/* ============================================================
   NUMBER FIELD

function NumberField({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  min: number;
}) {
  return (
    <div>
      <label className="block text-[9px] font-black tracking-[0.2em] text-white/40 mb-2">
        {label}
      </label>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-black text-white outline-none focus:border-white transition [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

/* ============================================================
   HISTORY LIST

function HistoryList({ logs }: { logs: WorkoutLog[] }) {
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const prevLenRef = useRef(logs.length);

  useEffect(() => {
    if (logs.length > prevLenRef.current && logs[0]) {
      setAnimatingId(logs[0]._id);
      const timer = setTimeout(() => setAnimatingId(null), 500);
      return () => clearTimeout(timer);
    }
    prevLenRef.current = logs.length;
  }, [logs.length, logs]);

  if (logs.length === 0) {
    return (
      <div className="border border-dashed border-white/10 rounded-2xl p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          No sets logged yet for this session
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
          <Flame className="w-3.5 h-3.5" />
        </span>
        <h3 className="text-xs font-black uppercase tracking-wider text-white">
          UPDATED HISTORY
        </h3>
      </div>

      <ul className="space-y-2">
        {logs.map((log) => (
          <li
            key={log._id}
            className="flex items-center justify-between gap-3 border border-white/10 bg-neutral-950 rounded-xl px-3 py-2.5"
          >
            {/* Success checkmark with pulse micro-interaction */}
            <div
              className={`shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ${
                animatingId === log._id ? "animate-[setPulse_400ms_ease-out]" : ""
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">
                {log.setsCount} × {log.repsCount} @ {log.weight}kg
              </p>
              {log.notes && (
                <p className="text-[10px] text-white/50 truncate">
                  {log.notes}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-black text-white">
                {log.caloriesBurned ? `${log.caloriesBurned} kcal` : "—"}
              </p>
              <p className="text-[9px] uppercase tracking-wider text-white/40">
                {new Date(log.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Set completion pulse keyframes */}
      <style>{`
        @keyframes setPulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   INFO BOX

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-2.5 sm:p-3">
      <div className="text-white/35 mb-1.5">
        <span className="w-3.5 h-3.5 block [&>svg]:w-3.5 [&>svg]:h-3.5">
          {icon}
        </span>
      </div>

      <p className="text-[7.5px] sm:text-[8px] font-bold tracking-[0.2em] text-white/30">
        {label}
      </p>

      <p className="text-[9px] sm:text-[11px] font-black uppercase mt-0.5 truncate">
        {value}
      </p>
    </div>
  );
}
export * from "./exercises/ExerciseTracker";
export { default } from "./exercises/ExerciseTracker";
