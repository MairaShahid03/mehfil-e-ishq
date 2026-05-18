import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Play, TrendingUp, Star, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroBaraat from "@/assets/hero-baraat.jpg";
import heroIftar from "@/assets/hero-iftar.jpg";
import { THEMES } from "@/lib/eventData";
import { useState } from "react";

const highlights = [
  { src: heroMehndi, label: "Mehndi Celebrations" },
  { src: heroBaraat, label: "Grand Baraat" },
  { src: heroIftar, label: "Ramadan Setups" },
];



const trendingEvents = [
  { name: "Royal Gold Wedding", bookings: 142, trend: "+28%", theme: "royal-gold" },
  { name: "Mughal Theme Baraat", bookings: 98, trend: "+15%", theme: "mughal" },
  { name: "Floral Pastel Nikkah", bookings: 87, trend: "+22%", theme: "floral-pastel" },
  { name: "Arabian Nights Walima", bookings: 76, trend: "+12%", theme: "arabian-nights" },
];

const popularPackages = [
  { name: "Full Event Planning", price: "PKR 300,000+", popularity: 95 },
  { name: "Mehndi + Baraat + Walima", price: "PKR 500,000+", popularity: 88 },
  { name: "Destination Wedding", price: "PKR 800,000+", popularity: 72 },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      {/* Introduction */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">About Us</p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-6">Mehfil-e-Ishq</h2>
            <div className="gold-divider mb-6" />
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              Mehfil-e-Ishq is a premium event planning company based in Karachi, specializing in
              weddings, Ramadan events, and luxury celebrations. We craft unforgettable moments
              with elegance, tradition, and meticulous attention to every detail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Our Expertise</p>
            <h2 className="font-heading text-3xl md:text-4xl text-ivory font-bold">What We Do Best</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading text-xl text-ivory font-bold">{item.label}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-luxury-outline text-ivory border-ivory/30 hover:bg-ivory/10 hover:text-ivory">View Full Gallery</Link>
          </div>
        </div>
      </section>



      {/* Popular Events / Trending */}
      <section className="section-padding bg-noir">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">What's Hot</p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground font-bold">Trending Events</h2>
            <div className="gold-divider mt-4" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trending Themes */}
            <div>
              <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-gold" /> Most Booked Themes
              </h3>
              <div className="space-y-3">
                {trendingEvents.map((event, i) => {
                  const theme = THEMES.find((t) => t.id === event.theme);
                  return (
                    <motion.div
                      key={event.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gold/10 bg-noir/30 hover:border-gold/30 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme?.color || "from-gold to-gold-light"} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-medium text-ivory text-sm">{event.name}</p>
                        <p className="text-ivory/40 text-xs">{event.bookings} bookings</p>
                      </div>
                      <span className="text-green-400 text-xs font-semibold font-body">{event.trend}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Popular Packages */}
            <div>
              <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
                <Star size={20} className="text-gold" /> Popular Packages
              </h3>
              <div className="space-y-3">
                {popularPackages.map((pkg, i) => (
                  <motion.div
                    key={pkg.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-gold/10 bg-noir/30 hover:border-gold/30 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-body font-medium text-ivory text-sm">{pkg.name}</p>
                      <span className="text-gold text-xs font-body">{pkg.price}</span>
                    </div>
                    <div className="w-full h-1.5 bg-ivory/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pkg.popularity}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.15 }}
                      />
                    </div>
                    <p className="text-ivory/30 text-xs mt-1 text-right">{pkg.popularity}% popularity</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link to="/booking" className="btn-luxury text-sm">Book Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact */}
      <section id="contact" className="section-padding bg-noir">
        <div className="container mx-auto text-center max-w-xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Get in Touch</p>
            <h2 className="font-heading text-3xl md:text-4xl text-ivory font-bold mb-6">Contact Us</h2>
            <div className="gold-divider mb-8" />
            <div className="space-y-4">
              <a href="tel:03282681668" className="flex items-center justify-center gap-3 text-ivory hover:text-gold transition-colors font-body text-lg">
                <Phone size={20} className="text-gold" /> 0328-2681668
              </a>
              <a href="https://wa.me/923282681668" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 btn-luxury text-base">
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
              <a href="https://www.instagram.com/dawateeishq.pk?igsh=ZGEwZmJ4NmJuMnlm" target="_blank" rel="noopener noreferrer" className="block text-gold hover:text-gold-light transition-colors font-body">
                @dawateeishq.pk on Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
