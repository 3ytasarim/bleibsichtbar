import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, Search, CheckCircle2, AlertCircle, ExternalLink, ChevronDown, ChevronUp, Code2, Tag } from "lucide-react";

interface SeoRow {
  slug: string;
  pageLabel: string;
  metaTitle: string;
  metaDescription: string;
  metaTitleEn: string;
  metaDescriptionEn: string;
  metaTitleNl: string;
  metaDescriptionNl: string;
  metaTitleFr: string;
  metaDescriptionFr: string;
  keywords: string;
  googleVerification: string;
  headScript: string;
  bodyScript: string;
}

const LANG_TABS = [
  { key: "de", label: "DE", flag: "🇩🇪", titleField: "metaTitle" as keyof SeoRow, descField: "metaDescription" as keyof SeoRow },
  { key: "en", label: "EN", flag: "🇬🇧", titleField: "metaTitleEn" as keyof SeoRow, descField: "metaDescriptionEn" as keyof SeoRow },
  { key: "nl", label: "NL", flag: "🇳🇱", titleField: "metaTitleNl" as keyof SeoRow, descField: "metaDescriptionNl" as keyof SeoRow },
  { key: "fr", label: "FR", flag: "🇫🇷", titleField: "metaTitleFr" as keyof SeoRow, descField: "metaDescriptionFr" as keyof SeoRow },
];

async function fetchAllSeo(): Promise<SeoRow[]> {
  const res = await fetch("/api/seo");
  if (!res.ok) throw new Error("Fehler beim Laden");
  return res.json();
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = (value || "").length;
  const color = len > max ? "text-red-500" : len > max * 0.85 ? "text-yellow-500" : "text-green-600";
  return <span className={`text-xs font-mono ${color}`}>{len}/{max}</span>;
}

