import { useEffect, useRef, useState } from "react";
import { supabase } from "@/core/supabase";

export function useAboutSection() {
  const experienceRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [profile, setProfile] = useState(null);
  const [experiencess, setExperiences] = useState([]);

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
      const fetchExperiences = async () => {
        const { data, error } = await supabase
          .from("journeys")
          .select("*")
          .eq("is_active", true)
          .order("date_start", { ascending: false });
  
        if (!error && data) {
          setExperiences(data);
        }

      };
  
      fetchExperiences();
    }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      if (!experienceRef.current) return;

      const rect = experienceRef.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const start = viewportHeight * 0.8;
      const end = viewportHeight * 0.25;
      const rawProgress = (start - rect.top) / (start - end + rect.height);
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      setScrollProgress(progress);
    };

    updateScrollProgress();

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  return {
    experiencess,
    profile,
    experienceRef,
    scrollProgress,
  };
}
