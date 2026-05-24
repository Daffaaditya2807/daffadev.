import { useAboutSection } from "../hooks/useAboutSection";
import memojiImage from "../../../assets/images/userpng.png";
import { supabase } from "@/core/supabase";

const STORAGE_BUCKET = "portfolio-assets";

const getPublicImageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
};

function AboutSection() {
  const { experienceRef, scrollProgress , profile , experiencess } = useAboutSection();
  const dynamicAboutImage = profile?.about_image ? getPublicImageUrl(profile.about_image) : memojiImage;

console.log(experiencess)


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
                height: `calc((100% - 1.5rem) * ${scrollProgress})`,
              }}
            />

            {experiencess.map((experience) => (
              <ExperienceItem
                key={experience.title}
                experience={experience}
                isActive={scrollProgress > experience.activeAt}
              />
            ))}
          </div>
        </div>

        <ProfileImage imageSrc={dynamicAboutImage} />
      </div>
    </section>
  );
}

function ExperienceItem({ experience, isActive }) {
  // Fungsi untuk memformat tanggal (contoh: "Jan 2023")
  const formatDate = (dateString) => {
    if (!dateString) return "Sekarang"; // Jika null, berarti pekerjaan masih berlangsung
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative">
      <span
        className={`
          absolute -left-8 top-2 h-6 w-6 rounded-full border-2 bg-black
          transition-all duration-500
          ${
            isActive
              ? "border-white shadow-[0_0_24px_rgba(255,255,255,0.65)]"
              : "border-white/35 shadow-none"
          }
        `}
      />

      <div
        className={`
          rounded-2xl border bg-white/5 p-5 backdrop-blur-md
          transition-all duration-500
          ${
            isActive
              ? "border-white/40 shadow-[0_0_28px_rgba(255,255,255,0.14)]"
              : "border-white/10"
          }
        `}
      >
        <h4 className="text-lg font-semibold text-white">
          {experience.company}
        </h4>

        {/* Baris Posisi dan Tanggal */}
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-400">
            {experience.position}
          </p>
          <p className="mt-1 text-xs text-gray-500 sm:mt-0 font-mono">
            {formatDate(experience.date_start)} — {formatDate(experience.date_end)}
          </p>
        </div>

        <p className="mt-4 leading-relaxed text-gray-300">
          {experience.description}
        </p>
      </div>
    </div>
  );
}

function ProfileImage({imageSrc}) {
  return (
    <div className="flex justify-center">
      <div className="group relative">
        <div className="relative h-100 w-80 overflow-hidden rounded-3xl border border-white/30 bg-linear-to-br from-white/20 via-white/10 to-white/5 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-white/20">
          <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-gray-400/10 via-transparent to-blue-400/10" />

          <div className="absolute left-2 top-2 h-16 w-16 rounded-full bg-white/20 blur-xl" />
          <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-blue-400/30 blur-lg" />

          <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
            <img
              src={imageSrc}
              alt="Ilustrasi profil"
              className="h-full w-full object-contain drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]"
            />
          </div>

          <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-gray-400/50 via-gray-400/50 to-gray-400/50 p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="h-full w-full rounded-3xl bg-transparent" />
          </div>
        </div>

        <div className="absolute -inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute left-4 top-4 h-2 w-2 animate-pulse rounded-full bg-gray-400" />
          <div className="absolute right-8 top-12 h-1 w-1 animate-ping rounded-full bg-gray-400" />
          <div className="absolute bottom-8 left-12 h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          <div className="absolute bottom-4 right-4 h-1 w-1 animate-ping rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
