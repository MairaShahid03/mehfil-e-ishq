import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Palette, Flower2, Lightbulb, LayoutGrid } from "lucide-react";
import { THEMES, FLOWERS, EventCategory } from "@/lib/eventData";

interface AISuggestionsProps {
  budget: number;
  guests: number;
  category: EventCategory | "";
  onSelectTheme: (themeId: string) => void;
  onSelectFlower: (flowerId: string) => void;
}

interface Suggestion {
  theme: string;
  flowers: string[];
  decorStyle: string;
  setupType: string;
  reason: string;
}

const getSuggestions = (budget: number, guests: number, category: EventCategory | ""): Suggestion => {
  const isHighBudget = budget > 1000000;
  const isMedBudget = budget > 400000;
  const isLargeEvent = guests > 300;

  if (category === "wedding") {
    if (isHighBudget && isLargeEvent) {
      return {
        theme: "mughal",
        flowers: ["roses-red", "orchids", "jasmine"],
        decorStyle: "Grand Mughal Palace with gold accents and chandeliers",
        setupType: "Grand Ballroom with stage, runway, and VIP seating",
        reason: "Your generous budget and large guest count call for a majestic Mughal-inspired celebration",
      };
    }
    if (isHighBudget) {
      return {
        theme: "royal-gold",
        flowers: ["roses-white", "orchids", "babys-breath"],
        decorStyle: "Royal Gold with crystal centerpieces and draping",
        setupType: "Intimate luxury with round tables and a premium stage",
        reason: "A high-end intimate wedding deserves the opulence of Royal Gold",
      };
    }
    if (isMedBudget) {
      return {
        theme: "floral-pastel",
        flowers: ["roses-pink", "tulips", "babys-breath"],
        decorStyle: "Soft floral pastel with fairy lights and fabric draping",
        setupType: "Banquet style with mixed seating and floral arches",
        reason: "A beautiful floral pastel theme balances elegance with your budget",
      };
    }
    return {
      theme: "minimal-elegant",
      flowers: ["babys-breath", "roses-white"],
      decorStyle: "Clean and minimal with white linens and candles",
      setupType: "Simple stage with organized seating rows",
      reason: "Minimal elegance creates sophistication without overspending",
    };
  }

  if (category === "ramadan") {
    return {
      theme: "arabian-nights",
      flowers: ["jasmine", "marigold"],
      decorStyle: "Arabian lanterns, crescent motifs, and warm lighting",
      setupType: "Long communal tables with floor seating option",
      reason: "Arabian Nights perfectly captures the spirit of Ramadan gatherings",
    };
  }

  if (category === "birthday") {
    if (isHighBudget) {
      return {
        theme: "modern-luxe",
        flowers: ["orchids", "roses-red"],
        decorStyle: "Modern luxe with neon accents and sleek furniture",
        setupType: "Lounge-style with cocktail tables and DJ setup",
        reason: "Modern Luxe creates an unforgettable birthday celebration",
      };
    }
    return {
      theme: "candlelight",
      flowers: ["roses-pink", "mixed-floral"],
      decorStyle: "Warm candlelight with balloon arches and photo wall",
      setupType: "Casual mixed seating with dance floor",
      reason: "Candlelight theme adds a warm, festive birthday vibe",
    };
  }

  if (category === "shower") {
    return {
      theme: "garden",
      flowers: ["roses-pink", "tulips", "babys-breath"],
      decorStyle: "Garden-fresh with greenery, pastels, and floral installations",
      setupType: "Outdoor-style with round tables and a gift station",
      reason: "A garden theme creates the perfect setting for showers",
    };
  }

  // Custom / default
  if (isHighBudget) {
    return {
      theme: "white-gold",
      flowers: ["orchids", "roses-white", "jasmine"],
      decorStyle: "White & Gold luxury with crystal and satin",
      setupType: "Premium banquet with dedicated activity zones",
      reason: "White & Gold offers timeless elegance for any occasion",
    };
  }

  return {
    theme: "vintage-classic",
    flowers: ["mixed-floral", "marigold"],
    decorStyle: "Vintage charm with warm tones and rustic elements",
    setupType: "Flexible layout with both formal and casual zones",
    reason: "Vintage Classic adapts beautifully to any event type",
  };
};

const AISuggestions = ({ budget, guests, category, onSelectTheme, onSelectFlower }: AISuggestionsProps) => {
  const suggestion = useMemo(() => getSuggestions(budget, guests, category), [budget, guests, category]);

  const themeName = THEMES.find((t) => t.id === suggestion.theme)?.label || suggestion.theme;
  const themeColor = THEMES.find((t) => t.id === suggestion.theme)?.color || "from-gold to-gold-light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
          <Sparkles className="text-gold" size={20} />
        </div>
        <div>
          <h4 className="font-heading text-lg text-ivory">Smart Recommendations</h4>
          <p className="text-ivory/40 text-xs">{suggestion.reason}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Theme */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTheme(suggestion.theme)}
          className="p-4 rounded-xl border-2 border-gold/20 hover:border-gold/50 bg-noir/50 text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Palette size={16} className="text-gold" />
            <span className="text-xs text-ivory/50 uppercase tracking-wider">Suggested Theme</span>
          </div>
          <div className={`h-8 rounded-md bg-gradient-to-r ${themeColor} mb-2`} />
          <p className="font-heading text-ivory font-semibold">{themeName}</p>
          <p className="text-xs text-gold/70 mt-1 group-hover:text-gold">Click to select →</p>
        </motion.button>

        {/* Decor Style */}
        <div className="p-4 rounded-xl border-2 border-gold/20 bg-noir/50 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-gold" />
            <span className="text-xs text-ivory/50 uppercase tracking-wider">Decor Style</span>
          </div>
          <p className="text-ivory text-sm">{suggestion.decorStyle}</p>
        </div>

        {/* Flowers */}
        <div className="p-4 rounded-xl border-2 border-gold/20 bg-noir/50 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Flower2 size={16} className="text-gold" />
            <span className="text-xs text-ivory/50 uppercase tracking-wider">Suggested Flowers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestion.flowers.map((fId) => {
              const flower = FLOWERS.find((f) => f.id === fId);
              return flower ? (
                <button
                  key={fId}
                  onClick={() => onSelectFlower(fId)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-gold/10 text-ivory text-xs hover:bg-gold/20 transition-all"
                >
                  <span>{flower.emoji}</span>
                  <span>{flower.label}</span>
                </button>
              ) : null;
            })}
          </div>
        </div>

        {/* Setup */}
        <div className="p-4 rounded-xl border-2 border-gold/20 bg-noir/50 text-left">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid size={16} className="text-gold" />
            <span className="text-xs text-ivory/50 uppercase tracking-wider">Setup Type</span>
          </div>
          <p className="text-ivory text-sm">{suggestion.setupType}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AISuggestions;
