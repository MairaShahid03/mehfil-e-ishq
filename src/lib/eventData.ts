export type EventCategory = "wedding" | "ramadan" | "birthday" | "shower" | "custom";

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "wedding", label: "Wedding" },
  { value: "ramadan", label: "Ramadan Events" },
  { value: "birthday", label: "Birthday Events" },
  { value: "shower", label: "Bridal / Baby Shower" },
  { value: "custom", label: "Custom Events" },
];

export const SUB_CATEGORIES: Record<EventCategory, string[]> = {
  wedding: ["Mehndi", "Mayoun", "Baraat", "Walima", "Ubtan", "Dholki", "Mehndi Lagayi", "Nikkah", "Dua-e-Khair"],
  ramadan: ["Sehr", "Iftar", "Family Gathering"],
  birthday: ["Kids Birthday", "Milestone Birthday", "Themed Party", "Surprise Party"],
  shower: ["Bridal Shower", "Baby Shower", "Gender Reveal"],
  custom: ["Corporate Event", "Anniversary", "Engagement", "Qawali Night", "Other"],
};

export const SERVICES_ADDONS = [
  "Catering",
  "Photography / Videography",
  "Decoration",
  "Makeup Artist",
  "Entertainment (DJ, Live Music)",
  "Invitations & Stationery",
  "Transportation",
  "Accommodation",
];

export const SURPRISE_ADDONS = [
  { id: "qawali-night", label: "Qawali Night", emoji: "🎶", description: "Live qawali performance with traditional musicians" },
  { id: "fireworks", label: "Fireworks Display", emoji: "🎆", description: "Grand fireworks finale for your event" },
  { id: "special-entry", label: "Special Entry", emoji: "🚪", description: "Dramatic bridal/groom entry with effects" },
  { id: "drone-light-show", label: "Drone Light Show", emoji: "✨", description: "Modern drone-based light choreography" },
  { id: "live-band", label: "Live Band", emoji: "🎸", description: "Professional live music performance" },
  { id: "ice-sculpture", label: "Ice Sculpture", emoji: "🧊", description: "Custom carved ice centerpiece" },
];

export const THEMES = [
  { id: "royal-gold", label: "Royal Gold", color: "from-yellow-600 to-amber-400" },
  { id: "floral-pastel", label: "Floral Pastel", color: "from-pink-300 to-rose-200" },
  { id: "minimal-elegant", label: "Minimal Elegant", color: "from-gray-200 to-gray-400" },
  { id: "traditional-desi", label: "Traditional Desi", color: "from-red-600 to-orange-400" },
  { id: "mughal", label: "Mughal Theme", color: "from-emerald-700 to-yellow-600" },
  { id: "vintage-classic", label: "Vintage Classic", color: "from-amber-200 to-stone-400" },
  { id: "garden", label: "Garden Theme", color: "from-green-400 to-emerald-300" },
  { id: "arabian-nights", label: "Arabian Nights", color: "from-indigo-800 to-purple-500" },
  { id: "qawali-night", label: "Qawali Night", color: "from-red-800 to-amber-600" },
  { id: "beach-wedding", label: "Beach Wedding", color: "from-cyan-400 to-blue-300" },
  { id: "modern-luxe", label: "Modern Luxe", color: "from-zinc-800 to-zinc-500" },
  { id: "candlelight", label: "Candlelight Theme", color: "from-amber-500 to-orange-300" },
  { id: "white-gold", label: "White & Gold", color: "from-yellow-200 to-amber-100" },
  { id: "colorful-mehndi", label: "Colorful Mehndi", color: "from-yellow-400 to-green-400" },
  { id: "custom", label: "Custom Theme", color: "from-gold to-gold-light" },
];

export const FLOWERS = [
  { id: "roses-red", label: "Red Roses", emoji: "🌹" },
  { id: "roses-white", label: "White Roses", emoji: "🤍" },
  { id: "roses-pink", label: "Pink Roses", emoji: "🌸" },
  { id: "marigold", label: "Marigold", emoji: "🌼" },
  { id: "jasmine", label: "Jasmine", emoji: "🤍" },
  { id: "tulips", label: "Tulips", emoji: "🌷" },
  { id: "orchids", label: "Orchids", emoji: "💐" },
  { id: "babys-breath", label: "Baby's Breath", emoji: "🌿" },
  { id: "mixed-floral", label: "Mixed Floral", emoji: "💐" },
  { id: "custom", label: "Custom Flower Request", emoji: "✨" },
];

export interface SubEventDetail {
  name: string;
  date: string;
  guests: number;
  budget: number;
  theme: string;
  flowers: string[];
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  category: EventCategory | "";
  subCategories: string[];
  subEvents: SubEventDetail[];
  eventDate: string;
  guests: number;
  budget: number;
  location: string;
  latitude: number | null;
  longitude: number | null;
  services: string[];
  surpriseAddons: string[];
  theme: string;
  customTheme: string;
  flowers: string[];
  customFlower: string;
  notes: string;
}

export const initialFormData: BookingFormData = {
  name: "",
  email: "",
  phone: "",
  category: "",
  subCategories: [],
  subEvents: [],
  eventDate: "",
  guests: 100,
  budget: 500000,
  location: "",
  latitude: null,
  longitude: null,
  services: [],
  surpriseAddons: [],
  theme: "",
  customTheme: "",
  flowers: [],
  customFlower: "",
  notes: "",
};
