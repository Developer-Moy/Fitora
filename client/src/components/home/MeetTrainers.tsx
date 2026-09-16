"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Target, Clock, Quote } from "lucide-react";

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
}

export default function MeetTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/trainers")
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

        {/* Dynamic Grid */}
        {!loading && trainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer) => (
              <motion.div
                key={trainer._id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTrainer(trainer)}
                className="group relative h-[270px] sm:h-[300px] rounded-2xl overflow-hidden border border-white/15 bg-neutral-900 shadow-xl cursor-pointer"
              >
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-0.5">
                  <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                    {trainer.name}
                  </h4>
                  <p className="text-xs font-semibold text-white/80 line-clamp-1">
                    {trainer.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[300px] bg-neutral-900 rounded-2xl border border-white/10" />
             ))}
          </div>
        )}
      </div>

      {/* Wikipedia-Style Details Modal */}
      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrainer(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-neutral-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10"
            >
              {/* Left Image Section */}
              <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-neutral-900">
                <img src={selectedTrainer.image} className="w-full h-full object-cover filter contrast-125" alt={selectedTrainer.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                <button 
                  onClick={() => setSelectedTrainer(null)}
                  className="absolute top-4 right-4 md:hidden bg-black/50 p-2 rounded-full text-white backdrop-blur-md border border-white/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Right Content Section */}
              <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto scrollbar-hide flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">{selectedTrainer.name}</h3>
                    <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs mt-1 flex items-center gap-2">
                       {selectedTrainer.role} <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> <span className="text-white/60">{selectedTrainer.experience} YRS EXP</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrainer(null)}
                    className="hidden md:flex bg-white/5 hover:bg-white/10 p-2.5 rounded-full text-gray-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <Quote className="w-4 h-4 text-emerald-500" /> Biography
                  </h5>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedTrainer.bio}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Specialties
                    </h5>
                    <ul className="space-y-2">
                      {selectedTrainer.specialties.map((s, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-2 font-medium">
                          <span className="w-1 h-1 bg-white/40 rounded-full" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-500" /> Certifications
                    </h5>
                    <ul className="space-y-2">
                      {selectedTrainer.certifications.map((c, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-2 font-medium">
                          <span className="w-1 h-1 bg-white/40 rounded-full" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <p className="text-white/90 text-sm italic font-medium relative z-10 leading-relaxed">
                    "{selectedTrainer.philosophy}"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
