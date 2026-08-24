import Image from "next/image";

const trainers = [
  {
    src: "/image4.jpg.jpeg",
    alt: "Alex Carter",
    name: "Alex Carter",
    mobileOrder: "order-2",
    mobileSpan: "col-span-1",
    desktopOrder: "md:order-1",
    desktopSpan: "md:col-span-1",
  },
  {
    src: "/image5.jpg.jpeg",
    alt: "Ryan Mitchell",
    name: "Ryan Mitchell",
    mobileOrder: "order-1",
    mobileSpan: "col-span-2",
    desktopOrder: "md:order-2",
    desktopSpan: "md:col-span-2",
  },
  {
    src: "/image6.jpg.jpeg",
    alt: "Daniel Brooks",
    name: "Daniel Brooks",
    mobileOrder: "order-3",
    mobileSpan: "col-span-1",
    desktopOrder: "md:order-3",
    desktopSpan: "md:col-span-1",
  },
  {
    src: "/image7.jpg.jpeg",
    alt: "Ethan Parker",
    name: "Ethan Parker",
    mobileOrder: "order-4",
    mobileSpan: "col-span-2",
    desktopOrder: "md:order-4",
    desktopSpan: "md:col-span-2",
  },
  {
    src: "/image8.jpg.jpeg",
    alt: "Michael Reed",
    name: "Michael Reed",
    mobileOrder: "order-5",
    mobileSpan: "col-span-1",
    desktopOrder: "md:order-5",
    desktopSpan: "md:col-span-1",
  },
  {
    src: "/image9.jpg.jpeg",
    alt: "James Wilson",
    name: "James Wilson",
    mobileOrder: "order-6",
    mobileSpan: "col-span-1",
    desktopOrder: "md:order-6",
    desktopSpan: "md:col-span-1",
  },
];

const Trainers = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="text-3xl font-bold text-[#424242] sm:text-4xl">
            Meet Our Trainers
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#9E9E9E] sm:text-base">
            Our experienced trainers are dedicated to helping you reach your
            fitness goals with personalized guidance, expert knowledge, and
            constant motivation.
          </p>
        </div>

        {/* Trainer Gallery */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trainers.map((trainer) => (
            <div
              key={trainer.src}
              className={`
                group relative h-55 overflow-hidden rounded-xl
                sm:h-65
                md:h-70
                ${trainer.mobileSpan}
                ${trainer.mobileOrder}
                ${trainer.desktopSpan}
                ${trainer.desktopOrder}
              `}
            >
              <Image
                src={trainer.src}
                alt={trainer.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 767px) 50vw, 25vw"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-end bg-black/0 p-5 transition-all duration-300 group-hover:bg-black/45">
                <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-white">
                    Trainer
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {trainer.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
