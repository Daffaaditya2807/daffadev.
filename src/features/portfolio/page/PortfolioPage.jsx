
import MainLayout from "../../../components/layout/MainLayout";
import SEO from "../../../components/common/SEO";
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
    <>
      <SEO
        title="Daffa Aditya R. R. | Mobile & Website Developer"
        description="Portfoliosss Daffa Aditya R. R., seorang Mobile dan Website Developer yang antusias mempelajari hal baru, membangun aplikasi modern, serta mengembangkan solusi digital yang kreatif dan bermanfaat."
        path="/"
      />

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
          className="flex min-h-screen items-center justify-center px-4 py-5"
        >
          <AboutSection />
        </section>

        <section
          id="lab"
          className="flex min-h-screen items-center justify-center px-4 py-5"
        >
          <LabSection
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </section>

        <section
          id="contact"
          className="flex h-auto items-center justify-center px-4 py-25"
        >
          <ContactSection />
        </section>
      </MainLayout>
    </>
  );
}

export default PortfolioPage;
