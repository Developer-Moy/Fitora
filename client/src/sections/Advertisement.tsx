import { motion, type Variants } from "framer-motion";
import Marquee from "react-fast-marquee";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IconType } from "react-icons";
import {
    FaDumbbell,
    FaAppleWhole,
    FaShirt,
    FaPersonRunning,
    FaHeartPulse, 
    FaStar,
    FaArrowRight,
    FaLocationDot,
    FaFire,
} from "react-icons/fa6";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type AdCategory = "Equipment" | "Gym" | "Nutrition" | "Sportswear" | "Training";
type AdAccent = "emerald" | "cyan" | "rose";

interface Advertisement {
    id: string;
    brand: string;
    title: string;
    description: string;
    category: AdCategory;
    badge?: string;
    price: string;
    oldPrice?: string;
    discount?: string;
    rating: number;
    location?: string;
    ctaText: string;
    icon: IconType;
    accent: AdAccent;
    featured?: boolean;
}

const advertisements: Advertisement[] = [
    {
        id: "ad-1",
        brand: "IronPeak Athletics",
        title: "Elite 12-Month Gym Membership",
        description:
            "Unlimited access to 40+ premium gyms, recovery zones, group classes, and a free personal training session every month.",
        category: "Gym",
        badge: "Featured",
        price: "$49/mo",
        oldPrice: "$79/mo",
        discount: "38% off",
        rating: 4.9,
        location: "Austin, TX",
        ctaText: "Claim Offer",
        icon: FaDumbbell,
        accent: "emerald",
        featured: true,
    },
    {
        id: "ad-2",
        brand: "PulseFlex",
        title: "Adjustable Dumbbell Set 5-52.5 lb",
        description:
            "Space-saving quick-adjust dumbbells with anti-slip grip and durable steel plates for any home workout.",
        category: "Equipment",
        badge: "Best Seller",
        price: "$329",
        oldPrice: "$449",
        discount: "27% off",
        rating: 4.8,
        location: "Online",
        ctaText: "Shop Now",
        icon: FaDumbbell,
        accent: "cyan",
    },
    {
        id: "ad-3",
        brand: "VitalBite",
        title: "Plant-Based Performance Protein",
        description:
            "24g protein per scoop with zero added sugar. Chocolate, vanilla, and berry flavors for faster recovery.",
        category: "Nutrition",
        badge: "New Flavor",
        price: "$39",
        oldPrice: "$54",
        discount: "28% off",
        rating: 4.7,
        location: "Online",
        ctaText: "Buy Now",
        icon: FaAppleWhole,
        accent: "emerald",
    },
    {
        id: "ad-4",
        brand: "AeroStride",
        title: "MotionFlex Running Shoes",
        description:
            "Lightweight, breathable running shoes with responsive cushioning for road and trail performance.",
        category: "Sportswear",
        badge: "Limited Offer",
        price: "$119",
        oldPrice: "$159",
        discount: "25% off",
        rating: 4.6,
        location: "Online",
        ctaText: "Shop Now",
        icon: FaPersonRunning,
        accent: "rose",
    },
    {
        id: "ad-5",
        brand: "FitTrack Pro",
        title: "Smart Heart Rate Armband",
        description:
            "Accurate optical heart rate monitoring with 10-day battery and Bluetooth/ANT+ connectivity.",
        category: "Equipment",
        badge: "Popular",
        price: "$79",
        oldPrice: "$99",
        discount: "20% off",
        rating: 4.5,
        location: "Online",
        ctaText: "Get Yours",
        icon: FaHeartPulse,
        accent: "cyan",
    },
    {
        id: "ad-6",
        brand: "FlexGear",
        title: "Weightlifting Belt & Wrist Wraps Bundle",
        description:
            "Heavy-duty leather belt and adjustable wrist wraps for safe, stable heavy lifting.",
        category: "Equipment",
        badge: "Bundle Deal",
        price: "$59",
        oldPrice: "$85",
        discount: "31% off",
        rating: 4.7,
        location: "Online",
        ctaText: "Shop Now",
        icon: FaDumbbell,
        accent: "emerald",
    },
    {
        id: "ad-8",
        brand: "ZenRun",
        title: "Performance Running Shorts",
        description:
            "Sweat-wicking, quick-dry running shorts with zip pockets and reflective details for early morning runs.",
        category: "Sportswear",
        badge: "Eco Fabric",
        price: "$44",
        oldPrice: "$59",
        discount: "25% off",
        rating: 4.4,
        location: "Online",
        ctaText: "Shop Now",
        icon: FaShirt,
        accent: "cyan",
    },
];

const accentStyles: Record<
    AdAccent,
    {
        icon: string;
        hoverBorder: string;
        glow: string;
        badge: string;
    }
