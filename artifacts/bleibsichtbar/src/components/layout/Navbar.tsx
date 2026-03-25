import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ContactModal } from "@/components/shared/ContactModal";

const links = [
  { name: "Start", path: "/" },
  { name: "Social Media", path: "/social-media" },
  { name: "Webseiten", path: "/webseiten" },
  { name: "Marketing Ads", path: "/marketing-ads" },
  { name: "Ki & Automatisierungen", path: "/ki-automatisierungen" },
  { name: "Analyse", path: "/analyse" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const isHeroPage = location === "/";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-100 py-3 shadow-sm"
            : isHeroPage
            ? "bg-transparent border-transparent py-6"
            : "bg-white/95 backdrop-blur-xl border-b border-gray-100 py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 group">
              <span className={cn(
                "font-display font-black text-[22px] tracking-[0.18em] uppercase transition-colors",
                isScrolled || !isHeroPage ? "text-foreground" : "text-white"
              )}>
                Bleibsichtbar
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-[13px] xl:text-sm font-medium transition-all hover:text-accent relative py-1 whitespace-nowrap",
                    location === link.path
                      ? "text-accent"
                      : isScrolled || !isHeroPage
                      ? "text-foreground/80"
                      : "text-white/90"
                  )}
                >
                  {link.name}
                  {location === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center shrink-0">
              <motion.button
                onClick={() => setModalOpen(true)}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 28px rgba(255,107,53,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)" }}
              >
                {/* Shimmer */}
                <motion.span
                  className="absolute inset-0 -translate-x-full skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
                  animate={{ x: ["−100%", "200%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                />
                <span className="relative flex items-center gap-2">
                  Kontakt aufnehmen
                </span>
              </motion.button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isScrolled || !isHeroPage ? "text-foreground" : "text-white"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 pb-8 overflow-y-auto"
          >
            <nav className="flex flex-col space-y-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.path}
                    className={cn(
                      "block text-2xl font-display font-bold py-4 border-b border-gray-100 hover:text-accent transition-colors",
                      location === link.path ? "text-accent" : "text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="pt-8">
              <motion.button
                onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-full text-lg font-bold text-white"
                style={{ background: "linear-gradient(135deg, #ff6b35, #e8522a)" }}
              >
                Kontakt aufnehmen
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
