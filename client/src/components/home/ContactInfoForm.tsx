"use client";

import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaPinterestP,
} from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { ArrowUpRight } from "lucide-react";

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
    <section
      id="contact"
      className="w-full py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-black text-white select-none font-sans border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Info */}
        <div className="lg:col-span-6 space-y-8 lg:pr-6">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15] uppercase">
              WE ARE HERE TO HELP YOU SHAPE YOUR BODY
            </h2>

            <p className="text-white/60 text-sm sm:text-base leading-relaxed font-normal pt-2">
              At Fitora, we are dedicated to helping athletes and fitness
              enthusiasts across all 64 districts of Bangladesh achieve their peak athletic potential.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide">
                Dhaka, Bangladesh
              </h3>
              <div className="w-10 h-1 bg-white" />
              <div className="text-xs sm:text-sm text-white/50 leading-relaxed font-normal pt-1 space-y-0.5">
                <p>Fitora Tower, Gulshan-2, Dhaka 1212</p>
                <p className="font-bold text-white">
                  64 Branches in Bangladesh
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide">
                Opening Hours
              </h3>
              <div className="w-10 h-1 bg-white" />
              <div className="text-xs sm:text-sm text-white/50 leading-relaxed font-normal space-y-0.5 pt-1">
                <p>Mon to Sat: 6:00 AM &mdash; 11:30 PM</p>
                <p className="font-bold text-white">24/7 AI Assistance</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide">
                Information
              </h3>
              <div className="w-10 h-1 bg-white" />
              <div className="text-xs sm:text-sm text-white/50 leading-relaxed font-normal space-y-0.5 pt-1">
                <p>+880 1700-000000</p>
                <p>support@fitora.com.bd</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide">
                Follow Us
              </h3>
              <div className="w-10 h-1 bg-white" />
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-sm"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={14} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-sm"
                  aria-label="Twitter / X"
                >
                  <FaXTwitter size={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-sm"
                  aria-label="Instagram"
                >
                  <FaInstagram size={15} />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-neutral-900 border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-sm"
                  aria-label="Pinterest"
                >
                  <FaPinterestP size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Box */}
        <div className="lg:col-span-6 bg-neutral-950 border border-white/10 p-8 sm:p-12 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              LEAVE US YOUR INFO
            </h3>
            <div className="w-10 h-1 bg-white" />
          </div>

          {submitted ? (
            <div className="p-6 bg-neutral-900 text-white text-center space-y-3 border border-white/15 rounded-2xl">
              <FiCheckCircle className="w-10 h-10 text-white mx-auto" />
              <h4 className="font-extrabold text-lg uppercase">
                Submission Received!
              </h4>
              <p className="text-xs text-white/60">
                Thank you, {formData.fullName}. Our team will contact you shortly.
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
                  className="w-full px-4 py-3.5 bg-neutral-900 border border-white/15 rounded-2xl text-white text-sm outline-none focus:border-white transition-colors font-medium placeholder-white/30"
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
                  className="w-full px-4 py-3.5 bg-neutral-900 border border-white/15 rounded-2xl text-white text-sm outline-none focus:border-white transition-colors font-medium placeholder-white/30"
                />
              </div>

              <div>
                <select
                  value={formData.selectedClass}
                  onChange={(e) =>
                    setFormData({ ...formData, selectedClass: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-neutral-900 border border-white/15 rounded-2xl text-white text-sm outline-none focus:border-white transition-colors font-medium cursor-pointer"
                >
                  <option className="bg-neutral-950" value="">
                    Select Fitness Goal
                  </option>
                  <option className="bg-neutral-950" value="weight-loss">
                    Weight Loss & Cardio
                  </option>
                  <option className="bg-neutral-950" value="muscle-building">
                    Muscle Building & Hypertrophy
                  </option>
                  <option className="bg-neutral-950" value="personal-training">
                    1-on-1 Personal Trainer
                  </option>
                </select>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Comment or Question..."
                  className="w-full px-4 py-3.5 bg-neutral-900 border border-white/15 rounded-2xl text-white text-sm outline-none focus:border-white transition-colors font-medium placeholder-white/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-gray-100 transition shadow-xl cursor-pointer"
              >
                SUBMIT CONSULTATION REQUEST
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