function SeoPageRow({ row, onSave }: { row: SeoRow; onSave: (slug: string, data: Partial<SeoRow>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("de");
  const [form, setForm] = useState({
    metaTitle: row.metaTitle || "",
    metaDescription: row.metaDescription || "",
    metaTitleEn: row.metaTitleEn || "",
    metaDescriptionEn: row.metaDescriptionEn || "",
    metaTitleNl: row.metaTitleNl || "",
    metaDescriptionNl: row.metaDescriptionNl || "",
    metaTitleFr: row.metaTitleFr || "",
    metaDescriptionFr: row.metaDescriptionFr || "",
    keywords: row.keywords || "",
    googleVerification: row.googleVerification || "",
    headScript: row.headScript || "",
    bodyScript: row.bodyScript || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      metaTitle: row.metaTitle || "",
      metaDescription: row.metaDescription || "",
      metaTitleEn: row.metaTitleEn || "",
      metaDescriptionEn: row.metaDescriptionEn || "",
      metaTitleNl: row.metaTitleNl || "",
      metaDescriptionNl: row.metaDescriptionNl || "",
      metaTitleFr: row.metaTitleFr || "",
      metaDescriptionFr: row.metaDescriptionFr || "",
      keywords: row.keywords || "",
      googleVerification: row.googleVerification || "",
      headScript: row.headScript || "",
      bodyScript: row.bodyScript || "",
    });
  }, [row]);

  const isGlobal = row.slug === "global";
  const hasContent = row.metaTitle || row.metaTitleEn || row.metaTitleNl || row.metaTitleFr;
  const hasScripts = row.headScript || row.bodyScript;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(row.slug, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const activeLangTab = LANG_TABS.find(l => l.key === activeLang)!;
  const currentTitle = form[activeLangTab.titleField] as string;
  const currentDesc = form[activeLangTab.descField] as string;

  const langHasContent = (lang: typeof LANG_TABS[0]) =>
    !!(form[lang.titleField] as string) || !!(form[lang.descField] as string);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isGlobal ? (hasScripts ? "bg-orange-500" : "bg-gray-300") : hasContent ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="font-semibold text-sm text-gray-800">{row.pageLabel}</span>
          {!isGlobal && hasContent && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">SEO konfiguriert</span>
          )}
          {isGlobal && hasScripts && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Scripts aktiv</span>
          )}
          {!isGlobal && !hasContent && (
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium">Nicht konfiguriert</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100 space-y-5">
          {isGlobal ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <strong>Global:</strong> Diese Einstellungen gelten für <em>alle</em> Seiten der Website.
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Search className="w-3.5 h-3.5" /> Google Search Console – Verification
                </label>
                <Input
                  placeholder="z.B. google-site-verification=AbCdEfGhIjKlMnOpQr..."
                  value={form.googleVerification}
                  onChange={e => setForm(f => ({ ...f, googleVerification: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  In Search Console → „HTML-Tag" → den <code>content="..."</code> Wert hier einfügen.
                </p>
              </div>

              <hr className="border-gray-200" />

              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Code2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>&lt;head&gt; Script</span>
                  <span className="text-xs font-normal text-gray-400 ml-1">— Google Tag Manager / Analytics</span>
                </label>
                <Textarea
                  rows={7}
                  className="font-mono text-xs bg-white"
                  placeholder={"<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXX');</script>\n<!-- End Google Tag Manager -->"}
                  value={form.headScript}
                  onChange={e => setForm(f => ({ ...f, headScript: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Das komplette <code>&lt;script&gt;...&lt;/script&gt;</code> Tag aus GTM/GA hier einfügen. Wird in den <code>&lt;head&gt;</code> aller Seiten eingefügt.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  <span>&lt;body&gt; Script</span>
                  <span className="text-xs font-normal text-gray-400 ml-1">— GTM &lt;noscript&gt; Snippet</span>
                </label>
                <Textarea
                  rows={5}
                  className="font-mono text-xs bg-white"
                  placeholder={"<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX\"\nheight=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->"}
                  value={form.bodyScript}
                  onChange={e => setForm(f => ({ ...f, bodyScript: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Das <code>&lt;noscript&gt;</code> Tag aus GTM. Wird direkt nach dem <code>&lt;body&gt;</code>-Tag eingefügt.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Language Tab Bar */}
              <div>
                <div className="flex items-center gap-0.5 mb-4 bg-white border border-gray-200 rounded-lg p-1 w-fit">
                  {LANG_TABS.map(lang => (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() => setActiveLang(lang.key)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                        activeLang === lang.key
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base leading-none">{lang.flag}</span>
                      <span>{lang.label}</span>
                      {langHasContent(lang) && (
                        <span className={`w-1.5 h-1.5 rounded-full ${activeLang === lang.key ? "bg-green-400" : "bg-green-500"}`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Meta Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Meta Title
                      <span className="ml-2 text-xs font-normal text-gray-400">{activeLangTab.flag} {activeLangTab.label}</span>
                    </label>
                    <CharCount value={currentTitle} max={60} />
                  </div>
                  <Input
                    placeholder={`Seitentitel auf ${activeLangTab.label} (max. 60 Zeichen)`}
                    value={currentTitle}
                    onChange={e => setForm(f => ({ ...f, [activeLangTab.titleField]: e.target.value }))}
                    maxLength={80}
                  />
                  {activeLang === "de" && (
                    <p className="text-xs text-gray-400 mt-1">Standard: wird auch verwendet, wenn keine andere Sprache gesetzt ist.</p>
                  )}
                </div>

                {/* Meta Description */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Meta Description
                      <span className="ml-2 text-xs font-normal text-gray-400">{activeLangTab.flag} {activeLangTab.label}</span>
                    </label>
                    <CharCount value={currentDesc} max={160} />
                  </div>
                  <Textarea
                    rows={3}
                    placeholder={`Kurzbeschreibung auf ${activeLangTab.label} für Google-Suchergebnisse (max. 160 Zeichen)`}
                    value={currentDesc}
                    onChange={e => setForm(f => ({ ...f, [activeLangTab.descField]: e.target.value }))}
                    maxLength={200}
                  />
                  {activeLang === "de" && (
                    <p className="text-xs text-gray-400 mt-1">Standard: wird auch verwendet, wenn keine andere Sprache gesetzt ist.</p>
                  )}
                </div>

                {/* Language overview indicator */}
                <div className="flex items-center gap-3 mt-2 p-3 bg-white rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">Sprachen:</span>
                  <div className="flex gap-2">
                    {LANG_TABS.map(lang => (
                      <span
                        key={lang.key}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          langHasContent(lang)
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {lang.flag} {lang.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keywords (shared, language-independent) */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Keywords</label>
                <Input
                  placeholder="Social Media Agentur, Instagram Marketing, ..."
                  value={form.keywords}
                  onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">Kommagetrennt – nicht übertreiben, 5–10 Keywords genügen.</p>
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            <div />
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-accent hover:bg-accent/90 text-white"
              size="sm"
            >
              {saving ? "Speichern..." : saved ? "✓ Gespeichert" : "Speichern"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSeo() {
  const queryClient = useQueryClient();
  const { data: pages = [], isLoading } = useQuery<SeoRow[]>({
    queryKey: ["/api/seo"],
    queryFn: fetchAllSeo,
  });

  const handleSave = async (slug: string, data: Partial<SeoRow>) => {
    const token = localStorage.getItem("bs_auth_token");
    await fetch(`/api/seo/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    queryClient.invalidateQueries({ queryKey: ["/api/seo"] });
  };

  const normalPages = pages.filter(p => p.slug !== "global");
  const globalPage = pages.find(p => p.slug === "global");
  const configuredCount = pages.filter(p => p.slug !== "global" && (p.metaTitle || p.metaTitleEn || p.metaTitleNl || p.metaTitleFr)).length;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">SEO-Verwaltung</h1>
        <p className="text-muted-foreground mt-1">Meta-Titel & Beschreibungen pro Sprache, Keywords und Google-Scripts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Sitemap</p>
            <a href="/api/sitemap.xml" target="_blank" rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center gap-1 mt-0.5">
              /sitemap.xml <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
          <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Search className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">robots.txt</p>
            <a href="/api/robots.txt" target="_blank" rel="noopener noreferrer"
              className="text-xs text-accent hover:underline flex items-center gap-1 mt-0.5">
              /robots.txt <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Seiten mit SEO</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {configuredCount} von {normalPages.length} konfiguriert
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="text-2xl leading-none mt-0.5">🌍</div>
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-1">Mehrsprachige SEO</p>
          <p className="text-xs text-blue-700">
            Für jede Seite können Sie Meta Title und Meta Description in <strong>Deutsch (DE)</strong>, <strong>Englisch (EN)</strong>, <strong>Niederländisch (NL)</strong> und <strong>Französisch (FR)</strong> hinterlegen.
            Der Besucher sieht automatisch die Version seiner gewählten Sprache. Ist eine Übersetzung leer, wird <strong>DE</strong> als Fallback verwendet.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Seitenweise SEO</h2>
          {normalPages.map(page => (
            <SeoPageRow key={page.slug} row={page} onSave={handleSave} />
          ))}

          {globalPage && (
            <>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4">Global – Google Scripts & Verification</h2>
              <SeoPageRow key="global" row={globalPage} onSave={handleSave} />
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
