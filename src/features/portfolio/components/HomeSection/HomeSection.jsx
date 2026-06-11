import { memo } from "react";
import { useHomeSection } from "../../hooks/useHomeSection";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import HeroContent from "./HeroContent";
import IntroCard from "./IntroCard";
import TechStackSlider from "./TechStackSlider";

const socialLinks = [
  {
    Icon: FaGithub,
    href: "https://github.com/Daffaaditya2807",
    label: "GitHub",
  },
  {
    Icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/daffaadityarejasaruswanto/",
    label: "LinkedIn",
  },
  {
    Icon: FaInstagram,
    href: "https://www.instagram.com/daafaditya/",
    label: "Instagram",
  },
];

function HomeSection({ isLoaded = false, setActiveSection }) {
  const {
    profile,
    techStacks,
    handleDownloadPortfolio,
    handleContactClick,
  } = useHomeSection({ setActiveSection });

  return (
    <section className="relative flex items-center justify-center overflow-hidden py-2">
      <div
        className={`
          z-10 mx-auto w-full max-w-7xl px-4 transition-all duration-1000
          sm:px-6 lg:px-8
          ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
        `}
        style={{ transitionDelay: "300ms" }}
      >
        <HeroContent
          profile={profile}
          onDownloadPortfolio={handleDownloadPortfolio}
          onContactClick={handleContactClick}
        />

        <IntroCard profile={profile} />

        <TechStackSlider techStacks={techStacks} />

        <SocialLinks isLoaded={isLoaded} />
      </div>
    </section>
  );
}

const SocialLinks = memo(function SocialLinks({ isLoaded }) {
  return (
    <div
      className={`
        mt-12 pb-8 transition-all duration-1000
        sm:pb-12
        ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
      `}
      style={{ transitionDelay: "1300ms" }}
    >
      <h3 className="mb-4 text-center text-lg font-semibold text-white sm:text-2xl">
        Sosial Media
      </h3>

      <div className="flex justify-center space-x-4 sm:space-x-6">
        {socialLinks.map(({ Icon, href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group rounded-full border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-12 hover:border-white/50 hover:bg-white/20 sm:p-5"
          >
            <Icon className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-white sm:h-8 sm:w-8" />
          </a>
        ))}
      </div>
    </div>
  );
});

export default memo(HomeSection);