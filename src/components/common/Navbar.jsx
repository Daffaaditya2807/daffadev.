import { Home, User, Briefcase, Mail, Newspaper, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  Home,
  About: User,
  Lab: Briefcase,
  Contact: Mail,
  Blog: Newspaper,
  Quiz: Trophy,
};

function Navbar({
  navItems = [],
  activeSection,
  setActiveSection,
  isLoaded = false,
  isNavbarOnHero = false,
}) {
  const navigate = useNavigate()
  return (
    <nav
      className={`
        fixed left-0 right-0 top-0 z-50 flex items-center justify-between
        px-5 py-2.5 md:px-8 md:py-3.5
        translate-y-0 opacity-100
        transition-all duration-700 ease-out
        ${
          isNavbarOnHero
            ? "bg-transparent"
            : " bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-2xl backdrop-saturate-150"
        }
      `}
    >
      <div
        className={`
          flex items-center text-3xl font-bold transition-all duration-1000
          ${isLoaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}
        `}
      >
        <img src="/daf-dev.png" alt="DaffaDev Logo" className="h-8 w-auto object-contain" />
        <span
          className={`
            hidden overflow-hidden whitespace-nowrap text-white font-display md:inline-block
            transition-all duration-500 ease-out
            ${
              isNavbarOnHero
                ? "ml-0 max-w-0 -translate-x-2 opacity-0"
                : "ml-1 max-w-40 translate-x-0 opacity-100"
            }
          `}
        >
          affa.
        </span>
      </div>

      <div
        className={`
          flex items-center space-x-6 rounded-full bg-transparent px-3 py-2
          transition-all duration-700 ease-out md:space-x-8
        `}
      >
        {navItems.map((item, index) => {
          const Icon = iconMap[item.label];
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => item.href ? navigate(item.href) : setActiveSection(item.id)}
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
