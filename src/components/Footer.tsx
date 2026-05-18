import { Heart, Instagram, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-noir text-ivory/70">
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <img src={logo} alt="Mehfil-e-Ishq" className="h-12 w-auto mb-4" />
          <p className="text-sm leading-relaxed">
            Premium event planning based in Karachi. Crafting unforgettable moments with elegance, tradition, and love.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/services" className="hover:text-gold transition-colors">Services</Link>
            <Link to="/features" className="hover:text-gold transition-colors">Features</Link>
            <Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
            <Link to="/booking" className="hover:text-gold transition-colors">Book Event</Link>
            <Link to="/login" className="hover:text-gold transition-colors">Login</Link>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Our Services</h4>
          <div className="flex flex-col gap-2 text-sm">
            <span>Weddings</span>
            <span>Ramadan Events</span>
            <span>Birthday Celebrations</span>
            <span>Bridal & Baby Showers</span>
            <span>Destination Weddings</span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Contact Us</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a href="tel:03282681668" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone size={14} /> 0328-2681668
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={14} /> Karachi, Pakistan
            </span>
          </div>
          <div className="mt-4">
            <a href="https://www.instagram.com/dawateeishq.pk?igsh=ZGEwZmJ4NmJuMnlm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ivory/80 hover:text-gold hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all duration-300 font-body">
              <Instagram size={20} className="transform hover:scale-110 transition-transform" />
              <span>@dawateeishq.pk</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10 mt-12 pt-8 text-center text-xs text-ivory/40">
        <p className="flex items-center justify-center gap-1">
          © 2026 Mehfil-e-Ishq. Made with <Heart size={12} className="text-gold" /> in Karachi
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
