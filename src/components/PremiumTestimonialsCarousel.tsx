import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { getReviews, Testimonial } from "@/lib/reviewsStore";

const PremiumTestimonialsCarousel = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    // Fetch and filter to approved reviews only
    const approvedReviews = getReviews().filter((r) => r.approved);
    setReviews(approvedReviews);
  }, []);

  useEffect(() => {
    if (!autoPlay || reviews.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % reviews.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [autoPlay, reviews]);

  const navigate = (dir: number) => {
    if (reviews.length === 0) return;
    setCurrent((p) => (p + dir + reviews.length) % reviews.length);
    setAutoPlay(false);
  };

  const t = reviews[current];

  return (
    <section className="section-padding bg-noir relative overflow-hidden">
      {/* Subtle gold background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            What Our Clients Say
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto">
          {reviews.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl">
              <Quote className="text-gold/40 mx-auto mb-4 animate-bounce" size={40} />
              <p className="text-ivory/60 font-body">No reviews submitted yet.</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glass rounded-2xl p-8 md:p-12 border border-gold/10 relative"
                >
                  {/* Decorative golden corner markers */}
                  <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-gold/30" />
                  <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-gold/30" />
                  <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-gold/30" />
                  <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-gold/30" />

                  <div className="flex flex-col items-center text-center gap-6">
                    {/* Big Quote Icon */}
                    <Quote className="text-gold/30 mb-2" size={48} />

                    {/* Dual-Language Testimonial Block */}
                    <div className="space-y-6 w-full">
                      {/* English Testimonial */}
                      <p className="text-ivory font-body text-lg md:text-xl leading-relaxed italic">
                        "{t.text}"
                      </p>

                      {/* Traditional Calligraphy Urdu Testimonial */}
                      {t.textUrdu && (
                        <div className="pt-4 border-t border-gold/10 w-3/4 mx-auto">
                          <p 
                            className="text-gold font-serif text-xl md:text-2xl leading-loose font-medium select-none" 
                            dir="rtl"
                          >
                            {t.textUrdu}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-1.5 justify-center mt-2">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          <Star
                            size={18}
                            className="text-gold fill-gold"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Client Info */}
                    <div className="mt-2">
                      <h4 className="text-gold font-heading text-lg font-bold tracking-wide">
                        {t.name}
                      </h4>
                      <p className="text-ivory/50 text-xs font-body mt-1 uppercase tracking-wider">
                        {t.role || "Client"}
                      </p>
                      <p className="text-gold/60 text-xs font-body mt-0.5 italic">
                        {t.event}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              {reviews.length > 1 && (
                <div className="flex justify-center items-center gap-6 mt-10">
                  {/* Previous Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="p-3 rounded-full border border-gold/30 text-ivory/50 hover:text-gold hover:border-gold/60 transition-all duration-300"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>

                  {/* Indicators */}
                  <div className="flex gap-2">
                    {reviews.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setCurrent(i);
                          setAutoPlay(false);
                        }}
                        className={`rounded-full transition-all duration-300 ${
                          i === current
                            ? "bg-gold w-8 h-2"
                            : "bg-ivory/20 w-2 h-2 hover:bg-ivory/40"
                        }`}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(1)}
                    className="p-3 rounded-full border border-gold/30 text-ivory/50 hover:text-gold hover:border-gold/60 transition-all duration-300"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </div>
              )}

              {/* Auto-play Toggle */}
              {reviews.length > 1 && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="text-ivory/40 hover:text-gold text-xs font-body transition-colors"
                  >
                    {autoPlay ? "⏸ Pause Autoplay" : "▶ Start Autoplay"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonialsCarousel;
