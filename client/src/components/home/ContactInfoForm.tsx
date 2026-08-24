"use client";

import { useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiMapPin, FiClock, FiPhone, FiMail, FiSend, FiCheckCircle } from "react-icons/fi";

export default function ContactInfoForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    selectedClass: "",
    comment: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: "", email: "", selectedClass: "", comment: "" });
    }, 4000);
  };

  return (
    <section id="contact" className="w-full py-20 px-6 sm:px-10 lg:px-16 bg-black text-white border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* ── Left Column: Office Info & Mission ── */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Main Headline */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider">
              <FiSend className="w-3.5 h-3.5" />
              <span>Contact Consultation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.1] text-white">
              We are here for help you! To Shape Your Body.
            </h2>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg">
              At Fitora Gym Studio, our certified coaches and AI fitness systems are ready to help you reach your physical goals. Reach out today for a free consultation!
            </p>
          </div>

          {/* Info Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Address & Location */}
            <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FiMapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Location
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Banashankari Stage II, Bengaluru, Karnataka 560070
              </p>
            </div>

            {/* Opening Hours */}
            <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FiClock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Opening Hours
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Mon to Fri: 7:30 AM &mdash; 1:00 AM
              </p>
            </div>

            {/* Phone Number */}
            <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FiPhone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Phone Number
              </h4>
              <p className="text-xs font-semibold text-white">
                +91-999999-9999
              </p>
            </div>

            {/* Email Address */}
            <div className="p-5 rounded-2xl bg-[#0E0F12] border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <FiMail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold uppercase text-white tracking-wider">
                Email Address
              </h4>
              <p className="text-xs text-gray-400">
                fitflex@mymail.com
              </p>
            </div>

          </div>

          {/* Social Links Bar */}
          <div className="pt-2 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Follow Us On Social Media
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="Instagram"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="Twitter / X"
              >
                <FaXTwitter size={15} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                aria-label="YouTube"
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* ── Right Column: Clean White Consultation Form Box ── */}
        <div className="lg:col-span-6 bg-white text-black p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
          
          <div className="space-y-2 border-b border-gray-200 pb-4">
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
              Leave Us Your Info
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Fill out the form below to book your free trainer consultation.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-black text-white text-center space-y-3 animate-in fade-in duration-300">
              <FiCheckCircle className="w-10 h-10 text-white mx-auto" />
              <h4 className="font-extrabold text-lg uppercase">Submission Received!</h4>
              <p className="text-xs text-gray-300">
                Thank you, {formData.fullName}. Our head coach will contact you at {formData.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-black text-sm outline-none focus:border-black transition-colors font-medium"
                />
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-black text-sm outline-none focus:border-black transition-colors font-medium"
                />
              </div>

              {/* Select Class Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                  Select Class / Training Goal
                </label>
                <select
                  value={formData.selectedClass}
                  onChange={(e) => setFormData({ ...formData, selectedClass: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-black text-sm outline-none focus:border-black transition-colors font-medium cursor-pointer"
                >
                  <option value="">Select your training goal...</option>
                  <option value="bodybuilding">Hypertrophy & Bodybuilding</option>
                  <option value="weightloss">Weight Loss & Fat Burn</option>
                  <option value="ai-coaching">AI Personal Coaching</option>
                  <option value="yoga">Yoga & Mobility Recovery</option>
                </select>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-gray-800 tracking-wider">
                  Comment / Message
                </label>
                <textarea
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Tell us about your fitness targets..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-black text-sm outline-none focus:border-black transition-colors font-medium resize-none"
                />
              </div>

              {/* Pure White / Dark High Contrast SUBMIT NOW Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-black hover:bg-gray-900 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer block text-center"
              >
                SUBMIT NOW
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
