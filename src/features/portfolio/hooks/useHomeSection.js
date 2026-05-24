import { useCallback, useEffect, useState } from "react";
import {
  SiDart,
  SiFirebase,
  SiFlutter,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiPostman,
  SiVuedotjs,
} from "react-icons/si";
import cvFile from "../../../assets/documents/cv.pdf";
import { techStacks as defaultTechStacks, typingTexts } from "../data/homeSectionData";
import { supabase } from "@/core/supabase";

const STORAGE_BUCKET = "portfolio-assets";

const getPublicFileUrl = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
};

const stackIconMap = {
  flutter: SiFlutter,
  dart: SiDart,
  laravel: SiLaravel,
  php: SiPhp,
  mysql: SiMysql,
  firebase: SiFirebase,
  vue: SiVuedotjs,
  postman: SiPostman,
};

function useTypingText(texts) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    const typingSpeed = isPaused
      ? 2000
      : isDeleting
        ? 50 + Math.random() * 50
        : 100 + Math.random() * 100;

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

export function useHomeSection({ setActiveSection }) {
  const typingText = useTypingText(typingTexts);
  const [profile, setProfile] = useState(null);
  const [techStacks, setTechStacks] = useState(defaultTechStacks);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchTechStacks = async () => {
      const { data, error } = await supabase
        .from("tech_stacks")
        .select("name, icon_key, color")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error || !data?.length) {
        return;
      }

      const mappedStacks = data
        .map((stack) => ({
          name: stack.name,
          Icon: stackIconMap[stack.icon_key],
          color: stack.color,
        }))
        .filter((stack) => stack.Icon);

      if (mappedStacks.length) {
        setTechStacks(mappedStacks);
      }
    };

    fetchTechStacks();
  }, []);

  const handleDownload = useCallback((href, fileName) => {
    const link = document.createElement("a");

    link.href = href;
    link.download = fileName;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDownloadCV = () => {
    handleDownload(cvFile, "CV - Daffa Aditya R R.pdf");
  };

  const handleDownloadPortfolio = () => {
    const portfolioUrl = getPublicFileUrl(profile?.link_porto) || cvFile;

    handleDownload(portfolioUrl, "Portfolio - Daffa Aditya.pdf");
  };

  const handleContactClick = () => {
    if (setActiveSection) {
      setActiveSection("contact");
    }
  };

  return {
    profile,
    techStacks,
    typingText,
    handleDownloadCV,
    handleDownloadPortfolio,
    handleContactClick,
  };
}
