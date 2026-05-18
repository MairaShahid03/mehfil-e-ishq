import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";

type Reel = {
  id: string;
  video_url: string | null;
  title: string | null;
};

const ReelsSection = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchReels = async () => {
      const response: any = await supabase
        .from("reels" as any)
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = response;

      if (error) {
        console.error("Error fetching reels:", error);
        return;
      }

      setReels(data ?? []);
    };

    fetchReels();
  }, []);

  return (
    <section className="py-20 px-6 bg-noir">
      <div className="max-w-6xl mx-auto">

        {/* HEADING */}
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-heading tracking-widest uppercase mb-2">
            Watch & Explore
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ivory">
            Event Reels
          </h2>
          <div className="gold-divider mt-4 mx-auto" />
        </div>

        {/* EMPTY STATE */}
        {reels.length === 0 && (
          <p className="text-center text-ivory/50 font-body">
            No reels found (check Supabase or console)
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reels.map((reel, index) => {
            const favorited = isFavorite(`reel-${reel.id}`);
            
            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a0a0a] rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-colors shadow-lg flex flex-col aspect-[9/16] relative group"
              >
                {/* HEART BUTTON */}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(`reel-${reel.id}`); }}
                  className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-ivory/10 flex items-center justify-center transition-all hover:scale-110 hover:border-gold/50"
                >
                  <Heart size={16} className={`transition-colors ${favorited ? "fill-gold text-gold" : "text-ivory/80 hover:text-gold"}`} />
                </button>

                {/* VIDEO */}
                <div className="flex-1 bg-black overflow-hidden flex items-center justify-center relative">
                  <video
                    src={reel.video_url || ""}
                    className="w-full h-full object-cover"
                    controls
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        const p = document.createElement('p');
                        p.className = 'text-white/40 text-xs text-center px-4 font-body';
                        p.innerText = 'Video unavailable or URL broken';
                        target.parentElement.appendChild(p);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />
                </div>

                {/* TITLE */}
                <div className="p-4 bg-gradient-to-t from-black to-black/80 shrink-0 border-t border-gold/10 absolute bottom-0 left-0 right-0">
                  <p className="text-sm text-ivory font-medium font-body truncate drop-shadow-md">
                    {reel.title || "Event Reel"}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;