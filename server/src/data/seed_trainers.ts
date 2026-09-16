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
    bio: "Elena Rostova is a former Olympic lifter who transformed her passion for heavy iron into a lifelong career of coaching elite athletes. With a degree in Kinesiology and a relentless drive, she builds programs that prioritize functional strength and injury prevention.",
    experience: 12,
    certifications: ["CSCS", "USA Weightlifting Level 2", "CrossFit Level 3"],
    specialties: ["Olympic Lifting", "Powerlifting", "Functional Hypertrophy"],
    philosophy: "Strength is never a weakness, and weakness is never a choice."
  },
  {
    name: "David Miller",
    role: "Olympic Lifting Specialist",
    image: "/image2.jpg.jpeg",
    bio: "David Miller combines biomechanics with practical training to produce staggering results. He has trained collegiate athletes and professional competitors, focusing heavily on mobility before loading.",
    experience: 8,
    certifications: ["NASM-CPT", "FMS Level 1"],
    specialties: ["Biomechanics", "Mobility", "Sports Conditioning"],
    philosophy: "Move well before you move heavy."
  },
  {
    name: "Sophia Thorne",
    role: "Bodybuilding & Nutrition Coach",
    image: "/image1.jpg.jpeg",
    bio: "An IFBB Pro and certified sports nutritionist, Sophia knows exactly what it takes to build a stage-ready physique. She takes a scientific approach to macros and micro-cycles.",
    experience: 10,
    certifications: ["Precision Nutrition Level 2", "ISSA Master Trainer"],
    specialties: ["Hypertrophy", "Contest Prep", "Macro Coaching"],
    philosophy: "You can't out-train a bad diet, but you can build a masterpiece with the right fuel."
  },
  {
    name: "Jason Statham",
    role: "Deadlift & Powerlifting Coach",
    image: "/image4.jpg.jpeg",
    bio: "Known for his explosive power and no-nonsense coaching style, Jason helps lifters break past their plateaus. If you want to add 50lbs to your deadlift, he is your guy.",
    experience: 15,
    certifications: ["Westside Barbell Certified", "RTS Level 1"],
    specialties: ["Powerlifting", "Grip Strength", "Max Effort Training"],
    philosophy: "Grip it and rip it. The barbell doesn't care about your feelings."
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");
    await Trainer.deleteMany({});
    await Trainer.insertMany(trainers);
    console.log("Seeded 4 trainers successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding trainers:", error);
    process.exit(1);
  }
}

seed();
