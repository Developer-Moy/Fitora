"use client";

const TRAINERS = [
  {
    name: "Marcus Vance",
    role: "Head Strength Coach",
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Alex Rivera",
    role: "CrossFit & Mobility",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "David Sterling",
    role: "Bodybuilding Specialist",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jake Lawson",
    role: "Powerlifting Coach",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Ryan Carter",
    role: "HIIT & Endurance",
    image:
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Elena Rostova",
    role: "Personal Trainer",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
  },
];

export default function MeetTrainers() {
  return (
    <section
      id="trainers"
      className="w-full py-20 px-6 sm:px-10 lg:px-16 bg-black text-white select-none border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Meet Our Trainers
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Our certified personal trainers are dedicated to guiding your form,
            strength, and transformation goals.
          </p>
        </div>

        {/* 6 Trainer Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAINERS.map(({ name, role, image }) => (
            <div
              key={name}
              className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#0E0F12] shadow-xl hover:border-white/40 transition-all duration-300"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 contrast-110"
                />
              </div>

              <div className="p-5 bg-[#0E0F12]">
                <h3 className="font-extrabold text-white text-base sm:text-lg uppercase">
                  {name}
                </h3>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  {role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
