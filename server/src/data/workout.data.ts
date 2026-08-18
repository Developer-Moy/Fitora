export interface WorkoutExercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio' | 'full-body';
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: 'Dumbbell' | 'Barbell' | 'Bodyweight' | 'Machine' | 'Cable' | 'Kettlebell' | 'None';
  targetSets: number;
  targetReps: number;
  estimatedCaloriesBurn: number;
  targetMuscles: string[];
  instructions: string[];
  tips: string;
  imageUrl?: string;
}

export const LOCAL_WORKOUTS_DATABASE: WorkoutExercise[] = [
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
      "Lie back on a flat bench with your eyes under the bar.",
      "Grip the bar slightly wider than shoulder-width with wrists straight.",
      "Unrack the bar and lower it smoothly to your mid-chest.",
      "Press the bar upward explosively until arms are extended."
    ],
    tips: "Keep your shoulder blades retracted and feet planted firmly on the floor.",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80"
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
    targetMuscles: ["Clavicular Head (Upper Chest)", "Front Deltoid", "Triceps"],
    instructions: [
      "Set an adjustable bench to a 30-45 degree incline.",
      "Hold a dumbbell in each hand and sit back on the bench.",
      "Press dumbbells upward directly over your upper chest.",
      "Lower with control until elbows reach just below 90 degrees."
    ],
    tips: "Avoid arching your lower back excessively on the incline bench.",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-03",
    name: "Push-ups (Standard)",
    category: "chest",
    muscleGroup: "Chest & Core",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 70,
    targetMuscles: ["Pectoralis Major", "Triceps", "Core", "Anterior Deltoid"],
    instructions: [
      "Start in a high plank position with hands slightly wider than shoulders.",
      "Keep body in a straight line from head to heels.",
      "Lower chest towards the floor by bending elbows at a 45-degree angle.",
      "Push back up to starting position while engaging your core."
    ],
    tips: "Do not let your hips sag or hike up during repetitions.",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-04",
    name: "Barbell Deadlift",
    category: "back",
    muscleGroup: "Posterior Chain",
    difficulty: "Advanced",
    equipment: "Barbell",
    targetSets: 4,
    targetReps: 6,
    estimatedCaloriesBurn: 160,
    targetMuscles: ["Erector Spinae", "Latissimus Dorsi", "Glutes", "Hamstrings", "Traps"],
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot.",
      "Hinge at hips to grip the bar just outside your knees.",
      "Flatten your back, engage lats, and drive through heels to stand upright.",
      "Lock out hips at the top without hyperextending your spine, then reverse motion."
    ],
    tips: "Maintain a neutral spine at all times to prevent lumbar strain.",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-05",
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
      "Sit at the lat pulldown machine and adjust thigh pads snugly.",
      "Grasp the bar with an overhand grip wider than shoulder-width.",
      "Pull the bar down toward your upper chest while leaning slightly back.",
      "Squeeze shoulder blades together at the bottom, then slowly return up."
    ],
    tips: "Focus on pulling with your elbows rather than just gripping with hands.",
    imageUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-06",
    name: "Bent-Over Barbell Row",
    category: "back",
    muscleGroup: "Mid Back & Lats",
    difficulty: "Intermediate",
    equipment: "Barbell",
    targetSets: 4,
    targetReps: 10,
    estimatedCaloriesBurn: 110,
    targetMuscles: ["Rhomboids", "Middle Traps", "Latissimus Dorsi", "Biceps"],
    instructions: [
      "Hold a barbell with overhand grip, bend knees slightly, and hinge torso forward to ~45 degrees.",
      "Pull the barbell toward your lower abdomen, driving elbows back.",
      "Squeeze back muscles at peak contraction and lower bar under control."
    ],
    tips: "Keep torso steady and avoid using momentum to swing the bar up.",
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-07",
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
      "Rest barbell comfortably across upper traps/rear deltoids.",
      "Stand with feet shoulder-width apart, toes turned slightly out.",
      "Initiate descent by sending hips back and bending knees until thighs are parallel to ground.",
      "Push forcefully through your mid-foot to return to standing."
    ],
    tips: "Keep chest tall and track knees in line with your second toe.",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-08",
    name: "Romanian Deadlift (RDL)",
    category: "legs",
    muscleGroup: "Hamstrings & Glutes",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 110,
    targetMuscles: ["Hamstrings", "Glutes", "Erector Spinae"],
    instructions: [
      "Stand tall holding dumbbells in front of thighs with slight bend in knees.",
      "Hinge hips backwards while gliding dumbbells down along shins.",
      "Feel a deep stretch in hamstrings, then drive hips forward to return up."
    ],
    tips: "Do not squat down; maintain the fixed knee angle and push hips back.",
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-09",
    name: "Leg Press Machine",
    category: "legs",
    muscleGroup: "Legs",
    difficulty: "Beginner",
    equipment: "Machine",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 95,
    targetMuscles: ["Quadriceps", "Glutes", "Calves"],
    instructions: [
      "Sit in machine with back firmly against backrest.",
      "Place feet shoulder-width apart on platform center.",
      "Release safety bars and lower platform until knees reach 90 degrees.",
      "Press platform back up without locking knees at the top."
    ],
    tips: "Never lock knees at full extension to protect joint cartilage.",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-10",
    name: "Standing Dumbbell Overhead Press",
    category: "shoulders",
    muscleGroup: "Deltoids",
    difficulty: "Intermediate",
    equipment: "Dumbbell",
    targetSets: 4,
    targetReps: 10,
    estimatedCaloriesBurn: 90,
    targetMuscles: ["Anterior Deltoids", "Lateral Deltoids", "Triceps", "Traps"],
    instructions: [
      "Stand with feet shoulder-width apart, holding dumbbells at shoulder level.",
      "Press dumbbells directly upward until arms are fully extended overhead.",
      "Lower dumbbells smoothly back to shoulder level."
    ],
    tips: "Engage glutes and core to avoid hyperextending your lower spine.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-11",
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
      "Stand holding dumbbells at your sides with a slight bend in elbows.",
      "Raise arms out to sides until parallel to the floor.",
      "Pause momentarily at the top and lower dumbbells slowly."
    ],
    tips: "Lead with elbows and avoid swinging the torso for momentum.",
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-12",
    name: "Incline Bicep Dumbbell Curl",
    category: "arms",
    muscleGroup: "Biceps",
    difficulty: "Beginner",
    equipment: "Dumbbell",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Biceps Brachii (Long Head)", "Brachialis"],
    instructions: [
      "Sit back on an incline bench angled at 45-60 degrees.",
      "Hold dumbbells with arms extended toward the ground, palms forward.",
      "Curl weights up while keeping upper arms stationary.",
      "Squeeze biceps at the top and lower slowly to full extension."
    ],
    tips: "Incline angle provides maximum stretch on the long head of the bicep.",
    imageUrl: "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-13",
    name: "Tricep Rope Cable Pushdown",
    category: "arms",
    muscleGroup: "Triceps",
    difficulty: "Beginner",
    equipment: "Cable",
    targetSets: 3,
    targetReps: 15,
    estimatedCaloriesBurn: 65,
    targetMuscles: ["Triceps Lateral Head", "Triceps Long Head"],
    instructions: [
      "Attach a rope to high pulley on cable station.",
      "Grip ends of rope, tuck elbows to your sides, and lean slightly forward.",
      "Extend arms downward, spreading rope ends apart at bottom lockout.",
      "Return rope smoothly up to elbow level."
    ],
    tips: "Keep elbows pinned to your ribs throughout the entire movement.",
    imageUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-14",
    name: "Hanging Leg Raises",
    category: "core",
    muscleGroup: "Abs & Core",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 12,
    estimatedCaloriesBurn: 75,
    targetMuscles: ["Rectus Abdominis", "Hip Flexors", "Obliques"],
    instructions: [
      "Hang from a pull-up bar with an overhand grip, arms straight.",
      "Engage core and raise straight legs up until parallel to floor or higher.",
      "Slowly lower legs back down without swinging."
    ],
    tips: "Posteriorly tilt your pelvis at the top to maximally engage lower abs.",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-15",
    name: "Plank to Shoulder Tap",
    category: "core",
    muscleGroup: "Core Stability",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    targetSets: 3,
    targetReps: 20,
    estimatedCaloriesBurn: 60,
    targetMuscles: ["Transverse Abdominis", "Obliques", "Deltoids"],
    instructions: [
      "Start in a high plank position with feet slightly wider than shoulders.",
      "Lift right hand to tap left shoulder while keeping hips completely still.",
      "Place hand down and repeat with left hand tapping right shoulder."
    ],
    tips: "Resist hip rotation; squeeze glutes to keep pelvis level.",
    imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-16",
    name: "HIIT Sprint Intervals",
    category: "cardio",
    muscleGroup: "Full Body Cardio",
    difficulty: "Advanced",
    equipment: "None",
    targetSets: 6,
    targetReps: 1,
    estimatedCaloriesBurn: 200,
    targetMuscles: ["Quadriceps", "Hamstrings", "Calves", "Cardiovascular System"],
    instructions: [
      "Warm up with 3 minutes of light jogging.",
      "Sprint at 90-95% maximum effort for 30 seconds.",
      "Recover with 60 seconds of walking or light jogging.",
      "Repeat for 6 to 8 rounds."
    ],
    tips: "Focus on driving knees high and pumping arms rhythmically.",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-17",
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
      "Stand with feet slightly wider than shoulder-width, kettlebell on ground in front.",
      "Hinge at hips, grip bell, and hike it back between your legs.",
      "Explosively drive hips forward to propel kettlebell to chest height.",
      "Allow bell to swing back naturally and hinge into next rep."
    ],
    tips: "Power comes from explosive hip snap, not lifting with your arms.",
    imageUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "w-18",
    name: "Burpee to Box Jump",
    category: "full-body",
    muscleGroup: "Full Body Conditioning",
    difficulty: "Advanced",
    equipment: "None",
    targetSets: 3,
    targetReps: 10,
    estimatedCaloriesBurn: 150,
    targetMuscles: ["Chest", "Quads", "Glutes", "Core", "Heart"],
    instructions: [
      "Perform a full chest-to-floor burpee.",
      "Jump feet forward into athletic stance facing a plyo box.",
      "Explosively jump onto box, landing softly in a partial squat.",
      "Step down carefully and immediately drop into the next burpee."
    ],
    tips: "Land softly on the box with whole foot on the surface.",
    imageUrl: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=400&q=80"
  }
];
