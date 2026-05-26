import { ArrowUpRight } from "lucide-react";
import heroImage from "../../../../assets/images/daff-rgb.png";
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

function HeroContent({ profile, onDownloadPortfolio, onContactClick }) {
  const heroName = profile?.name?.split(" ")[0] || "Daffa";
  const heroAlt = profile?.name || "Daffa Aditya Rejasa Ruswanto";
  const heroTextOne =
    profile?.text_hero_1 ||
    "Software engineer yang fokus membangun pengalaman mobile dan web yang rapi, responsif, dan mudah digunakan.";
  const heroTextTwo =
    profile?.text_hero_2 ||
    "Menggabungkan mobile development, frontend, dan backend untuk membuat produk digital yang berjalan stabil dan terlihat profesional.";
    
  const dynamicHeroImage =
    getPublicImageUrl(profile?.hero_image_rgb) ||
    getPublicImageUrl(profile?.hero_image_bw) ||
    heroImage;

  return (
<div
  id="home-hero"
  className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#0a0a0a]"
>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_72%_35%,rgba(255,255,255,0.13),transparent_22%),linear-gradient(135deg,#050505_0%,#111111_45%,#000000_100%)]" />
      <div className="absolute -left-20 top-16 h-80 w-80 rounded-full border border-white/10" />
      <div className="absolute left-1/3 top-14 h-120 w-120 rounded-full border-[5rem] border-white/4" />

      {/* Mobile Layout */}
      <div className="relative z-10 flex min-h-screen flex-col px-5 pt-24 lg:hidden">
        <h1 className="text-center text-[4.5rem] font-black uppercase leading-none tracking-normal text-white sm:text-[7rem] md:text-[9rem]">
          {heroName}
        </h1>

        <div className="relative z-20 -mt-6 flex justify-center sm:-mt-8">
          <img
            src={dynamicHeroImage}
            alt={heroAlt}
            loading="lazy"
            // 👇 Perubahan ada di sini: penambahan class transisi dan hover
            className="h-105 max-w-none object-contain opacity-100 grayscale contrast-110 transition-all duration-500 hover:grayscale-0 hover:contrast-100 sm:h-130"
          />
        </div>

        <div className="relative z-30 mt-4 grid gap-6 pb-12 text-center sm:mx-auto sm:max-w-xl">
          <div>
            <p className="text-sm leading-relaxed text-white sm:text-base">
              {heroTextOne}
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm leading-relaxed text-white sm:text-base">
              {heroTextTwo}
            </p>

            <button
              type="button"
              onClick={onDownloadPortfolio}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200"
            >
              Download Porto

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 hidden min-h-170 lg:block">
        <h1 className="absolute left-4 right-4 top-10 z-10 text-center text-[11rem] font-black uppercase leading-none tracking-normal text-white xl:text-[13rem]">
          {heroName}
        </h1>

        <img
          src={dynamicHeroImage}
          loading="lazy"
          alt={heroAlt}
          // 👇 Perubahan ada di sini: penambahan class transisi dan hover
          className="absolute bottom-0 left-1/2 z-20 h-[88%] max-w-none -translate-x-1/2 object-contain opacity-100 grayscale contrast-110 transition-all duration-500 hover:grayscale-0 hover:contrast-100"
        />

<div className="absolute inset-x-0 bottom-0 z-30 h-1/2 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/35 to-transparent pointer-events-none" />

        <div className="absolute left-10 top-[46%] z-40 max-w-xs text-left">
          <p className="text-base leading-relaxed text-white">
            {heroTextOne}
          </p>

          <div className="mt-5 flex items-center gap-3">


            <button
              type="button"
              onClick={onContactClick}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:scale-105 hover:bg-white/20"
              aria-label="Hubungi Daffa"
            >
              <ArrowUpRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 right-10 z-40 max-w-xs text-left">
          <p className="mb-4 text-base leading-relaxed text-white">
            {heroTextTwo}
          </p>

          <button
            type="button"
            onClick={onDownloadPortfolio}
            className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200"
          >
            Download Porto

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
