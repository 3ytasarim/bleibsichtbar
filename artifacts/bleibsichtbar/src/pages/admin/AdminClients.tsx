import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, Trash2, Plus, Upload, GripVertical, ChevronUp, ChevronDown, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Client {
  id: number;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients", { credentials: "include" });
      const data = await res.json() as Client[];
      setClients(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingClient(null);
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setName(c.name);
    setImageFile(null);
    setImagePreview(c.imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
    setName("");
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
      fd.append("sortOrder", editingClient
        ? String(editingClient.sortOrder)
        : String(clients.length));
      if (imageFile) fd.append("image", imageFile);

      const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients";
      const method = editingClient ? "PUT" : "POST";
      await fetch(url, { method, body: fd, credentials: "include" });
      closeModal();
      await load();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Kunden wirklich löschen?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE", credentials: "include" });
    await load();
  };

  const moveOrder = async (id: number, direction: "up" | "down") => {
    const idx = clients.findIndex(c => c.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= clients.length) return;

    const a = clients[idx]!;
    const b = clients[swapIdx]!;

    await Promise.all([
      fetch(`/api/clients/${a.id}`, {
        method: "PUT",
        body: (() => { const f = new FormData(); f.append("name", a.name); f.append("sortOrder", String(b.sortOrder)); return f; })(),
        credentials: "include",
      }),
      fetch(`/api/clients/${b.id}`, {
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
            <Users className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold font-display">Kunden</h1>
          </div>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Kunde hinzufügen
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Laden…</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-muted-foreground">Noch keine Kunden. Fügen Sie den ersten hinzu.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-10">Nr.</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-24">Foto</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-28">Reihenfolge</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-28">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c, idx) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      {c.imageUrl ? (
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-16 h-10 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          Kein Foto
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveOrder(c.id, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveOrder(c.id, "down")}
                          disabled={idx === clients.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
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
                {editingClient ? "Kunde bearbeiten" : "Neuen Kunden hinzufügen"}
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
                  placeholder="z.B. Müller GmbH"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Foto</label>
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
                  {imageFile ? imageFile.name : "Foto auswählen (klicken)"}
                </button>
                {imagePreview && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview}
                      alt="Vorschau"
                      className="w-full h-32 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(editingClient?.imageUrl ?? null); }}
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
