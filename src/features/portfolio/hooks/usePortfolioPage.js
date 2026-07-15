import { useCallback, useEffect, useState } from "react";

export function usePortfolioPage(navItems) {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavbarOnHero, setIsNavbarOnHero] = useState(true);

  useEffect(() => {
    setIsLoaded(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      const homeHero = document.getElementById("home-hero");
      if (homeHero) {
        setIsNavbarOnHero(window.scrollY < homeHero.getBoundingClientRect().bottom + window.scrollY - 80);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  const scrollToSection = useCallback((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId);
  }, []);

  return { activeSection, isLoaded, isNavbarOnHero, scrollToSection };
}
