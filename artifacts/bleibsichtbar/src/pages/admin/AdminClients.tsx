import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Users, Trash2, Plus, Upload, ChevronUp, ChevronDown, Pencil, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Client {
  id: number;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  row: number;
  createdAt: string;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [defaultRow, setDefaultRow] = useState<1 | 2>(1);
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

  const row1 = clients.filter(c => c.row === 1).sort((a, b) => a.sortOrder - b.sortOrder);
  const row2 = clients.filter(c => c.row === 2).sort((a, b) => a.sortOrder - b.sortOrder);

  const openAdd = (row: 1 | 2) => {
    setEditingClient(null);
    setDefaultRow(row);
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setDefaultRow(c.row as 1 | 2);
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
      const rowClients = defaultRow === 1 ? row1 : row2;
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("row", String(defaultRow));
      fd.append("sortOrder", editingClient
        ? String(editingClient.sortOrder)
        : String(rowClients.length));
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
    if (!confirm("Logo wirklich löschen?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE", credentials: "include" });
    await load();
  };

  const moveOrder = async (rowClients: Client[], id: number, direction: "up" | "down") => {
    const idx = rowClients.findIndex(c => c.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= rowClients.length) return;

    const a = rowClients[idx]!;
    const b = rowClients[swapIdx]!;

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

  const ClientTable = ({ rowClients, rowNum }: { rowClients: Client[]; rowNum: 1 | 2 }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${rowNum === 1 ? "bg-accent" : "bg-blue-500"}`} />
          <h2 className="text-base font-bold font-display">
            {rowNum === 1 ? "Obere Reihe (→ links scrollend)" : "Untere Reihe (← rechts scrollend)"}
          </h2>
          <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">
            {rowClients.length} Logo{rowClients.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button size="sm" onClick={() => openAdd(rowNum)} className="flex items-center gap-1.5 text-xs h-8">
          <Plus className="w-3.5 h-3.5" /> Logo hinzufügen
        </Button>
      </div>

      {rowClients.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
          <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Noch keine Logos. Fügen Sie das erste hinzu.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-10">Nr.</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-24">Logo</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-28">Reihenfolge</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground w-28">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {rowClients.map((c, idx) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3">
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="h-10 w-auto max-w-[80px] object-contain rounded border border-gray-200 bg-gray-50 p-1"
                      />
                    ) : (
                      <div className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        Kein Logo
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveOrder(rowClients, c.id, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        title="Nach oben"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveOrder(rowClients, c.id, "down")}
                        disabled={idx === rowClients.length - 1}
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
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
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
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-accent" />
          <div>
            <h1 className="text-2xl font-bold font-display">Kunden-Logos</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Verwalten Sie die Logos in zwei unabhängigen Marquee-Reihen</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Laden…</div>
        ) : (
          <>
            <ClientTable rowClients={row1} rowNum={1} />

            <div className="border-t border-dashed border-gray-200 pt-2" />

            <ClientTable rowClients={row2} rowNum={2} />
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-bold font-display">
                  {editingClient ? "Logo bearbeiten" : "Neues Logo hinzufügen"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {defaultRow === 1 ? "Obere Reihe" : "Untere Reihe"}
                </p>
              </div>
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
                      onClick={() => { setImageFile(null); setImagePreview(editingClient?.imageUrl ?? null); }}
                      className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {editingClient && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Reihe</label>
                  <div className="flex gap-2">
                    {([1, 2] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setDefaultRow(r)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                          defaultRow === r
                            ? "bg-accent text-white border-accent"
                            : "border-border text-muted-foreground hover:border-accent/50"
                        }`}
                      >
                        {r === 1 ? "Obere Reihe" : "Untere Reihe"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
