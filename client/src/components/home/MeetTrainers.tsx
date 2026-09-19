"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Award,
  Target,
  BookOpen,
  Quote,
  Info,
  ChevronRight,
  User,
  Star,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface Trainer {
  _id: string;
  name: string;
  role?: string; // Old schema
  designation?: string; // New schema
  image?: string; // Old schema
  photo?: string; // New schema
  bio: string;
  experience?: number; // Old schema
  experienceYears?: number; // New schema
  certifications: string[];
  specialties?: string[]; // Old schema
  specializations?: string[]; // New schema
  philosophy?: string; // Old schema
  about?: string; // New schema
  earlyLife?: string;
  education?: string[];
  careerHighlights?: string[]; // Old schema
  achievements?: string[]; // New schema
}

const DEFAULT_TRAINERS: Trainer[] = [
  {
    _id: "trainer-1",
    name: "Elena Rostova",
    designation: "Strength & Conditioning Specialist",
    role: "Strength & Conditioning Specialist",
    photo: "/image3.jpg.jpeg",
    image: "/image3.jpg.jpeg",
    bio: "Elena Rostova is a former Olympic lifter who transformed her passion for heavy iron into a lifelong career of coaching elite athletes. With a degree in Kinesiology and a relentless drive, she builds programs that prioritize functional strength and injury prevention. She has dedicated over a decade to perfecting the biomechanics of raw strength.",
    about:
      "Elena Rostova is a former Olympic lifter who transformed her passion for heavy iron into a lifelong career of coaching elite athletes. With a degree in Kinesiology and a relentless drive, she builds programs that prioritize functional strength and injury prevention.",
    experienceYears: 12,
    experience: 12,
    certifications: ["CSCS", "USA Weightlifting Level 2", "CrossFit Level 3"],
    specializations: [
      "Olympic Lifting",
      "Powerlifting",
      "Functional Hypertrophy",
    ],
    specialties: ["Olympic Lifting", "Powerlifting", "Functional Hypertrophy"],
    philosophy: "Strength is never a weakness, and weakness is never a choice.",
    earlyLife:
      "Born in St. Petersburg, Elena began her athletic career in gymnastics before transitioning to Olympic weightlifting at age 14. Her early exposure to rigorous Soviet-era training methodologies shaped her disciplined approach to coaching.",
    achievements: [
      "2014 European Weightlifting Champion (63kg)",
      "Coached 3 athletes to the CrossFit Games",
      "Published author of 'The Iron Blueprint'",
    ],
    careerHighlights: [
      "2014 European Weightlifting Champion (63kg)",
      "Coached 3 athletes to the CrossFit Games",
      "Published author of 'The Iron Blueprint'",
    ],
  },
  {
    _id: "trainer-2",
    name: "David Miller",
    designation: "Olympic Lifting Specialist",
    role: "Olympic Lifting Specialist",
    photo: "/image2.jpg.jpeg",
    image: "/image2.jpg.jpeg",
    bio: "David Miller combines biomechanics with practical training to produce staggering results. He has trained collegiate athletes and professional competitors, focusing heavily on mobility before loading. His meticulous attention to form ensures longevity in the sport.",
    about:
      "David Miller combines biomechanics with practical training to produce staggering results. He has trained collegiate athletes and professional competitors, focusing heavily on mobility before loading.",
    experienceYears: 8,
    experience: 8,
    certifications: ["NASM-CPT", "FMS Level 1", "USAW Level 1"],
    specializations: ["Biomechanics", "Mobility", "Sports Conditioning"],
    specialties: ["Biomechanics", "Mobility", "Sports Conditioning"],
    philosophy:
      "Move well before you move heavy. Mechanics dictate performance.",
    earlyLife:
      "David grew up in Texas playing Division 1 football. After a career-ending ACL injury, he dedicated his life to physical therapy and sports conditioning to help others avoid preventable injuries.",
    achievements: [
      "Head Strength Coach for Texas A&M Athletics",
      "Developed the 'Miller Mobility Protocol'",
      "Over 500+ athletes successfully rehabilitated",
    ],
    careerHighlights: [
      "Head Strength Coach for Texas A&M Athletics",
      "Developed the 'Miller Mobility Protocol'",
      "Over 500+ athletes successfully rehabilitated",
    ],
  },
  {
    _id: "trainer-3",
    name: "Sophia Thorne",
    designation: "Bodybuilding & Nutrition Coach",
    role: "Bodybuilding & Nutrition Coach",
    photo: "/image1.jpg.jpeg",
    image: "/image1.jpg.jpeg",
    bio: "An IFBB Pro and certified sports nutritionist, Sophia knows exactly what it takes to build a stage-ready physique. She takes a scientific approach to macros and micro-cycles, manipulating physiological variables to achieve peak physical condition.",
    about:
      "An IFBB Pro and certified sports nutritionist, Sophia knows exactly what it takes to build a stage-ready physique. She takes a scientific approach to macros and micro-cycles, manipulating physiological variables to achieve peak physical condition.",
    experienceYears: 10,
    experience: 10,
    certifications: ["Precision Nutrition Level 2", "ISSA Master Trainer"],
    specializations: ["Hypertrophy", "Contest Prep", "Macro Coaching"],
    specialties: ["Hypertrophy", "Contest Prep", "Macro Coaching"],
    philosophy:
      "You can't out-train a bad diet, but you can build a masterpiece with the right fuel.",
    earlyLife:
      "Sophia struggled with metabolic issues in her late teens, which sparked her obsession with nutritional science. She earned her master's degree in Dietetics from UCLA.",
    achievements: [
      "IFBB Pro Card winner in 2018",
      "Featured in Muscle & Fitness Magazine",
      "Formulated a highly successful line of vegan supplements",
    ],
    careerHighlights: [
      "IFBB Pro Card winner in 2018",
      "Featured in Muscle & Fitness Magazine",
      "Formulated a highly successful line of vegan supplements",
    ],
  },
  {
    _id: "trainer-4",
    name: "Jason Statham",
    designation: "Deadlift & Powerlifting Coach",
    role: "Deadlift & Powerlifting Coach",
    photo: "/image4.jpg.jpeg",
    image: "/image4.jpg.jpeg",
    bio: "Known for his explosive power and no-nonsense coaching style, Jason helps lifters break past their plateaus. If you want to add 50lbs to your deadlift, he is your guy. He believes in maximal effort lifting and nervous system adaptation.",
    about:
      "Known for his explosive power and no-nonsense coaching style, Jason helps lifters break past their plateaus. If you want to add 50lbs to your deadlift, he is your guy.",
    experienceYears: 15,
    experience: 15,
    certifications: ["Westside Barbell Certified", "RTS Level 1"],
    specializations: ["Powerlifting", "Grip Strength", "Max Effort Training"],
    specialties: ["Powerlifting", "Grip Strength", "Max Effort Training"],
    philosophy:
      "Grip it and rip it. The barbell doesn't care about your feelings.",
    earlyLife:
      "A former underground powerlifter from London, Jason spent years training in grit-and-chalk garage gyms before bringing his brutal but effective methods to the mainstream.",
    achievements: [
      "Holds a state record 800lb deadlift",
      "Owner of the notorious 'Iron Dungeon' gym",
      "Coached multiple WPO world record holders",
    ],
    careerHighlights: [
      "Holds a state record 800lb deadlift",
      "Owner of the notorious 'Iron Dungeon' gym",
      "Coached multiple WPO world record holders",
    ],
  },
  {
    _id: "trainer-5",
    name: "Maya Lin",
    designation: "Yoga & Mindfulness Instructor",
    role: "Yoga & Mindfulness Instructor",
    photo: "/image7.jpg.jpeg",
    image: "/image7.jpg.jpeg",
    bio: "Maya seamlessly blends ancient yogic philosophies with modern anatomical science. She focuses on breathwork, functional flexibility, and mental resilience, helping athletes recover faster and perform with a clear mind.",
    about:
      "Maya seamlessly blends ancient yogic philosophies with modern anatomical science. She focuses on breathwork, functional flexibility, and mental resilience, helping athletes recover faster and perform with a clear mind.",
    experienceYears: 9,
    experience: 9,
    certifications: [
      "E-RYT 500",
      "Yoga Alliance Certified",
      "Mindfulness-Based Stress Reduction (MBSR)",
    ],
    specializations: [
      "Vinyasa Flow",
      "Active Recovery",
      "Breathwork (Pranayama)",
    ],
    specialties: ["Vinyasa Flow", "Active Recovery", "Breathwork (Pranayama)"],
    philosophy: "Flexibility of the body begins with flexibility of the mind.",
    earlyLife:
      "Raised in a monastic community in Northern India, Maya moved to the US in her twenties to bridge the gap between spiritual wellness and high-performance athletics.",
    achievements: [
      "Lead instructor at the annual Sedona Wellness Retreat",
      "Consultant for NBA players on active recovery",
      "Author of 'The Mindful Athlete'",
    ],
    careerHighlights: [
      "Lead instructor at the annual Sedona Wellness Retreat",
      "Consultant for NBA players on active recovery",
      "Author of 'The Mindful Athlete'",
    ],
  },
  {
    _id: "trainer-6",
    name: "Marcus Cole",
    designation: "HIIT & Combat Conditioning",
    role: "HIIT & Combat Conditioning",
    photo: "/image6.jpg.jpeg",
    image: "/image6.jpg.jpeg",
    bio: "Marcus is a former MMA fighter who brings the intensity of the octagon to the gym floor. His high-intensity interval training (HIIT) sessions are legendary for pushing clients to their absolute cardiovascular limits.",
    about:
      "Marcus is a former MMA fighter who brings the intensity of the octagon to the gym floor. His high-intensity interval training (HIIT) sessions are legendary for pushing clients to their absolute cardiovascular limits.",
    experienceYears: 11,
    experience: 11,
    certifications: [
      "ACE-CPT",
      "Kettlebell Athletics Level 2",
      "Muay Thai Kru",
    ],
    specializations: ["HIIT", "Combat Conditioning", "Fat Loss"],
    specialties: ["HIIT", "Combat Conditioning", "Fat Loss"],
    philosophy: "Comfort is the enemy of progress. Embrace the burn.",
    earlyLife:
      "Growing up in Chicago, Marcus found discipline through martial arts. He competed professionally in MMA for six years before retiring to focus on conditioning coaching.",
    achievements: [
      "Undefeated amateur MMA record",
      "Creator of the 'Spartan 300' conditioning program",
      "Voted Top Group Fitness Instructor 2023",
    ],
    careerHighlights: [
      "Undefeated amateur MMA record",
      "Creator of the 'Spartan 300' conditioning program",
      "Voted Top Group Fitness Instructor 2023",
    ],
  },
];

