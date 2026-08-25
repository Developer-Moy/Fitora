"use client";

import { Building2, MapPin, Users, Plus, ArrowUpRight } from "lucide-react";

export default function AdminBranchesPage() {
  const branches = [
    {
      id: 1,
      name: "DHAKA CENTRAL FLAGSHIP",
      district: "DHAKA DISTRICT",
      members: "4,250 MEMBERS",
      status: "OPERATIONAL",
      headTrainer: "TANVIR HOSSAIN",
    },
    {
      id: 2,
      name: "CHATTOGRAM ATHLETIC CLUB",
      district: "CHATTOGRAM DISTRICT",
      members: "2,840 MEMBERS",
      status: "OPERATIONAL",
      headTrainer: "NUTRAT JAHAN",
    },
    {
      id: 3,
      name: "SYLHET HIGH-PERFORMANCE HUB",
      district: "SYLHET DISTRICT",
      members: "1,920 MEMBERS",
      status: "OPERATIONAL",
      headTrainer: "SADIA AKTER",
    },
    {
      id: 4,
      name: "RAJSHAHI FITNESS CENTER",
      district: "RAJSHAHI DISTRICT",
      members: "1,450 MEMBERS",
      status: "OPERATIONAL",
      headTrainer: "FAHIM AHMED",
    },
  ];

  return (
    <div className="space-y-8 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              NATIONAL GYM NETWORK
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            BRANCH NETWORK
          </h1>
          <p className="mt-1.5 text-xs text-white/50 font-medium max-w-xl">
            Monitor and manage physical branch locations across all 64 districts
            in Bangladesh.
          </p>
        </div>

        <button
          type="button"
          className="group inline-flex items-center gap-2 bg-white text-black font-extrabold text-xs px-5 py-3 rounded-full hover:bg-gray-100 transition shadow-xl cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD NEW BRANCH</span>
        </button>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 transition hover:border-white/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white text-black text-[9px] font-black uppercase">
                {branch.status}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-white/50">
                <MapPin className="w-3.5 h-3.5 text-white" /> {branch.district}
              </div>
            </div>

            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              {branch.name}
            </h2>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
              <div>
                <span className="text-[9px] font-bold text-white/40 uppercase">
                  ACTIVE MEMBERS
                </span>
                <p className="font-black text-white">{branch.members}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-white/40 uppercase">
                  HEAD TRAINER
                </span>
                <p className="font-black text-white">{branch.headTrainer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
