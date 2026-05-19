import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const favorited = isFavorite(`service-${title}`);

  return (
    <>
      <motion.div
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="group relative rounded-2xl overflow-hidden border border-border hover:border-gold/40 transition-all duration-500 shadow-lg hover:shadow-gold bg-[#0a0a0a] flex flex-col h-full"
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
        <div className="relative z-10 p-6 flex flex-col justify-end flex-grow">
          <div className="w-12 h-12 rounded-xl bg-gold/10 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors border border-gold/20">
            <Icon className="text-gold" size={24} />
          </div>
          <h3 className="font-heading text-xl text-gold font-semibold mb-2 drop-shadow-md">{title}</h3>
          <p className="text-sm text-ivory/80 leading-relaxed line-clamp-2 mb-4">{desc}</p>
          <div className="flex items-center justify-between text-gold text-sm font-heading">
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 hover:text-gold-light transition-colors"
            >
              View Details
              <ChevronDown size={16} />
            </button>
            <span className="text-xs text-ivory/50">{pricingHint}</span>
          </div>
        </div>
      </motion.div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-noir border-gold/20">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                <Icon className="text-gold" size={24} />
              </div>
              <div>
                <DialogTitle className="text-2xl text-gold font-heading">{title}</DialogTitle>
                <DialogDescription className="text-gold/70 mt-1">{pricingHint}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-ivory/70 font-body leading-relaxed text-sm">{desc}</p>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-gold text-xs tracking-wider uppercase font-semibold mb-3">Included Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-ivory/70 text-sm">
                    <span className="text-gold mt-1">✦</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Packages */}
            <div>
              <h4 className="text-gold text-xs tracking-wider uppercase font-semibold mb-3">Sample Packages</h4>
              <div className="space-y-2">
                {packages.map((p) => (
                  <div key={p} className="px-4 py-3 rounded-xl border border-gold/10 bg-noir text-ivory/80 text-sm shadow-inner shadow-black">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <a 
              href={`/booking?service=${encodeURIComponent(title)}`} 
              className="btn-luxury w-full text-center block text-sm py-3 mt-4 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              Book This Service
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceCard;
