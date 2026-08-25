"use client";

import { Settings, ShieldCheck, Lock, Save, Bell } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Admin configuration saved successfully!");
  };

  return (
    <div className="space-y-8 select-none font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-white" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            SYSTEM CONFIGURATION
          </p>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          ADMIN SETTINGS & SECURITY
        </h1>
        <p className="mt-1 text-xs text-white/50">
          Configure system notifications, security protocols, API access keys,
          and platform controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-white">
            GENERAL PLATFORM CONTROLS
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-white/10">
              <div>
                <p className="text-xs font-bold text-white uppercase">
                  Maintenance Mode
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">
                  Restrict platform access during system updates
                </p>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 accent-white cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900 border border-white/10">
              <div>
                <p className="text-xs font-bold text-white uppercase">
                  New User Registration
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">
                  Allow new members to create accounts
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-extrabold uppercase tracking-wider hover:bg-gray-100 transition shadow-xl cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>SAVE SYSTEM CONFIGURATION</span>
        </button>
      </form>
    </div>
  );
}
