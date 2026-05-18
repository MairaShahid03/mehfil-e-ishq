import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, DollarSign, Image as ImageIcon,
  ChevronRight, Filter, X
} from "lucide-react";
import mansionMarquee from "@/assets/mansion-marquee.jpg";
import courtyardVenues from "@/assets/courtyard-venues.jpg";
import dynasty from "@/assets/dynasty.jpg";

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  priceRange: string;
  image: string;
  rating: number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
}

const venues: Venue[] = [
  {
    id: "1",
    name: "Mansion Marquee",
    location: "Karachi, Clifton",
    capacity: 500,
    priceRange: "PKR 500,000 - 1,500,000",
    image: mansionMarquee,
    rating: 4.9,
    amenities: ["AC Hall", "Luxury Decor", "Parking", "Catering"],
    coordinates: { lat: 24.7914, lng: 67.0099 },
  },
  {
    id: "2",
    name: "Courtyard Venues",
    location: "Karachi, Defence",
    capacity: 300,
    priceRange: "PKR 300,000 - 800,000",
    image: courtyardVenues,
    rating: 4.8,
    amenities: ["Outdoor Garden", "Beautiful Lighting", "Sound System", "Parking"],
    coordinates: { lat: 24.8241, lng: 67.0521 },
  },
  {
    id: "3",
    name: "Dynasty",
    location: "Karachi, KDA Scheme",
    capacity: 600,
    priceRange: "PKR 800,000 - 2,500,000",
    image: dynasty,
    rating: 5.0,
    amenities: ["Royal Stage", "Crystal Chandeliers", "VIP Lounge", "Valet Parking"],
    coordinates: { lat: 24.9, lng: 67.1 },
  },
];

const InteractiveVenueMap = () => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [filterCapacity, setFilterCapacity] = useState<number | null>(null);
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null);

  const filteredVenues = filterCapacity
    ? venues.filter((v) => v.capacity >= filterCapacity)
    : venues;

  return (
    <section className="section-padding bg-noir">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Venue Selection
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            Explore Our Premium Venues
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Filter Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-gold" />
              <h3 className="font-heading text-lg text-ivory">Filter Venues</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[200, 300, 400, 500].map((capacity) => (
                <motion.button
                  key={capacity}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setFilterCapacity(
                      filterCapacity === capacity ? null : capacity
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
                    filterCapacity === capacity
                      ? "bg-gold text-noir font-semibold"
                      : "bg-ivory/10 text-ivory/70 hover:bg-ivory/20"
                  }`}
                >
                  {capacity}+ Guests
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Venue Cards */}
          <div className="lg:col-span-2 space-y-6">
            {filteredVenues.map((venue, idx) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredVenue(venue.id)}
                onMouseLeave={() => setHoveredVenue(null)}
                onClick={() => setSelectedVenue(venue)}
                className="glass rounded-2xl overflow-hidden cursor-pointer group hover:border-gold/50 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent" />
                      <div className="absolute bottom-3 right-3 bg-gold/90 text-noir px-3 py-1 rounded-full text-sm font-bold">
                        ★ {venue.rating}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-2xl text-ivory mb-2">
                        {venue.name}
                      </h3>
                      <div className="flex items-center gap-2 text-ivory/60 mb-4">
                        <MapPin size={16} className="text-gold" />
                        <span className="text-sm">{venue.location}</span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {venue.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold/80"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gold" />
                        <div>
                          <p className="text-ivory text-sm font-semibold">
                            {venue.capacity}
                          </p>
                          <p className="text-ivory/50 text-xs">Capacity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gold" />
                        <div>
                          <p className="text-ivory text-sm font-semibold">
                            {venue.priceRange.split(" - ")[0]}
                          </p>
                          <p className="text-ivory/50 text-xs">Starting</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <motion.div
                    className="md:col-span-3"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredVenue === venue.id ? 1 : 0,
                    }}
                  >
                    <button className="btn-luxury w-full flex items-center justify-center gap-2">
                      View Details <ChevronRight size={18} />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Venue Preview Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedVenue ? (
                <motion.div
                  key={selectedVenue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass rounded-2xl p-6 sticky top-24"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-heading text-xl text-ivory">
                      {selectedVenue.name}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedVenue(null)}
                      className="text-ivory/50 hover:text-ivory"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {/* Image */}
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={selectedVenue.image}
                        alt={selectedVenue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gold" />
                        <span className="text-ivory/70 text-sm">
                          {selectedVenue.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gold" />
                        <span className="text-ivory/70 text-sm">
                          Up to {selectedVenue.capacity} guests
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gold" />
                        <span className="text-ivory/70 text-sm">
                          {selectedVenue.priceRange}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <p className="text-gold text-sm font-semibold mb-2">
                        Amenities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedVenue.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-xs px-2 py-1 rounded bg-gold/10 text-gold/80"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-luxury w-full mt-4"
                    >
                      Book This Venue
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <ImageIcon size={40} className="mx-auto text-gold/30 mb-4" />
                  <p className="text-ivory/50 font-body">
                    Select a venue to view details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveVenueMap;
