import Image from "next/image";

const coachesData = {
    images: [
        {
            src: "/Trainers&CoachesImg/Coache1.jpg",
            alt: "Fitness coach",
            className: "w-[38%]",
        },
        {
            src: "/Trainers&CoachesImg/Coache2.jpg",
            alt: "Personal training coach",
            className: "flex-1",
        },
    ],
    subtitle: "Are you looking for a Mentor?",
    title: "Coaches",
    description:
        "Achieve your personal fitness goals with one-on-one guidance from our certified master coaches. We provide tailored training plans, nutrition advice, and constant motivation to help you transform safely and effectively.",
};

const CoachesSection = () => {
    return (
        <section className="w-full bg-white py-12 md:py-16 lg:py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-5 md:px-8 lg:flex-row lg:gap-16">
                {/* Images */}
                <div className="flex w-full items-center gap-3 sm:gap-4 lg:w-1/2">
                    {coachesData.images.map((image) => (
                        <div
                            key={image.src}
                            className={`relative h-55 overflow-hidden rounded-2xl sm:h-[280px] md:h-[330px] ${image.className}`}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority
                                className="h-full w-full object-cover"
                                sizes="(max-width: 768px) 50vw, 30vw"
                            />
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                    <p className="mb-2 text-sm text-[#9E9E9E]">
                        {coachesData.subtitle}
                    </p>

                    <h2 className="mb-4 text-3xl font-bold text-[#424242] sm:text-4xl">
                        {coachesData.title}
                    </h2>

                    <p className="max-w-xl text-sm leading-relaxed text-[#9E9E9E] sm:text-base">
                        {coachesData.description}
                    </p>

                    <button
                        type="button"
                        className="mt-6 rounded-md bg-[#424242] px-5 py-2.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                        Explore More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CoachesSection;