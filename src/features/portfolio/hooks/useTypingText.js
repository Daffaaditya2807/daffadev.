import { useEffect, useState } from "react";

export function useTypingText(texts = []) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!texts.length) return;

    const currentText = texts[currentIndex];

    const typingSpeed = isPaused
      ? 1800
      : isDeleting
        ? 60
        : 120;

    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (!isDeleting && displayText.length < currentText.length) {
        setDisplayText(currentText.slice(0, displayText.length + 1));
        return;
      }

      if (!isDeleting) {
        setIsPaused(true);
        return;
      }

      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
        return;
      }

      setIsDeleting(false);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [texts, currentIndex, displayText, isDeleting, isPaused]);

  return displayText;
}