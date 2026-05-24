import {
  Computer,
  Globe,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { supabase } from "@/core/supabase";

const STORAGE_BUCKET = "portfolio-assets";

export const iconMap = {
  computer: Computer,
  globe: Globe,
  smartphone: Smartphone,
  star: Star,
  users: Users,
};

export const fallbackCategories = [
  { id: "all", label: "Semua Proyek", icon: Star },
];

export const getLabAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const storagePath = path.replace(/^\/+/, "");

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
};
