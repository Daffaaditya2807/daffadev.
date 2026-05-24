import { useHomeSection } from "../../hooks/useHomeSection";
import HeroContent from "./HeroContent";
import IntroCard from "./IntroCard";
import TechStackSlider from "./TechStackSlider";

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
      </div>
    </section>
  );
}

export default HomeSection;
