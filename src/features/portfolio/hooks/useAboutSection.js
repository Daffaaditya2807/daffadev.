import { useEffect, useRef, useState } from "react";
import { supabase } from "@/core/supabase";

export function useAboutSection() {
  const experienceRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);

  const scrollProgressRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!experienceRef.current) return;

      experienceRef.current
        .querySelectorAll("[data-experience-active-at]")
        .forEach((item) => {
          item.dataset.active =
            scrollProgressRef.current >
            Number(item.dataset.experienceActiveAt);
        });
    });

    return () => cancelAnimationFrame(frame);
  }, [experiences]);

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

    const fetchExperiences = async () => {
      const { data, error } = await supabase
        .from("journeys")
        .select("*")
        .eq("is_active", true)
        .order("date_start", { ascending: false });

      if (isMounted && !error && data) {
        const mappedData = data.map((item, index) => ({
          ...item,
          activeAt: item.activeAt ?? index / Math.max(data.length - 1, 1),
        }));

        setExperiences(mappedData);
      }
    };

    fetchExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const calculateScrollProgress = () => {
      if (!experienceRef.current) return;

      const rect = experienceRef.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const start = viewportHeight * 0.8;
      const end = viewportHeight * 0.25;

      const rawProgress = (start - rect.top) / (start - end + rect.height);
      const nextProgress = Math.min(Math.max(rawProgress, 0), 1);

      const previousProgress = scrollProgressRef.current;
      const progressDiff = Math.abs(nextProgress - previousProgress);

      if (progressDiff > 0.015 || nextProgress === 0 || nextProgress === 1) {
        scrollProgressRef.current = nextProgress;
        experienceRef.current.style.setProperty(
          "--scroll-progress",
          nextProgress
        );
      }

      experienceRef.current
        .querySelectorAll("[data-experience-active-at]")
        .forEach((item) => {
          item.dataset.active =
            nextProgress > Number(item.dataset.experienceActiveAt);
        });
    };

    const handleScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      requestAnimationFrame(() => {
        calculateScrollProgress();
        tickingRef.current = false;
      });
    };

    calculateScrollProgress();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return {
    experiences,
    profile,
    experienceRef,
  };
}
