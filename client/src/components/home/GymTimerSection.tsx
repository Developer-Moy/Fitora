
import StopwatchPage from "../time/stopwatch";


// ─────────────────────────────────────────────────────────────────────────────
export default function GymTimerSection() {
  return (
    <section
      id="gym-timer"
      className="w-full py-16 px-6 md:px-10 border-t border-white/[0.06]"
    >
      {/* TODO: Puskor Roy — Build gym timer preview section */}
      {/* Show a preview of the GymTimer with a "Open Full Timer" CTA linking to /stopwatch */}
      {/* Add a workout stats strip below (e.g., workouts this week, calories burned) */}
      <div className="w-full min-h-[400px] rounded-2xl border border-dashed border-red-500/20 flex items-center justify-center">
      <StopwatchPage/>
      </div>
    </section>
  );
}
