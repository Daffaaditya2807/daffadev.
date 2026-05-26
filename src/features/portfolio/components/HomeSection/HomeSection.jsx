import { useHomeSection } from "../../hooks/useHomeSection";
import { Code2, Users, Layers3, Worm } from "lucide-react";
import HeroContent from "./HeroContent";
import IntroCard from "./IntroCard";
import TechStackSlider from "./TechStackSlider";
const socialLinks = [
  {
    Icon: Code2,
    href: "https://github.com/Daffaaditya2807",
    label: "GitHub",
  },
  {
    Icon: Layers3,
    href: "https://www.linkedin.com/in/daffaadityarejasaruswanto/",
    label: "LinkedIn",
  },
  {
    Icon: Users,
    href: "https://www.instagram.com/daafaditya/",
    label: "Instagram",
  },
  {
    Icon: Worm,
    href: "mailto:daffaaditya2912@gmail.com",
    label: "Email",
  },
];
function HomeSection({ isLoaded = false, setActiveSection }) {
  const {
    profile,
    techStacks,
    typingText,
    handleDownloadCV,
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
          onDownloadCV={handleDownloadCV}
          onDownloadPortfolio={handleDownloadPortfolio}
          onContactClick={handleContactClick}
        />

        <IntroCard typingText={typingText} profile={profile} />

        <TechStackSlider techStacks={techStacks} />
        <SocialLinks isLoaded={isLoaded} />
      </div>
    </section>
  );
}

function SocialLinks({ isLoaded }) {
  return (
    <div
      className={`
        mt-12 pb-8 transition-all duration-1000
        sm:pb-12
        ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
      `}
      style={{ transitionDelay: "1300ms" }}
    >
      <h3 className="mb-4 text-center text-lg font-semibold text-white sm:text-xl">
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
            className="group rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-12 hover:border-white/50 hover:bg-white/20 sm:p-3"
          >
            <Icon className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-white sm:h-6 sm:w-6" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default HomeSection;
