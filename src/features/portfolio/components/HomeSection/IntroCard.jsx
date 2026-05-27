function IntroCard({ typingText, profile }) {

  const headerText = profile?.header_text ?? ""
  const descriptionText = profile?.description ?? ""
  return (
    <>
  {/* Container utama tetap memusatkan seluruh blok di tengah halaman */}
<div className="mx-auto flex flex-col items-center justify-center bg-[#0a0a0a] px-5 py-1 sm:py-8 w-full">
  
  {/* 👇 Pembungkus teks: max-w-4xl memastikan batas kirinya sejajar sempurna dengan gambar di bawahnya */}
  <div className="w-full max-w-4xl text-left mb-6">
    <h2 className="text-2xl px-2 sm:px-4 font-bold text-white sm:text-3xl lg:text-4xl inline-block">
      I&apos;m a{" "}
      <span className="relative text-gray-400">
        {typingText}
        <span className="absolute -right-4 top-0 animate-pulse text-white">
          |
        </span>
      </span>
    </h2>
  </div>
  
  {/* Gambar kontribusi GitHub */}
  <img
    src="https://raw.githubusercontent.com/Daffaaditya2807/Daffaaditya2807/output/github-contribution-grid-snake.dark.svg"
    alt="GitHub Contribution Snake Dark Mode"
    className="w-full max-w-4xl object-contain"
  />
</div>

      <div className="mx-auto mt-2 sm:mt-4 max-w-5xl space-y-6 rounded-2xl px-4 py-2 text-lg text-white shadow-lg backdrop-blur-md md:px-12">
        <p className="text-lg">
          {headerText}
        </p>

        <p className="text-justify">
          {descriptionText}
        </p>
      </div>
    </>
  );
}

export default IntroCard;
