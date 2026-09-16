"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Target, BookOpen, Quote, Info, ChevronRight, User, Star, Clock, ArrowUpRight } from "lucide-react";

interface Trainer {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: number;
  certifications: string[];
  specialties: string[];
  philosophy: string;
  earlyLife?: string;
  careerHighlights?: string[];
}

export default function MeetTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") + "/trainers")
      .then(res => res.json())
      .then(data => {
        if (data.success) setTrainers(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
          <p
            className="text-white/80 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium italic"
          >
            Certified experts dedicated to helping you unlock your full athletic potential.
          </p>
        </div>

        {/* Dynamic Grid - Reverted to 3 Columns */}
        {!loading && trainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/[0.02] border border-white/5 p-6 sm:p-10 rounded-3xl shadow-inner">
            {trainers.map((trainer) => (
              <motion.div
                key={trainer._id}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setSelectedTrainer(trainer)}
                className="group relative h-[270px] sm:h-[300px] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] cursor-pointer transition-all duration-300"
              >
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end gap-2">
                  <div className="space-y-0.5 overflow-hidden">
                    <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider truncate">
                      {trainer.name}
                    </h4>
                    <p className="text-xs font-semibold text-white/80 line-clamp-1">
                      {trainer.role}
                    </p>
                  </div>
                  
                  {/* Unique Expandable White Button */}
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
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse bg-white/[0.02] border border-white/5 p-6 sm:p-10 rounded-3xl">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[300px] bg-neutral-900 rounded-2xl border border-white/10" />
             ))}
          </div>
        )}
      </div>

      {/* Wikipedia-Style Details Modal (Full Page / Z-Index Fix) */}
      <AnimatePresence>
        {selectedTrainer && (
          <motion.div 
            key="trainer-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: "easeIn" } }}
              transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
              className="relative w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-7xl bg-[#0a0a0a] md:rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden"
            >
                            {/* Left Sidebar (Infobox / Photo & Quote) */}
              <div className="w-full md:w-[35%] h-[40vh] md:h-full flex flex-col shrink-0 z-10">
                
                {/* Image & Stats Section */}
                <div className="relative flex-1 md:h-[80%] min-h-[60%] bg-black md:rounded-r-[2.5rem] md:border-r md:border-white/10 overflow-hidden shadow-2xl z-20">
                  <img 
                    src={selectedTrainer.image} 
                    className="absolute inset-0 w-full h-full object-cover filter contrast-125 brightness-90" 
                    alt={selectedTrainer.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-95" />
                  
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
                         {selectedTrainer.role}
                      </p>
                    </div>

                    {/* Wikipedia-style Infobox Stats */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5 backdrop-blur-sm">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5"><User className="w-3 h-3"/> Full Name</span>
                        <span className="text-white text-[10px] font-semibold">{selectedTrainer.name}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5"><Clock className="w-3 h-3"/> Experience</span>
                        <span className="text-white text-[10px] font-semibold">{selectedTrainer.experience} Years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-[10px] uppercase font-bold flex items-center gap-1.5"><Star className="w-3 h-3"/> Specialty</span>
                        <span className="text-white text-[10px] font-semibold">{selectedTrainer.specialties[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Section (Bottom of Sidebar) */}
                <div className="hidden md:flex h-[20%] bg-[#080808] p-6 items-center justify-center relative overflow-hidden md:rounded-br-[2.5rem] md:border-r md:border-b md:border-white/10 -mt-6 pt-10 z-10">
                   <motion.div
                      animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="absolute -bottom-4 -right-2"
                   >
                     <Quote className="w-32 h-32 text-white/5 transform -scale-x-100" />
                   </motion.div>
                   <div className="relative z-10 border-l-2 border-white/30 pl-4 py-2">
                      <p className="text-sm font-sans italic text-gray-300 leading-relaxed">
                        "{selectedTrainer.philosophy}"
                      </p>
                   </div>
                </div>

              </div>

              {/* Right Content Area (Wiki Article) */}
              <div className="w-full md:w-[65%] h-[60vh] md:h-full p-6 md:p-8 overflow-hidden bg-[#0a0a0a] relative">
                
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
                      {selectedTrainer.bio}
                    </p>
                  </div>

                  {/* Early Life Section */}
                  {selectedTrainer.earlyLife && (
                    <div className="space-y-3">
                      <h3 className="text-base font-sans font-semibold text-white tracking-wide flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-white" /> Early Life & Education
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed font-sans pl-7 border-l-2 border-white/10">
                        {selectedTrainer.earlyLife}
                      </p>
                    </div>
                  )}

                  {/* Career Highlights Section */}
                  {selectedTrainer.careerHighlights && selectedTrainer.careerHighlights.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-sans font-semibold text-white tracking-wide flex items-center gap-2">
                        <Award className="w-4 h-4 text-white" /> Career Highlights
                      </h3>
                      <ul className="space-y-2 pl-7 border-l-2 border-white/10">
                        {selectedTrainer.careerHighlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-400 text-xs font-medium">
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
                        <Target className="w-3 h-3 text-white" /> Core Specialties
                      </h3>
                      <ul className="space-y-1.5">
                        {selectedTrainer.specialties.map((s, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-center gap-2 font-medium">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-sm font-sans font-black uppercase text-white tracking-widest flex items-center gap-2 border-b border-white/10 pb-2">
                        <Award className="w-3 h-3 text-white" /> Credentials
                      </h3>
                      <ul className="space-y-1.5">
                        {selectedTrainer.certifications.map((c, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-center gap-2 font-medium">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full shrink-0" /> {c}
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