const TRAINER_QUOTES: Record<string, string> = {
  "Elena Rostova":
    "Strength is never a weakness, and weakness is never a choice.",
  "David Miller":
    "Move well before you move heavy. Mechanics dictate performance.",
  "Sophia Thorne":
    "You can't out-train a bad diet, but you can build a masterpiece with the right fuel.",
  "Jason Statham":
    "Grip it and rip it. The barbell doesn't care about your feelings.",
  "Maya Lin": "Flexibility of the body begins with flexibility of the mind.",
  "Marcus Cole": "Comfort is the enemy of progress. Embrace the burn.",
};

const TRAINER_EARLY_LIFE: Record<string, string> = {
  "Elena Rostova":
    "Born in St. Petersburg, Elena began her athletic career in gymnastics before transitioning to Olympic weightlifting at age 14. Her early exposure to rigorous Soviet-era training methodologies shaped her disciplined approach to coaching.",
  "David Miller":
    "David grew up in Texas playing Division 1 football. After a career-ending ACL injury, he dedicated his life to physical therapy and sports conditioning to help others avoid preventable injuries.",
  "Sophia Thorne":
    "Sophia struggled with metabolic issues in her late teens, which sparked her obsession with nutritional science. She earned her master's degree in Dietetics from UCLA.",
  "Jason Statham":
    "A former underground powerlifter from London, Jason spent years training in grit-and-chalk garage gyms before bringing his brutal but effective methods to the mainstream.",
  "Maya Lin":
    "Raised in a monastic community in Northern India, Maya moved to the US in her twenties to bridge the gap between spiritual wellness and high-performance athletics.",
  "Marcus Cole":
    "Growing up in Chicago, Marcus found discipline through martial arts. He competed professionally in MMA for six years before retiring to focus on conditioning coaching.",
};

