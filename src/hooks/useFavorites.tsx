import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchRemoteFavorites();
    } else {
      const stored = localStorage.getItem("dawat_favorites");
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse favorites");
        }
      } else {
        setFavorites([]);
      }
    }
  }, [user]);

  const fetchRemoteFavorites = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("user_favorites" as any).select("item_id").eq("user_id", user.id);
    if (!error && data) {
      const remoteFavs = (data as any[]).map(d => d.item_id);
      setFavorites(remoteFavs);
    }
  };

  const toggleFavorite = async (id: string) => {
    const isFav = favorites.includes(id);
    // Optimistic UI update
    setFavorites((prev) => isFav ? prev.filter((f) => f !== id) : [...prev, id]);

    if (user) {
      if (isFav) {
        await supabase.from("user_favorites" as any).delete().eq("user_id", user.id).eq("item_id", id);
      } else {
        await supabase.from("user_favorites" as any).insert({ user_id: user.id, item_id: id });
      }
    } else {
      const updated = isFav ? favorites.filter((f) => f !== id) : [...favorites, id];
      localStorage.setItem("dawat_favorites", JSON.stringify(updated));
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
