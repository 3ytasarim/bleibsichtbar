import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";

const sections = [
  {
    num: "1.",
    title: "Geltungsbereich",
    content: [
      '(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Bleibsichtbar (nachfolgend \u201EAgentur\u201C) und ihren Kunden (nachfolgend \u201EKunde\u201C) über Social Media, Webseiten, Online-Werbung (Ads), KI-Dienstleistungen sowie damit verbundene Leistungen.',
      "(2) Abweichende oder entgegenstehende Bedingungen des Kunden werden nicht Vertragsbestandteil, es sei denn, die Agentur stimmt deren Geltung ausdrücklich schriftlich zu.",
    ],
  },
  {
    num: "2.",
    title: "Vertragsgegenstand",
    content: [
      "(1) Die Agentur erbringt Dienstleistungen insbesondere in den Bereichen:",
      "· Social Media Betreuung",
      "· Content-Erstellung",
      "· Webseiten",
      "· Online-Werbung (Ads)",
      "· KI-Dienstleistungen",
      "(2) Der konkrete Leistungsumfang ergibt sich ausschließlich aus dem jeweiligen Angebot/Vertrag. Leistungen, die dort nicht aufgeführt sind, sind nicht geschuldet.",
    ],
  },
  {
    num: "3.",
    title: "Zusatzleistungen",
    content: [
      "(1) Alle Leistungen außerhalb der vereinbarten Social Media Betreuung sind kostenpflichtig.",
      "(2) Dies betrifft insbesondere, aber nicht abschließend:",
      "· Flyer",
      "· Menükarten",
      "· Plakatdesigns",
      "· Branding",
      "· sonstige Grafik- und Designleistungen",
      "(3) Zusatzleistungen werden nur nach gesonderter Vereinbarung erbracht und entsprechend vergütet.",
    ],
  },
  {
    num: "4.",
    title: "Werbung (Ads)",
    content: [
      "(1) Die Schaltung und Betreuung von Werbeanzeigen (Ads) ist nicht Bestandteil der regulären Social Media Betreuung.",
      "(2) Ads-Leistungen werden ausschließlich separat beauftragt und vergütet.",
    ],
  },
  {
    num: "5.",
    title: "Vertragslaufzeit und Kündigung",
    content: [
      "(1) Social Media, Webseiten, Ads und KI-Dienstleistungen werden ausschließlich auf Vertragsbasis erbracht.",
      "(2) Die Kündigungsfrist beträgt 1 Monat zum nächsten Abrechnungszeitraum.",
      "(3) Maßgeblich ist der individuelle Zahlungstag.",
      "Beispiel: Erfolgt die Zahlung am 25. eines Monats, muss die Kündigung spätestens am 25. des Vormonats eingehen.",
      "(4) Erfolgt keine fristgerechte Kündigung, verlängert sich der Vertrag automatisch und die bis dahin erbrachten sowie anfallenden Leistungen werden vollständig berechnet.",
    ],
  },
  {
    num: "6.",
    title: "Preise und Zahlungsbedingungen",
    content: [
      "(1) Alle Preise verstehen sich netto zzgl. gesetzlicher Umsatzsteuer.",
      "(2) Rechnungen sind innerhalb von 7 Tagen nach Rechnungsstellung zu begleichen.",
      "(3) Bei Zahlungsverzug ist die Agentur berechtigt:",
      "· die Leistungserbringung (insbesondere Social Media Postings) sofort einzustellen",
      "· bereits erstellte Leistungen vollständig in Rechnung zu stellen",
      "· Nutzungsrechte an erstellten Inhalten bis zur vollständigen Zahlung auszusetzen",
    ],
  },
  {
    num: "7.",
    title: "Content-Produktion und Fotografie",
    content: [
      "(1) Content- und Fototage werden im Voraus abgestimmt.",
      "(2) Sofern keine Änderungen kommuniziert werden, erfolgt die Umsetzung wie vereinbart.",
      "(3) Ein Anspruch auf Rückerstattung besteht nicht, sofern die Inhalte wie vereinbart umgesetzt wurden.",
      "Fotografie-Leistungen:",
      "· 350 € für bis zu 3 Stunden",
      "· jede angefangene weitere Stunde: 80 €",
      "(4) Content-Tage sind nur dann inklusive, wenn dies ausdrücklich vereinbart wurde. Andernfalls gelten die oben genannten Preise.",
    ],
  },
  {
    num: "8.",
    title: "Leistungsdurchführung",
    content: [
      "(1) Die Agentur ist berechtigt, Leistungen durch Dritte (Subunternehmer) erbringen zu lassen.",
      "(2) Die Agentur schuldet keinen bestimmten wirtschaftlichen Erfolg.",
    ],
  },
  {
    num: "9.",
    title: "Mitwirkungspflichten des Kunden",
    content: [
      "(1) Der Kunde stellt alle zur Leistungserbringung erforderlichen Inhalte, Informationen und Zugänge rechtzeitig zur Verfügung.",
      "(2) Verzögerungen aufgrund fehlender Mitwirkung gehen nicht zu Lasten der Agentur.",
      "(3) Der Kunde ist für die rechtliche Zulässigkeit bereitgestellter Inhalte selbst verantwortlich.",
    ],
  },
  {
    num: "10.",
    title: "Haftung",
    content: [
      "(1) Die Agentur haftet nicht für:",
      "· Umsätze",
      "· Verkaufszahlen",
      "· Kundengewinnung",
      "· sonstige wirtschaftliche Ergebnisse",
      "(2) Eine Erfolgsgarantie wird ausdrücklich nicht übernommen.",
    ],
  },
  {
    num: "11.",
    title: "Nutzungsrechte",
    content: [
      "(1) Nutzungsrechte an erstellten Inhalten gehen erst nach vollständiger Zahlung auf den Kunden über.",
      "(2) Bis zur vollständigen Zahlung verbleiben alle Rechte bei der Agentur.",
    ],
  },
  {
    num: "12.",
    title: "Geheimhaltung",
    content: [
      "Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei nicht an Dritte weiterzugeben.",
    ],
  },
  {
    num: "13.",
    title: "Schlussbestimmungen",
    content: [
      "(1) Es gilt das Recht der Bundesrepublik Deutschland.",
      "(2) Gerichtsstand ist, soweit zulässig, der Sitz der Agentur.",
      "(3) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
    ],
  },
];

export default function AGB() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="py-24 pt-36 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0a1628 0%, #163060 50%, #0a1628 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold tracking-widest uppercase text-accent/80 mb-4"
          >
            // Rechtliches
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Allgemeine Geschäftsbedingungen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-3 text-white/50 text-sm"
          >
            Stand: Mai 2026
          </motion.p>
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
                  {section.content.map((line, i) => {
                    const isBullet = line.startsWith("·");
                    const isSubLabel = line.endsWith(":");
                    return (
                      <p
                        key={i}
                        className={
                          isBullet
                            ? "text-muted-foreground leading-relaxed pl-3 flex gap-2"
                            : isSubLabel
                            ? "text-sm font-semibold text-foreground/70 mt-3"
                            : "text-muted-foreground leading-relaxed"
                        }
                      >
                        {isBullet ? (
                          <>
                            <span className="text-accent font-bold mt-0.5 shrink-0">—</span>
                            <span>{line.replace("· ", "")}</span>
                          </>
                        ) : (
                          line
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
