
import MainLayout from "../../../components/layout/MainLayout";
import HomeSection from "../components/HomeSection/HomeSection";
import AboutSection from "../components/AboutSection";
import LabSection from "../components/LabSection";
import ContactSection from "../components/ContactSection";
import { usePortfolioPage } from "../hooks/usePortfolioPage";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "quiz", label: "Quiz", href:"/quiz" },
];

function PortfolioPage() {
const {
    activeSection,
    isLoaded,
    showBottomNav,
    isNavbarOnHero,
    selectedProject,
    setSelectedProject,
    scrollToSection
  } = usePortfolioPage(navItems);

  return (
    <MainLayout
      navItems={navItems}
      activeSection={activeSection}
      scrollToSection={scrollToSection}
      isLoaded={isLoaded}
      isNavbarOnHero={isNavbarOnHero}
      showBottomNav={showBottomNav}
      selectedProject={selectedProject}
    >
      <section id="home" className="flex min-h-screen flex-col">
        <HomeSection
          isLoaded={isLoaded}
          setActiveSection={scrollToSection}
        />
      </section>

      <section
        id="about"
        className="flex min-h-screen items-center justify-center px-4 py-20"
      >
        <AboutSection />
      </section>

      <section
        id="lab"
        className="flex min-h-screen items-center justify-center px-4 py-20"
      >
        <LabSection
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </section>

      <section
        id="contact"
        className="flex min-h-screen items-center justify-center px-4 py-20"
      >
        <ContactSection />
      </section>
    </MainLayout>
  );
}

export default PortfolioPage;