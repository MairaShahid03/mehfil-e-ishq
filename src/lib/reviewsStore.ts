export interface Testimonial {
  id: string;
  name: string;
  event: string;
  text: string;     // English text
  textUrdu?: string; // Urdu translation
  rating: number;
  approved: boolean;
  role?: string;
  created_at?: string;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Ayesha & Bilal",
    event: "Wedding — Baraat & Walima",
    text: "Mehfil-e-Ishq made our wedding a fairy tale. Every detail was perfect, from the floral arrangements to the lighting. Our guests still talk about it!",
    textUrdu: "محفلِ عشق نے ہماری شادی کو ایک پریوں کی کہانی بنا دیا۔ پھولوں کی سجاوٹ سے لے کر روشنی تک ہر چیز بہترین تھی! ہمارے مہمان اب بھی اس کا تذکرہ کرتے ہیں۔",
    rating: 5,
    role: "Bride & Groom",
    approved: true
  },
  {
    id: "2",
    name: "Fatima Khan",
    event: "Ramadan Iftar Gathering",
    text: "The most beautifully organized iftar we've ever hosted. The décor, the ambiance, the food — everything was beyond our expectations.",
    textUrdu: "ہماری میزبانی میں اب تک کا سب سے خوبصورتی سے ترتیب دیا گیا افطار۔ سجاوٹ، ماحول، کھانا — سب کچھ ہماری توقعات سے بڑھ کر تھا۔",
    rating: 5,
    role: "Event Organizer",
    approved: true
  },
  {
    id: "3",
    name: "Haris & Sana",
    event: "Mehndi Night",
    text: "Our mehndi was absolutely magical. The team understood our vision perfectly and brought it to life with such elegance and creativity.",
    textUrdu: "ہماری مہندی کی رات بالکل جادوئی تھی۔ ٹیم نے ہمارے وژن کو مکمل طور پر سمجھا اور اسے اتنی خوبصورتی اور تخلیقی صلاحیتوں کے ساتھ زندہ کیا۔",
    rating: 5,
    role: "Couple",
    approved: true
  }
];

export const getReviews = (): Testimonial[] => {
  const data = localStorage.getItem("mehfil_reviews");
  if (!data) {
    localStorage.setItem("mehfil_reviews", JSON.stringify(INITIAL_TESTIMONIALS));
    return INITIAL_TESTIMONIALS;
  }
  return JSON.parse(data);
};

export const saveReviews = (reviews: Testimonial[]) => {
  localStorage.setItem("mehfil_reviews", JSON.stringify(reviews));
};

export const addReview = (review: Omit<Testimonial, "id" | "approved" | "created_at">): Testimonial => {
  const reviews = getReviews();
  const newReview: Testimonial = {
    ...review,
    id: Date.now().toString(),
    approved: false,
    created_at: new Date().toISOString()
  };
  reviews.push(newReview);
  saveReviews(reviews);
  return newReview;
};

export const approveReview = (id: string) => {
  const reviews = getReviews();
  const updated = reviews.map(r => r.id === id ? { ...r, approved: true } : r);
  saveReviews(updated);
};

export const deleteReview = (id: string) => {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  saveReviews(filtered);
};
