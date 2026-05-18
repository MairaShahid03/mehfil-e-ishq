import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PremiumTestimonialsCarousel from "@/components/PremiumTestimonialsCarousel";
import GuestInvitationSystem from "@/components/GuestInvitationSystem";
import InteractiveVenueMap from "@/components/InteractiveVenueMap";
import AIDecorPreviewGenerator from "@/components/AIDecorPreviewGenerator";

const Features = () => {
  return (
    <div className="min-h-screen bg-noir text-ivory">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-noir via-noir to-noir/90">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold font-heading text-xs uppercase tracking-[0.4em] mb-4 block">
              Experience the Extraordinary
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Our Premium <span className="text-gold">Interactive Features</span>
            </h1>
            <p className="max-w-2xl mx-auto text-ivory/60 font-body text-md md:text-lg leading-relaxed">
              Dawat-e-Ishq delivers premium tools to design, curate, and perfect every detail of your dream event. From custom guest cards to AI decor previews and interactive venue maps.
            </p>
            <div className="gold-divider mt-8" />
          </motion.div>
        </div>
      </section>

      {/* 1. What Our Clients Say */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <PremiumTestimonialsCarousel />
      </motion.div>

      {/* 2. Invitation & RSVP System */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-gold/10"
      >
        <GuestInvitationSystem />
      </motion.div>

      {/* 3. Premium Venues Map */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-gold/10"
      >
        <InteractiveVenueMap />
      </motion.div>

      {/* 4. AI Decor Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-gold/10 pb-16"
      >
        <AIDecorPreviewGenerator />
      </motion.div>

      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Features;
