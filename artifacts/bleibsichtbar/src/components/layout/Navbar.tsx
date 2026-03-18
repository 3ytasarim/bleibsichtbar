import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { name: "Startseite", path: "/" },
  { name: "Leistungen", path: "/services" },
  { name: "Social Media", path: "/services/social-media" },
  { name: "Projekte", path: "/projekte" },
  { name: "Referenzen", path: "/referenzen" },
  { name: "Blog", path: "/blog" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-white/80 backdrop-blur-lg border-border/50 py-4 shadow-sm" 
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-display font-bold text-xl group-hover:bg-accent transition-colors">
                B
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Bleibsichtbar<span className="text-accent">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent relative",
                    location === link.path ? "text-accent" : "text-foreground/80"
                  )}
                >
                  {link.name}
                  {location === link.path && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center">
              <Button asChild variant="default" className="rounded-full px-6">
                <Link href="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-4 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col space-y-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-2xl font-display font-bold py-4 border-b border-border",
                    location === link.path ? "text-accent" : "text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8">
                <Button asChild variant="accent" size="lg" className="w-full">
                  <Link href="/kontakt">Kontakt aufnehmen</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
