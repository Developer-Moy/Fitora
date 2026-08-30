"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaPinterestP,
} from "react-icons/fa6";
import { ArrowUpRight, CheckCircle2 as FiCheckCircle } from "lucide-react";
import { submitConsultationApi } from "@/services/consultationService";

export default function ContactInfoForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedClass: "",
    comment: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    setIsSubmitting(true);
    const result = await submitConsultationApi({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      selectedClass: formData.selectedClass || "General Fitness & Gym Access",
      comment: formData.comment,
    });

    setIsSubmitting(false);
    setResponseMsg(result.message);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        selectedClass: "",
        comment: "",
      });
    }, 4500);
  };

  return (
    <section
      id="contact"
      className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-white text-black select-none font-sans"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Office Info */}
        <div className="lg:col-span-6 space-y-8 lg:pr-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-black tracking-tight leading-[1.15]">
              We are here for help you! To Shape Your Body.
            </h2>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-normal pt-2">
              At Fitora, we are dedicated to helping athletes and fitness
              enthusiasts across all 64 districts of Bangladesh achieve the body
              of their dreams. Our expert trainers and AI engines create
              personalized workout and nutrition plans.
            </p>
          </div>

          {/* 4 Info Sub-blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 pt-4">
            {/* 1. Location */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-black tracking-wide">
                Dhaka, Bangladesh
              </h3>
              <div className="w-10 h-1 bg-black" />
              <div className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal pt-1 space-y-0.5">
                <p>Fitora Tower, Gulshan-2, Dhaka 1212</p>
                <p className="font-semibold text-black/80">
                  64 Branches in Bangladesh
                </p>
              </div>
            </div>

            {/* 2. Opening Hours */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-black tracking-wide">
                Opening Hours
              </h3>
              <div className="w-10 h-1 bg-black" />
              <div className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal space-y-0.5 pt-1">
                <p>Mon to Sat: 6:00 AM &mdash; 11:30 PM</p>
                <p>24/7 AI Assistance Available</p>
              </div>
            </div>

            {/* 3. Information */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-black tracking-wide">
                Information
              </h3>
              <div className="w-10 h-1 bg-black" />
              <div className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal space-y-0.5 pt-1">
                <p>+880 1700-000000</p>
                <p>support@fitora.com.bd</p>
              </div>
            </div>

            {/* 4. Follow Us On */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-black tracking-wide">
                Follow Us On
              </h3>
              <div className="w-10 h-1 bg-black" />
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={14} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  aria-label="Twitter / X"
                >
                  <FaXTwitter size={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <FaInstagram size={15} />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                  aria-label="Pinterest"
                >
                  <FaPinterestP size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Container — Light gray box, no rounded corners, matching fitora-homepage.png */}
        <div className="lg:col-span-6 bg-[#F4F4F4] p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Leave Us Your Info
            </h3>
            <div className="w-10 h-1 bg-black" />
          </div>

          {submitted ? (
            <div className="p-6 bg-white text-black text-center space-y-3 border border-gray-200">
              <FiCheckCircle className="w-10 h-10 text-black mx-auto" />
              <h4 className="font-extrabold text-lg uppercase">
                Submission Received!
              </h4>
              <p className="text-xs text-gray-500">
                Thank you, {formData.fullName}. Our trainer will contact you
                shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Full Name *"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email Address *"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400"
                />
              </div>

              <div>
                <select
                  value={formData.selectedClass}
                  onChange={(e) =>
                    setFormData({ ...formData, selectedClass: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-black text-sm outline-none focus:border-black transition-colors font-medium text-gray-600 cursor-pointer"
                >
                  <option value="">Select Class</option>
                  <option value="bodybuilding">
                    Hypertrophy & Bodybuilding
                  </option>
                  <option value="weightloss">Weight Loss & Fat Burn</option>
                  <option value="fitness">Personal Fitness Training</option>
                  <option value="yoga">Yoga & Mobility</option>
                </select>
              </div>

              <div>
                <textarea
                  rows={5}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Comment"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 text-black text-sm outline-none focus:border-black transition-colors font-medium placeholder-gray-400 resize-none"
                />
              </div>

              {/* SUBMIT NOW Button — Black pill with white circle ArrowUpRight badge (moloy branch original) */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2.5 bg-black text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <span>SUBMIT NOW</span>
                  <span className="bg-white text-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
