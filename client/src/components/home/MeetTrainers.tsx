"use client";

import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import { ArrowUpRight, X, Award, Dumbbell, Clock, User } from "lucide-react";

interface Trainer {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  experience?: string;
  specialization?: string[];
  certifications?: string[];
  achievements?: string[];
  trainingPhilosophy?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MeetTrainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/trainers`);

        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }

        const data = await response.json();

        // Supports both:
        // { trainers: [...] }
        // and [...]
        const trainerData = Array.isArray(data)
          ? data
          : data.trainers || data.data || [];

        setTrainers(trainerData);
      } catch (err) {
        console.error("Trainer fetch error:", err);
        setError("Unable to load trainers.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedTrainer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedTrainer]);

  return (
    <>
      <section
        id="trainers"
        className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight text-white">
              Meet Our Expert Trainers
            </h2>

            <p className="text-white/80 text-[11px] xs:text-xs sm:text-[13px] md:text-sm leading-[1.6] sm:leading-[1.7] font-medium italic">
              Certified experts dedicated to helping you unlock your full
              athletic potential.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-67.5 sm:h-75 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-12">
              <p className="text-white/60 text-sm">{error}</p>
            </div>
          )}

          {/* Trainer Cards */}
          {!loading && !error && trainers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer) => (
                <button
                  key={trainer._id}
                  type="button"
                  onClick={() => setSelectedTrainer(trainer)}
                  className="group relative h-67.5 sm:h-75 rounded-2xl overflow-hidden border border-white/15 bg-black shadow-xl cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover object-top filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                  {/* Open Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight size={18} />
                  </div>

                  {/* Trainer Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                      {trainer.name}
                    </h4>

                    <p className="text-xs font-semibold text-white/80 mt-1">
                      {trainer.role}
                    </p>

                    <p className="text-[10px] uppercase tracking-widest text-white/50 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Trainer Profile →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No trainers */}
          {!loading && !error && trainers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/50 text-sm">
                No trainers available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trainer Details Modal */}
      {selectedTrainer && (
        <div
          className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedTrainer(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#171717] border border-white/15 rounded-2xl shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Close trainer details"
            >
              <Image
                fill
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover object-top filter brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Trainer Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-0.5">
                <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  {trainer.name}
                </h4>
                <p className="text-xs font-semibold text-white/80">
                  {trainer.role}
                </p>

                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                  {selectedTrainer.name}
                </h3>

                <p className="mt-3 text-sm sm:text-base text-white/70 font-medium">
                  {selectedTrainer.role}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  {selectedTrainer.experience && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs">
                      <Clock size={14} />
                      {selectedTrainer.experience}
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-xs">
                    <Dumbbell size={14} />
                    Fitora Trainer
                  </div>
                </div>
              </div>
            </div>

            {/* Wikipedia-style Content */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
                {/* Main Article */}
                <article className="space-y-8">
                  {/* Biography */}
                  {selectedTrainer.bio && (
                    <section>
                      <h4 className="text-xl font-black uppercase tracking-wide border-b border-white/10 pb-3">
                        Biography
                      </h4>

                      <p className="mt-4 text-sm leading-7 text-white/70">
                        {selectedTrainer.bio}
                      </p>
                    </section>
                  )}

                  {/* Training Philosophy */}
                  {selectedTrainer.trainingPhilosophy && (
                    <section>
                      <h4 className="text-xl font-black uppercase tracking-wide border-b border-white/10 pb-3">
                        Training Philosophy
                      </h4>

                      <p className="mt-4 text-sm leading-7 text-white/70">
                        {selectedTrainer.trainingPhilosophy}
                      </p>
                    </section>
                  )}

                  {/* Specializations */}
                  {selectedTrainer.specialization &&
                    selectedTrainer.specialization.length > 0 && (
                      <section>
                        <h4 className="text-xl font-black uppercase tracking-wide border-b border-white/10 pb-3">
                          Specializations
                        </h4>

                        <ul className="mt-4 space-y-3">
                          {selectedTrainer.specialization.map(
                            (specialization, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm text-white/70"
                              >
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                                {specialization}
                              </li>
                            )
                          )}
                        </ul>
                      </section>
                    )}

                  {/* Achievements */}
                  {selectedTrainer.achievements &&
                    selectedTrainer.achievements.length > 0 && (
                      <section>
                        <h4 className="text-xl font-black uppercase tracking-wide border-b border-white/10 pb-3">
                          Achievements
                        </h4>

                        <ul className="mt-4 space-y-3">
                          {selectedTrainer.achievements.map(
                            (achievement, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm text-white/70"
                              >
                                <Award
                                  size={16}
                                  className="mt-0.5 shrink-0 text-white"
                                />
                                {achievement}
                              </li>
                            )
                          )}
                        </ul>
                      </section>
                    )}
                </article>

                {/* Sidebar */}
                <aside className="h-fit border border-white/10 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 bg-white/5 border-b border-white/10">
                    <h4 className="font-black uppercase tracking-wide text-sm">
                      Trainer Information
                    </h4>
                  </div>

                  <div className="divide-y divide-white/10">
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-widest text-white/40">
                        Name
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {selectedTrainer.name}
                      </p>
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-widest text-white/40">
                        Position
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {selectedTrainer.role}
                      </p>
                    </div>

                    {selectedTrainer.experience && (
                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">
                          Experience
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {selectedTrainer.experience}
                        </p>
                      </div>
                    )}

                    {selectedTrainer.certifications &&
                      selectedTrainer.certifications.length > 0 && (
                        <div className="p-5">
                          <p className="text-[10px] uppercase tracking-widest text-white/40">
                            Certifications
                          </p>

                          <ul className="mt-3 space-y-2">
                            {selectedTrainer.certifications.map(
                              (certification, index) => (
                                <li
                                  key={index}
                                  className="flex gap-2 text-xs text-white/70"
                                >
                                  <Award size={13} className="shrink-0 mt-0.5" />
                                  {certification}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
