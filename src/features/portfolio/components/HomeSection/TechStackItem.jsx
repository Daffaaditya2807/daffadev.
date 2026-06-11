import { memo } from "react";

function TechStackItem({ tech }) {
  const { name, Icon, color } = tech;

  return (
    <div
      className="group flex h-20 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 shadow-lg shadow-black/20 backdrop-blur-md hover:border-white/40 hover:bg-white/10"
      title={name}
      aria-label={name}
      tabIndex={0}
      style={{ "--tech-color": color }}
    >
      <Icon className="h-10 w-10 text-gray-400 grayscale transition-all duration-300 group-hover:scale-110 group-hover:text-(--tech-color) group-hover:grayscale-0 group-focus:text-(--tech-color) group-focus:grayscale-0" />
    </div>
  );
}

export default memo(TechStackItem);