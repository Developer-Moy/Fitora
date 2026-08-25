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

const metrics = [
    { label: "Total Users", value: "24,892", change: "+12.8%", icon: Users },
    { label: "Premium Subscribers", value: "8,426", change: "+8.4%", icon: Crown },
    { label: "Monthly Revenue", value: "$184,240", change: "+16.2%", icon: DollarSign },
    { label: "Active Districts", value: "64 / 64", change: "100% coverage", icon: MapPinned },
];

const quickActions = [
    ["User Management", "Filter members, manage roles, and account status.", "View Users", Users],
    ["Branch Network", "Manage gym locations across all 64 districts.", "Manage Branches", Building2],
    ["AI Model Control", "Monitor chat tokens and response latency.", "Open Controls", Activity],
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">Control Center</p>
                    <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">Admin Overview</h1>
                    <p className="mt-2 text-sm text-white/50">A live view of Fitora&apos;s members, branches, and platform health.</p>
                </div>
                <button className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/80 sm:self-auto">
                    Export Report <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ label, value, change, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-white/[0.08] bg-[#0e0f12] p-5">
                        <div className="flex items-center justify-between"><span className="text-sm text-white/50">{label}</span><Icon className="h-5 w-5 text-white/80" /></div>
                        <p className="mt-5 text-2xl font-black text-white">{value}</p>
                        <p className="mt-2 text-xs font-semibold text-emerald-400">{change}</p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0e0f12] p-5 md:p-6">
                    <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-white">District Activity</h2><p className="mt-1 text-xs text-white/40">Member activity across the branch network</p></div><Activity className="h-5 w-5 text-white/80" /></div>
                    <div className="mt-8 flex h-44 items-end gap-2 border-b border-white/[0.08] px-2">{[42, 58, 48, 72, 64, 88, 76, 94, 68, 82, 56, 74].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-white/80 transition hover:bg-white" style={{ height: `${height}%` }} />)}</div>
                    <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30"><span>Jan</span><span>Jun</span><span>Dec</span></div>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-[#0e0f12] p-5 md:p-6"><h2 className="text-lg font-bold text-white">Platform Health</h2><p className="mt-1 text-xs text-white/40">Real-time service status</p><div className="mt-7 space-y-5">{[["API Services", "Operational", "99.98%"], ["Socket.IO", "Operational", "42ms latency"], ["AI Coach", "Operational", "1.2s response"]].map(([name, status, value]) => <div key={name} className="flex items-center justify-between border-b border-white/[0.06] pb-4"><div><p className="text-sm font-semibold text-white">{name}</p><p className="mt-1 flex items-center gap-2 text-xs text-white/70"><span className="h-1.5 w-1.5 rounded-full bg-white/70" />{status}</p></div><span className="text-xs text-white/40">{value}</span></div>)}</div></div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                {quickActions.map(([title, description, action, Icon]) => <div key={title as string} className="rounded-2xl border border-white/[0.08] bg-[#0e0f12] p-5"><Icon className="h-5 w-5 text-white/80" /><h2 className="mt-4 text-base font-bold text-white">{title as string}</h2><p className="mt-2 min-h-10 text-sm leading-5 text-white/45">{description as string}</p><button className="mt-5 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300">{action as string} <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 text-white/80" /></button></div>)}
            </section>
        </div>
    );
}