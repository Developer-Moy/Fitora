"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Crown,
  DollarSign,
  MapPinned,
  Users,
} from "lucide-react";
import type { IconType } from "react-icons";

type DashboardMetric = {
  label: string;
  value: string;
  change: string;
  icon: IconType;
};

type QuickAction = {
  title: string;
  description: string;
  action: string;
  icon: IconType;
};

type PlatformService = {
  name: string;
  status: string;
  value: string;
};

const metrics: DashboardMetric[] = [
  { label: "Total Users", value: "24,892", change: "+12.8%", icon: Users },
  {
    label: "Premium Subscribers",
    value: "8,426",
    change: "+8.4%",
    icon: Crown,
  },
  {
    label: "Monthly Revenue",
    value: "$184,240",
    change: "+16.2%",
    icon: DollarSign,
  },
  {
    label: "Active Districts",
    value: "64 / 64",
    change: "100% coverage",
    icon: MapPinned,
  },
];

const quickActions: QuickAction[] = [
  {
    title: "User Management",
    description: "Filter members, manage roles, and account status.",
    action: "View Users",
    icon: Users,
  },
  {
    title: "Branch Network",
    description: "Manage gym locations across all 64 districts.",
    action: "Manage Branches",
    icon: Building2,
  },
  {
    title: "AI Model Control",
    description: "Monitor chat tokens and response latency.",
    action: "Open Controls",
    icon: Activity,
  },
];

const platformServices: PlatformService[] = [
  { name: "API Services", status: "Operational", value: "99.98%" },
  { name: "Socket.IO", status: "Operational", value: "42ms latency" },
  { name: "AI Coach", status: "Operational", value: "1.2s response" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
              CONTROL CENTER
            </p>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            ADMIN OVERVIEW
          </h1>
          <p className="mt-1.5 text-xs text-white/50 font-medium">
            Live telemetry of members, district network coverage, and platform
            services.
          </p>
        </div>
        <button className="group inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-black transition hover:bg-gray-100 shadow-xl cursor-pointer sm:self-auto">
          <span>Export Report</span>
          <ArrowUpRight className="h-4 w-4 stroke-[2.5] group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      {/* Metrics Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, change, icon: MetricIcon }) => (
          <div
            key={label}
            className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-neutral-900 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white/50">
                {label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <MetricIcon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-white tracking-tight">
              {value}
            </p>
            <p className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-white/70">
              {change}
            </p>
          </div>
        ))}
      </section>

      {/* Activity & Health Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition duration-300 hover:border-white/20 md:p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                District Activity
              </h2>
              <p className="mt-1 text-xs text-white/40">
                Member activity across the 64-district branch network
              </p>
            </div>
            <Activity className="h-5 w-5 text-white/80" />
          </div>
          <div className="mt-8 flex h-44 items-end gap-2 border-b border-white/10 px-2 pb-1">
            {[42, 58, 48, 72, 64, 88, 76, 94, 68, 82, 56, 74].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-white/70 transition hover:bg-white hover:scale-y-105 origin-bottom"
                  style={{ height: `${height}%` }}
                />
              ),
            )}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-white/30">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-neutral-950 p-5 transition duration-300 hover:border-white/20 md:p-6 shadow-xl">
          <h2 className="text-base font-black uppercase tracking-wider text-white">
            Platform Health
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Real-time infrastructure status
          </p>
          <div className="mt-6 space-y-4">
            {platformServices.map(({ name, status, value }) => (
              <div
                key={name}
                className="flex items-center justify-between border-b border-white/5 pb-3.5 last:border-none"
              >
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    {name}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    {status}
                  </p>
                </div>
                <span className="text-xs font-extrabold text-white/40 tracking-wider">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {quickActions.map(
          ({ title, description, action, icon: ActionIcon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white text-black font-black flex items-center justify-center mb-4">
                  <ActionIcon className="h-5 w-5 stroke-[2.5]" />
                </div>
                <h2 className="text-base font-black uppercase tracking-tight text-white">
                  {title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  {description}
                </p>
              </div>
              <button className="mt-6 text-xs font-extrabold uppercase tracking-widest text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer">
                <span>{action}</span>
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5] group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          ),
        )}
      </section>
    </div>
  );
}
