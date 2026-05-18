import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha & Bilal",
    event: "Wedding — Baraat & Walima",
    text: "Mehfil-e-Ishq made our wedding a fairy tale. Every detail was perfect, from the floral arrangements to the lighting. Our guests still talk about it!",
    rating: 5,
  },
  {
    name: "Fatima Khan",
    event: "Ramadan Iftar Gathering",
    text: "The most beautifully organized iftar we've ever hosted. The décor, the ambiance, the food — everything was beyond our expectations.",
    rating: 5,
  },
  {
    name: "Haris & Sana",
    event: "Mehndi Night",
    text: "Our mehndi was absolutely magical. The team understood our vision perfectly and brought it to life with such elegance and creativity.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[current];

  return (
    <section className="section-padding bg-noir relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">What Our Clients Say</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-8 md:p-12"
            >
              <Quote className="mx-auto mb-6 text-gold/40" size={40} />
              <p className="text-ivory/80 font-body text-lg md:text-xl leading-relaxed italic mb-6">
                "{t.text}"
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <h4 className="text-gold font-heading text-lg">{t.name}</h4>
              <p className="text-ivory/50 text-sm">{t.event}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="text-ivory/30 hover:text-gold transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2 items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-gold w-6" : "bg-ivory/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
              className="text-ivory/30 hover:text-gold transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
