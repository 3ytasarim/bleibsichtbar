import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";

const sections = [
  {
    num: "1.",
    title: "Geltungsbereich",
    content: [
      '(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen Bleibsichtbar LLC (nachfolgend \u201EAgentur\u201C) und ihren Kunden (nachfolgend \u201EKunde\u201C) über Social Media Dienstleistungen, Webseiten, Online-Werbung (Ads), KI-Dienstleistungen sowie damit verbundene Leistungen.',
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
      "· Branding & Designleistungen",
      "· Strategieberatung & Marketing",
      "(2) Der konkrete Leistungsumfang ergibt sich ausschließlich aus dem jeweiligen Angebot, Vertrag oder der schriftlichen Vereinbarung.",
      "(3) Leistungen, die dort nicht ausdrücklich aufgeführt sind, gelten nicht als geschuldet und werden gesondert berechnet.",
    ],
  },
  {
    num: "3.",
    title: "Zusatzleistungen",
    content: [
      "(1) Alle Leistungen außerhalb des vereinbarten Leistungsumfangs gelten als Zusatzleistungen und sind kostenpflichtig.",
      "(2) Dies betrifft insbesondere, aber nicht abschließend:",
      "· Flyer",
      "· Menükarten",
      "· Plakatdesigns",
      "· Branding",
      "· Logos",
      "· zusätzliche Designarbeiten",
      "· Druckdaten-Erstellungen",
      "· zusätzliche Content-Produktionen",
      "· Sonderanfragen außerhalb des Pakets",
      "(3) Zusatzleistungen werden ausschließlich nach gesonderter Vereinbarung erbracht und vergütet.",
    ],
  },
  {
    num: "4.",
    title: "Werbung (Ads)",
    content: [
      "(1) Die Erstellung, Verwaltung und Betreuung von Werbeanzeigen (Ads) ist nicht automatisch Bestandteil der regulären Social Media Betreuung.",
      "(2) Werbeanzeigen werden ausschließlich nach separater Beauftragung erstellt und verwaltet.",
      "(3) Werbebudgets für Plattformen wie Meta, Google, TikTok oder ähnliche Plattformen sind vom Kunden separat zu tragen.",
      "(4) Eine Garantie für Reichweite, Leads, Verkäufe oder Umsätze wird ausdrücklich nicht übernommen.",
    ],
  },
  {
    num: "5.",
    title: "Vertragslaufzeit und Kündigung",
    content: [
      "(1) Dienstleistungen werden ausschließlich auf Vertragsbasis erbracht.",
      "(2) Die Kündigungsfrist beträgt 1 Monat zum nächsten Abrechnungszeitraum, sofern keine andere schriftliche Vereinbarung getroffen wurde.",
      "(3) Maßgeblich ist der individuelle Zahlungstag des Kunden.",
      "Beispiel: Erfolgt die Zahlung am 25. eines Monats, muss die Kündigung spätestens am 25. des Vormonats eingehen.",
      "(4) Erfolgt keine fristgerechte Kündigung, verlängert sich der Vertrag automatisch um den jeweiligen vereinbarten Zeitraum.",
    ],
  },
  {
    num: "6.",
    title: "Preise und Zahlungsbedingungen",
    content: [
      "(1) Alle Preise verstehen sich netto zzgl. gesetzlicher Umsatzsteuer, sofern anwendbar.",
      "(2) Rechnungen sind innerhalb von 7 Tagen nach Rechnungsstellung ohne Abzug zu begleichen.",
      "(3) Die Agentur behält sich vor, Dienstleistungen ausschließlich gegen Vorkasse anzubieten.",
      "(4) Bei Zahlungsverzug ist die Agentur berechtigt:",
      "· die Leistungserbringung sofort einzustellen",
      "· geplante Veröffentlichungen auszusetzen",
      "· Nutzungsrechte vorübergehend zu entziehen",
      "· offene Leistungen vollständig in Rechnung zu stellen",
      "· veröffentlichte Inhalte vorübergehend zu deaktivieren oder zu entfernen",
    ],
  },
  {
    num: "7.",
    title: "Erreichbarkeit und Kommunikation",
    content: [
      "(1) Die regulären Erreichbarkeitszeiten der Agentur für telefonische sowie Chat-/Supportanfragen liegen werktags von Montag bis Freitag zwischen 10:00 Uhr und 14:00 Uhr deutscher Zeit.",
      "(2) Außerhalb dieser Zeiten erfolgen interne Arbeitsprozesse, Content-Erstellung, Strategien, Kampagnenoptimierungen sowie organisatorische Abläufe.",
      "(3) Außerhalb der regulären Erreichbarkeitszeiten erfolgt die Kommunikation ausschließlich per E-Mail.",
      "(4) Nachrichten außerhalb der Geschäftszeiten werden schnellstmöglich innerhalb der regulären Geschäftszeiten bearbeitet.",
      "(5) Die Agentur schuldet keine permanente Soforterreichbarkeit.",
    ],
  },
  {
    num: "8.",
    title: "Bearbeitungszeiten und Expressleistungen",
    content: [
      "(1) Reguläre Arbeitsaufträge, Änderungswünsche sowie Content-Anfragen werden innerhalb von bis zu 3 Werktagen bearbeitet, sofern keine andere Vereinbarung getroffen wurde.",
      "(2) Expressleistungen, insbesondere kurzfristige Umsetzungen innerhalb von 24 Stunden, erfolgen ausschließlich nach vorheriger Absprache.",
      "(3) Für Expressleistungen fällt abhängig vom Umfang und Arbeitsaufwand ein zusätzlicher Expresszuschlag an.",
      "(4) Die Agentur behält sich vor, Expressanfragen aufgrund aktueller Auslastung abzulehnen.",
    ],
  },
  {
    num: "9.",
    title: "Revisionen und Änderungswünsche",
    content: [
      "(1) Im vereinbarten Leistungsumfang sind maximal 2 Revisions- bzw. Korrekturrunden enthalten, sofern nichts anderes schriftlich vereinbart wurde.",
      "(2) Weitere Änderungswünsche oder zusätzliche Revisionsrunden werden gesondert berechnet.",
      "(3) Umfangreiche Konzept-, Stil- oder Strukturänderungen nach bereits erfolgter Freigabe gelten als neue Zusatzleistung.",
    ],
  },
  {
    num: "10.",
    title: "Content-Produktion und Fotografie",
    content: [
      "(1) Content-, Video- und Fototage werden im Voraus abgestimmt.",
      "(2) Sofern keine Änderungen kommuniziert werden, erfolgt die Umsetzung wie vereinbart.",
      "(3) Ein Anspruch auf Rückerstattung besteht nicht, sofern die Inhalte wie vereinbart umgesetzt wurden.",
      "(4) Content-Tage sind ausschließlich dann inklusive, wenn dies ausdrücklich schriftlich vereinbart wurde.",
    ],
  },
  {
    num: "11.",
    title: "Freigaben und Veröffentlichung",
    content: [
      "(1) Inhalte gelten als freigegeben, sofern der Kunde nicht innerhalb von 24 Stunden nach Übersendung Änderungswünsche mitteilt.",
      "(2) Erfolgt innerhalb dieser Frist keine Rückmeldung, ist die Agentur berechtigt, die Inhalte wie geplant zu veröffentlichen.",
      "(3) Verzögerungen aufgrund verspäteter Kundenfreigaben gehen nicht zu Lasten der Agentur.",
    ],
  },
  {
    num: "12.",
    title: "Plattformen und Drittanbieter",
    content: [
      "(1) Die Agentur haftet nicht für Einschränkungen, Sperrungen, Shadowbans, technische Fehler oder Ausfälle von Drittplattformen wie Instagram, Facebook, TikTok, Google oder vergleichbaren Diensten.",
      "(2) Änderungen von Algorithmen, Reichweiten oder Plattformfunktionen liegen außerhalb des Einflussbereichs der Agentur.",
      "(3) Die Agentur übernimmt keine Haftung für verlorene Daten, gesperrte Accounts oder technische Probleme seitens der Plattformanbieter.",
    ],
  },
  {
    num: "13.",
    title: "Webseiten und technische Leistungen",
    content: [
      "(1) Nach Übergabe der Webseite liegt die Verantwortung für Inhalte, rechtliche Pflichtangaben, Datenschutztexte sowie laufende Aktualisierungen beim Kunden, sofern keine laufende Betreuung vereinbart wurde.",
      "(2) Nach Fertigstellung der Webseite stehen dem Kunden ausschließlich die im jeweiligen Angebot oder Vertrag festgelegten Revisions- und Änderungsrechte zu.",
      "(3) Weitere Änderungen nach Ausschöpfung der vereinbarten Revisionsrunden gelten als kostenpflichtige Zusatzleistung.",
      "(4) Die Agentur haftet nicht für spätere Änderungen durch den Kunden oder Dritte.",
      "(5) Externe Kosten wie Domains, Hosting, Plugins, Drittanbieter-Software oder Lizenzgebühren sind — sofern nicht ausdrücklich anders vereinbart — vom Kunden separat zu tragen.",
    ],
  },
  {
    num: "14.",
    title: "KI-Dienstleistungen",
    content: [
      "(1) KI-generierte Inhalte können trotz sorgfältiger Prüfung Fehler, Abweichungen oder unvollständige Informationen enthalten.",
      "(2) Die finale Prüfung und Freigabe sämtlicher KI-generierter Inhalte obliegt dem Kunden.",
      "(3) Die Agentur übernimmt keine Haftung für Entscheidungen oder wirtschaftliche Folgen aufgrund KI-generierter Inhalte oder Automatisierungen.",
    ],
  },
  {
    num: "15.",
    title: "Leistungsdurchführung",
    content: [
      "(1) Die Agentur ist berechtigt, Leistungen ganz oder teilweise durch Dritte oder Subunternehmer erbringen zu lassen.",
      "(2) Die Agentur schuldet keinen bestimmten wirtschaftlichen Erfolg.",
      "(3) Zeitangaben zu Veröffentlichungen oder Projekten gelten, sofern nicht ausdrücklich anders vereinbart, als Richtwerte.",
    ],
  },
  {
    num: "16.",
    title: "Mitwirkungspflichten des Kunden",
    content: [
      "(1) Der Kunde verpflichtet sich, sämtliche zur Leistungserbringung erforderlichen Informationen, Inhalte, Materialien und Zugänge rechtzeitig bereitzustellen.",
      "(2) Verzögerungen aufgrund fehlender Mitwirkung, verspäteter Antworten oder nicht bereitgestellter Inhalte gehen nicht zu Lasten der Agentur.",
      "(3) Vereinbarte Veröffentlichungs- oder Projekttermine verschieben sich entsprechend.",
      "(4) Der Kunde ist für die rechtliche Zulässigkeit bereitgestellter Inhalte selbst verantwortlich.",
      "(5) Die Agentur übernimmt keine Haftung für Verzögerungen oder Schäden aufgrund fehlerhafter oder fehlender Zugangsdaten.",
    ],
  },
  {
    num: "17.",
    title: "Haftung",
    content: [
      "(1) Die Agentur haftet nicht für:",
      "· Umsätze",
      "· Verkaufszahlen",
      "· Reichweiten",
      "· Kundengewinnung",
      "· wirtschaftliche Ergebnisse",
      "· algorithmische Änderungen von Plattformen",
      "(2) Eine Erfolgs- oder Umsatzgarantie wird ausdrücklich nicht übernommen.",
      "(3) Die Haftung der Agentur ist — soweit gesetzlich zulässig — auf Vorsatz und grobe Fahrlässigkeit beschränkt.",
    ],
  },
  {
    num: "18.",
    title: "Nutzungsrechte",
    content: [
      "(1) Nutzungsrechte an erstellten Designs, Inhalten, Webseiten oder Medien gehen erst nach vollständiger Zahlung auf den Kunden über.",
      "(2) Bis zur vollständigen Zahlung verbleiben sämtliche Rechte bei der Agentur.",
      "(3) Die Agentur ist berechtigt, erstellte Projekte, Designs oder Inhalte zu Präsentations- und Referenzzwecken auf Webseiten, Social Media oder Präsentationen zu verwenden, sofern der Kunde dem nicht ausdrücklich schriftlich widerspricht.",
    ],
  },
  {
    num: "19.",
    title: "Geheimhaltung",
    content: [
      "(1) Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei nicht an Dritte weiterzugeben.",
      "(2) Diese Verpflichtung gilt auch nach Beendigung des Vertragsverhältnisses fort.",
    ],
  },
  {
    num: "20.",
    title: "Schlussbestimmungen",
    content: [
      "(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.",
      "(2) Gerichtsstand ist — soweit gesetzlich zulässig — der Sitz der Agentur.",
      "(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
      "(4) Änderungen oder Ergänzungen bedürfen der Schriftform.",
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
            für Dienstleistungen der Bleibsichtbar LLC · Stand: Mai 2026
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
                    const isSubLabel = !isBullet && line.endsWith(":") && line.length < 60;
                    return isBullet ? (
                      <p key={i} className="text-muted-foreground leading-relaxed flex gap-2 pl-2">
                        <span className="text-accent font-bold shrink-0 mt-0.5">—</span>
                        <span>{line.replace("· ", "")}</span>
                      </p>
                    ) : isSubLabel ? (
                      <p key={i} className="text-sm font-semibold text-foreground/60 mt-3">
                        {line}
                      </p>
                    ) : (
                      <p key={i} className="text-muted-foreground leading-relaxed">
                        {line}
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
