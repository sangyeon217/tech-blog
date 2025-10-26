import Image from "next/image";

export default function Introduction() {
  return (
    <section className="mb-10">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="relative overflow-hidden rounded-full w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px] shrink-0">
          <Image
            src="/images/profile.jpeg"
            alt="Sangyeon Song profile"
            fill
            sizes="(max-width: 1024px) 120px, 140px"
            className="object-cover"
            priority
          />
        </div>

        <div className="text-center lg:text-left">
          <h1 className="font-bold text-[24px] md:text-[28px] lg:text-[32px]">Sangyeon Song</h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
            Software QA Engineer
          </p>

          <p className="mt-1 text-neutral-500 dark:text-neutral-400 text-xs md:text-sm">
            Constant learner 📚 · Sharing to grow 🌱
          </p>
        </div>
      </div>
    </section>
  );
}
