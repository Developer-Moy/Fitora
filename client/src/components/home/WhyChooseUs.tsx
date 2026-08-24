"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BsCheckCircleFill } from "react-icons/bs";

const features = [
    {
        title: "Expert Trainers",
        description:
            "Our certified trainers provide personalized guidance and expert advice to help you achieve your fitness goals.",
    },
    {
        title: "State-of-the-Art Equipment",
        description:
            "Work out with modern, high-quality fitness equipment designed for a better and more effective experience.",
    },
    {
        title: "Comprehensive Programs",
        description:
            "Choose from personalized programs designed to support strength, fitness, mobility, and long-term progress.",
    },
];

const images = [
    {
        src: "/choose1.jpg.jpeg",
        alt: "Modern gym training area",
    },
    {
        src: "/choose2.jpg.jpeg",
        alt: "Gym member training",
    },
    {
        src: "/choose3.jpg.jpeg",
        alt: "Outdoor fitness training",
    },
];

export default function WhyChooseUs() {
    const shouldReduceMotion = useReducedMotion();

    const imageContainer = {
        hidden: {
            opacity: 0,
            x: shouldReduceMotion ? 0 : -40,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    const contentContainer = {
        hidden: {
            opacity: 0,
            x: shouldReduceMotion ? 0 : 40,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    return (
        <section className="bg-white py-20 text-gray-900 transition-colors duration-300 dark:bg-black dark:text-white md:py-24">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
                <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:grid-cols-2 lg:gap-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="space-y-3.5">

                        {images.map((image, index) => (
                            <motion.div
                                key={image.src}
                                variants={imageContainer}
                                transition={{
                                    delay: index * 0.12,
                                }}
                                className="group relative h-36.25 overflow-hidden rounded-2xl sm:h-41.25 md:h-37.5 lg:h-43.75">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-black/0" />

                                <div className="absolute inset-y-0 left-0 w-1/3 translate-x-[-180%] skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[450%]" />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={contentContainer}
                    >

                        <h2 className="max-w-md text-4xl font-black leading-[1.02] tracking-[-0.045em] text-gray-950 dark:text-white sm:text-5xl">
                            Why Choose FitLife
                            <br />
                            <span>
                                Studio?
                            </span>
                        </h2>

                        <p className=" mt-5 max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-[15px] sm:leading-7">
                            Discover the benefits that set us apart and propel your fitness
                            journey forward. Everything you need to become stronger,
                            healthier, and more confident.
                        </p>

                        <div className="mt-7 space-y-5">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{
                                        opacity: 0,
                                        y: shouldReduceMotion ? 0 : 18,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                        amount: 0.25,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.12,
                                    }}
                                    className="group flex gap-3"
                                >

                                    <BsCheckCircleFill className="mt-0.5 h-4.5 w-4.5 shrink-0  transition-transform duration-300 group-hover:scale-110" />

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400 sm:text-base">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-1 max-w-lg text-xs leading-5 text-gray-600 dark:text-gray-400 sm:text-sm sm:leading-6">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: shouldReduceMotion ? 0 : 15,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: 0.45,
                            }}
                            className="mt-7"
                        >
                            <Link
                                href="/contact"
                                className="group inline-flex items-center gap-2 rounded-lg bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-lg hover:shadow-green-600/20 dark:bg-white dark:text-gray-950 dark:hover:bg-green-500 sm:px-6 sm:py-3">
                                Free Trial Today

                                <ArrowUpRight
                                    className=" h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}