import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed, Palette, Camera, Sparkles, Calendar, Flower2,
  Zap, Printer,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ServiceCard from "@/components/ServiceCard";

const services = [
  {
    icon: UtensilsCrossed, title: "Catering",
    desc: "Exquisite menus tailored to your event — from traditional desi feasts to international cuisines. Our culinary team crafts bespoke dining experiences.",
    features: ["Custom menu design", "Live cooking stations", "Traditional & fusion options", "Professional service staff", "Dietary accommodations", "Premium crockery & setup"],
    packages: ["Dawat-e-Khaas — PKR 6,500/head", "Shan-e-Baraat — PKR 3,850/head", "Chef's Masterpiece — PKR 7,000/head"],
    pricingHint: "Starting from PKR 3,850/head",
    images: ["Biryani setup", "Buffet station", "Live BBQ"],
  },
  {
    icon: Palette, title: "Decor & Design",
    desc: "Creative design teams transforming ordinary venues into breathtaking luxury experiences with meticulous attention to every detail.",
    features: ["Stage design", "Entrance decor", "Ceiling draping", "Lighting design", "Table centerpieces", "Lounge areas"],
    packages: ["Mayoun Decor — PKR 650,000", "Full Wedding Decor — Custom", "Mehndi Setup — Custom"],
    pricingHint: "Starting from PKR 150,000",
    images: ["Gold stage", "Floral arch", "Lounge setup"],
  },
  {
    icon: Camera, title: "Photography & Videography",
    desc: "Cinematic coverage capturing every precious moment. From candid photography to drone shots and full-length films.",
    features: ["Candid photography", "Cinematic video", "Drone coverage", "Same-day edit", "Photo booth", "Albums & prints"],
    packages: ["Photo Only — PKR 80,000+", "Photo + Video — PKR 150,000+", "Premium Package — PKR 250,000+"],
    pricingHint: "Starting from PKR 80,000",
    images: ["Couple portrait", "Baraat coverage", "Drone shot"],
  },
  {
    icon: Sparkles, title: "Bride/Groom Makeover",
    desc: "Theme-based bridal and groom styling with top makeup artists, hair stylists, and fashion designers.",
    features: ["Bridal makeup", "Groom styling", "Trial sessions", "Outfit coordination", "Jewelry matching", "Touch-up kit"],
    packages: ["Bridal Only — PKR 50,000+", "Bride + Groom — PKR 80,000+", "Full Entourage — Custom"],
    pricingHint: "Starting from PKR 50,000",
    images: ["Bridal look", "Groom style", "Mehndi look"],
  },
  {
    icon: Calendar, title: "Event Planning",
    desc: "Full-service event management ensuring flawless execution from concept to completion. We handle everything so you can enjoy.",
    features: ["Vendor management", "Timeline planning", "Budget tracking", "Day-of coordination", "Guest management", "Emergency handling"],
    packages: ["Consultation — PKR 25,000", "Partial Planning — PKR 100,000+", "Full Planning — PKR 200,000+"],
    pricingHint: "Starting from PKR 25,000",
    images: ["Planning board", "Timeline chart", "Setup"],
  },
  {
    icon: Flower2, title: "Floral Decoration",
    desc: "Stunning floral arrangements from traditional marigold setups to modern imported flower installations.",
    features: ["Fresh flowers", "Artificial options", "Stage florals", "Car decoration", "Bouquets", "Table arrangements"],
    packages: ["Basic Floral — PKR 50,000+", "Premium Floral — PKR 150,000+", "Luxury Imports — PKR 300,000+"],
    pricingHint: "Starting from PKR 50,000",
    images: ["Rose arch", "Marigold stage", "Bouquet"],
  },
  {
    icon: Zap, title: "Lighting & Sound",
    desc: "Professional lighting and sound systems that set the perfect mood and ambiance for your celebration.",
    features: ["LED uplighting", "Fairy lights", "DJ system", "Stage lighting", "Ambient effects", "Followspot"],
    packages: ["Basic Sound — PKR 30,000+", "Full Lighting — PKR 80,000+", "Premium AV — PKR 150,000+"],
    pricingHint: "Starting from PKR 30,000",
    images: ["Stage lights", "Fairy lights", "DJ setup"],
  },
  {
    icon: Printer, title: "Invitations",
    desc: "Customized and handmade invitation cards with premium finishes, calligraphy, and luxury packaging.",
    features: ["Custom design", "Calligraphy", "Box invites", "Digital invites", "RSVP management", "Thank-you cards"],
    packages: ["Digital Only — PKR 15,000", "Printed — PKR 500+/card", "Luxury Box — PKR 2,000+/card"],
    pricingHint: "Starting from PKR 15,000",
    images: ["Box invite", "Card design", "Calligraphy"],
  },
];

