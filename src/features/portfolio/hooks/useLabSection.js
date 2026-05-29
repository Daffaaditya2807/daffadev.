import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/core/supabase";
import { fallbackCategories, getLabAssetUrl, iconMap } from "../data/labSectionData";

const mapProject = (project) => ({
  id: project.id,
  type: project.type_id,
  title: project.title,
  category: project.category_id,
  description: project.description,
  longDescription: project.long_description || project.description,
  image: getLabAssetUrl(project.image_path),
  screenshots: (project.screenshots?.length ? project.screenshots : [project.image_path])
    .filter(Boolean)
    .map(getLabAssetUrl),
  tech: project.tech_stack || [],
  features: project.features || [],
  links: {
    github: project.github_url || "",
    website: project.website_url || "",
  },
  status: project.status,
});

const mapCategory = (category) => ({
  id: category.id,
  label: category.label,
  icon: iconMap[category.icon_key] || iconMap.star,
});

export function useLabSection({ selectedProject, setSelectedProject }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState(fallbackCategories);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLabData = async () => {
      const [categoryResult, projectResult] = await Promise.all([
        supabase
          .from("lab_categories")
          .select("id,label,icon_key,kind,sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("lab_projects")
          .select("*")
          .eq("is_active", true)
          .eq("status", "published")
          .order("created_at", { ascending: false }),
      ]);

      if (!isMounted) {
        return;
      }

      if (categoryResult.error || projectResult.error) {
        setErrorMessage("Gagal mengambil data portfolio.");
        setIsLoading(false);
        return;
      }

      const mappedCategories = (categoryResult.data || []).map(mapCategory);
      const hasAllCategory = mappedCategories.some((category) => category.id === "all");

      setCategories(hasAllCategory ? mappedCategories : [...fallbackCategories, ...mappedCategories]);
      setProjects((projectResult.data || []).map(mapProject));
      setIsLoading(false);
    };

    fetchLabData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    htmlElement.style.overflow = selectedProject ? "hidden" : "auto";
    bodyElement.style.overflow = selectedProject ? "hidden" : "auto";

    return () => {
      htmlElement.style.overflow = "auto";
      bodyElement.style.overflow = "auto";
    };
  }, [selectedProject]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.type === activeFilter || project.category === activeFilter
    );
  }, [activeFilter, projects]);

  const handleChangeFilter = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  return {
    activeFilter,
    categories,
    filteredProjects,
    isLoading,
    errorMessage,
    handleChangeFilter,
    handleSelectProject,
    handleCloseProject,
  };
}
