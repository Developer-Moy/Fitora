export interface WorkoutLog {
  _id?: string;
  userId?: string;
  exerciseName: string;
  setsCount: number;
  repsCount: number;
  weight?: number;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutLogSummary {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalCaloriesBurned: number;
  totalDurationMinutes: number;
}

export interface CreateWorkoutLogPayload {
  exerciseName: string;
  setsCount: number;
  repsCount: number;
  weight?: number;
  durationMinutes?: number;
  notes?: string;
  date?: string;
  userId?: string;
}

export interface WorkoutLogsResult {
  logs: WorkoutLog[];
  summary?: WorkoutLogSummary;
}
