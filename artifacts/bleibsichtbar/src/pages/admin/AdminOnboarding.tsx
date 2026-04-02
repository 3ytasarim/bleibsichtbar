import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ClipboardList, Trash2, Eye, X, ChevronDown, ChevronUp, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingRow {
  id: number;
  companyName: string;
  ansprechpartner: string | null;
  data: Record<string, unknown>;
  createdAt: string;
}

const FIELD_LABELS: Record<string, string> = {
  q0: "Unternehmensname",
  q1: "Corporate Design vorhanden?",
  q2: "Marke wirken wie?",
  q3: "Tonalität",
  q4: "Aktuelle Zielgruppe",
  q5: "Neue Zielgruppe gewünscht?",
  q5detail: "Neue Zielgruppe (Detail)",
  q6: "Unterschied zur Konkurrenz",
  q7: "Warum bei uns kaufen?",
  q8: "Content-Richtung",
  q9: "No-Gos",
  q10: "Hervorheben",
  q11: "Kamera bereit?",
  q12: "Offen für",
  q13: "Gefällt-mir-Accounts",
  q15: "Zu vermeiden",
  q16: "Oberste Priorität",
  q17: "Produkte pushen",
  q18: "Fotos/Videos vorhanden?",
  q18detail: "Content-Tag Details",
  q19: "Zusätzliche Materialien?",
  q20: "Meistverkauftes Produkt",
  q21: "Häufige Kundenfragen",
  q22: "Markenstory",
  q23: "Slogans",
  q24: "Ansprechpartner",
  q25: "Sonstiges",
};

function formatValue(val: unknown): string {
  if (!val) return "–";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "–";
  return String(val);
}

function DetailModal({ row, onClose }: { row: OnboardingRow; onClose: () => void }) {
  const data = row.data as Record<string, unknown>;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b bg-[#0a1628] text-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold">{row.companyName}</h2>
            <p className="text-white/50 text-xs mt-0.5">
              Eingegangen am {new Date(row.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-3">
          {Object.entries(FIELD_LABELS).map(([key, label]) => {
            const val = data[key];
            const formatted = formatValue(val);
            if (formatted === "–" && key.endsWith("detail")) return null;
            return (
              <div key={key} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs font-semibold text-gray-500 w-44 flex-shrink-0 pt-0.5">{label}</span>
                <span className="text-sm text-gray-800 flex-1">{formatted}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminOnboarding() {
  const [rows, setRows] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<OnboardingRow | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", { credentials: "include" });
      if (res.ok) setRows(await res.json());
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;
    await fetch(`/api/onboarding/${id}`, { method: "DELETE", credentials: "include" });
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const sorted = [...rows].sort((a, b) => {
    const d = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortAsc ? d : -d;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
              <p className="text-sm text-gray-500">{rows.length} Eingang{rows.length !== 1 ? "änge" : ""}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRows}>Aktualisieren</Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">Wird geladen…</div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
              <ClipboardList className="w-8 h-8 opacity-30" />
              <span className="text-sm">Noch keine Onboarding-Einträge</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 w-10">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        Unternehmen
                      </div>
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Ansprechpartner</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Priorität</th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer select-none"
                      onClick={() => setSortAsc(v => !v)}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Datum
                        {sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.map((row, i) => {
                    const data = row.data as Record<string, unknown>;
                    const prio = Array.isArray(data.q16) ? data.q16.slice(0, 2).join(", ") : "–";
                    return (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.companyName}</td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{row.ansprechpartner || "–"}</td>
                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell text-xs">{prio}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(row.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                          <span className="text-gray-400 ml-1">
                            {new Date(row.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setDetail(row)} className="gap-1 h-7 text-xs">
                              <Eye className="w-3 h-3" /> Details
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)} className="gap-1 h-7 text-xs text-red-500 hover:text-red-700 hover:border-red-300">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detail && <DetailModal row={detail} onClose={() => setDetail(null)} />}
    </AdminLayout>
  );
}