const packages = [
  {
    title: "DAWAT-E-KHAAS", subtitle: "Baraat Menu", price: "PKR 6,500", perHead: true, highlight: true,
    sections: [
      { heading: "Starters", items: ["Soup", "Fish Crackers", "Mini Burgers with Caramelised Onion & Cheese"] },
      { heading: "Main Course", items: ["Lamb Kofta with Mint Yogurt", "Charcoal Kabab with Apricot Chutni", "King Prawn Biryani", "Delhi Butter Chicken", "Mutton Joints with Tartar Sauce", "Stuffed Chicken Supreme", "Alfredo Pasta", "Beef Afghani Pulao", "Smoky Tandoori Drumsticks", "Assorted Naan & Breads"] },
      { heading: "Desserts", items: ["Saal Halwa", "Sweet Bar with Assorted Cakes", "Gurr Chawal", "Live Jalebi with Rabri"] },
      { heading: "Add-ons", items: ["Tin Packs", "Water", "Salad Bar"] },
    ],
  },
  {
    title: "SHAN-E-BARAAT", subtitle: "Baraat Menu", price: "PKR 3,850", perHead: true,
    sections: [
      { heading: "Starters", items: ["Hot & Sour Soup", "Fish Crackers"] },
      { heading: "Main Course", items: ["Beef Kabuli Pulao", "Mutton Kunna", "Chicken with Cashew Nuts & Rice", "Assorted Bread"] },
      { heading: "Desserts", items: ["Aloo Bukhara Chatni", "Fruit Trifle", "Gulab Jamun", "Green Tea"] },
      { heading: "Add-ons", items: ["Tin Packs", "Water", "Salad Bar"] },
    ],
  },
  {
    title: "CHEF'S MASTERPIECE", subtitle: "Baraat Menu", price: "PKR 7,000", perHead: true,
    sections: [
      { heading: "Starters", items: ["Sesame Fried Shrimps", "Spring Rolls", "Fried Wings", "Broccoli Soup"] },
      { heading: "Main Course", items: ["Turkish Kabab", "Paneer Tikka", "Fish Tikka", "Mutton Keema with Malai", "Mutton Badami Qorma", "Mutton Champ", "Chicken Manchurian", "Garlic Chicken"] },
      { heading: "Desserts", items: ["Kulfi", "Fruit Trifle", "Kheer Thuti", "Chocolate Mousse"] },
      { heading: "Add-ons", items: ["Tin Packs", "Water", "Salad Bar"] },
    ],
  },
  {
    title: "CATERING SETUP", subtitle: "Full Setup Package", price: "Custom", perHead: false,
    sections: [
      { heading: "Includes", items: ["Dera Setup", "Carpet", "Goblet Glass", "Crockery", "Cutlery", "Round Table Sitting with Sofa 20%", "Sofa Chairs & Covers", "Buffet Stations", "Lighting", "Waiters"] },
    ],
  },
  {
    title: "MEHNDI PACKAGE", subtitle: "Food Menu", price: "Custom", perHead: false,
    sections: [
      { heading: "Menu", items: ["Pathore Chanay", "Tikka Boti", "Gulab Jamun", "Mineral Water", "Chicken Kababs", "Live Nan", "Fresh Salad Raita", "Cold Drinks"] },
    ],
  },
  {
    title: "RAMZAN FARSHI SETUP", subtitle: "Complete Setup", price: "PKR 35,000", perHead: false,
    sections: [
      { heading: "Includes", items: ["Wooden pallets", "Carpet", "Cushions", "Floral work", "Table decor", "Fairy lights + baby lanterns", "Crockery, cutlery, mats & napkins", "Ambient lighting", "Custom backdrop (arch, balloons, floral work)", "Cake stand & cake table"] },
    ],
  },
  {
    title: "BIRTHDAY FARSHI SETUP", subtitle: "Complete Setup", price: "PKR 44,999", perHead: false,
    sections: [
      { heading: "Includes", items: ["Wooden pallets", "Carpet", "Cushions", "Floral decor", "Lighting", "Backdrop", "Cake table"] },
    ],
  },
  {
    title: "MAYOUN DECOR", subtitle: "Full Decor Package", price: "PKR 650,000", perHead: false,
    sections: [
      { heading: "Includes", items: ["Entrance decor (gainda setup)", "Floral stage setup", "Walkway decor", "Dining setup", "Lounge area setup", "Floral stands", "Photobooth", "Sound system"] },
    ],
  },
];

const Services = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="pt-28 pb-16 px-4 bg-noir">
      <div className="container mx-auto text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
          What We Offer
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
          Our Services
        </motion.h1>
        <div className="gold-divider" />
      </div>
    </section>

    {/* Interactive Services Grid */}
    <section className="section-padding bg-noir">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Packages */}
    <section id="packages" className="section-padding bg-noir">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Premium Menus</p>
          <h2 className="font-heading text-3xl md:text-5xl text-foreground font-bold mb-4">Our Packages</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-gold ${
                pkg.highlight ? "border-gold bg-gold/5" : "border-gold/20 bg-noir/50"
              }`}
            >
              {pkg.highlight && (
                <div className="bg-gold text-noir text-center py-2 text-xs font-heading font-bold tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <p className="text-gold/70 text-xs tracking-wider uppercase mb-1">{pkg.subtitle}</p>
                <h3 className="font-heading text-2xl text-foreground font-bold mb-1">{pkg.title}</h3>
                <p className="text-gold font-heading text-xl font-bold">
                  {pkg.price}
                  {pkg.perHead && <span className="text-sm text-muted-foreground font-body font-normal"> / per head</span>}
                </p>
                <div className="mt-6 space-y-4">
                  {pkg.sections.map((section) => (
                    <div key={section.heading}>
                      <h4 className="text-gold/80 text-xs tracking-wider uppercase font-semibold mb-2">{section.heading}</h4>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-gold mt-1">•</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link to={`/booking?package=${encodeURIComponent(pkg.title)}`} className="btn-luxury w-full text-center block mt-6 text-sm">
                  Book This Package
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding bg-noir">
      <div className="container mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl md:text-4xl text-ivory font-bold mb-4">
            Ready to Plan Your Dream Event?
          </h2>
          <p className="text-ivory/60 mb-8 max-w-lg mx-auto">
            Contact us today and let our expert team create something extraordinary for you.
          </p>
          <Link to="/booking" className="btn-luxury text-base">Get Started</Link>
        </motion.div>
      </div>
    </section>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default Services;
