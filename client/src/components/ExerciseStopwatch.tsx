"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, Pause, Play, RotateCcw, X } from "lucide-react";

function format(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centi = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centi).padStart(2, "0")}`;
}

export default function ExerciseStopwatch({
  collapsible: collapsibleProp = true,
}: {
  collapsible?: boolean;
}) {
  const [running, setRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const startedAtRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  const start = () => {
    if (running) return;
    startedAtRef.current = Date.now() - elapsedMs;
    tickRef.current = setInterval(() => {
      setElapsedMs(Date.now() - (startedAtRef.current ?? Date.now()));
    }, 100);
    setRunning(true);
  };

  const pause = () => {
    if (!running) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setRunning(false);
  };

  const reset = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    startedAtRef.current = null;
    setElapsedMs(0);
    setRunning(false);
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white text-black items-center justify-center shadow-2xl border border-white/20 hover:scale-105 transition cursor-pointer"
        aria-label="Open stopwatch"
      >
        <Clock3 className="w-5 h-5" />
      </button>
    );
  }

  return (
    <aside
      className="hidden lg:block fixed left-4 top-28 z-40 w-64 xl:w-72 bg-neutral-950/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      aria-label="Exercise stopwatch"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
            <Clock3 className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
            STOPWATCH
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
            {running ? "RUN" : elapsedMs > 0 ? "PAUSE" : "READY"}
          </span>
          {collapsibleProp && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="w-6 h-6 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-white/60 flex items-center justify-center transition"
              aria-label="Collapse stopwatch"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center w-full py-6">
        <span
          className={`block w-full text-center font-black tracking-tight tabular-nums text-4xl xl:text-5xl ${
            running ? "text-white" : "text-white/80"
          }`}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {format(elapsedMs)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {!running ? (
          <button
            type="button"
            onClick={start}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 bg-white text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-2 rounded-full hover:bg-gray-100 transition shadow-md cursor-pointer"
          >
            <Play className="w-3 h-3 fill-black" />
            <span>{elapsedMs > 0 ? "Resume" : "Start"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 bg-white text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-2 rounded-full hover:bg-gray-100 transition shadow-md cursor-pointer"
          >
            <Pause className="w-3 h-3 fill-black" />
            <span>Pause</span>
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          disabled={elapsedMs === 0 && !running}
          className="inline-flex items-center justify-center gap-1.5 bg-neutral-900 border border-white/15 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-2 rounded-full hover:border-white/40 transition shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </aside>
  );
}