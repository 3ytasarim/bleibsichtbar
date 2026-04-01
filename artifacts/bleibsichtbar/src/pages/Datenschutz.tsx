import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";

const sections = [
  {
    num: "1.",
    title: "Verantwortlicher",
    content: [
      "Bleibsichtbar LLC",
      "Sitz der Gesellschaft: New Mexico, USA",
      "E-Mail: info@bleibsichtbar.com",
      "Weitere Angaben zum Unternehmen finden Sie im Impressum dieser Website.",
    ],
  },
  {
    num: "2.",
    title: "Allgemeine Hinweise zur Datenverarbeitung",
    content: [
      "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist oder sofern Sie uns Daten freiwillig mitteilen (z. B. über Kontaktformular, E-Mail oder Terminbuchung).",
    ],
  },
  {
    num: "3.",
    title: "Rechtsgrundlagen der Verarbeitung",
    content: [
      "Die Verarbeitung erfolgt auf Grundlage von:",
      "· Art. 6 Abs. 1 lit. b DSGVO (Vertrag / vorvertragliche Maßnahmen)",
      "· Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren und stabilen Betrieb der Website)",
      "· Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, sofern erforderlich)",
    ],
  },
  {
    num: "4.",
    title: "Hosting und Website-Betrieb",
    content: [
      "Unsere Website wird über einen professionellen Hosting-Anbieter bereitgestellt. Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, um die Seite an Ihr Endgerät auszuliefern und die Sicherheit zu gewährleisten.",
    ],
  },
  {
    num: "5.",
    title: "Cookies",
    content: [
      "Unsere Website verwendet technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind.",
    ],
  },
  {
    num: "6.",
    title: "Kontaktaufnahme",
    content: [
      "Wenn Sie uns per Formular, E-Mail oder über Plattformen kontaktieren, werden Ihre Angaben zur Bearbeitung Ihrer Anfrage verarbeitet.",
    ],
  },
  {
    num: "7.",
    title: "Nutzung externer Tools",
    content: [
      "Zur Bearbeitung von Anfragen und Projekten nutzen wir ggf. Tools wie Google Forms, Calendly oder Videomeeting-Dienste. Die Nutzung erfolgt ausschließlich zur Kommunikation und Projektabwicklung.",
    ],
  },
  {
    num: "8.",
    title: "Kommunikation über Social Media",
    content: [
      "Wir kommunizieren mit Interessenten und Kunden teilweise über Plattformen wie Instagram, WhatsApp oder LinkedIn. Dabei werden übermittelte Daten ausschließlich zur Bearbeitung Ihrer Anfrage verwendet.",
    ],
  },
  {
    num: "9.",
    title: "Datenverarbeitung im Rahmen unserer Leistungen",
    content: [
      "Im Rahmen unserer Agenturleistungen verarbeiten wir Daten ausschließlich zur Durchführung von Projekten, Marketing- oder Automatisierungsleistungen.",
    ],
  },
  {
    num: "10.",
    title: "Speicherdauer",
    content: [
      "Wir speichern personenbezogene Daten nur so lange, wie dies für den jeweiligen Zweck erforderlich ist und keine gesetzlichen Aufbewahrungspflichten bestehen.",
    ],
  },
  {
    num: "11.",
    title: "Ihre Rechte",
    content: [
      "Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Widerspruch gegen die Verarbeitung Ihrer Daten.",
    ],
  },
  {
    num: "12.",
    title: "Änderungen",
    content: [
      "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich rechtliche Anforderungen oder unsere Leistungen ändern.",
    ],
  },
];

export default function Datenschutz() {
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
            Datenschutzerklärung
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
            {sections.map((section) => (
              <div key={section.num}>
                <h2 className="text-xl font-display font-bold mb-4 flex items-baseline gap-2">
                  <span className="text-accent font-black">{section.num}</span>
                  {section.title}
                </h2>
                <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                  {section.content.map((line, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
