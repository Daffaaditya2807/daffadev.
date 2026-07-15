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
  SiReact,
  SiNodedotjs,
  SiTailwindcss,
  SiNextdotjs,
  SiVite,
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiPython,
  SiDjango,
  SiDocker
} from "react-icons/si";
import cvFile from "../../../assets/documents/cv.pdf";
import { techStacks as defaultTechStacks } from "../data/homeSectionData";
import { supabase } from "@/core/supabase";

const STORAGE_BUCKET = "portfolio-assets";

const getPublicFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
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
  react: SiReact,
  node: SiNodedotjs,
  tailwind: SiTailwindcss,
  nextjs: SiNextdotjs,
  vite: SiVite,
  javascript: SiJavascript,
  typescript: SiTypescript,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  git: SiGit,
  github: SiGithub,
  python: SiPython,
  django: SiDjango,
  docker: SiDocker,
};

export function useHomeSection({ setActiveSection }) {
  const [profile, setProfile] = useState(null);
  const [techStacks, setTechStacks] = useState(defaultTechStacks);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (isMounted && !error && data) {
        setProfile(data);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchTechStacks = async () => {
      const { data, error } = await supabase
        .from("tech_stacks")
        .select("name, icon_key, color")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!isMounted || error || !data?.length) {
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

    return () => {
      isMounted = false;
    };
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

  const handleDownloadCV = useCallback(() => {
    handleDownload(cvFile, "CV - Daffa Aditya R R.pdf");
  }, [handleDownload]);

  const handleDownloadPortfolio = useCallback(() => {
    const portfolioUrl = getPublicFileUrl(profile?.link_porto) || cvFile;

    handleDownload(portfolioUrl, "Portfolio - Daffa Aditya.pdf");
  }, [handleDownload, profile?.link_porto]);

  const handleContactClick = useCallback(() => {
    setActiveSection?.("contact");
  }, [setActiveSection]);

  return {
    profile,
    techStacks,
    handleDownloadCV,
    handleDownloadPortfolio,
    handleContactClick,
  };
}