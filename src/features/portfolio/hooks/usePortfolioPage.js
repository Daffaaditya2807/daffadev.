import { useCallback, useEffect, useRef, useState } from "react";

export function usePortfolioPage(navItems) {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavbarOnHero, setIsNavbarOnHero] = useState(true);

  const activeSectionRef = useRef("home");
  const isNavbarOnHeroRef = useRef(true);
  const tickingRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSection = activeSectionRef.current;

      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          currentSection = item.id;
          break;
        }
      }

      if (currentSection !== activeSectionRef.current) {
        activeSectionRef.current = currentSection;
        setActiveSection(currentSection);
      }
    };

    const updateNavigationVisibility = () => {
      const homeHero = document.getElementById("home-hero");
      const navbarHeight = 80;

      let nextIsNavbarOnHero = false;

      if (homeHero) {
        const heroBottom =
          homeHero.getBoundingClientRect().bottom + window.scrollY;

        nextIsNavbarOnHero = window.scrollY < heroBottom - navbarHeight;
      }

      if (nextIsNavbarOnHero !== isNavbarOnHeroRef.current) {
        isNavbarOnHeroRef.current = nextIsNavbarOnHero;
        setIsNavbarOnHero(nextIsNavbarOnHero);
      }
    };

    const handleScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      requestAnimationFrame(() => {
        updateActiveSection();
        updateNavigationVisibility();
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (sectionId !== activeSectionRef.current) {
      activeSectionRef.current = sectionId;
      setActiveSection(sectionId);
    }
  }, []);

  return {
    activeSection,
    isLoaded,
    isNavbarOnHero,
    scrollToSection,
  };
}
