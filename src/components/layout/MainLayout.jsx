import { Code2, Users, Layers3, Worm } from "lucide-react";
import Navbar from "../common/Navbar";
import BottomNavigation from "../common/BottomNavigation";

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

function MainLayout({
  children,
  navItems,
  activeSection,
  scrollToSection,
  isLoaded,
  isNavbarOnHero,
  showBottomNav,
  selectedProject,
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
          color: #030303
          `,
          backgroundSize: "400% 400%",
          // animation: "gradientShift 15s ease infinite",
        }}
      />

      <Navbar
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        isLoaded={isLoaded}
        isNavbarOnHero={isNavbarOnHero}
      />
      
      <BottomNavigation
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        isVisible={showBottomNav && !selectedProject}
      />

      <main className="relative z-20 w-full">
        {children}

        <SocialLinks isLoaded={isLoaded} />
      </main>
    </div>
  );
}

function SocialLinks({ isLoaded }) {
  return (
    <div
      className={`
        flex justify-center space-x-4 pb-8 transition-all duration-1000
        sm:space-x-6 sm:pb-12
        ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
      `}
      style={{ transitionDelay: "1300ms" }}
    >
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
  );
}

export default MainLayout;