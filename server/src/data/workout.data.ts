export interface WorkoutExercise {
  id: string;
  name: string;
  category:
    | "chest"
    | "back"
    | "legs"
    | "shoulders"
    | "arms"
    | "core"
    | "cardio"
    | "full-body";

  muscleGroup: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";

  equipment:
    | "Dumbbell"
    | "Barbell"
    | "Bodyweight"
    | "Machine"
    | "Cable"
    | "Kettlebell"
    | "None";

  targetSets: number;
  targetReps: number;
  estimatedCaloriesBurn: number;
  targetMuscles: string[];
  instructions: string[];
  tips: string;

  imageUrl?: string;
  videoUrl?: string;
}



export const LOCAL_WORKOUTS_DATABASE: WorkoutExercise[] = [
  // =========================
  // CHEST
  // =========================

  {
    id: "w-01",
    name: "Barbell Bench Press",
    category: "chest",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Barbell",
    targetSets: 4,
    targetReps: 10,
    estimatedCaloriesBurn: 120,
    targetMuscles: ["Pectoralis Major", "Anterior Deltoids", "Triceps"],
    instructions: [
      "Lie on a flat bench with your eyes under the bar.",
      "Grip the bar slightly wider than shoulder width.",
      "Lower the bar toward the middle of your chest.",
      "Press the bar upward until your arms are extended."
    ],
    tips: "Keep your shoulder blades retracted and feet firmly planted.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=barbell+bench+press+proper+form"
  },

  {
    id: "w-02",
    name: "Incline Dumbbell Press",
    category: "chest",
    muscleGroup: "Upper Chest",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 100,
    targetMuscles: ["Upper Chest", "Anterior Deltoids", "Triceps"],
    instructions: [
      "Set the bench to approximately 30 to 45 degrees.",
      "Hold dumbbells at chest level.",
      "Press the dumbbells upward.",
      "Lower them slowly until you feel a chest stretch."
    ],
    tips: "Avoid excessive lower-back arching.",
    imageUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=incline+dumbbell+press+proper+form"
  },

  {
    id: "w-03",
    name: "Push-ups",
    category: "chest",
    muscleGroup: "Chest & Core",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 70,
    targetMuscles: ["Pectoralis Major", "Triceps", "Anterior Deltoids", "Core"],
    instructions: [
      "Start in a high plank position.",
      "Keep your body straight.",
      "Lower your chest toward the floor.",
      "Push back up while keeping your core engaged."
    ],
    tips: "Do not allow your hips to sag.",
    imageUrl:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=push+ups+proper+form"
  },

  {
    id: "w-04",
    name: "Dumbbell Chest Fly",
    category: "chest",
    muscleGroup: "Chest",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 80,
    targetMuscles: ["Pectoralis Major", "Anterior Deltoids"],
    instructions: [
      "Lie on a flat bench holding dumbbells above your chest.",
      "Keep a slight bend in your elbows.",
      "Lower the dumbbells outward in an arc.",
      "Bring the dumbbells back together above your chest."
    ],
    tips: "Use controlled movement and avoid excessive weight.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+chest+fly+proper+form"
  },

  {
    id: "w-05",
    name: "Cable Chest Fly",
    category: "chest",
    muscleGroup: "Chest",
    difficulty: "Intermediate",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 85,
    targetMuscles: ["Pectoralis Major", "Anterior Deltoids"],
    instructions: [
      "Set both cable handles around chest height.",
      "Stand between the cables with a staggered stance.",
      "Bring both handles together in front of your chest.",
      "Return slowly to the starting position."
    ],
    tips: "Keep your chest lifted and elbows slightly bent.",
    imageUrl:
      "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=cable+chest+fly+proper+form"
  },

  {
    id: "w-06",
    name: "Decline Push-ups",
    category: "chest",
    muscleGroup: "Upper Chest",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 75,
    targetMuscles: ["Upper Chest", "Triceps", "Anterior Deltoids"],
    instructions: [
      "Place your feet on a stable elevated surface.",
      "Place hands slightly wider than shoulder width.",
      "Lower your chest toward the floor.",
      "Push back to the starting position."
    ],
    tips: "Keep your body straight throughout the movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=decline+push+ups+proper+form"
  },

  {
    id: "w-07",
    name: "Chest Dips",
    category: "chest",
    muscleGroup: "Lower Chest",
    difficulty: "Advanced",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Lower Chest", "Triceps", "Anterior Deltoids"],
    instructions: [
      "Grip the parallel bars and support your body.",
      "Lean your torso slightly forward.",
      "Lower yourself by bending your elbows.",
      "Press back up to the starting position."
    ],
    tips: "Avoid dropping too deep if you feel shoulder discomfort.",
    imageUrl:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=chest+dips+proper+form"
  },

  // =========================
  // BACK
  // =========================

  {
    id: "w-08",
    name: "Barbell Deadlift",
    category: "back",
    muscleGroup: "Posterior Chain",
    difficulty: "Advanced",
    equipment: "Barbell",
    targetSets: 4,
    targetReps: 6,
    estimatedCaloriesBurn: 160,
    targetMuscles: [
      "Erector Spinae",
      "Latissimus Dorsi",
      "Glutes",
      "Hamstrings",
      "Traps"
    ],
    instructions: [
      "Stand with the bar over your mid-foot.",
      "Hinge at the hips and grip the bar.",
      "Brace your core and keep your back neutral.",
      "Drive through the floor and stand upright."
    ],
    tips: "Never round your lower back during the lift.",
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=barbell+deadlift+proper+form"
  },

  {
    id: "w-09",
    name: "Wide-Grip Lat Pulldown",
    category: "back",
    muscleGroup: "Upper Back",
    difficulty: "Beginner",
    equipment: "Cable",
    targetSets: 4,
    targetReps: 12,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Latissimus Dorsi", "Teres Major", "Rhomboids", "Biceps"],
    instructions: [
      "Sit at the lat pulldown machine.",
      "Grip the bar wider than shoulder width.",
      "Pull the bar toward your upper chest.",
      "Return the bar slowly."
    ],
    tips: "Pull with your elbows rather than your hands.",
    imageUrl:
      "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=lat+pulldown+proper+form"
  },

  {
    id: "w-10",
    name: "Bent-Over Barbell Row",
    category: "back",
    muscleGroup: "Mid Back",
    difficulty: "Intermediate",
    equipment: "Barbell",
    targetSets: 4,
    targetReps: 10,
    estimatedCaloriesBurn: 110,
    targetMuscles: ["Rhomboids", "Middle Traps", "Latissimus Dorsi", "Biceps"],
    instructions: [
      "Hold a barbell with an overhand grip.",
      "Hinge forward while keeping your back neutral.",
      "Pull the bar toward your lower abdomen.",
      "Lower the bar under control."
    ],
    tips: "Do not use momentum to move the bar.",
    imageUrl:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=bent+over+barbell+row+proper+form"
  },

  {
    id: "w-11",
    name: "Seated Cable Row",
    category: "back",
    muscleGroup: "Mid Back",
    difficulty: "Beginner",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Rhomboids", "Latissimus Dorsi", "Middle Traps", "Biceps"],
    instructions: [
      "Sit upright with feet on the platform.",
      "Hold the cable handle with both hands.",
      "Pull the handle toward your abdomen.",
      "Slowly extend your arms forward."
    ],
    tips: "Keep your torso stable and avoid excessive leaning.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=seated+cable+row+proper+form"
  },

  {
    id: "w-12",
    name: "Pull-ups",
    category: "back",
    muscleGroup: "Lats & Upper Back",
    difficulty: "Advanced",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 8,
    estimatedCaloriesBurn: 100,
    targetMuscles: ["Latissimus Dorsi", "Biceps", "Rhomboids", "Core"],
    instructions: [
      "Grip the pull-up bar slightly wider than shoulder width.",
      "Hang with your arms extended.",
      "Pull your chest toward the bar.",
      "Lower yourself with control."
    ],
    tips: "Avoid swinging your body.",
    imageUrl:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=pull+ups+proper+form"
  },

  {
    id: "w-13",
    name: "Single-Arm Dumbbell Row",
    category: "back",
    muscleGroup: "Lats",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 85,
    targetMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps"],
    instructions: [
      "Place one hand and knee on a bench.",
      "Hold a dumbbell with the opposite hand.",
      "Pull the dumbbell toward your hip.",
      "Lower it slowly."
    ],
    tips: "Keep your shoulder away from your ear.",
    imageUrl:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+proper+form"
  },

  {
    id: "w-14",
    name: "Straight-Arm Cable Pulldown",
    category: "back",
    muscleGroup: "Lats",
    difficulty: "Intermediate",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 70,
    targetMuscles: ["Latissimus Dorsi", "Teres Major"],
    instructions: [
      "Stand facing a high cable pulley.",
      "Hold the bar with straight arms.",
      "Pull the bar down toward your thighs.",
      "Return slowly to the starting position."
    ],
    tips: "Keep your arms mostly straight during the movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=straight+arm+pulldown+proper+form"
  },

  // =========================
  // LEGS
  // =========================

  {
    id: "w-15",
    name: "Barbell Back Squat",
    category: "legs",
    muscleGroup: "Quadriceps & Glutes",
    difficulty: "Intermediate",
    equipment: "Barbell",
    targetSets: 4,
    targetReps: 8,
    estimatedCaloriesBurn: 150,
    targetMuscles: ["Quadriceps", "Gluteus Maximus", "Hamstrings", "Core"],
    instructions: [
      "Place the bar across your upper back.",
      "Stand with feet approximately shoulder width.",
      "Bend your knees and hips to descend.",
      "Drive through your feet to stand."
    ],
    tips: "Keep knees tracking in line with your toes.",
    imageUrl:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=barbell+back+squat+proper+form"
  },

  {
    id: "w-16",
    name: "Romanian Deadlift",
    category: "legs",
    muscleGroup: "Hamstrings & Glutes",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 110,
    targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae"],
    instructions: [
      "Hold dumbbells in front of your thighs.",
      "Push your hips backward.",
      "Lower the dumbbells while maintaining a neutral spine.",
      "Drive your hips forward to stand."
    ],
    tips: "Focus on the hip hinge instead of squatting.",
    imageUrl:
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=romanian+deadlift+proper+form"
  },

  {
    id: "w-17",
    name: "Leg Press",
    category: "legs",
    muscleGroup: "Quadriceps & Glutes",
    difficulty: "Beginner",
    equipment: "Machine",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 95,
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    instructions: [
      "Sit with your back firmly against the pad.",
      "Place feet shoulder width on the platform.",
      "Lower the platform with control.",
      "Press through your feet to extend your legs."
    ],
    tips: "Do not lock your knees forcefully at the top.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=leg+press+proper+form"
  },

  {
    id: "w-18",
    name: "Walking Lunges",
    category: "legs",
    muscleGroup: "Legs & Glutes",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    instructions: [
      "Stand tall with feet hip width apart.",
      "Step forward with one leg.",
      "Lower your body until both knees are bent.",
      "Push through the front foot and step forward with the other leg."
    ],
    tips: "Keep your torso upright throughout the movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=walking+lunges+proper+form"
  },

  {
    id: "w-19",
    name: "Bulgarian Split Squat",
    category: "legs",
    muscleGroup: "Quads & Glutes",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 100,
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    instructions: [
      "Place the rear foot on a bench.",
      "Hold dumbbells at your sides.",
      "Lower your body by bending the front knee.",
      "Push through the front foot to rise."
    ],
    tips: "Keep most of your weight on the front leg.",
    imageUrl:
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=bulgarian+split+squat+proper+form"
  },

  {
    id: "w-20",
    name: "Dumbbell Goblet Squat",
    category: "legs",
    muscleGroup: "Quads & Glutes",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Quadriceps", "Glutes", "Core"],
    instructions: [
      "Hold one dumbbell close to your chest.",
      "Stand with feet slightly wider than hip width.",
      "Squat down while keeping your chest upright.",
      "Drive through your feet to stand."
    ],
    tips: "Keep the dumbbell close to your body.",
    imageUrl:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=goblet+squat+proper+form"
  },

  {
    id: "w-21",
    name: "Leg Extension",
    category: "legs",
    muscleGroup: "Quadriceps",
    difficulty: "Beginner",
    equipment: "Machine",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Quadriceps"],
    instructions: [
      "Sit on the machine with your back supported.",
      "Place your ankles behind the padded roller.",
      "Extend your knees until your legs are straight.",
      "Lower the weight slowly."
    ],
    tips: "Use controlled repetitions instead of swinging the weight.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=leg+extension+proper+form"
  },

  {
    id: "w-22",
    name: "Standing Calf Raise",
    category: "legs",
    muscleGroup: "Calves",
    difficulty: "Beginner",
    equipment: "None",
    targetSets: 4,
    targetReps: 15,
    estimatedCaloriesBurn: 50,
    targetMuscles: ["Gastrocnemius", "Soleus"],
    instructions: [
      "Stand upright with feet hip width apart.",
      "Rise onto the balls of your feet.",
      "Pause at the top.",
      "Lower your heels slowly."
    ],
    tips: "Use a full range of motion.",
    imageUrl:
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=standing+calf+raise+proper+form"
  },

  // =========================
  // SHOULDERS
  // =========================

  {
    id: "w-23",
    name: "Dumbbell Shoulder Press",
    category: "shoulders",
    muscleGroup: "Deltoids",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 4,
    targetReps: 10,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Anterior Deltoids", "Lateral Deltoids", "Triceps"],
    instructions: [
      "Hold dumbbells at shoulder height.",
      "Brace your core.",
      "Press the dumbbells overhead.",
      "Lower them back to shoulder level."
    ],
    tips: "Avoid excessive lower-back arching.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+shoulder+press+proper+form"
  },

  {
    id: "w-24",
    name: "Dumbbell Lateral Raise",
    category: "shoulders",
    muscleGroup: "Side Deltoids",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 4,
    targetReps: 15,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Lateral Deltoid"],
    instructions: [
      "Hold dumbbells at your sides.",
      "Raise your arms outward.",
      "Stop around shoulder height.",
      "Lower slowly."
    ],
    tips: "Do not swing your body to lift the dumbbells.",
    imageUrl:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+lateral+raise+proper+form"
  },

  {
    id: "w-25",
    name: "Dumbbell Front Raise",
    category: "shoulders",
    muscleGroup: "Front Deltoids",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Anterior Deltoids"],
    instructions: [
      "Hold dumbbells in front of your thighs.",
      "Raise one or both arms forward.",
      "Lift to approximately shoulder height.",
      "Lower with control."
    ],
    tips: "Avoid using momentum.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+front+raise+proper+form"
  },

  {
    id: "w-26",
    name: "Cable Face Pull",
    category: "shoulders",
    muscleGroup: "Rear Deltoids",
    difficulty: "Beginner",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Rear Deltoids", "Rhomboids", "Traps"],
    instructions: [
      "Attach a rope to a cable at upper chest height.",
      "Pull the rope toward your face.",
      "Rotate your hands outward as you pull.",
      "Return slowly."
    ],
    tips: "Focus on squeezing the rear shoulders.",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=cable+face+pull+proper+form"
  },

  {
    id: "w-27",
    name: "Arnold Press",
    category: "shoulders",
    muscleGroup: "Shoulders",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 85,
    targetMuscles: ["Anterior Deltoids", "Lateral Deltoids", "Triceps"],
    instructions: [
      "Start with dumbbells at shoulder height and palms facing you.",
      "Rotate your palms outward while pressing overhead.",
      "Extend your arms above your head.",
      "Reverse the motion slowly."
    ],
    tips: "Perform the rotation smoothly and under control.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=arnold+press+proper+form"
  },

  // =========================
  // ARMS
  // =========================

  {
    id: "w-28",
    name: "Barbell Bicep Curl",
    category: "arms",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Barbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Biceps Brachii", "Brachialis"],
    instructions: [
      "Hold the barbell with an underhand grip.",
      "Keep your elbows close to your torso.",
      "Curl the bar toward your shoulders.",
      "Lower the bar slowly."
    ],
    tips: "Keep your upper arms stationary.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=barbell+bicep+curl+proper+form"
  },

  {
    id: "w-29",
    name: "Hammer Curl",
    category: "arms",
    muscleGroup: "Biceps & Forearms",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Brachialis", "Biceps", "Brachioradialis"],
    instructions: [
      "Hold dumbbells with neutral palms facing each other.",
      "Keep elbows close to your body.",
      "Curl the dumbbells upward.",
      "Lower them slowly."
    ],
    tips: "Do not swing your torso.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+hammer+curl+proper+form"
  },

  {
    id: "w-30",
    name: "Incline Dumbbell Curl",
    category: "arms",
    muscleGroup: "Biceps",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Biceps Brachii", "Brachialis"],
    instructions: [
      "Sit on an incline bench.",
      "Let your arms hang naturally.",
      "Curl the dumbbells toward your shoulders.",
      "Lower them fully under control."
    ],
    tips: "Maintain a fixed upper-arm position.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=incline+dumbbell+curl+proper+form"
  },

  {
    id: "w-31",
    name: "Cable Bicep Curl",
    category: "arms",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Biceps Brachii", "Brachialis"],
    instructions: [
      "Attach a straight bar to a low pulley.",
      "Hold the bar with an underhand grip.",
      "Curl the bar toward your shoulders.",
      "Return slowly."
    ],
    tips: "Keep tension on the biceps throughout the movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=cable+bicep+curl+proper+form"
  },

  {
    id: "w-32",
    name: "Tricep Rope Pushdown",
    category: "arms",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Triceps Lateral Head", "Triceps Long Head"],
    instructions: [
      "Attach a rope to a high cable pulley.",
      "Keep elbows close to your body.",
      "Push the rope downward.",
      "Return slowly to the starting position."
    ],
    tips: "Keep your elbows fixed beside your torso.",
    imageUrl:
      "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=tricep+rope+pushdown+proper+form"
  },

  {
    id: "w-33",
    name: "Overhead Dumbbell Tricep Extension",
    category: "arms",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Triceps Long Head"],
    instructions: [
      "Hold one dumbbell overhead with both hands.",
      "Keep your elbows pointing forward.",
      "Lower the dumbbell behind your head.",
      "Extend your elbows to return upward."
    ],
    tips: "Keep your elbows from flaring outward.",
    imageUrl:
      "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=overhead+dumbbell+tricep+extension+proper+form"
  },

  {
    id: "w-34",
    name: "Close-Grip Push-up",
    category: "arms",
    muscleGroup: "Triceps",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 70,
    targetMuscles: ["Triceps", "Chest", "Anterior Deltoids"],
    instructions: [
      "Start in a high plank position.",
      "Place your hands closer than shoulder width.",
      "Lower your chest toward the floor.",
      "Push yourself back up."
    ],
    tips: "Keep your elbows relatively close to your torso.",
    imageUrl:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=close+grip+push+ups+proper+form"
  },

  // =========================
  // CORE
  // =========================

  {
    id: "w-35",
    name: "Plank",
    category: "core",
    muscleGroup: "Core Stability",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 1,
    estimatedCaloriesBurn: 45,
    targetMuscles: ["Rectus Abdominis", "Transverse Abdominis", "Obliques"],
    instructions: [
      "Place your forearms on the floor.",
      "Extend your legs behind you.",
      "Keep your body in a straight line.",
      "Hold while maintaining core tension."
    ],
    tips: "Avoid dropping or raising your hips.",
    imageUrl:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=plank+proper+form"
  },

  {
    id: "w-36",
    name: "Hanging Leg Raise",
    category: "core",
    muscleGroup: "Abs",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 75,
    targetMuscles: ["Rectus Abdominis", "Hip Flexors", "Obliques"],
    instructions: [
      "Hang from a pull-up bar.",
      "Brace your core.",
      "Raise your legs upward.",
      "Lower them slowly without swinging."
    ],
    tips: "Control the lowering phase.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=hanging+leg+raise+proper+form"
  },

  {
    id: "w-37",
    name: "Bicycle Crunch",
    category: "core",
    muscleGroup: "Abs & Obliques",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 20,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Rectus Abdominis", "Obliques"],
    instructions: [
      "Lie on your back with hands behind your head.",
      "Lift your shoulders slightly off the floor.",
      "Bring one knee toward your chest while rotating your torso.",
      "Alternate sides in a controlled motion."
    ],
    tips: "Avoid pulling your neck with your hands.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=bicycle+crunch+proper+form"
  },

  {
    id: "w-38",
    name: "Russian Twist",
    category: "core",
    muscleGroup: "Obliques",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 20,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Obliques", "Rectus Abdominis", "Transverse Abdominis"],
    instructions: [
      "Sit with knees bent and feet on the floor.",
      "Lean back slightly while keeping your chest lifted.",
      "Rotate your torso from side to side.",
      "Keep the movement controlled."
    ],
    tips: "Rotate through your torso rather than just moving your arms.",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=russian+twist+proper+form"
  },

  {
    id: "w-39",
    name: "Mountain Climbers",
    category: "core",
    muscleGroup: "Core & Cardio",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 30,
    estimatedCaloriesBurn: 100,
    targetMuscles: ["Core", "Hip Flexors", "Quadriceps", "Shoulders"],
    instructions: [
      "Start in a high plank position.",
      "Drive one knee toward your chest.",
      "Return it and switch legs.",
      "Continue alternating at a controlled pace."
    ],
    tips: "Keep your shoulders stacked above your hands.",
    imageUrl:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=mountain+climbers+proper+form"
  },

  {
    id: "w-40",
    name: "Dead Bug",
    category: "core",
    muscleGroup: "Core Stability",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 45,
    targetMuscles: ["Transverse Abdominis", "Rectus Abdominis", "Hip Flexors"],
    instructions: [
      "Lie on your back with arms and knees raised.",
      "Brace your abdominal muscles.",
      "Extend one arm and the opposite leg.",
      "Return and alternate sides."
    ],
    tips: "Keep your lower back gently pressed toward the floor.",
    imageUrl:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dead+bug+exercise+proper+form"
  },

  // =========================
  // CARDIO
  // =========================

  {
    id: "w-41",
    name: "Jumping Jacks",
    category: "cardio",
    muscleGroup: "Full Body Cardio",
    difficulty: "Beginner",
    equipment: "None",
    targetSets: 3,
    targetReps: 30,
    estimatedCaloriesBurn: 80,
    targetMuscles: ["Calves", "Quadriceps", "Shoulders", "Cardiovascular System"],
    instructions: [
      "Stand upright with feet together.",
      "Jump while moving your arms overhead.",
      "Land with feet apart.",
      "Return to the starting position."
    ],
    tips: "Land softly and maintain a steady rhythm.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=jumping+jacks+proper+form"
  },

  {
    id: "w-42",
    name: "Burpees",
    category: "cardio",
    muscleGroup: "Full Body",
    difficulty: "Advanced",
    equipment: "None",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 120,
    targetMuscles: ["Chest", "Quadriceps", "Glutes", "Core", "Cardiovascular System"],
    instructions: [
      "Start standing.",
      "Squat down and place your hands on the floor.",
      "Jump your feet back into a plank.",
      "Return your feet forward and jump upward."
    ],
    tips: "Land softly and maintain control.",
    imageUrl:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=burpee+proper+form"
  },

  {
    id: "w-43",
    name: "High Knees",
    category: "cardio",
    muscleGroup: "Cardio & Legs",
    difficulty: "Beginner",
    equipment: "None",
    targetSets: 3,
    targetReps: 30,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Hip Flexors", "Quadriceps", "Calves", "Core"],
    instructions: [
      "Stand upright.",
      "Drive one knee toward your chest.",
      "Quickly switch legs.",
      "Pump your arms naturally."
    ],
    tips: "Stay light on your feet and keep your core engaged.",
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=high+knees+proper+form"
  },

  {
    id: "w-44",
    name: "Jump Rope",
    category: "cardio",
    muscleGroup: "Full Body Cardio",
    difficulty: "Intermediate",
    equipment: "None",
    targetSets: 3,
    targetReps: 60,
    estimatedCaloriesBurn: 110,
    targetMuscles: ["Calves", "Quadriceps", "Shoulders", "Core"],
    instructions: [
      "Hold the rope handles at your sides.",
      "Rotate the rope using your wrists.",
      "Jump just high enough for the rope to pass underneath.",
      "Maintain a steady rhythm."
    ],
    tips: "Keep jumps small and land softly.",
    imageUrl:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=jump+rope+proper+form"
  },

  {
    id: "w-45",
    name: "Mountain Sprint",
    category: "cardio",
    muscleGroup: "Lower Body Cardio",
    difficulty: "Advanced",
    equipment: "None",
    targetSets: 6,
    targetReps: 1,
    estimatedCaloriesBurn: 150,
    targetMuscles: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
    instructions: [
      "Warm up with light jogging.",
      "Sprint at a high but controlled intensity.",
      "Recover with walking.",
      "Repeat for multiple rounds."
    ],
    tips: "Build sprint intensity gradually.",
    imageUrl:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=sprint+running+proper+form"
  },

  // =========================
  // FULL BODY
  // =========================

  {
    id: "w-46",
    name: "Kettlebell Swing",
    category: "full-body",
    muscleGroup: "Full Body Power",
    difficulty: "Intermediate",
    equipment: "Kettlebell",
    targetSets: 4,
    targetReps: 15,
    estimatedCaloriesBurn: 140,
    targetMuscles: ["Glutes", "Hamstrings", "Lats", "Core", "Shoulders"],
    instructions: [
      "Stand with feet slightly wider than shoulder width.",
      "Hinge at the hips and swing the kettlebell between your legs.",
      "Drive your hips forward explosively.",
      "Allow the kettlebell to swing to chest height."
    ],
    tips: "Generate power from the hips instead of lifting with your arms.",
    imageUrl:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=kettlebell+swing+proper+form"
  },

  {
    id: "w-47",
    name: "Thrusters",
    category: "full-body",
    muscleGroup: "Full Body",
    difficulty: "Advanced",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 130,
    targetMuscles: ["Quadriceps", "Glutes", "Shoulders", "Triceps", "Core"],
    instructions: [
      "Hold dumbbells at shoulder level.",
      "Perform a controlled squat.",
      "Drive upward through your legs.",
      "Use the momentum to press the dumbbells overhead."
    ],
    tips: "Keep your core braced throughout the movement.",
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+thruster+proper+form"
  },

  {
    id: "w-48",
    name: "Dumbbell Clean and Press",
    category: "full-body",
    muscleGroup: "Full Body Power",
    difficulty: "Advanced",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 125,
    targetMuscles: ["Shoulders", "Glutes", "Quadriceps", "Triceps", "Core"],
    instructions: [
      "Hold dumbbells beside your thighs.",
      "Hinge and explosively pull them toward your shoulders.",
      "Catch them at shoulder height.",
      "Press them overhead."
    ],
    tips: "Use your hips to generate power during the clean.",
    imageUrl:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=dumbbell+clean+and+press+proper+form"
  },

  {
    id: "w-49",
    name: "Bear Crawl",
    category: "full-body",
    muscleGroup: "Full Body",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 20,
    estimatedCaloriesBurn: 100,
    targetMuscles: ["Core", "Shoulders", "Quadriceps", "Glutes"],
    instructions: [
      "Start on hands and knees.",
      "Lift your knees slightly above the floor.",
      "Move opposite hand and foot forward.",
      "Continue crawling while keeping your hips controlled."
    ],
    tips: "Keep your back relatively flat and move slowly.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=bear+crawl+exercise+proper+form"
  },

  {
    id: "w-50",
    name: "Box Jump",
    category: "full-body",
    muscleGroup: "Lower Body Power",
    difficulty: "Advanced",
    equipment: "None",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 120,
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves", "Core"],
    instructions: [
      "Stand facing a stable plyometric box.",
      "Bend your knees and swing your arms.",
      "Jump onto the box.",
      "Land softly with both feet and step down."
    ],
    tips: "Use a box height that allows safe and controlled landings.",
    imageUrl:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://www.youtube.com/results?search_query=box+jump+proper+form"
  }
];
