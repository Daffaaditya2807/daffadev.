function IntroCard({ typingText, profile }) {

  const headerText = profile?.header_text ?? ""
  const descriptionText = profile?.description ?? ""
  return (
    <div className="mx-auto mt-2 sm:mt-12 max-w-4xl space-y-6 rounded-2xl border border-white/20 bg-white/10 px-6 py-10 text-lg text-white shadow-lg backdrop-blur-md md:px-12">
      <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
        I&apos;m a{" "}
        <span className="relative text-gray-400">
          {typingText}
          <span className="absolute -right-1 top-0 animate-pulse text-white">
            |
          </span>
        </span>
      </h2>

      <p className="text-lg">
        {headerText}
      </p>

      <p className="text-justify">
        {descriptionText}
      </p>
    </div>
  );
}

export default IntroCard;