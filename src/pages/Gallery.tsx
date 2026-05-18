import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroBaraat from "@/assets/hero-baraat.jpg";
import ReelsSection from "@/components/ReelsSection";

const GALLERY_CATEGORIES = [
  "baraat", "birthday", "dua-e-khair", "mayoun", "mehndi", "nikkah", "others", "engagement", "qawali night",
];

const DUMMY_CATEGORIES: Record<string, { images: string[]; label: string }> = {
  engagement: {
    label: "Engagement",
    images: [heroMehndi, heroBaraat],
  },
  "qawali night": {
    label: "Qawali Night",
    images: [heroBaraat, heroMehndi],
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  baraat: "Baraat",
  birthday: "Birthday",
  "dua-e-khair": "Dua-e-Khair",
  mayoun: "Mayoun",
  mehndi: "Mehndi",
  nikkah: "Nikkah",
  others: "Others",
  engagement: "Engagement",
  "qawali night": "Qawali Night",
};

interface GalleryImage {
  id: string;
  image_url: string;
  category: string;
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery")
        .select("id, image_url, category");
      
      console.log("Gallery data:", data, "Error:", error);
      
      if (data) {
        setAllImages(data.filter(img => img.image_url && img.category) as GalleryImage[]);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const groupedImages = allImages.reduce<Record<string, GalleryImage[]>>((acc, img) => {
    const cat = img.category.toLowerCase().trim();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(img);
    return acc;
  }, {});

  const getCategoryThumb = (cat: string): string | null => {
    if (DUMMY_CATEGORIES[cat]) return DUMMY_CATEGORIES[cat].images[0];
    const imgs = groupedImages[cat];
    return imgs?.[0]?.image_url || null;
  };

  const getCategoryImages = (cat: string): string[] => {
    if (DUMMY_CATEGORIES[cat]) return DUMMY_CATEGORIES[cat].images;
    return (groupedImages[cat] || []).map(i => i.image_url);
  };

  const currentImages = selectedCategory ? getCategoryImages(selectedCategory) : [];

  const navigateLightbox = (dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + dir + currentImages.length) % currentImages.length;
    });
  };

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />

      <section className="pt-28 pb-16 px-4 bg-noir">
        <div className="container mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3"
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4"
          >
            Gallery
          </motion.h1>
          <div className="gold-divider" />
        </div>
      </section>

      <section className="section-padding bg-noir">
        <div className="container mx-auto">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-gold" size={40} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GALLERY_CATEGORIES.map((cat, i) => {
                      const thumb = getCategoryThumb(cat);
                      const hasImages = DUMMY_CATEGORIES[cat] || (groupedImages[cat]?.length > 0);
                      return (
                        <motion.button
                          key={cat}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => setSelectedCategory(cat)}
                          className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-500"
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={CATEGORY_LABELS[cat]}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-noir/50 flex items-center justify-center">
                              <span className="text-ivory/30 text-sm">Coming Soon</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="font-heading text-xl text-ivory font-bold">{CATEGORY_LABELS[cat]}</h3>
                            <p className="text-gold text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {hasImages ? "View Gallery →" : "Coming Soon"}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="folder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <button
                  onClick={() => { setSelectedCategory(null); }}
                  className="flex items-center gap-2 text-gold hover:text-gold-light font-body mb-8 transition-colors"
                >
                  <ArrowLeft size={18} /> Back to Categories
                </button>

                <h2 className="font-heading text-2xl md:text-3xl text-ivory font-bold mb-8">
                  {CATEGORY_LABELS[selectedCategory] || selectedCategory}
                </h2>

                {currentImages.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-ivory/40">No images in this category yet.</p>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {currentImages.map((url, i) => (
                      <motion.div
                        key={url + i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setLightboxIndex(i)}
                      >
                        <img
                          src={url}
                          alt={`Gallery image ${i + 1}`}
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/30 transition-colors duration-300" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-noir/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-ivory/70 hover:text-gold transition-colors z-10"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-gold transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            >
              <ChevronLeft size={40} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-gold transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            >
              <ChevronRight size={40} />
            </button>
            <img
              src={currentImages[lightboxIndex]}
              alt="Full view"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ReelsSection />

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Gallery;
