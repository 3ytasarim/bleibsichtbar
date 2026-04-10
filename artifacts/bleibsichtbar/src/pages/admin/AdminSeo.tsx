import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, Search, CheckCircle2, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface SeoRow {
  slug: string;
  pageLabel: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  googleVerification: string;
}

async function fetchAllSeo(): Promise<SeoRow[]> {
  const res = await fetch("/api/seo");
  if (!res.ok) throw new Error("Fehler beim Laden");
  return res.json();
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? "text-red-500" : len > max * 0.85 ? "text-yellow-500" : "text-green-600";
  return <span className={`text-xs font-mono ${color}`}>{len}/{max}</span>;
}

function SeoPageRow({ row, onSave }: { row: SeoRow; onSave: (slug: string, data: Partial<SeoRow>) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    metaTitle: row.metaTitle || "",
    metaDescription: row.metaDescription || "",
    keywords: row.keywords || "",
    googleVerification: row.googleVerification || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      metaTitle: row.metaTitle || "",
      metaDescription: row.metaDescription || "",
      keywords: row.keywords || "",
      googleVerification: row.googleVerification || "",
    });
  }, [row]);

  const isGlobal = row.slug === "global";
  const hasContent = row.metaTitle || row.metaDescription;

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

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${hasContent ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="font-semibold text-sm text-gray-800">{row.pageLabel}</span>
          {hasContent && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">SEO konfiguriert</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100 space-y-4">
          {isGlobal ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <strong>Global:</strong> Der Google Verification Code wird auf <em>allen</em> Seiten eingebunden.
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> Google Search Console Verification
                  </label>
                </div>
                <Input
                  placeholder="z.B. google-site-verification=AbCdEfGhIjKlMnOpQr..."
                  value={form.googleVerification}
                  onChange={e => setForm(f => ({ ...f, googleVerification: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  In Google Search Console → „HTML-Tag" auswählen → den <code>content="..."</code> Wert hier einfügen.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700">Meta Title</label>
                  <CharCount value={form.metaTitle} max={60} />
                </div>
                <Input
                  placeholder="Seitentitel für Google (max. 60 Zeichen)"
                  value={form.metaTitle}
                  onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                  maxLength={80}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                  <CharCount value={form.metaDescription} max={160} />
                </div>
                <Textarea
                  rows={3}
                  placeholder="Kurzbeschreibung für Google-Suchergebnisse (max. 160 Zeichen)"
                  value={form.metaDescription}
                  onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                  maxLength={200}
                />
              </div>
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

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">SEO-Verwaltung</h1>
        <p className="text-muted-foreground mt-1">Meta-Titel, Beschreibungen und Keywords für jede Seite</p>
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
              {pages.filter(p => p.slug !== "global" && p.metaTitle).length} von {normalPages.length} konfiguriert
            </p>
          </div>
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
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4">Google Search Console</h2>
              <SeoPageRow key="global" row={globalPage} onSave={handleSave} />
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
