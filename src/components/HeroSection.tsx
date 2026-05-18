import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroBaraat from "@/assets/hero-baraat.jpg";
import heroWalima from "@/assets/hero-walima.jpg";
import heroIftar from "@/assets/hero-iftar.jpg";

const slides = [
  { image: heroMehndi, title: "Mehndi Celebrations", subtitle: "Golden traditions, timeless memories" },
  { image: heroBaraat, title: "Grand Baraat", subtitle: "Where royalty meets celebration" },
  { image: heroWalima, title: "Elegant Walima", subtitle: "Sophistication in every detail" },
  { image: heroIftar, title: "Ramadan Gatherings", subtitle: "Sacred moments, beautifully hosted" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => setCurrent((p) => (p + dir + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gold font-heading text-lg md:text-xl tracking-[0.3em] uppercase mb-4"
        >
          Mehfil-e-Ishq
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl text-ivory font-bold leading-tight mb-4"
        >
          Crafting Unforgettable
          <br />
          <span className="gradient-gold-text">Moments</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-ivory/70 font-body text-lg md:text-xl mb-8 max-w-2xl"
        >
          {slides[current].subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/booking" className="btn-luxury text-base">
            Book Your Event
          </Link>
          <a href="#services" className="btn-luxury-outline text-base text-ivory border-ivory/50 hover:bg-ivory/10 hover:text-ivory">
            Explore Services
          </a>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-gold w-8" : "bg-ivory/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-ivory/50 hover:text-gold transition-colors"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-ivory/50 hover:text-gold transition-colors"
      >
        <ChevronRight size={40} />
      </button>
    </section>
  );
};

export default HeroSection;
