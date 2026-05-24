function TechStackItem({ tech }) {
  const { name, Icon, color } = tech;

  const setIconColor = (event, value) => {
    event.currentTarget.style.color = value;
  };

  return (
    <div
      className="group flex h-20 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 shadow-lg shadow-black/20 backdrop-blur-md hover:border-white/40 hover:bg-white/10"
      title={name}
      aria-label={name}
      tabIndex={0}
    >
      <Icon
        className="h-10 w-10 text-gray-400 grayscale transition-all duration-300 group-hover:scale-110 group-hover:grayscale-0"
        onMouseEnter={(event) => setIconColor(event, color)}
        onMouseLeave={(event) => setIconColor(event, "")}
        onFocus={(event) => setIconColor(event, color)}
        onBlur={(event) => setIconColor(event, "")}
      />
    </div>
  );
}

export default TechStackItem;