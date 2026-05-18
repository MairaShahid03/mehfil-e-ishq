import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroMehndi from "@/assets/hero-mehndi.jpg";
import heroIftar from "@/assets/hero-iftar.jpg";
import catBirthday from "@/assets/cat-birthday.jpg";
import catShower from "@/assets/cat-shower.jpg";

const categories = [
  { title: "Wedding", description: "Mehndi, Baraat, Walima & more", image: heroMehndi, slug: "wedding" },
  { title: "Ramadan Events", description: "Sehr, Iftar & Family Gatherings", image: heroIftar, slug: "ramadan" },
  { title: "Birthday Events", description: "Milestone celebrations", image: catBirthday, slug: "birthday" },
  { title: "Bridal / Baby Shower", description: "Elegant intimate gatherings", image: catShower, slug: "shower" },
];

const CategoryShowcase = () => (
  <section id="services" className="section-padding bg-noir">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">What We Offer</p>
        <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">Our Event Categories</h2>
        <div className="gold-divider" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              to={`/booking?category=${cat.slug}`}
              className="group relative block aspect-[3/4] rounded-xl overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-heading text-xl text-ivory font-semibold mb-1">{cat.title}</h3>
                <p className="text-ivory/60 text-sm font-body">{cat.description}</p>
                <div className="mt-3 w-0 group-hover:w-12 h-0.5 bg-gold transition-all duration-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryShowcase;
