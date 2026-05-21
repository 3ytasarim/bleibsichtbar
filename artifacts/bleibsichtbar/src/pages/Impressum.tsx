import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";

export default function Impressum() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="py-24 pt-36 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0a1628 0%, #163060 50%, #0a1628 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-bold tracking-widest uppercase text-accent/80 mb-4"
          >
            // Rechtliches
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Impressum
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                <span className="text-accent font-black">1.</span>
                Angaben gemäß § 5 DDG
              </h2>
              <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                <p className="text-muted-foreground leading-relaxed">Anbieter: <strong className="text-foreground">Bleibsichtbar LLC</strong></p>
                <p className="text-muted-foreground leading-relaxed">Sitz der Gesellschaft: New Mexico, USA</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                <span className="text-accent font-black">2.</span>
                Vertreten durch
              </h2>
              <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                <p className="text-muted-foreground leading-relaxed">Semih Özdemir</p>
                <p className="text-muted-foreground leading-relaxed">Geschäftsführer</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                <span className="text-accent font-black">3.</span>
                Kontakt
              </h2>
              <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                <p className="text-muted-foreground leading-relaxed">
                  E-Mail:{" "}
                  <a href="mailto:info@bleibsichtbar.com" className="text-accent hover:underline font-medium">
                    info@bleibsichtbar.com
                  </a>
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Website:{" "}
                  <a href="https://www.bleibsichtbar.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">
                    www.bleibsichtbar.com
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                <span className="text-accent font-black">4.</span>
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </h2>
              <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                <p className="text-muted-foreground leading-relaxed">Semih Özdemir</p>
                <p className="text-muted-foreground leading-relaxed">Bleibsichtbar LLC</p>
                <p className="text-muted-foreground leading-relaxed">New Mexico, USA</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                <span className="text-accent font-black">5.</span>
                Verbraucherstreitbeilegung
              </h2>
              <div className="pl-6 border-l-2 border-gray-100">
                <p className="text-muted-foreground leading-relaxed">
                  Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                <span className="text-accent font-black">6.</span>
                Haftungsausschluss
              </h2>
              <div className="pl-6 border-l-2 border-gray-100">
                <p className="text-muted-foreground leading-relaxed">
                  Die Inhalte dieser Webseite werden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
