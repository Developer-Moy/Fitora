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
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                        Control Center
                    </p>
                    <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        Admin Overview
                    </h1>
                    <p className="mt-2 text-sm text-white/50">
                        A live view of Fitora&apos;s members, branches, and platform health.
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/80 sm:self-auto">
                    Export Report <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ label, value, change, icon: MetricIcon }) => (
                    <div
                        key={label}
                        className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-white/50">{label}</span>
                            <MetricIcon className="h-5 w-5 text-white/80" />
                        </div>
                        <p className="mt-5 text-2xl font-black text-white">{value}</p>
                        <p className="mt-2 text-xs font-semibold text-emerald-400">
                            {change}
                        </p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
                <div className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)] md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                District Activity
                            </h2>
                            <p className="mt-1 text-xs text-white/40">
                                Member activity across the branch network
                            </p>
                        </div>
                        <Activity className="h-5 w-5 text-white/80" />
                    </div>
                    <div className="mt-8 flex h-44 items-end gap-2 border-b border-white/8 px-2">
                        {[42, 58, 48, 72, 64, 88, 76, 94, 68, 82, 56, 74].map(
                            (height, index) => (
                                <div
                                    key={index}
                                    className="flex-1 rounded-t-md bg-white/80 transition hover:bg-white"
                                    style={{ height: `${height}%` }}
                                />
                            ),
                        )}
                    </div>
                    <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                        <span>Jan</span>
                        <span>Jun</span>
                        <span>Dec</span>
                    </div>
                </div>
                <div className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)] md:p-6">
                    <h2 className="text-lg font-bold text-white">Platform Health</h2>
                    <p className="mt-1 text-xs text-white/40">Real-time service status</p>
                    <div className="mt-7 space-y-5">
                        {platformServices.map(({ name, status, value }) => (
                            <div
                                key={name}
                                className="flex items-center justify-between border-b border-white/6 pb-4"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-white">{name}</p>
                                    <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                                        {status}
                                    </p>
                                </div>
                                <span className="text-xs text-white/40">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                {quickActions.map(
                    ({ title, description, action, icon: ActionIcon }) => (
                        <div
                            key={title}
                            className="group rounded-2xl border border-white/8 bg-[#0e0f12] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#14151a] hover:shadow-[0_12px_32px_rgba(0,0,0,0.24)]"
                        >
                            <ActionIcon className="h-5 w-5 text-white/80" />
                            <h2 className="mt-4 text-base font-bold text-white">{title}</h2>
                            <p className="mt-2 min-h-10 text-sm leading-5 text-white/45">
                                {description}
                            </p>
                            <button className="mt-5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-300">
                                {action}{" "}
                                <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 text-white/80" />
                            </button>
                        </div>
                    ),
                )}
            </section>
        </div>
    );
}
