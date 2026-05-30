import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const TO_EMAIL = "semih.oezdemir@bleibsichtbar.com";
const FROM_EMAIL = `"Bleibsichtbar Website" <${SMTP_USER || "bleibsichtbarwebseite@gmail.com"}>`;

export function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function baseTemplate(title: string, accentColor: string, badgeLabel: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:#060d1f;border-radius:16px 16px 0 0;padding:32px 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#f97316;color:#fff;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:5px 14px;border-radius:999px;margin-bottom:14px;">${badgeLabel}</span>
                    <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">${title}</h1>
                    <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">bleibsichtbar.com · ${new Date().toLocaleString("de-DE", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Berlin" })}</p>
                  </td>
                  <td align="right" valign="top">
                    <div style="width:52px;height:52px;background:#f97316;border-radius:14px;display:flex;align-items:center;justify-content:center;">
                      <span style="color:#fff;font-size:24px;font-weight:900;line-height:52px;display:block;text-align:center;">B</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background:linear-gradient(90deg,#f97316,#fb923c);height:3px;"></td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;border-radius:0 0 16px 16px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 40px 8px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                Diese E-Mail wurde automatisch durch das Kontaktformular auf <a href="https://bleibsichtbar.com" style="color:#f97316;text-decoration:none;">bleibsichtbar.com</a> generiert.<br>
                © ${new Date().getFullYear()} Bleibsichtbar – Agentur für Social Media Marketing
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function field(label: string, value: string | undefined | null, fullWidth = false): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:0 0 16px 0;" ${fullWidth ? 'colspan="2"' : ""}>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;">
          <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">${label}</p>
          <p style="margin:0;color:#1e293b;font-size:15px;line-height:1.55;white-space:pre-wrap;">${escHtml(value)}</p>
        </div>
      </td>
    </tr>`;
}

function escHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sectionHeader(label: string): string {
  return `<tr><td colspan="2" style="padding:8px 0 14px;"><p style="margin:0;color:#f97316;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #fed7aa;padding-bottom:8px;">${label}</p></td></tr>`;
}

/* ─────────────────────────────────────────────────────── */
/*  1. CONTACT (Kontakt, Footer, Modal, ContactSection)   */
/* ─────────────────────────────────────────────────────── */
export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
}) {
  const body = `
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Eine neue <strong style="color:#1e293b;">Kontaktanfrage</strong> ist über die Website eingegangen. Alle Details finden Sie nachfolgend.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${sectionHeader("Kontaktdaten")}
      ${field("Name", data.name)}
      ${field("E-Mail-Adresse", data.email)}
      ${field("Telefon", data.phone)}
      ${field("Unternehmen", data.company)}
      ${data.service ? sectionHeader("Gewünschte Leistung") : ""}
      ${field("Leistung / Interesse", data.service)}
      ${sectionHeader("Nachricht")}
      ${field("Nachricht", data.message, true)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <td>
          <a href="mailto:${escHtml(data.email)}" style="display:inline-block;background:#f97316;color:#fff;font-size:14px;font-weight:700;padding:13px 28px;border-radius:999px;text-decoration:none;">
            Antworten an ${escHtml(data.name)}
          </a>
        </td>
      </tr>
    </table>`;

  const transport = createTransport();
  await transport.sendMail({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: data.email,
    subject: `🔔 Neue Kontaktanfrage von ${data.name}${data.company ? ` (${data.company})` : ""}`,
    html: baseTemplate(`Neue Kontaktanfrage`, "#f97316", "Kontakt", body),
  });
}

/* ─────────────────────────────────────────────────────── */
/*  2. ANALYSE REQUEST                                     */
/* ─────────────────────────────────────────────────────── */
export async function sendAnalyseEmail(data: {
  name: string;
  contact: string;
}) {
  const body = `
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Eine neue <strong style="color:#1e293b;">Erstgespräch-Anfrage</strong> für die US LLC Gründung ist eingegangen. Bitte nehme innerhalb von 48 Stunden Kontakt auf.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${sectionHeader("Kontaktdaten")}
      ${field("Name & Vorname", data.name)}
      ${field("E-Mail / Telefon", data.contact)}
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <td>
          <a href="mailto:${escHtml(data.contact)}" style="display:inline-block;background:#f97316;color:#fff;font-size:14px;font-weight:700;padding:13px 28px;border-radius:999px;text-decoration:none;">
            Antworten an ${escHtml(data.name)}
          </a>
        </td>
      </tr>
    </table>`;

  const transport = createTransport();
  await transport.sendMail({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: data.contact,
    subject: `🏢 LLC Erstgespräch-Anfrage von ${data.name}`,
    html: baseTemplate("Kostenloses Erstgespräch angefragt", "#f97316", "LLC Gründung", body),
  });
}

/* ─────────────────────────────────────────────────────── */
/*  3. ONBOARDING                                          */
/* ─────────────────────────────────────────────────────── */
export async function sendOnboardingEmail(data: {
  companyName: string;
  ansprechpartner?: string;
  formData: Record<string, any>;
}) {
  const skipKeys = ["step", "completed"];

  const labelMap: Record<string, string> = {
    branding_name: "Unternehmensname",
    branding_slogan: "Slogan",
    branding_colors: "Markenfarben",
    branding_logo: "Logo vorhanden",
    branding_style: "Markenstil",
    branding_competitors: "Mitbewerber",
    target_age: "Altersgruppe",
    target_gender: "Geschlecht",
    target_location: "Standort / Region",
    target_interests: "Interessen der Zielgruppe",
    target_income: "Einkommensniveau",
    positioning_usp: "Alleinstellungsmerkmal (USP)",
    positioning_tone: "Kommunikationston",
    positioning_values: "Markenwerte",
    content_formats: "Bevorzugte Content-Formate",
    content_frequency: "Posting-Frequenz",
    content_topics: "Themen / Inhaltsbereiche",
    content_examples: "Beispiel-Accounts (Inspiration)",
    logistics_channels: "Aktive Social Media Kanäle",
    logistics_access: "Zugangsdaten übergeben",
    logistics_contact: "Ansprechpartner intern",
    logistics_phone: "Telefon / WhatsApp",
    logistics_email: "E-Mail",
    logistics_website: "Website",
    logistics_notes: "Weitere Anmerkungen",
  };

  const sectionMap: Record<string, string> = {
    branding_: "Branding & Markenidentität",
    target_: "Zielgruppe",
    positioning_: "Positionierung",
    content_: "Content-Strategie",
    logistics_: "Logistik & Zugänge",
  };

  let lastSection = "";
  let rows = "";

  const entries = Object.entries(data.formData).filter(
    ([k, v]) => !skipKeys.includes(k) && v !== undefined && v !== null && v !== ""
  );

  for (const [key, val] of entries) {
    const prefix = Object.keys(sectionMap).find((p) => key.startsWith(p));
    const section = prefix ? sectionMap[prefix] : "";
    if (section && section !== lastSection) {
      rows += sectionHeader(section);
      lastSection = section;
    }
    const label = labelMap[key] || key;
    const display = Array.isArray(val) ? val.join(", ") : String(val);
    rows += field(label, display);
  }

  const body = `
    <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
      Das Onboarding-Formular für <strong style="color:#1e293b;">${escHtml(data.companyName)}</strong>
      ${data.ansprechpartner ? ` (Ansprechpartner: <strong>${escHtml(data.ansprechpartner)}</strong>)` : ""} 
      wurde vollständig ausgefüllt und übermittelt.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${rows}
    </table>`;

  const transport = createTransport();
  await transport.sendMail({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `🚀 Neues Onboarding: ${data.companyName}${data.ansprechpartner ? ` – ${data.ansprechpartner}` : ""}`,
    html: baseTemplate(
      `Onboarding: ${data.companyName}`,
      "#8b5cf6",
      "Onboarding",
      body
    ),
  });
}
