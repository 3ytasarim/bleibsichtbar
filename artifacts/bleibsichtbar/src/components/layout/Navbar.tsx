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
  { name: "Kontakt", path: "/kontakt" },
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(5,10,22,0.72)", backdropFilter: "blur(6px)" }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Left panel */}
            <motion.div
              key="drawer-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 z-50 flex flex-col"
              style={{
                width: "80vw",
                maxWidth: 320,
                background: "linear-gradient(160deg, #0c1a36 0%, #0a1628 100%)",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "8px 0 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* Logo + close row */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <span className="font-display font-black text-[18px] tracking-[0.18em] uppercase text-white">
                  Bleibsichtbar
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-white/08 mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Nav links */}
              <nav className="flex flex-col px-4 flex-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
                  >
                    <Link
                      href={link.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3.5 rounded-xl font-semibold text-[15px] transition-all",
                        location === link.path
                          ? "text-accent bg-accent/10"
                          : "text-white/75 hover:text-white hover:bg-white/06"
                      )}
                      style={location !== link.path ? { "--tw-bg-opacity": 1 } as React.CSSProperties : undefined}
                    >
                      {location === link.path && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                      )}
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA */}
              <div className="px-5 pb-8">
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #ff6b35, #e8522a)" }}
                >
                  Kontakt aufnehmen
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
