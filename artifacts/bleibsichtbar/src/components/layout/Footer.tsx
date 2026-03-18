import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";

const TICKER_ITEMS = Array(14).fill(null);

export function Footer() {
  return (
    <div className="bg-white">
      <footer
        className="text-white overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d1f45 60%, #111d3a 100%)",
          borderRadius: "32px 32px 0 0",
          marginTop: "0",
        }}
      >

        {/* ── Scrolling Ticker ── */}
        <div
          className="overflow-hidden border-b border-white/[0.07]"
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            className="flex whitespace-nowrap select-none"
          >
            {TICKER_ITEMS.map((_, i) => (
              <span key={i} className="inline-flex items-center shrink-0">
                <span
                  className="font-display font-black uppercase text-white/75"
                  style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)", letterSpacing: "0.15em" }}
                >
                  BLEIBSICHTBAR.COM
                </span>
                <span
                  className="font-display font-black text-white/20 mx-10"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)" }}
                >
                  –
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Main Footer Body ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start pb-14 border-b border-white/[0.07]">

            {/* LEFT — Big Statement */}
            <div className="md:col-span-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-accent/80 mb-5">
                // Kontakt
              </p>
              <h2
                className="font-display font-black text-white uppercase leading-none mb-0"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", letterSpacing: "-0.01em", lineHeight: 1.05 }}
              >
                LASSEN SIE UNS IHR<br />
                UNTERNEHMEN<br />
                <span className="text-accent">SICHTBAR</span> MACHEN.
              </h2>
            </div>

            {/* RIGHT — Nav + Kontakt */}
            <div className="md:col-span-6 grid grid-cols-2 gap-8 md:pl-8">

              {/* Navigation */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">
                  Navigation
                </h4>
                <ul className="space-y-3.5">
                  {[
                    { label: "Datenschutz", href: "/datenschutz" },
                    { label: "Impressum", href: "/impressum" },
                    { label: "Social Media", href: "/social-media" },
                    { label: "Webseiten", href: "/webseiten" },
                    { label: "Marketing Ads", href: "/marketing-ads" },
                    { label: "KI & Automatisierungen", href: "/ki-automatisierungen" },
                    { label: "Analyse", href: "/analyse" },
                  ].map(l => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-white/55 hover:text-white transition-colors text-sm font-medium"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kontakt */}
              <div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">
                  Kontakt
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="mailto:info@bleibsichtbar.com"
                      className="flex items-start gap-2 text-white/55 hover:text-white transition-colors text-sm font-medium group"
                    >
                      <Mail className="w-3.5 h-3.5 mt-0.5 text-accent shrink-0" />
                      info@bleibsichtbar.com
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/kontakt"
                      className="flex items-center gap-1.5 text-white/55 hover:text-white transition-colors text-sm font-medium group"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                      Kostenlose Erstberatung
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/bleibsichtbar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-white/55 hover:text-white transition-colors text-sm font-medium group"
                    >
                      <Instagram className="w-3.5 h-3.5 text-accent group-hover:scale-110 transition-transform shrink-0" />
                      Folgen Sie uns auf Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-white/25 text-xs tracking-wide order-2 md:order-1">
              © Bleibsichtbar {new Date().getFullYear()}, Alle Rechte vorbehalten
            </p>
            <Link
              href="/admin/login"
              className="text-white/10 text-xs hover:text-white/30 transition-colors order-1 md:order-2"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