> = {
    emerald: {
        icon: "bg-emerald-400/10 text-emerald-300",
        hoverBorder: "hover:border-emerald-400/50",
        glow: "hover:shadow-[0_0_35px_-12px_rgba(16,185,129,0.4)]",
        badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    },
    cyan: {
        icon: "bg-cyan-400/10 text-cyan-300",
        hoverBorder: "hover:border-cyan-400/50",
        glow: "hover:shadow-[0_0_35px_-12px_rgba(34,211,238,0.35)]",
        badge: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/25",
    },
    rose: {
        icon: "bg-rose-400/10 text-rose-300",
        hoverBorder: "hover:border-rose-400/50",
        glow: "hover:shadow-[0_0_35px_-12px_rgba(251,113,133,0.35)]",
        badge: "bg-rose-400/10 text-rose-300 ring-rose-400/25",
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

interface AdvertisementCardProps {
    ad: Advertisement;
    className?: string;
}

function AdvertisementCard({ ad, className }: AdvertisementCardProps) {
    const Icon = ad.icon;
    const accent = accentStyles[ad.accent];

    return (
        <motion.article
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className={cn(
                "group flex flex-col rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-slate-900/90 overflow-hidden",
                accent.hoverBorder,
                accent.glow,
                className,
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div
                    className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        accent.icon,
                    )}
                >
                    <Icon size={24} aria-hidden="true" />
                </div>
                {ad.badge ? (
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                            accent.badge,
                        )}
                    >
                        {ad.badge}
                    </span>
                ) : null}
            </div>

            <div className="mt-5 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {ad.brand} · {ad.category}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug text-slate-100">
                    {ad.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {ad.description}
                </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                    <FaStar size={14} aria-hidden="true" />
                    <span className="font-medium text-slate-300">
                        {ad.rating.toFixed(1)}
                    </span>
                </div>
                {ad.location ? (
                    <div className="flex items-center gap-1 text-slate-500">
                        <FaLocationDot size={14} aria-hidden="true" />
                        <span>{ad.location}</span>
                    </div>
                ) : null}
            </div>

            <div className="mt-5 flex flex-col gap-4 border-t border-slate-700/60 pt-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-bold text-slate-100">{ad.price}</span>
                        {ad.oldPrice ? (
                            <span className="text-sm text-slate-500 line-through">
                                {ad.oldPrice}
                            </span>
                        ) : null}
                    </div>
                    {ad.discount ? (
                        <span className="mt-1 inline-block rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-300 ring-1 ring-inset ring-rose-400/20">
                            {ad.discount}
                        </span>
                    ) : null}
                </div>

                <button
                    type="button"
                    aria-label={`${ad.ctaText} for ${ad.title}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.97] sm:w-auto"
                >
                    {ad.ctaText}
                    <FaArrowRight size={14} aria-hidden="true" />
                </button>
            </div>
        </motion.article>
    );
}

function FeaturedAd({ ad }: { ad: Advertisement }) {
    const Icon = ad.icon;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur-xl transition duration-300 hover:border-emerald-400/40 hover:shadow-[0_0_45px_-15px_rgba(16,185,129,0.4)] md:p-8"
        >
            {ad.badge ? (
                <span className="absolute right-6 top-6 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
                    {ad.badge}
                </span>
            ) : null}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start lg:flex-1">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                        <Icon size={28} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {ad.brand} · {ad.category}
                        </p>
                        <h3 className="mt-2 text-xl font-bold leading-snug text-slate-100 sm:text-2xl">
                            {ad.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                            {ad.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center gap-1 text-amber-400">
                                <FaStar size={14} aria-hidden="true" />
                                <span className="font-medium text-slate-200">
                                    {ad.rating.toFixed(1)}
                                </span>
                            </div>
                            {ad.location ? (
                                <div className="flex items-center gap-1 text-slate-400">
                                    <FaLocationDot size={14} aria-hidden="true" />
                                    <span>{ad.location}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-4 rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 lg:min-w-65 lg:items-end">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-3xl font-bold text-slate-100">{ad.price}</span>
                        {ad.oldPrice ? (
                            <span className="text-lg text-slate-500 line-through">
                                {ad.oldPrice}
                            </span>
                        ) : null}
                    </div>
                    {ad.discount ? (
                        <span className="inline-block rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 ring-1 ring-inset ring-rose-400/20">
                            {ad.discount}
                        </span>
                    ) : null}
                    <button
                        type="button"
                        aria-label={`${ad.ctaText} for ${ad.title}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.97] lg:w-auto"
                    >
                        {ad.ctaText}
                        <FaArrowRight size={14} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

const featuredAd = advertisements.find((ad) => ad.featured);
const normalAds = advertisements.filter((ad) => !ad.featured);

export default function Advertisement() {
    return (
        <section
            aria-labelledby="advertisements-heading"
            className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mb-10 flex flex-col gap-5 md:mb-12"
                >
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                            <FaFire size={20} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                            Fitness Marketplace
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h2
                            id="advertisements-heading"
                            className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-100"
                        >
                            Power Your Fitness Journey
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                            Fitora partners with trusted brands and coaches to bring you
                            equipment, nutrition, apparel, and services that keep you moving
                            forward.
                        </p>
                    </div>
                </motion.div>

                <div className="space-y-6 md:space-y-8">
                    {featuredAd ? <FeaturedAd key={featuredAd.id} ad={featuredAd} /> : null}

                    {normalAds.length > 0 ? (
                        <div className="overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] mask-[linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
                            <Marquee
                                speed={40}
                                pauseOnHover
                                autoFill
                                className="py-1"
                            >
                                {normalAds.map((ad) => (
                                    <AdvertisementCard
                                        key={ad.id}
                                        ad={ad}
                                        className="w-75 h-85 shrink-0 sm:w-[320px] sm:h-87.5 lg:w-90 lg:h-90 mr-5"
                                    />
                                ))}
                            </Marquee>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}