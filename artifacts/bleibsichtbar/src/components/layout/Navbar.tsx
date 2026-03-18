import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

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
            <Link href="/" className="flex items-center shrink-0 group">
              <span className={cn("font-display font-bold text-2xl tracking-tight transition-colors", isScrolled || !isHeroPage ? "text-foreground" : "text-white")}>
                Bleibsichtbar
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-[13px] xl:text-sm font-medium transition-all hover:text-accent relative py-1 whitespace-nowrap",
                    location === link.path ? "text-accent" : isScrolled || !isHeroPage ? "text-foreground/80" : "text-white/90"
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

            <div className="hidden lg:flex items-center shrink-0">
              <Button asChild variant="default" className="rounded-full px-5 xl:px-6 text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
                <Link href="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>

            <button
              className={cn("lg:hidden p-2 rounded-lg transition-colors", isScrolled || !isHeroPage ? "text-foreground" : "text-white")}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

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
              <Button asChild variant="default" size="lg" className="w-full rounded-full text-lg font-semibold">
                <Link href="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
