export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: string[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  daysPerWeek: number;
  schedule: WorkoutDay[];
}

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  {
    id: "beginner-full-body",
    name: "Beginner Full Body",
    description: "A simple full-body workout program for beginners.",
    level: "Beginner",
    daysPerWeek: 3,

    schedule: [
      {
        day: "Monday",
        focus: "Full Body",
        exercises: [
          "Bodyweight Squat",
          "Push Up",
          "Lat Pulldown",
          "Dumbbell Shoulder Press",
        ],
      },
      {
        day: "Wednesday",
        focus: "Full Body",
        exercises: [
          "Goblet Squat",
          "Dumbbell Bench Press",
          "Seated Cable Row",
          "Dumbbell Bicep Curl",
        ],
      },
      {
        day: "Friday",
        focus: "Full Body",
        exercises: [
          "Leg Press",
          "Incline Dumbbell Press",
          "Lat Pulldown",
          "Tricep Pushdown",
        ],
      },
    ],
  },

  {
    id: "push-pull-legs",
    name: "Push Pull Legs",
    description: "A classic push, pull and legs training split.",
    level: "Intermediate",
    daysPerWeek: 6,

    schedule: [
      {
        day: "Monday",
        focus: "Push",
        exercises: [
          "Barbell Bench Press",
          "Overhead Press",
          "Incline Dumbbell Press",
          "Tricep Pushdown",
        ],
      },
      {
        day: "Tuesday",
        focus: "Pull",
        exercises: [
          "Barbell Row",
          "Lat Pulldown",
          "Face Pull",
          "Barbell Bicep Curl",
        ],
      },
      {
        day: "Wednesday",
        focus: "Legs",
        exercises: [
          "Barbell Back Squat",
          "Romanian Deadlift",
          "Leg Press",
          "Leg Curl",
        ],
      },
      {
        day: "Thursday",
        focus: "Push",
        exercises: [
          "Dumbbell Bench Press",
          "Dumbbell Shoulder Press",
          "Cable Fly",
          "Overhead Tricep Extension",
        ],
      },
      {
        day: "Friday",
        focus: "Pull",
        exercises: [
          "Deadlift",
          "Seated Cable Row",
          "Pull Up",
          "Hammer Curl",
        ],
      },
      {
        day: "Saturday",
        focus: "Legs",
        exercises: [
          "Front Squat",
          "Romanian Deadlift",
          "Leg Extension",
          "Standing Calf Raise",
        ],
      },
    ],
  },

  {
    id: "upper-lower",
    name: "Upper Lower Split",
    description: "A balanced four-day upper and lower body split.",
    level: "Intermediate",
    daysPerWeek: 4,

    schedule: [
      {
        day: "Monday",
        focus: "Upper Body",
        exercises: [
          "Barbell Bench Press",
          "Barbell Row",
          "Overhead Press",
          "Barbell Bicep Curl",
        ],
      },
      {
        day: "Tuesday",
        focus: "Lower Body",
        exercises: [
          "Barbell Back Squat",
          "Romanian Deadlift",
          "Leg Press",
          "Standing Calf Raise",
        ],
      },
      {
        day: "Thursday",
        focus: "Upper Body",
        exercises: [
          "Incline Dumbbell Press",
          "Lat Pulldown",
          "Dumbbell Shoulder Press",
          "Tricep Pushdown",
        ],
      },
      {
        day: "Friday",
        focus: "Lower Body",
        exercises: [
          "Front Squat",
          "Leg Curl",
          "Leg Extension",
          "Seated Calf Raise",
        ],
      },
    ],
  },
];