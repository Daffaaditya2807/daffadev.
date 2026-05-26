import { useEffect, useRef, useState } from "react";

export function usePortfolioPage( navItems ) {
  const [activeSection, setActiveSection] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [isNavbarOnHero, setIsNavbarOnHero] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const loadedRef = useRef(false);

  if (!loadedRef.current) {
    loadedRef.current = true;
    requestAnimationFrame(() => setIsLoaded(true));
  }

  useEffect(() => {
    // 1. Pindahkan fungsi ke dalam useEffect
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (!element) return;
        
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(item.id);
        }
      });
    };

    const updateNavigationVisibility = () => {
      const homeHero = document.getElementById("home-hero");
      const navbarHeight = 80;

      if (!homeHero) {
        setIsNavbarOnHero(false);
        setShowBottomNav(true);
        return;
      }

      const heroBottom = homeHero.getBoundingClientRect().bottom + window.scrollY;
      const isStillOnHero = window.scrollY < heroBottom - navbarHeight;

      setIsNavbarOnHero(isStillOnHero);
      setShowBottomNav(!isStillOnHero);
    };

    // 2. Sekarang handleScroll bisa langsung memanggilnya tanpa warning
    const handleScroll = () => {
      updateActiveSection();
      updateNavigationVisibility();
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navItems]); // Hanya navItems yang perlu masuk dependency array

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setActiveSection(sectionId);
  };

  return {
    activeSection,
    isLoaded,
    showBottomNav,
    isNavbarOnHero,
    selectedProject,
    setSelectedProject,
    scrollToSection
  };
}