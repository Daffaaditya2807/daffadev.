import Navbar from "../common/Navbar";
// import BottomNavigation from "../common/BottomNavigation";
import Footer from "../common/Footer";
import SpotifyWidget from "../common/SpotifyWidget";

function MainLayout({
  children,
  navItems,
  activeSection,
  scrollToSection,
  isLoaded,
  isNavbarOnHero,
  // showBottomNav,
  // selectedProject,
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#030303",
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
      
      {/* <BottomNavigation
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        isVisible={showBottomNav && !selectedProject}
      /> */}

      <main className="relative z-20 w-full">
        {children}
      </main>

      <Footer />
      <SpotifyWidget />
    </div>
  );
}



export default MainLayout;
