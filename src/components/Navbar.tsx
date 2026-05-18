import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LayoutDashboard } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./NotificationBell";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Features", path: "/features" },
  { label: "Gallery", path: "/gallery" },
  { label: "Booking", path: "/booking" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-noir/90 backdrop-blur-xl border-b border-gold/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Mehfil-e-Ishq" className="h-12 md:h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                  isActive(link.path) ? "text-gold" : "text-ivory/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <Link
                  to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-ivory/80 hover:text-gold font-body text-sm tracking-wider uppercase transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-ivory/80 hover:text-gold font-body text-sm tracking-wider uppercase transition-colors duration-300"
              >
                <LogIn size={16} /> Login
              </Link>
            )}
            <Link to="/booking" className="btn-luxury text-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-ivory p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-noir/95 backdrop-blur-xl border-t border-gold/10"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-base py-2 tracking-wider uppercase transition-colors ${
                    isActive(link.path) ? "text-gold" : "text-ivory/80 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <div className="py-2 border-y border-gold/10 my-2 flex items-center justify-between">
                    <span className="text-ivory/80 font-body text-base tracking-wider uppercase">Notifications</span>
                    <NotificationBell />
                  </div>
                  <Link
                    to={profile?.role === "admin" ? "/admin" : "/dashboard"}
                    className="text-ivory/80 hover:text-gold font-body text-base py-2 tracking-wider uppercase transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-ivory/80 hover:text-gold font-body text-base py-2 tracking-wider uppercase transition-colors flex items-center gap-2"
                >
                  <LogIn size={16} /> Login
                </Link>
              )}
              <Link to="/booking" className="btn-luxury text-center mt-2">
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
