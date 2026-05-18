import { Heart, Instagram, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-noir text-ivory/70">
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
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

        {/* Map */}
        <div>
          <h4 className="text-gold font-heading text-lg mb-4">Our Location</h4>
          <div className="w-full h-32 rounded-lg overflow-hidden border border-gold/20 shadow-md transition-all duration-300 hover:border-gold/50 hover:shadow-gold/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57904.38466141369!2d67.1952219!3d24.8970081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb3309a0a334f59%3A0x6e9f24b276709dc!2sMalir%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh!5e0!3m2!1sen!2spk!4v1716000000000!5m2!1sen!2spk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              title="Mehfil-e-Ishq Location Map"
            ></iframe>
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
