import { Home, User, Beaker, Mail, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  home: Home,
  about: User,
  lab: Beaker,
  contact: Mail,
  blog: Newspaper,
};

function BottomNavigation({
  navItems = [],
  activeSection,
  setActiveSection,
  isVisible = true,
}) {
  const navigate = useNavigate()

  const handleClick = (item) => {
    if (item.href) {
      navigate(item.href)
    } else {
      setActiveSection(item.id)
    }
  }

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 z-50 w-fit -translate-x-1/2
        transition-all duration-500 ease-in-out
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }
      `}
    >
      <div
        className="
          relative overflow-hidden rounded-full
          border border-white/25
          bg-white/10 px-2 py-2
          shadow-[0_8px_32px_rgba(0,0,0,0.35)]
          backdrop-blur-2xl
          before:absolute before:inset-0
          before:rounded-full
          before:bg-gradient-to-br
          before:from-white/35 before:via-white/10 before:to-transparent
          before:opacity-60
          after:absolute after:inset-[1px]
          after:rounded-full
          after:border after:border-white/10
        "
      >
        <div className="pointer-events-none absolute left-4 top-1 h-6 w-24 rounded-full bg-white/40 blur-xl" />
        <div className="pointer-events-none absolute bottom-0 right-4 h-8 w-20 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = iconMap[item.id];
            const isActive = activeSection === item.id;

          return (
  <button
    key={item.id}
    type="button"
    onClick={() => handleClick(item)}
    className={`
      group relative flex min-h-14 min-w-14 items-center justify-center
      overflow-hidden rounded-full text-sm font-medium
      transition-all duration-300
      sm:min-h-12 sm:min-w-0 sm:justify-start sm:gap-2 sm:px-4 sm:py-3
      ${
        isActive
          ? "bg-white/25 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_0_24px_rgba(255,255,255,0.18)]"
          : "text-gray-300 hover:bg-white/15 hover:text-white"
      }
    `}
  >
    <span
      className={`
        pointer-events-none absolute inset-0 rounded-full
        bg-gradient-to-br from-white/35 via-white/10 to-transparent
        transition-opacity duration-300
        ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"}
      `}
    />

    <span
      className={`
        pointer-events-none absolute left-2 top-1 h-4 w-8 rounded-full
        bg-white/40 blur-md transition-opacity duration-300
        ${isActive ? "opacity-70" : "opacity-0 group-hover:opacity-50"}
      `}
    />

    {Icon && (
      <Icon
        className={`
          relative z-10 h-6 w-6 transition-all duration-300
          sm:h-5 sm:w-5
          ${
            isActive
              ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              : "group-hover:scale-110"
          }
        `}
      />
    )}

    <span className="relative z-10 hidden sm:inline">
      {item.label}
    </span>
  </button>
);
          })}
        </div>
      </div>
    </div>
  );
}

export default BottomNavigation;