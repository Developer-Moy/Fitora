
import StopwatchPage from "../time/stopwatch";


// ─────────────────────────────────────────────────────────────────────────────
export default function GymTimerSection() {
  return (
    <section
      id="gym-timer"
    >
      {/* TODO: Puskor Roy — Build gym timer preview section */}
      {/* Show a preview of the GymTimer with a "Open Full Timer" CTA linking to /stopwatch */}
      {/* Add a workout stats strip below (e.g., workouts this week, calories burned) */}
      <div className=" flex items-center justify-center">
      <StopwatchPage/>
      </div>
    </section>
  );
}
