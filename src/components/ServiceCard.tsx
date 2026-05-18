import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  features: string[];
  packages: string[];
  pricingHint: string;
  images: string[];
}

// Function to convert abstract string names to actual hero images or placeholders
// Ideally these would be raw URLs passed from the parent, but we can fall back to random unsplash for real look
const getImageUrl = (title: string, index: number) => {
  const query = encodeURIComponent(`${title} event wedding`);
  return `https://source.unsplash.com/800x600/?${query}&sig=${index}`;
};

const ServiceCard = ({ icon: Icon, title, desc, features, packages, pricingHint, images }: ServiceCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const favorited = isFavorite(`service-${title}`);

  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="group relative rounded-2xl overflow-hidden border border-border hover:border-gold/40 transition-all duration-500 shadow-lg hover:shadow-gold bg-[#0a0a0a] flex flex-col"
    >
      {/* Background Image Setup */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getImageUrl(title, 0)} 
          alt={title}
          className="w-full h-full object-cover opacity-60"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Heart Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleFavorite(`service-${title}`); }}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-ivory/10 flex items-center justify-center transition-all hover:scale-110 hover:border-gold/50"
      >
        <Heart size={20} className={`transition-colors ${favorited ? "fill-gold text-gold" : "text-ivory/50 hover:text-gold"}`} />
      </button>

      {/* Main Card Header Area */}
      <div className="relative z-10 p-6 min-h-[220px] flex flex-col justify-end cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-12 h-12 rounded-xl bg-gold/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
          <Icon className="text-gold" size={24} />
        </div>
        <h3 className="font-heading text-xl text-gold font-semibold mb-2 drop-shadow-md">{title}</h3>
        <p className="text-sm text-ivory/80 leading-relaxed line-clamp-2">{desc}</p>
        <div className="mt-4 flex items-center justify-between text-gold text-sm font-heading transition-opacity duration-300">
          <span className="flex items-center gap-2">
            {expanded ? "Hide Details" : "View Details"} 
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
          <span className="text-xs text-ivory/50">{pricingHint}</span>
        </div>
      </div>

      {/* Inline Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative z-10 bg-black/90 backdrop-blur-md border-t border-gold/10"
          >
            <div className="p-6">
              <p className="text-ivory/70 font-body leading-relaxed mb-6 text-sm">{desc}</p>
              
              {/* Features */}
              <div className="mb-6">
                <h4 className="text-gold text-xs tracking-wider uppercase font-semibold mb-3">Included Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-ivory/70 text-sm">
                      <span className="text-gold">✦</span> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Packages */}
              <div className="mb-6">
                <h4 className="text-gold text-xs tracking-wider uppercase font-semibold mb-3">Sample Packages</h4>
                <div className="space-y-2">
                  {packages.map((p) => (
                    <div key={p} className="px-4 py-3 rounded-xl border border-gold/10 bg-noir text-ivory/80 text-sm shadow-inner shadow-black">
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <a href={`/booking?service=${encodeURIComponent(title)}`} className="btn-luxury w-full text-center block text-sm py-3 mt-4 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                Book This Service
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceCard;
