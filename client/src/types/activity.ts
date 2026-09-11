/**
 * Represents a single day's activity data for the activity heatmap.
 */
export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3;
}

/**
 * Represents calculated user activity streak statistics.
 */
export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}