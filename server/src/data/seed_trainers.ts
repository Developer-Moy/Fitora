import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Trainer from '../models/trainer.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fitora";

const trainers = [
  {
    name: "Elena Rostova",
    role: "Strength & Conditioning Specialist",
    image: "/image3.jpg.jpeg",
    bio: "Elena Rostova is a former Olympic lifter who transformed her passion for heavy iron into a lifelong career of coaching elite athletes. With a degree in Kinesiology and a relentless drive, she builds programs that prioritize functional strength and injury prevention. She has dedicated over a decade to perfecting the biomechanics of raw strength.",
    experience: 12,
    certifications: ["CSCS", "USA Weightlifting Level 2", "CrossFit Level 3"],
    specialties: ["Olympic Lifting", "Powerlifting", "Functional Hypertrophy"],
    philosophy: "Strength is never a weakness, and weakness is never a choice.",
    earlyLife: "Born in St. Petersburg, Elena began her athletic career in gymnastics before transitioning to Olympic weightlifting at age 14. Her early exposure to rigorous Soviet-era training methodologies shaped her disciplined approach to coaching.",
    careerHighlights: ["2014 European Weightlifting Champion (63kg)", "Coached 3 athletes to the CrossFit Games", "Published author of 'The Iron Blueprint'"]
  },
  {
    name: "David Miller",
    role: "Olympic Lifting Specialist",
    image: "/image2.jpg.jpeg",
    bio: "David Miller combines biomechanics with practical training to produce staggering results. He has trained collegiate athletes and professional competitors, focusing heavily on mobility before loading. His meticulous attention to form ensures longevity in the sport.",
    experience: 8,
    certifications: ["NASM-CPT", "FMS Level 1", "USAW Level 1"],
    specialties: ["Biomechanics", "Mobility", "Sports Conditioning"],
    philosophy: "Move well before you move heavy. Mechanics dictate performance.",
    earlyLife: "David grew up in Texas playing Division 1 football. After a career-ending ACL injury, he dedicated his life to physical therapy and sports conditioning to help others avoid preventable injuries.",
    careerHighlights: ["Head Strength Coach for Texas A&M Athletics", "Developed the 'Miller Mobility Protocol'", "Over 500+ athletes successfully rehabilitated"]
  },
  {
    name: "Sophia Thorne",
    role: "Bodybuilding & Nutrition Coach",
    image: "/image1.jpg.jpeg",
    bio: "An IFBB Pro and certified sports nutritionist, Sophia knows exactly what it takes to build a stage-ready physique. She takes a scientific approach to macros and micro-cycles, manipulating physiological variables to achieve peak physical condition.",
    experience: 10,
    certifications: ["Precision Nutrition Level 2", "ISSA Master Trainer"],
    specialties: ["Hypertrophy", "Contest Prep", "Macro Coaching"],
    philosophy: "You can't out-train a bad diet, but you can build a masterpiece with the right fuel.",
    earlyLife: "Sophia struggled with metabolic issues in her late teens, which sparked her obsession with nutritional science. She earned her master's degree in Dietetics from UCLA.",
    careerHighlights: ["IFBB Pro Card winner in 2018", "Featured in Muscle & Fitness Magazine", "Formulated a highly successful line of vegan supplements"]
  },
  {
    name: "Jason Statham",
    role: "Deadlift & Powerlifting Coach",
    image: "/image4.jpg.jpeg",
    bio: "Known for his explosive power and no-nonsense coaching style, Jason helps lifters break past their plateaus. If you want to add 50lbs to your deadlift, he is your guy. He believes in maximal effort lifting and nervous system adaptation.",
    experience: 15,
    certifications: ["Westside Barbell Certified", "RTS Level 1"],
    specialties: ["Powerlifting", "Grip Strength", "Max Effort Training"],
    philosophy: "Grip it and rip it. The barbell doesn't care about your feelings.",
    earlyLife: "A former underground powerlifter from London, Jason spent years training in grit-and-chalk garage gyms before bringing his brutal but effective methods to the mainstream.",
    careerHighlights: ["Holds a state record 800lb deadlift", "Owner of the notorious 'Iron Dungeon' gym", "Coached multiple WPO world record holders"]
  },
  {
    name: "Maya Lin",
    role: "Yoga & Mindfulness Instructor",
    image: "/image5.jpg.jpeg",
    bio: "Maya seamlessly blends ancient yogic philosophies with modern anatomical science. She focuses on breathwork, functional flexibility, and mental resilience, helping athletes recover faster and perform with a clear mind.",
    experience: 9,
    certifications: ["E-RYT 500", "Yoga Alliance Certified", "Mindfulness-Based Stress Reduction (MBSR)"],
    specialties: ["Vinyasa Flow", "Active Recovery", "Breathwork (Pranayama)"],
    philosophy: "Flexibility of the body begins with flexibility of the mind.",
    earlyLife: "Raised in a monastic community in Northern India, Maya moved to the US in her twenties to bridge the gap between spiritual wellness and high-performance athletics.",
    careerHighlights: ["Lead instructor at the annual Sedona Wellness Retreat", "Consultant for NBA players on active recovery", "Author of 'The Mindful Athlete'"]
  },
  {
    name: "Marcus Cole",
    role: "HIIT & Combat Conditioning",
    image: "/image6.jpg.jpeg",
    bio: "Marcus is a former MMA fighter who brings the intensity of the octagon to the gym floor. His high-intensity interval training (HIIT) sessions are legendary for pushing clients to their absolute cardiovascular limits.",
    experience: 11,
    certifications: ["ACE-CPT", "Kettlebell Athletics Level 2", "Muay Thai Kru"],
    specialties: ["HIIT", "Combat Conditioning", "Fat Loss"],
    philosophy: "Comfort is the enemy of progress. Embrace the burn.",
    earlyLife: "Growing up in Chicago, Marcus found discipline through martial arts. He competed professionally in MMA for six years before retiring to focus on conditioning coaching.",
    careerHighlights: ["Undefeated amateur MMA record", "Creator of the 'Spartan 300' conditioning program", "Voted Top Group Fitness Instructor 2023"]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");
    await Trainer.deleteMany({});
    await Trainer.insertMany(trainers);
    console.log("Seeded 6 trainers successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding trainers:", error);
    process.exit(1);
  }
}

seed();
