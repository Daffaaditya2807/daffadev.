import { Home, User, Briefcase, Mail } from "lucide-react";

const iconMap = {
  Home,
  About: User,
  Lab: Briefcase,
  Contact: Mail,
};

function Navbar({
  navItems = [],
  activeSection,
  setActiveSection,
  isLoaded = false,
  isNavbarOnHero = false,
}) {
  return (
    <nav
      className={`
        fixed left-0 right-0 top-0 z-50 flex items-center justify-between
        px-5 py-4 md:px-8 md:py-6
        transition-all duration-700 ease-out
        ${
          isNavbarOnHero
            ? "translate-y-0 bg-transparent opacity-100"
            : "-translate-y-full bg-transparent opacity-0 pointer-events-none"
        }
      `}
    >
      <div
        className={`
          text-3xl font-bold transition-all duration-1000
          ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
        `}
      >
        <span className="text-white">⚡</span>
      </div>

      <div className="flex items-center space-x-6 rounded-full bg-transparent px-4 py-3 transition-all duration-700 ease-out md:space-x-8">
        {navItems.map((item, index) => {
          const Icon = iconMap[item.label];
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`
                group relative transition-all duration-500
                ${
                  isActive
                    ? "text-white"
                    : isNavbarOnHero
                      ? "text-white/75 hover:text-white"
                      : "text-gray-400 hover:text-white"
                }
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0"
                }
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="hidden md:inline">{item.label}</span>

              {Icon && <Icon className="h-5 w-5 md:hidden" />}

              <span
                className={`
                  absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300
                  ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                `}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;