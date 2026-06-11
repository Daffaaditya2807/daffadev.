import { memo } from "react";
import { typingTexts } from "../../data/homeSectionData";
import { useTypingText } from "../../hooks/useTypingText";

function IntroCard({ profile }) {
  const typingText = useTypingText(typingTexts);

  const headerText = profile?.header_text ?? "";
  const descriptionText = profile?.description ?? "";

  return (
    <>
      <div className="mx-auto flex w-full flex-col items-center justify-center bg-[#0a0a0a] px-5 py-1 sm:py-8">
        <div className="mb-6 w-full max-w-4xl text-left">
          <h2 className="inline-block px-2 text-2xl font-bold text-white sm:px-4 sm:text-3xl lg:text-4xl">
            I&apos;m a{" "}
            <span className="relative text-gray-400">
              {typingText}
              <span className="absolute -right-4 top-0 animate-pulse text-white">
                |
              </span>
            </span>
          </h2>
        </div>

        <img
          src="https://raw.githubusercontent.com/Daffaaditya2807/Daffaaditya2807/output/github-contribution-grid-snake.dark.svg"
          alt="GitHub Contribution Snake Dark Mode"
          loading="lazy"
          decoding="async"
          className="w-full max-w-4xl object-contain"
        />
      </div>

      <div className="mx-auto mt-2 max-w-5xl space-y-6 rounded-2xl px-4 py-2 text-lg text-white shadow-lg backdrop-blur-md sm:mt-4 md:px-12">
        <p className="text-lg">{headerText}</p>

        <p className="text-justify">{descriptionText}</p>
      </div>
    </>
  );
}

export default memo(IntroCard);