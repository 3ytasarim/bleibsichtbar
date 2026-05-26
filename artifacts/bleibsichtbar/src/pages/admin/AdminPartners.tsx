import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Handshake, Trash2, Plus, Upload, ChevronUp, ChevronDown, Pencil, X, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Partner {
  id: number;
  name: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/partners", { credentials: "include" });
      const data = await res.json() as Partner[];
      setPartners(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sorted = [...partners].sort((a, b) => a.sortOrder - b.sortOrder);

  const openAdd = () => {
    setEditingPartner(null);
    setName("");
    setWebsiteUrl("");
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (p: Partner) => {
    setEditingPartner(p);
    setName(p.name);
    setWebsiteUrl(p.websiteUrl ?? "");
    setImageFile(null);
    setImagePreview(p.imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPartner(null);
    setName("");
    setWebsiteUrl("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("websiteUrl", websiteUrl.trim());
      fd.append("sortOrder", editingPartner
        ? String(editingPartner.sortOrder)
        : String(sorted.length));
      if (imageFile) fd.append("image", imageFile);

      const url = editingPartner ? `/api/partners/${editingPartner.id}` : "/api/partners";
      const method = editingPartner ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unbekannter Fehler" })) as { error?: string };
        alert(err.error ?? "Fehler beim Speichern");
        setSubmitting(false);
        return;
      }
      closeModal();
      await load();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Partner wirklich löschen?")) return;
    await fetch(`/api/partners/${id}`, { method: "DELETE", credentials: "include" });
    await load();
  };

  const moveOrder = async (id: number, direction: "up" | "down") => {
    const idx = sorted.findIndex(p => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx]!;
    const b = sorted[swapIdx]!;
    await Promise.all([
      fetch(`/api/partners/${a.id}`, {
        method: "PUT",
        body: (() => { const f = new FormData(); f.append("name", a.name); f.append("sortOrder", String(b.sortOrder)); return f; })(),
        credentials: "include",
      }),
      fetch(`/api/partners/${b.id}`, {
        method: "PUT",
        body: (() => { const f = new FormData(); f.append("name", b.name); f.append("sortOrder", String(a.sortOrder)); return f; })(),
        credentials: "include",
      }),
    ]);
    await load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Handshake className="w-6 h-6 text-accent" />
            <div>
              <h1 className="text-2xl font-bold font-display">Partner</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Partner-Logos und Links verwalten</p>
            </div>
          </div>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Partner hinzufügen
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Laden…</div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <Handshake className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Noch keine Partner. Fügen Sie den ersten hinzu.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-10">Nr.</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-24">Logo</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Website</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-28">Reihenfolge</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-28">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, idx) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-10 w-auto max-w-[80px] object-contain rounded border border-gray-200 bg-gray-50 p-1"
                        />
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          Kein Logo
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-accent hover:underline text-xs truncate max-w-[180px]"
                        >
                          <Link className="w-3 h-3 shrink-0" />
                          {p.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveOrder(p.id, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                          title="Nach oben"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveOrder(p.id, "down")}
                          disabled={idx === sorted.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                          title="Nach unten"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                          title="Bearbeiten"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold font-display">
                {editingPartner ? "Partner bearbeiten" : "Neuen Partner hinzufügen"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="z.B. Strom Strategen"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Website-URL</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Logo-Bild</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-accent/50 hover:bg-accent/5 transition-colors text-sm text-muted-foreground"
                >
                  <Upload className="w-5 h-5" />
                  {imageFile ? imageFile.name : "Logo auswählen (klicken)"}
                </button>
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview}
                      alt="Vorschau"
                      className="w-full h-24 object-contain rounded-xl border border-gray-200 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(editingPartner?.imageUrl ?? null); }}
                      className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                  Abbrechen
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? "Speichern…" : "Speichern"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