const TRAINER_HIGHLIGHTS: Record<string, string[]> = {
  "Elena Rostova": [
    "2014 European Weightlifting Champion (63kg)",
    "Coached 3 athletes to the CrossFit Games",
    "Published author of 'The Iron Blueprint'",
  ],
  "David Miller": [
    "Head Strength Coach for Texas A&M Athletics",
    "Developed the 'Miller Mobility Protocol'",
    "Over 500+ athletes successfully rehabilitated",
  ],
  "Sophia Thorne": [
    "IFBB Pro Card winner in 2018",
    "Featured in Muscle & Fitness Magazine",
    "Formulated a highly successful line of vegan supplements",
  ],
  "Jason Statham": [
    "Holds a state record 800lb deadlift",
    "Owner of the notorious 'Iron Dungeon' gym",
    "Coached multiple WPO world record holders",
  ],
  "Maya Lin": [
    "Lead instructor at the annual Sedona Wellness Retreat",
    "Consultant for NBA players on active recovery",
    "Author of 'The Mindful Athlete'",
  ],
  "Marcus Cole": [
    "Undefeated amateur MMA record",
    "Creator of the 'Spartan 300' conditioning program",
    "Voted Top Group Fitness Instructor 2023",
  ],
};

export default function MeetTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    let isMounted = true;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    setLoading(true);
    fetch(`${apiUrl}/trainers`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const fetchedTrainers = Array.isArray(data?.data?.trainers)
          ? data.data.trainers
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.trainers)
          ? data.trainers
          : [];

        if (fetchedTrainers.length > 0) {
          setTrainers(fetchedTrainers);
        } else {
          // Fallback to defaults if API returns empty
          setTrainers(DEFAULT_TRAINERS);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn(
          "API fetch failed for trainers, utilizing reliable default trainers:",
          err
        );
        if (isMounted) {
          setTrainers(DEFAULT_TRAINERS);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <section
      id="trainers"
      className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-t border-white/10 relative"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white select-none">
            Meet Our Expert Trainers
          </h2>
          <p className="text-white/80 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium italic">
            Certified experts dedicated to helping you unlock your full athletic
            potential.
          </p>
        </div>

        {/* Dynamic Grid - 3 Columns Full Width (12-Sep Height & Spacing) */}
        {!loading && trainers.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => {
              const photoSrc =
                trainer.photo || trainer.image || "/image1.jpg.jpeg";
              const titleText =
                trainer.designation || trainer.role || "Elite Fitness Trainer";

              return (
                <motion.div
                  key={trainer._id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedTrainer(trainer)}
                  className="group relative w-full h-67.5 sm:h-75 rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl hover:shadow-[0_20px_40px_rgba(255,255,255,0.12)] cursor-pointer transition-all duration-300"
                >
                  <img
                    src={photoSrc}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end gap-2">
                    <div className="space-y-0.5 overflow-hidden">
                      <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider truncate">
                        {trainer.name}
                      </h4>
                      <p className="text-xs font-semibold text-white/80 line-clamp-1">
                        {titleText}
                      </p>
                    </div>

                    {/* Expandable White Button */}
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-between shadow-lg group-hover:w-28 md:group-hover:w-32 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shrink-0 relative">
                      <span className="text-black text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 absolute left-4">
                        Details
                      </span>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black flex items-center justify-center absolute right-1 group-hover:rotate-45 transition-transform duration-500 shadow-md">
                        <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-white stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-67.5 sm:h-75 bg-neutral-900 rounded-2xl border border-white/10"
              />
            ))}
          </div>
        )}
      </div>

      {/* Wikipedia-Style Details Modal */}
      <AnimatePresence>
        {selectedTrainer && (
          <motion.div
            key="trainer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 40,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
              className="relative w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-7xl bg-[#0a0a0a] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
              {/* Left Sidebar (Infobox / Photo & Quote) */}
              <div className="w-full md:w-[35%] h-[40vh] md:h-full flex flex-col shrink-0 z-10">
                {/* Image & Stats Section */}
                <div className="relative flex-1 md:h-[80%] min-h-[60%] bg-black md:rounded-r-[2.5rem] md:border-r md:border-white/10 overflow-hidden shadow-2xl z-20">
                  <img
                    src={
                      selectedTrainer.photo ||
                      selectedTrainer.image ||
                      "/image1.jpg.jpeg"
                    }
                    className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-90"
                    alt={selectedTrainer.name}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent opacity-95" />

                  {/* Mobile Close Button */}
                  <button
                    onClick={() => setSelectedTrainer(null)}
                    className="absolute top-4 right-4 md:hidden bg-white p-1.5 rounded-full text-black shadow-lg z-10 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight leading-none mb-1">
                        {selectedTrainer.name}
                      </h3>
                      <p className="text-gray-300 font-bold uppercase tracking-wider text-[10px]">
                        {selectedTrainer.designation ||
                          selectedTrainer.role ||
                          "Elite Trainer"}
                      </p>
                    </div>

                    {/* Wikipedia-style Infobox Stats */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5 backdrop-blur-sm">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <User className="w-3 h-3" /> Full Name
                        </span>
                        <span className="text-white text-[10px] font-semibold">
                          {selectedTrainer.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Experience
                        </span>
                        <span className="text-white text-[10px] font-semibold">
                          {selectedTrainer.experienceYears ??
                            selectedTrainer.experience ??
                            8}{" "}
                          Years
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Star className="w-3 h-3" /> Specialty
                        </span>
                        <span className="text-white text-[10px] font-semibold">
                          {selectedTrainer.specializations?.[0] ||
                            selectedTrainer.specialties?.[0] ||
                            "Strength & Conditioning"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-white/10 pt-2 md:hidden">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Quote className="w-3 h-3" /> Quote
                        </span>
                        <span className="text-white text-[10px] italic font-medium truncate max-w-42.5">
                          &quot;
                          {selectedTrainer.philosophy?.trim() ||
                            TRAINER_QUOTES[selectedTrainer.name] ||
                            "Consistency and discipline build champions."}
                          &quot;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Section (Bottom of Sidebar) */}
                <div className="hidden md:flex h-[20%] bg-[#080808] p-6 items-center justify-center relative overflow-hidden md:rounded-br-[2.5rem] md:border-r md:border-b md:border-white/10 -mt-6 pt-10 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-4 -right-2"
                  >
                    <Quote className="w-32 h-32 text-white/5 transform -scale-x-100" />
                  </motion.div>
                  <div className="relative z-10 border-l-2 border-white/30 pl-4 py-2">
                    <p className="text-sm font-sans italic text-gray-300 leading-relaxed">
                      &quot;
                      {selectedTrainer.philosophy?.trim() ||
                        TRAINER_QUOTES[selectedTrainer.name] ||
                        "Consistency and discipline build champions."}
                      &quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Content Area (Wiki Article) */}
              <div className="w-full md:w-[65%] h-[60vh] md:h-full p-6 md:p-8 overflow-y-auto bg-[#0a0a0a] relative custom-scrollbar">
                {/* Desktop Close Button */}
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="hidden md:flex absolute top-6 right-6 bg-white hover:bg-gray-200 p-2 rounded-full text-black transition-all shadow-lg z-10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="max-w-3xl space-y-5 pb-6">
                  {/* Article Title */}
                  <div className="border-b border-white/10 pb-6 pr-12">
                    <h2 className="text-lg font-sans font-semibold text-white tracking-wide mb-2 flex items-center gap-3">
                      <Info className="w-5 h-5 text-white" />
                      Biography
                    </h2>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans">
                      {selectedTrainer.bio || selectedTrainer.about}
                    </p>
                  </div>

                  {/* Early Life Section */}
                  {(selectedTrainer.earlyLife ||
                    TRAINER_EARLY_LIFE[selectedTrainer.name] ||
                    (selectedTrainer.education &&
                      selectedTrainer.education.length > 0)) && (
                    <div className="space-y-3">
                      <h3 className="text-base font-sans font-semibold text-white tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-white" /> Early Life &
                        Education
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed font-sans pl-7 border-l-2 border-white/10">
                        {selectedTrainer.earlyLife ||
                          TRAINER_EARLY_LIFE[selectedTrainer.name] ||
                          `Education: ${selectedTrainer.education?.join(", ")}`}
                      </p>
                    </div>
                  )}

                  {/* Career Highlights Section */}
                  {((selectedTrainer.careerHighlights &&
                    selectedTrainer.careerHighlights.length > 0) ||
                    (selectedTrainer.achievements &&
                      selectedTrainer.achievements.length > 0) ||
                    TRAINER_HIGHLIGHTS[selectedTrainer.name]) && (
                    <div className="space-y-3">
                      <h3 className="text-base font-sans font-semibold text-white tracking-wide flex items-center gap-2">
                        <Award className="w-4 h-4 text-white" /> Career
                        Highlights
                      </h3>
                      <ul className="space-y-2 pl-7 border-l-2 border-white/10">
                        {(
                          (selectedTrainer.careerHighlights?.length
                            ? selectedTrainer.careerHighlights
                            : selectedTrainer.achievements?.length
                            ? selectedTrainer.achievements
                            : TRAINER_HIGHLIGHTS[selectedTrainer.name]) || []
                        ).map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-gray-400 text-xs font-medium"
                          >
                            <ChevronRight className="w-3 h-3 text-white shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Certifications & Specialties Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <h3 className="text-sm font-sans font-black uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                        <Target className="w-3 h-3 text-white" /> Core
                        Specialties
                      </h3>
                      <ul className="space-y-1.5">
                        {(
                          selectedTrainer.specializations ||
                          selectedTrainer.specialties ||
                          []
                        ).map((s, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-400 flex items-center gap-2 font-medium"
                          >
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />{" "}
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-sans font-black uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                        <Award className="w-3 h-3 text-white" /> Credentials
                      </h3>
                      <ul className="space-y-1.5">
                        {(selectedTrainer.certifications || []).map((c, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-400 flex items-center gap-2 font-medium"
                          >
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" />{" "}
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
