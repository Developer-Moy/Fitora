"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Calendar, Clock, User, Phone, Mail, ArrowUpRight, ShieldCheck, Activity, Zap, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookSessionPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    trainerId: "",
    date: "",
    timeSlot: "",
  });

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/trainers`);
        const data = await res.json();
        if (data.success) {
          setTrainers(data.data.trainers || []);
        }
      } catch (err) {
        console.error("Failed to fetch trainers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.trainerId && formData.date) {
        setLoadingSlots(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/session-booking/booked-slots?trainerId=${formData.trainerId}&date=${formData.date}`);
          const data = await res.json();
          if (data.success) {
            setBookedSlots(data.data || []);
            // If currently selected slot becomes booked, reset it
            if (formData.timeSlot && data.data.includes(formData.timeSlot)) {
              setFormData((prev) => ({ ...prev, timeSlot: "" }));
            }
          }
        } catch (err) {
          console.error("Failed to fetch booked slots", err);
        } finally {
          setLoadingSlots(false);
        }
      } else {
        setBookedSlots([]);
      }
    };
    fetchBookedSlots();
  }, [formData.trainerId, formData.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/session-booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          trainerId: "",
          date: "",
          timeSlot: "",
        });
      } else {
        throw new Error(data.message || "Failed to book session. Please try again later.");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to book session. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-12 pb-16 px-6 sm:px-10 lg:px-16 flex items-center justify-center relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-[80px] pointer-events-none z-0" />

        <div className="w-11/12 max-w-7xl relative z-10 mx-auto">
          
          {/* Top Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left w-full mb-8 sm:mb-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
              Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">Physique</span>
            </h1>
            <div className="w-20 h-1.5 bg-white mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
            
            {/* Left Column - Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col space-y-8 lg:pr-10"
            >
              <div className="space-y-4">
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium" style={{ fontStyle: "italic" }}>
                At Fitora, our elite trainers combine AI-driven insights with years of professional bodybuilding and fitness experience. Book a 1-on-1 session to get a customized roadmap for your ultimate transformation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">Elite Trainers</h3>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Train with certified professionals who have transformed hundreds of lives across Bangladesh.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Activity className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">Custom Plans</h3>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Get personalized nutrition and workout plans tailored strictly to your body type and goals.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">Flexible Timing</h3>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Choose a schedule that perfectly fits your lifestyle. Morning or evening, we are here for you.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">Guaranteed Results</h3>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  Follow our guidance and witness massive changes in your physique and overall health.
                </p>
              </div>
            </div>
            
            <div className="pt-6 flex items-center gap-6">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-800"></div>
                 <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-700"></div>
                 <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-600"></div>
                 <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center text-xs font-bold text-black tracking-tighter">+2k</div>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                <strong className="text-white text-sm">2000+</strong> <br/>Successful Transformations
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#F4F4F4] p-8 sm:p-12 space-y-6 rounded-2xl"
          >
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                Session Details
              </h3>
              <div className="w-10 h-1 bg-black" />
            </div>

            {success ? (
              <div className="p-6 bg-white text-black text-center space-y-3 border border-gray-200">
                <CheckCircle2 className="w-10 h-10 text-black mx-auto" />
                <h4 className="font-extrabold text-lg uppercase">
                  Booking Confirmed!
                </h4>
                <p className="text-xs text-gray-500">
                  Your session request has been sent successfully. The trainer will contact you shortly to confirm the appointment.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-3 bg-black text-white font-bold uppercase text-xs tracking-wider rounded-full hover:bg-gray-900 transition-colors w-full"
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400"
                  />
                </div>

                <div className="relative">
                  <select
                    name="trainerId"
                    required
                    value={formData.trainerId}
                    onChange={handleChange}
                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-black text-sm outline-none focus:border-black transition-colors font-medium cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select Trainer *</option>
                    {loading ? (
                      <option disabled>Loading trainers...</option>
                    ) : (
                      trainers.map((trainer) => (
                        <option key={trainer._id} value={trainer._id}>
                          {trainer.name} - {trainer.designation}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-[5px] top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      name="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400"
                    />
                  </div>
                  <div className="relative">
                    <select
                      name="timeSlot"
                      required
                      value={formData.timeSlot}
                      onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-black text-sm outline-none focus:border-black transition-colors font-medium cursor-pointer appearance-none"
                    >
                      <option value="" disabled>
                        {loadingSlots ? "Checking slots..." : "Select Time *"}
                      </option>
                      {timeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <option key={slot} value={slot} disabled={isBooked}>
                            {slot} {isBooked ? "(Booked)" : ""}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="absolute right-[5px] top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-xs p-3 rounded-lg flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <p>{error}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className="group inline-flex items-center gap-2 bg-black text-white border border-white/25 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-black hover:border-white/60 hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{submitting ? "PROCESSING..." : "CONFIRM BOOKING"}</span>
                    {!submitting && (
                      <span className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                        <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
