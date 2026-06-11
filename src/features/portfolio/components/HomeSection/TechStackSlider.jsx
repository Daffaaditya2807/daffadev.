import { memo, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { techStacks as defaultTechStacks } from "../../data/homeSectionData";
import TechStackItem from "./TechStackItem";

import "swiper/css";
import "swiper/css/navigation";

function TechStackSlider({ techStacks = defaultTechStacks }) {
  const swiperModules = useMemo(() => [Navigation, Autoplay], []);

  return (
    <div className="mx-auto mt-8 max-w-5xl">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <h2 className="text-2xl font-semibold text-white">Tech Stack</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="tech-stack-prev flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
            aria-label="Geser tech stack ke kiri"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="tech-stack-next flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
            aria-label="Geser tech stack ke kanan"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Swiper
        modules={swiperModules}
        navigation={{
          prevEl: ".tech-stack-prev",
          nextEl: ".tech-stack-next",
        }}
        autoplay={{
          delay: 2600,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={techStacks.length > 5}
        spaceBetween={14}
        slidesPerView={2}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="w-full"
      >
        {techStacks.map((tech) => (
          <SwiperSlide key={tech.name}>
            <TechStackItem tech={tech} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default memo(TechStackSlider);