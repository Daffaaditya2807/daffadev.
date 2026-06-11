import { memo } from "react";
import { useAboutSection } from "../hooks/useAboutSection";
import memojiImage from "../../../assets/images/userpng.png";
import { supabase } from "@/core/supabase";

const STORAGE_BUCKET = "portfolio-assets";

const getPublicImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
};

function AboutSection() {
  const { experienceRef, profile, experiences } = useAboutSection();

  const dynamicAboutImage = profile?.about_image
    ? getPublicImageUrl(profile.about_image)
    : memojiImage;

  return (
    <section className="mx-auto max-w-6xl animate-fade-in">
      <h2 className="mb-12 text-center text-4xl font-bold text-white md:text-5xl">
        Tentang Saya
      </h2>

      <div className="mb-2 grid items-center gap-12 md:grid-cols-2">
        <div>
          <h3 className="mb-6 text-2xl font-bold text-white">
            Pengalaman Kerja
          </h3>

          <div ref={experienceRef} className="relative space-y-10 pl-8">
            <span className="absolute left-3 top-3 h-[calc(100%-1.5rem)] w-px bg-white/15" />

            <span
              className="absolute left-3 top-3 w-px bg-linear-to-b from-white via-gray-300 to-white shadow-[0_0_18px_rgba(255,255,255,0.55)] transition-all duration-300 ease-out"
              style={{
                height: "calc((100% - 1.5rem) * var(--scroll-progress, 0))",
              }}
            />

            {experiences.map((experience) => (
              <ExperienceItem
                key={experience.id ?? experience.title ?? experience.company}
                experience={experience}
              />
            ))}
          </div>
        </div>

        <ProfileImage imageSrc={dynamicAboutImage} />
      </div>
    </section>
  );
}

const ExperienceItem = memo(function ExperienceItem({ experience }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Sekarang";

    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="group/experience relative"
      data-active="false"
      data-experience-active-at={experience.activeAt}
    >
      <span
        className={`
          absolute -left-8 top-2 h-6 w-6 rounded-full border-2 bg-black
          transition-all duration-500
          border-white/35 shadow-none
          group-data-[active=true]/experience:border-white
          group-data-[active=true]/experience:shadow-[0_0_24px_rgba(255,255,255,0.65)]
        `}
      />

      <div
        className={`
          rounded-2xl border bg-white/5 p-5 backdrop-blur-md
          transition-all duration-500
          border-white/10
          group-data-[active=true]/experience:border-white/40
          group-data-[active=true]/experience:shadow-[0_0_28px_rgba(255,255,255,0.14)]
        `}
      >
        <h4 className="text-lg font-semibold text-white">
          {experience.company}
        </h4>

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-400">
            {experience.position}
          </p>

          <p className="mt-1 font-mono text-xs text-gray-500 sm:mt-0">
            {formatDate(experience.date_start)} —{" "}
            {formatDate(experience.date_end)}
          </p>
        </div>

        <p className="mt-4 leading-relaxed text-gray-300">
          {experience.description}
        </p>
      </div>
    </div>
  );
});

const ProfileImage = memo(function ProfileImage({ imageSrc }) {
  return (
    <div className="flex justify-center">
      <div className="group relative">
        <div className="relative h-100 w-80 overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105">
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <img
              src={imageSrc}
              alt="Ilustrasi profil"
              loading="lazy"
              decoding="async"
              className="h-full w-full rounded-3xl object-cover drop-shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute -inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute left-4 top-4 h-2 w-2 animate-pulse rounded-full bg-gray-400" />
          <div className="absolute right-8 top-12 h-1 w-1 animate-ping rounded-full bg-gray-400" />
          <div className="absolute bottom-8 left-12 h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          <div className="absolute bottom-4 right-4 h-1 w-1 animate-ping rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
});

export default memo(AboutSection);
