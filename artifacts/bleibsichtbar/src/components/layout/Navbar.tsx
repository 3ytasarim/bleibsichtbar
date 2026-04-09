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
  { name: "Analyse & Reporting", path: "/analyse" },
];

const WHATSAPP_NUMBER = "4915567152351";
const WHATSAPP_TEXT = encodeURIComponent(
  "Hallo Bleibsichtbar Team, ich würde gerne eine kostenlose Erstberatung anfragen."
);

function WhatsAppSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          "bg-white/98 backdrop-blur-xl border-b border-gray-100",
          isScrolled ? "py-2.5 shadow-sm" : "py-3.5"
        )}
      >
        <div className="w-full px-3 sm:px-5 lg:px-7">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Logo — pinned left */}
            <Link href="/" className="flex items-center shrink-0 group">
              <span className="font-display font-black text-[22px] tracking-[0.18em] uppercase text-foreground">
                Bleibsichtbar
              </span>
            </Link>

            {/* Desktop Nav — truly centered in the full header */}
            <nav className="hidden lg:flex items-center justify-center gap-6 2xl:gap-9">
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-[16px] xl:text-[17px] font-semibold transition-all hover:text-accent relative py-1 whitespace-nowrap",
                    location === link.path
                      ? "text-accent"
                      : "text-foreground/80"
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

            {/* CTA Button — "Kontakt" */}
            <div className="hidden lg:flex items-center shrink-0">
              <Link href="/kontakt">
                <motion.span
                  whileHover={{ scale: 1.06, boxShadow: "0 10px 34px rgba(255,107,53,0.5)" }}
                  whileTap={{ scale: 0.96 }}
                  animate={{
                    x: [0, -4, 4, -4, 4, -2, 2, 0],
                    transition: {
                      duration: 0.55,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: "easeInOut",
                    },
                  }}
                  className="relative overflow-hidden px-7 py-3 rounded-full text-[15px] font-bold text-white inline-flex items-center cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)",
                    boxShadow: "0 4px 18px rgba(255,107,53,0.4)",
                  }}
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 skew-x-12"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }}
                    animate={{ x: ["-100%", "220%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                  />
                  {/* Pulse ring */}
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-orange-400/60"
                    animate={{ scale: [1, 1.18], opacity: [0.7, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                  <span className="relative z-10 flex items-center gap-2 tracking-wide">
                    Kontakt
                  </span>
                </motion.span>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Floating Side Buttons (right, vertically centered) ─────────────── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 items-end">
        {/* WhatsApp */}
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: 56 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ x: -4, boxShadow: "0 8px 32px rgba(37,211,102,0.45)" }}
          className="flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-l-2xl text-white font-bold text-sm cursor-pointer select-none"
          style={{
            background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
            boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
          }}
        >
          <WhatsAppSVG className="w-5 h-5 text-white shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">WhatsApp</span>
        </motion.a>

        {/* Kontakt aufnehmen → opens modal */}
        <motion.button
          onClick={() => setModalOpen(true)}
          initial={{ x: 56 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ x: -4, boxShadow: "0 8px 32px rgba(255,107,53,0.45)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 pl-3.5 pr-4 py-3 rounded-l-2xl text-white font-bold text-sm cursor-pointer select-none"
          style={{
            background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)",
            boxShadow: "0 4px 20px rgba(255,107,53,0.3)",
          }}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden sm:inline whitespace-nowrap">Kontakt aufnehmen</span>
        </motion.button>
      </div>

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
              <div className="mx-6 h-px mb-4" style={{ background: "rgba(255,255,255,0.08)" }} />

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

                {/* Kontakt link in mobile menu too */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + links.length * 0.06, ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
                >
                  <Link
                    href="/kontakt"
                    className={cn(
                      "flex items-center gap-3 px-3 py-3.5 rounded-xl font-semibold text-[15px] transition-all",
                      location === "/kontakt"
                        ? "text-accent bg-accent/10"
                        : "text-white/75 hover:text-white hover:bg-white/06"
                    )}
                  >
                    {location === "/kontakt" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    )}
                    Kontakt
                  </Link>
                </motion.div>
              </nav>

              {/* CTA buttons (mobile bottom) */}
              <div className="px-5 pb-8 space-y-3">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #128C7E, #25D366)" }}
                >
                  <WhatsAppSVG className="w-5 h-5" />
                  WhatsApp schreiben
                </a>
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl text-sm font-bold text-white"
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
