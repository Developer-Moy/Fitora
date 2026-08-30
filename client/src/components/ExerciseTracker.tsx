"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Play,
  Search,
  Target,
  X,
  Zap,
} from "lucide-react";

type Exercise = {
  id: number;
  name: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  equipment: string;
  muscle: string;
  description: string;
  tips: string[];
  videoId: string;
  image: string;
};

const exercises: Exercise[] = [
  // =========================
  // CHEST
  // =========================
  {
    id: 1,
    name: "BARBELL BENCH PRESS",
    category: "CHEST",
    difficulty: "INTERMEDIATE",
    duration: "12 MIN",
    equipment: "BARBELL",
    muscle: "CHEST",
    description:
      "A foundational upper-body pressing movement for building chest, shoulder, and triceps strength.",
    tips: [
      "Keep your shoulder blades retracted.",
      "Keep your feet firmly planted.",
      "Lower the bar with control.",
      "Press upward while maintaining a stable position.",
    ],
    videoId: "vcBig73ojpE",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 2,
    name: "INCLINE DUMBBELL PRESS",
    category: "CHEST",
    difficulty: "INTERMEDIATE",
    duration: "10 MIN",
    equipment: "DUMBBELLS",
    muscle: "UPPER CHEST",
    description:
      "An incline pressing exercise designed to emphasize the upper portion of the chest.",
    tips: [
      "Set the bench at a moderate incline.",
      "Keep your wrists straight.",
      "Lower the dumbbells slowly.",
      "Press without locking your elbows aggressively.",
    ],
    videoId: "8iPEnn-ltC8",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 3,
    name: "PUSH UP",
    category: "CHEST",
    difficulty: "BEGINNER",
    duration: "06 MIN",
    equipment: "BODYWEIGHT",
    muscle: "CHEST",
    description:
      "A classic bodyweight pushing exercise that trains the chest, shoulders, triceps, and core.",
    tips: [
      "Keep your body in a straight line.",
      "Brace your core.",
      "Lower your chest with control.",
      "Push the floor away from you.",
    ],
    videoId: "IODxDxX7oi4",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 4,
    name: "CABLE FLY",
    category: "CHEST",
    difficulty: "INTERMEDIATE",
    duration: "08 MIN",
    equipment: "CABLE",
    muscle: "CHEST",
    description:
      "A controlled isolation movement that keeps tension on the chest throughout the range of motion.",
    tips: [
      "Keep a slight bend in your elbows.",
      "Move through a controlled range.",
      "Squeeze your chest at the center.",
      "Avoid using momentum.",
    ],
    videoId: "Iwe6AmxVf7o",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 5,
    name: "DUMBBELL FLOOR PRESS",
    category: "CHEST",
    difficulty: "BEGINNER",
    duration: "08 MIN",
    equipment: "DUMBBELLS",
    muscle: "CHEST",
    description:
      "A floor-based pressing movement that develops chest and triceps strength with a limited range of motion.",
    tips: [
      "Keep your upper arms controlled.",
      "Use a neutral wrist position.",
      "Pause briefly at the bottom.",
      "Press evenly with both arms.",
    ],
    videoId: "uUGDRwge4F8",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // BACK
  // =========================
  {
    id: 6,
    name: "DEADLIFT",
    category: "BACK",
    difficulty: "ADVANCED",
    duration: "15 MIN",
    equipment: "BARBELL",
    muscle: "FULL BODY",
    description:
      "A powerful compound lift that develops the posterior chain and total-body strength.",
    tips: [
      "Keep the bar close to your legs.",
      "Brace your core before lifting.",
      "Maintain a neutral spine.",
      "Drive your hips forward at the top.",
    ],
    videoId: "op9kVnSso6Q",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 7,
    name: "PULL UP",
    category: "BACK",
    difficulty: "ADVANCED",
    duration: "10 MIN",
    equipment: "PULL-UP BAR",
    muscle: "LATS",
    description:
      "A bodyweight pulling movement that develops the lats, upper back, and arms.",
    tips: [
      "Start from a controlled hang.",
      "Pull your elbows toward your sides.",
      "Avoid excessive swinging.",
      "Lower yourself slowly.",
    ],
    videoId: "eGo4IYlbE5g",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 8,
    name: "LAT PULLDOWN",
    category: "BACK",
    difficulty: "BEGINNER",
    duration: "10 MIN",
    equipment: "CABLE",
    muscle: "LATS",
    description:
      "A machine-based pulling exercise that helps develop the lats and upper back.",
    tips: [
      "Keep your chest lifted.",
      "Pull toward your upper chest.",
      "Avoid leaning excessively backward.",
      "Control the return.",
    ],
    videoId: "CAwf7n6Luuc",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 9,
    name: "BARBELL ROW",
    category: "BACK",
    difficulty: "INTERMEDIATE",
    duration: "12 MIN",
    equipment: "BARBELL",
    muscle: "UPPER BACK",
    description:
      "A compound rowing exercise for developing the upper back, lats, and posterior shoulders.",
    tips: [
      "Keep your spine neutral.",
      "Hinge at the hips.",
      "Pull the bar toward your torso.",
      "Avoid shrugging your shoulders.",
    ],
    videoId: "FWJR5Ve8bnQ",
    image:
      "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 10,
    name: "SEATED CABLE ROW",
    category: "BACK",
    difficulty: "BEGINNER",
    duration: "09 MIN",
    equipment: "CABLE",
    muscle: "MID BACK",
    description:
      "A controlled horizontal pulling movement for building mid-back strength and posture.",
    tips: [
      "Sit tall throughout the movement.",
      "Pull toward your abdomen.",
      "Squeeze your shoulder blades.",
      "Return the handle slowly.",
    ],
    videoId: "GZbfZ033f74",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // LEGS
  // =========================
  {
    id: 11,
    name: "BARBELL SQUAT",
    category: "LEGS",
    difficulty: "INTERMEDIATE",
    duration: "12 MIN",
    equipment: "BARBELL",
    muscle: "QUADRICEPS",
    description:
      "A fundamental lower-body movement for developing leg strength, stability, and power.",
    tips: [
      "Keep your chest up.",
      "Brace your core.",
      "Track your knees over your toes.",
      "Drive through your feet.",
    ],
    videoId: "aclHkVaku9U",
    image:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 12,
    name: "LEG PRESS",
    category: "LEGS",
    difficulty: "BEGINNER",
    duration: "10 MIN",
    equipment: "MACHINE",
    muscle: "QUADRICEPS",
    description:
      "A machine-based lower-body exercise that targets the quads, glutes, and hamstrings.",
    tips: [
      "Keep your lower back supported.",
      "Position your feet comfortably.",
      "Lower the platform with control.",
      "Avoid locking your knees aggressively.",
    ],
    videoId: "IZxyjW7MPJQ",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 13,
    name: "ROMANIAN DEADLIFT",
    category: "LEGS",
    difficulty: "INTERMEDIATE",
    duration: "12 MIN",
    equipment: "BARBELL",
    muscle: "HAMSTRINGS",
    description:
      "A hip-hinge movement focused on the hamstrings, glutes, and posterior chain.",
    tips: [
      "Push your hips backward.",
      "Keep the bar close.",
      "Maintain a neutral spine.",
      "Stop when your hamstrings are fully loaded.",
    ],
    videoId: "JCXUYuzwNrM",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 14,
    name: "WALKING LUNGE",
    category: "LEGS",
    difficulty: "BEGINNER",
    duration: "08 MIN",
    equipment: "BODYWEIGHT",
    muscle: "GLUTES",
    description:
      "A unilateral lower-body movement that improves leg strength, balance, and coordination.",
    tips: [
      "Take controlled steps.",
      "Keep your torso upright.",
      "Lower your back knee toward the floor.",
      "Push through your front foot.",
    ],
    videoId: "L8fvypPrzzs",
    image:
      "https://images.unsplash.com/photo-1434608519344-49d77a699ded?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 15,
    name: "BULGARIAN SPLIT SQUAT",
    category: "LEGS",
    difficulty: "ADVANCED",
    duration: "10 MIN",
    equipment: "DUMBBELLS",
    muscle: "GLUTES",
    description:
      "A challenging unilateral exercise that develops leg strength, balance, and stability.",
    tips: [
      "Keep your front foot stable.",
      "Lower under control.",
      "Keep your torso slightly forward.",
      "Drive through the front foot.",
    ],
    videoId: "2C-uNgKwPLE",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 16,
    name: "LEG EXTENSION",
    category: "LEGS",
    difficulty: "BEGINNER",
    duration: "07 MIN",
    equipment: "MACHINE",
    muscle: "QUADRICEPS",
    description:
      "An isolation exercise designed to directly target the quadriceps.",
    tips: [
      "Adjust the machine correctly.",
      "Keep your hips against the seat.",
      "Extend smoothly.",
      "Control the lowering phase.",
    ],
    videoId: "YyvSfVjQeL0",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 17,
    name: "CALF RAISE",
    category: "LEGS",
    difficulty: "BEGINNER",
    duration: "06 MIN",
    equipment: "MACHINE",
    muscle: "CALVES",
    description:
      "An isolation movement that strengthens and develops the calf muscles.",
    tips: [
      "Use a full range of motion.",
      "Pause at the top.",
      "Lower your heels slowly.",
      "Avoid bouncing.",
    ],
    videoId: "gwLzBJYoWlI",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // ARMS
  // =========================
  {
    id: 18,
    name: "DUMBBELL CURL",
    category: "ARMS",
    difficulty: "BEGINNER",
    duration: "08 MIN",
    equipment: "DUMBBELLS",
    muscle: "BICEPS",
    description:
      "A simple isolation movement for developing biceps strength and arm control.",
    tips: [
      "Keep your elbows close.",
      "Avoid swinging.",
      "Control the lowering phase.",
      "Squeeze at the top.",
    ],
    videoId: "ykJmrZ5v0Oo",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 19,
    name: "HAMMER CURL",
    category: "ARMS",
    difficulty: "BEGINNER",
    duration: "08 MIN",
    equipment: "DUMBBELLS",
    muscle: "BICEPS",
    description:
      "A neutral-grip curl that trains the biceps, brachialis, and forearms.",
    tips: [
      "Keep palms facing inward.",
      "Keep elbows stable.",
      "Curl without swinging.",
      "Lower with control.",
    ],
    videoId: "zC3nLlEvin4",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 20,
    name: "TRICEP PUSHDOWN",
    category: "ARMS",
    difficulty: "BEGINNER",
    duration: "07 MIN",
    equipment: "CABLE",
    muscle: "TRICEPS",
    description:
      "A cable isolation movement designed to strengthen and develop the triceps.",
    tips: [
      "Keep your elbows close.",
      "Push the handle downward.",
      "Avoid moving your shoulders.",
      "Control the return.",
    ],
    videoId: "2-LAMcpzODU",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 21,
    name: "SKULL CRUSHER",
    category: "ARMS",
    difficulty: "INTERMEDIATE",
    duration: "09 MIN",
    equipment: "EZ BAR",
    muscle: "TRICEPS",
    description:
      "A lying triceps exercise that emphasizes elbow extension and arm strength.",
    tips: [
      "Keep your upper arms stable.",
      "Lower the bar slowly.",
      "Avoid excessive elbow flare.",
      "Extend your arms smoothly.",
    ],
    videoId: "d_KZxkY_0cM",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 22,
    name: "PREACHER CURL",
    category: "ARMS",
    difficulty: "INTERMEDIATE",
    duration: "08 MIN",
    equipment: "EZ BAR",
    muscle: "BICEPS",
    description:
      "A supported curl variation that minimizes momentum and focuses on the biceps.",
    tips: [
      "Keep your upper arms supported.",
      "Use controlled repetitions.",
      "Avoid fully relaxing at the bottom.",
      "Squeeze the biceps at the top.",
    ],
    videoId: "fIWP-FRFNU0",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // SHOULDERS
  // =========================
  {
    id: 23,
    name: "OVERHEAD PRESS",
    category: "SHOULDERS",
    difficulty: "INTERMEDIATE",
    duration: "10 MIN",
    equipment: "BARBELL",
    muscle: "SHOULDERS",
    description:
      "A compound pressing exercise that develops shoulder strength and upper-body stability.",
    tips: [
      "Brace your core.",
      "Keep your wrists stacked.",
      "Press directly overhead.",
      "Avoid excessive back arching.",
    ],
    videoId: "2yjwXTZQDDI",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 24,
    name: "DUMBBELL SHOULDER PRESS",
    category: "SHOULDERS",
    difficulty: "BEGINNER",
    duration: "09 MIN",
    equipment: "DUMBBELLS",
    muscle: "SHOULDERS",
    description:
      "A dumbbell pressing movement for building balanced shoulder strength.",
    tips: [
      "Keep your back supported.",
      "Press evenly with both arms.",
      "Keep your wrists neutral.",
      "Lower the dumbbells slowly.",
    ],
    videoId: "qEwKCR5JCog",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 25,
    name: "LATERAL RAISE",
    category: "SHOULDERS",
    difficulty: "BEGINNER",
    duration: "07 MIN",
    equipment: "DUMBBELLS",
    muscle: "SIDE DELTS",
    description:
      "An isolation movement that targets the lateral deltoids and builds shoulder width.",
    tips: [
      "Use light controlled weights.",
      "Keep a slight bend in your elbows.",
      "Raise to approximately shoulder height.",
      "Avoid swinging.",
    ],
    videoId: "3VcKaXpzqRo",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 26,
    name: "FRONT RAISE",
    category: "SHOULDERS",
    difficulty: "BEGINNER",
    duration: "07 MIN",
    equipment: "DUMBBELLS",
    muscle: "FRONT DELTS",
    description:
      "A controlled shoulder isolation exercise that emphasizes the front deltoids.",
    tips: [
      "Keep your core engaged.",
      "Raise the dumbbells with control.",
      "Avoid using momentum.",
      "Stop around shoulder height.",
    ],
    videoId: "3VcKaXpzqRo",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 27,
    name: "FACE PULL",
    category: "SHOULDERS",
    difficulty: "BEGINNER",
    duration: "07 MIN",
    equipment: "CABLE",
    muscle: "REAR DELTS",
    description:
      "A cable exercise that trains the rear shoulders and upper-back stabilizers.",
    tips: [
      "Pull toward your face.",
      "Keep elbows high.",
      "Rotate your hands outward.",
      "Control every repetition.",
    ],
    videoId: "rep-qVOkqgk",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // CORE
  // =========================
  {
    id: 28,
    name: "PLANK",
    category: "CORE",
    difficulty: "BEGINNER",
    duration: "05 MIN",
    equipment: "BODYWEIGHT",
    muscle: "CORE",
    description:
      "An isometric exercise that develops core stability and endurance.",
    tips: [
      "Keep your hips level.",
      "Squeeze your glutes.",
      "Keep your neck neutral.",
      "Breathe consistently.",
    ],
    videoId: "pSHjTRCQxIw",
    image:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 29,
    name: "HANGING LEG RAISE",
    category: "CORE",
    difficulty: "ADVANCED",
    duration: "08 MIN",
    equipment: "PULL-UP BAR",
    muscle: "LOWER ABS",
    description:
      "A challenging core movement that develops abdominal strength and grip endurance.",
    tips: [
      "Avoid excessive swinging.",
      "Brace your core.",
      "Raise your legs under control.",
      "Lower slowly.",
    ],
    videoId: "Pr1ieGZ5atk",
    image:
      "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 30,
    name: "BICYCLE CRUNCH",
    category: "CORE",
    difficulty: "BEGINNER",
    duration: "06 MIN",
    equipment: "BODYWEIGHT",
    muscle: "ABS",
    description:
      "A dynamic abdominal exercise combining trunk flexion and rotation.",
    tips: [
      "Move slowly.",
      "Rotate through your torso.",
      "Avoid pulling your neck.",
      "Fully extend each leg.",
    ],
    videoId: "9FGilxCbdz8",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 31,
    name: "RUSSIAN TWIST",
    category: "CORE",
    difficulty: "INTERMEDIATE",
    duration: "07 MIN",
    equipment: "BODYWEIGHT",
    muscle: "OBLIQUES",
    description:
      "A rotational core exercise that emphasizes the abdominal and oblique muscles.",
    tips: [
      "Keep your chest lifted.",
      "Rotate through your torso.",
      "Move under control.",
      "Avoid excessive momentum.",
    ],
    videoId: "wkD8rjkodUI",
    image:
      "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 32,
    name: "MOUNTAIN CLIMBER",
    category: "CORE",
    difficulty: "INTERMEDIATE",
    duration: "06 MIN",
    equipment: "BODYWEIGHT",
    muscle: "CORE",
    description:
      "A dynamic bodyweight exercise that combines core stability with cardiovascular conditioning.",
    tips: [
      "Keep your shoulders over your hands.",
      "Maintain a stable torso.",
      "Drive knees forward.",
      "Keep your movement controlled.",
    ],
    videoId: "nmwgirgXLYM",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // GLUTES
  // =========================
  {
    id: 33,
    name: "HIP THRUST",
    category: "GLUTES",
    difficulty: "INTERMEDIATE",
    duration: "10 MIN",
    equipment: "BARBELL",
    muscle: "GLUTES",
    description:
      "A powerful hip-extension exercise designed to develop glute strength and size.",
    tips: [
      "Keep your upper back supported.",
      "Drive through your heels.",
      "Squeeze your glutes at the top.",
      "Avoid excessive lower-back extension.",
    ],
    videoId: "SEdqd1n0cvg",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 34,
    name: "GLUTE BRIDGE",
    category: "GLUTES",
    difficulty: "BEGINNER",
    duration: "07 MIN",
    equipment: "BODYWEIGHT",
    muscle: "GLUTES",
    description:
      "A beginner-friendly hip-extension movement that activates the glutes and posterior chain.",
    tips: [
      "Keep your feet planted.",
      "Brace your core.",
      "Drive through your heels.",
      "Pause at the top.",
    ],
    videoId: "wPM8icPu6H8",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 35,
    name: "CABLE KICKBACK",
    category: "GLUTES",
    difficulty: "BEGINNER",
    duration: "08 MIN",
    equipment: "CABLE",
    muscle: "GLUTES",
    description:
      "An isolation exercise that targets the glutes through controlled hip extension.",
    tips: [
      "Keep your torso stable.",
      "Move your leg backward under control.",
      "Squeeze your glute.",
      "Avoid arching your back.",
    ],
    videoId: "SJ1Xuz9D-ZQ",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // FULL BODY
  // =========================
  {
    id: 36,
    name: "BURPEE",
    category: "FULL BODY",
    difficulty: "INTERMEDIATE",
    duration: "08 MIN",
    equipment: "BODYWEIGHT",
    muscle: "FULL BODY",
    description:
      "A high-intensity bodyweight movement combining strength, coordination, and cardiovascular conditioning.",
    tips: [
      "Keep your core engaged.",
      "Land softly.",
      "Maintain a controlled pace.",
      "Scale the movement when needed.",
    ],
    videoId: "TU8QYVW0gDU",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 37,
    name: "KETTLEBELL SWING",
    category: "FULL BODY",
    difficulty: "INTERMEDIATE",
    duration: "08 MIN",
    equipment: "KETTLEBELL",
    muscle: "FULL BODY",
    description:
      "A powerful hip-hinge movement that develops explosive strength and conditioning.",
    tips: [
      "Drive the movement with your hips.",
      "Keep your back neutral.",
      "Do not squat excessively.",
      "Control the kettlebell path.",
    ],
    videoId: "YSxHifyI6s8",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 38,
    name: "THRUSTER",
    category: "FULL BODY",
    difficulty: "ADVANCED",
    duration: "10 MIN",
    equipment: "DUMBBELLS",
    muscle: "FULL BODY",
    description:
      "A compound movement combining a squat and overhead press for total-body conditioning.",
    tips: [
      "Keep your core braced.",
      "Use your legs to initiate the press.",
      "Keep the dumbbells controlled.",
      "Maintain a steady rhythm.",
    ],
    videoId: "L219ltL15zk",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 39,
    name: "DUMBBELL CLEAN",
    category: "FULL BODY",
    difficulty: "ADVANCED",
    duration: "09 MIN",
    equipment: "DUMBBELLS",
    muscle: "FULL BODY",
    description:
      "An explosive full-body movement that develops coordination, power, and athletic performance.",
    tips: [
      "Generate power from your hips.",
      "Keep the dumbbells close.",
      "Catch them in a stable position.",
      "Practice technique before increasing weight.",
    ],
    videoId: "OZTiJ7i3j1A",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 40,
    name: "MAN MAKER",
    category: "FULL BODY",
    difficulty: "ADVANCED",
    duration: "12 MIN",
    equipment: "DUMBBELLS",
    muscle: "FULL BODY",
    description:
      "A demanding full-body movement combining multiple strength patterns into one exercise.",
    tips: [
      "Use a manageable weight.",
      "Keep your core stable.",
      "Control every transition.",
      "Focus on movement quality.",
    ],
    videoId: "uZfZ5d1XK5U",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // CARDIO
  // =========================
  {
    id: 41,
    name: "JUMPING JACK",
    category: "CARDIO",
    difficulty: "BEGINNER",
    duration: "05 MIN",
    equipment: "BODYWEIGHT",
    muscle: "FULL BODY",
    description:
      "A simple cardiovascular movement useful for warming up and increasing heart rate.",
    tips: [
      "Land softly.",
      "Keep a steady rhythm.",
      "Stay light on your feet.",
      "Breathe consistently.",
    ],
    videoId: "c4DAnQ6DtF8",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 42,
    name: "HIGH KNEES",
    category: "CARDIO",
    difficulty: "BEGINNER",
    duration: "06 MIN",
    equipment: "BODYWEIGHT",
    muscle: "FULL BODY",
    description:
      "A high-energy cardio drill that improves coordination and cardiovascular endurance.",
    tips: [
      "Keep your chest upright.",
      "Drive your knees upward.",
      "Pump your arms naturally.",
      "Maintain a consistent pace.",
    ],
    videoId: "ZZeO1B8YjT0",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 43,
    name: "JUMP ROPE",
    category: "CARDIO",
    difficulty: "INTERMEDIATE",
    duration: "10 MIN",
    equipment: "JUMP ROPE",
    muscle: "FULL BODY",
    description:
      "A rhythmic cardiovascular exercise that improves conditioning, coordination, and footwork.",
    tips: [
      "Keep your jumps low.",
      "Rotate the rope with your wrists.",
      "Stay relaxed.",
      "Land softly on the balls of your feet.",
    ],
    videoId: "1BZM2Vre5oc",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 44,
    name: "BOX JUMP",
    category: "CARDIO",
    difficulty: "ADVANCED",
    duration: "08 MIN",
    equipment: "BOX",
    muscle: "LEGS",
    description:
      "An explosive plyometric movement that develops lower-body power and coordination.",
    tips: [
      "Choose an appropriate box height.",
      "Land softly.",
      "Stand fully on the box.",
      "Step down when possible.",
    ],
    videoId: "52r_Ul5k03g",
    image:
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // MOBILITY
  // =========================
  {
    id: 45,
    name: "HIP FLEXOR STRETCH",
    category: "MOBILITY",
    difficulty: "BEGINNER",
    duration: "05 MIN",
    equipment: "BODYWEIGHT",
    muscle: "HIP FLEXORS",
    description:
      "A mobility drill designed to improve hip flexibility and reduce stiffness.",
    tips: [
      "Keep your torso upright.",
      "Tuck your pelvis slightly.",
      "Move into the stretch gradually.",
      "Never force the range.",
    ],
    videoId: "YQmpZ4VQz1Y",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 46,
    name: "WORLD'S GREATEST STRETCH",
    category: "MOBILITY",
    difficulty: "BEGINNER",
    duration: "06 MIN",
    equipment: "BODYWEIGHT",
    muscle: "FULL BODY",
    description:
      "A dynamic mobility sequence targeting the hips, hamstrings, spine, and shoulders.",
    tips: [
      "Move slowly between positions.",
      "Keep your breathing relaxed.",
      "Avoid forcing the stretch.",
      "Repeat on both sides.",
    ],
    videoId: "2S6V2c8R2mM",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 47,
    name: "CAT COW",
    category: "MOBILITY",
    difficulty: "BEGINNER",
    duration: "05 MIN",
    equipment: "BODYWEIGHT",
    muscle: "SPINE",
    description:
      "A gentle mobility movement that improves spinal movement and body awareness.",
    tips: [
      "Move with your breathing.",
      "Use a comfortable range.",
      "Keep your hands under your shoulders.",
      "Move smoothly between positions.",
    ],
    videoId: "kqnua4rHVVA",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
  },

  // =========================
  // FUNCTIONAL
  // =========================
  {
    id: 48,
    name: "FARMER'S WALK",
    category: "FUNCTIONAL",
    difficulty: "INTERMEDIATE",
    duration: "08 MIN",
    equipment: "DUMBBELLS",
    muscle: "FULL BODY",
    description:
      "A loaded carry that develops grip strength, core stability, posture, and total-body endurance.",
    tips: [
      "Stand tall.",
      "Keep your shoulders down.",
      "Take controlled steps.",
      "Brace your core throughout.",
    ],
    videoId: "Fkzk_RqlYig",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 49,
    name: "BATTLE ROPE SLAM",
    category: "FUNCTIONAL",
    difficulty: "INTERMEDIATE",
    duration: "07 MIN",
    equipment: "BATTLE ROPE",
    muscle: "FULL BODY",
    description:
      "A high-intensity conditioning exercise that develops power, endurance, and upper-body coordination.",
    tips: [
      "Use your whole body.",
      "Keep your core braced.",
      "Maintain a stable stance.",
      "Work in controlled intervals.",
    ],
    videoId: "w9p7a4k8k9E",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 50,
    name: "SLED PUSH",
    category: "FUNCTIONAL",
    difficulty: "ADVANCED",
    duration: "10 MIN",
    equipment: "SLED",
    muscle: "FULL BODY",
    description:
      "A demanding functional conditioning exercise that develops lower-body drive and work capacity.",
    tips: [
      "Keep your body at a strong angle.",
      "Drive through the floor.",
      "Take short powerful steps.",
      "Maintain steady pressure.",
    ],
    videoId: "J0rK6Z2mX8Q",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  },
];

const categories = [
  "ALL",
  "CHEST",
  "BACK",
  "LEGS",
  "ARMS",
  "SHOULDERS",
  "CORE",
  "GLUTES",
  "FULL BODY",
  "CARDIO",
  "MOBILITY",
  "FUNCTIONAL",
];

export default function ExercisePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesCategory =
        activeCategory === "ALL" || exercise.category === activeCategory;

      const matchesSearch =
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);

  const paginatedExercises = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExercises.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExercises, currentPage]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* =====================================================
          EXERCISE LIBRARY HEADER (ULTRA MINIMAL & COMPACT WITH PUBLIC BG)
      ====================================================== */}
      <section
        id="exercise-library"
        className="relative pt-6 pb-2 overflow-hidden border-b border-white/10 select-none"
      >
        {/* Background Image from public folder */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.35] contrast-110 z-0 transition-all duration-300"
          style={{
            backgroundImage: "url('/trainer-banner-bg-wide.jpg')",
          }}
        />
        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Top Title & Search Bar Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/40">
                  EXERCISE LIBRARY
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
                All Exercises & PR Studio
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="SEARCH EXERCISES..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-neutral-900 border border-white/15 rounded-full py-2.5 pl-11 pr-5 text-xs font-bold tracking-wider text-white placeholder:text-gray-400 outline-none focus:border-white transition shadow-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto py-8 scrollbar-hide">
            {categories.map((category) => {
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap px-5 py-3 rounded-full text-[10px] font-black tracking-wider transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-white text-black border border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.02]"
                      : "bg-neutral-900 border border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* 3x3 Exercise Grid (9 Cards Per Page) */}
          {paginatedExercises.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedExercises.map((exercise, index) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                    onClick={() => setSelectedExercise(exercise)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-12 pb-4 select-none">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(p - 1, 1));
                      document
                        .getElementById("exercise-library")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-xs font-bold text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>

                  {/* Page Number Buttons */}
                  <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            document
                              .getElementById("exercise-library")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`w-9 h-9 rounded-full text-xs font-extrabold transition cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-white text-black font-black shadow-lg scale-105"
                              : "bg-neutral-900 text-gray-400 hover:text-white border border-white/10 hover:border-white/30"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.min(p + 1, totalPages));
                      document
                        .getElementById("exercise-library")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900 text-xs font-bold text-white hover:bg-white hover:text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-24 text-center border border-white/10 rounded-2xl">
              <p className="text-white/40 text-sm font-bold uppercase tracking-wider">
                No exercises found
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          EXERCISE MODAL
      ====================================================== */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </main>
  );
}

/* ============================================================
   EXERCISE CARD
============================================================ */

function ExerciseCard({
  exercise,
  index,
  onClick,
}: {
  exercise: Exercise;
  index: number;
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
      className="group relative min-h-[380px] sm:min-h-[420px] overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-xl"
    >
      {/* Image */}
      <img
        src={imgSrc}
        alt=""
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

      {/* Number */}
      <div className="absolute top-5 left-5">
        <span className="bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Play */}
      <div className="absolute top-5 right-5">
        <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
          <Play className="w-4 h-4 fill-black ml-0.5" />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 rounded-full border border-white/20 bg-black/50 text-[9px] font-bold tracking-wider">
            {exercise.category}
          </span>

          <span className="px-3 py-1.5 rounded-full border border-white/20 bg-black/50 text-[9px] font-bold tracking-wider">
            {exercise.difficulty}
          </span>
        </div>

        <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
          {exercise.name}
        </h3>

        <div className="flex flex-wrap items-center gap-4 mt-5 text-white/50">
          <span className="flex items-center gap-2 text-[10px] font-bold">
            <Clock3 className="w-4 h-4" />
            {exercise.duration}
          </span>

          <span className="flex items-center gap-2 text-[10px] font-bold">
            <Dumbbell className="w-4 h-4" />
            {exercise.equipment}
          </span>

          <span className="flex items-center gap-2 text-[10px] font-bold">
            <Target className="w-4 h-4" />
            {exercise.muscle}
          </span>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          className="group/btn inline-flex items-center gap-2 mt-6 text-xs font-black uppercase tracking-wider"
        >
          WATCH TECHNIQUE
          <span className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition">
            <ArrowUpRight className="w-3 h-3 group-hover/btn:rotate-45 transition-transform" />
          </span>
        </button>
      </div>
    </article>
  );
}

{
  /* EXERCISE MODAL */
}

function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
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
          overflow-y-auto overscroll-contain
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
              RESPONSIVE 50/50 LAYOUT: VIDEO + METADATA (LEFT) & TITLE + TIPS (RIGHT)
          ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* LEFT COLUMN (50% Width) - Video Player & 3 Metadata Info Boxes */}
            <div className="space-y-4">
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

            {/* RIGHT COLUMN (50% Width) - Badges, Exercise Title, Description, Technique Tips & CTA */}
            <div className="space-y-5">
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

              {/* Start Exercise CTA Button */}
              <button
                type="button"
                onClick={onClose}
                className="group w-full inline-flex items-center justify-center gap-2.5 bg-white text-black font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl cursor-pointer"
              >
                <span>START THIS EXERCISE</span>
                <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INFO BOX
============================================================ */

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
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4">
      <div className="text-white/35 mb-3">
        <span className="w-4 h-4 block [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      </div>

      <p className="text-[8px] font-bold tracking-[0.2em] text-white/30">
        {label}
      </p>

      <p className="text-[10px] sm:text-xs font-black uppercase mt-1">
        {value}
      </p>
    </div>
  );
}
