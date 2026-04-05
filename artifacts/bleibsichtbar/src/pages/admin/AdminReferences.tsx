import React, { useState, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Check, X, Upload, Link as LinkIcon, ImagePlus } from "lucide-react";
import { useGetReferences, useDeleteReference } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type Reference = {
  id: number;
  clientName: string;
  clientTitle?: string | null;
  company: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  testimonial?: string | null;
  rating?: number | null;
  published: boolean;
  sortOrder: number;
};

type FormState = {
  clientName: string;
  clientTitle: string;
  company: string;
  websiteUrl: string;
  testimonial: string;
  rating: number;
  published: boolean;
  sortOrder: number;
};

const defaultForm: FormState = {
  clientName: "",
  clientTitle: "",
  company: "",
  websiteUrl: "",
  testimonial: "",
  rating: 5,
  published: true,
  sortOrder: 0,
};

export default function AdminReferences() {
  const queryClient = useQueryClient();
  const { data: references = [], isLoading } = useGetReferences();
  const deleteMut = useDeleteReference();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setLogoFile(null);
    setLogoPreview(null);
    setExistingLogoUrl(null);
    setIsModalOpen(true);
  };

  const openEdit = (ref: Reference) => {
    setEditingId(ref.id);
    setForm({
      clientName: ref.clientName,
      clientTitle: ref.clientTitle || "",
      company: ref.company,
      websiteUrl: ref.websiteUrl || "",
      testimonial: ref.testimonial || "",
      rating: ref.rating || 5,
      published: ref.published,
      sortOrder: ref.sortOrder,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setExistingLogoUrl(ref.logoUrl || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      setLogoPreview(null);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Referenz wirklich löschen?")) return;
    deleteMut.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/references"] })
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("clientName", form.clientName);
      fd.append("clientTitle", form.clientTitle);
      fd.append("company", form.company);
      fd.append("websiteUrl", form.websiteUrl);
      fd.append("testimonial", form.testimonial);
      fd.append("rating", String(form.rating));
      fd.append("published", String(form.published));
      fd.append("sortOrder", String(form.sortOrder));
      if (logoFile) fd.append("logo", logoFile);

      const url = editingId ? `/api/references/${editingId}` : "/api/references";
      const method = editingId ? "PUT" : "POST";
      await fetch(url, { method, body: fd });
      queryClient.invalidateQueries({ queryKey: ["/api/references"] });
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const logoDisplay = logoPreview || existingLogoUrl;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Referenzen</h1>
          <p className="text-muted-foreground">Kundenstimmen verwalten</p>
        </div>
        <Button onClick={openCreate} className="bg-accent hover:bg-accent/90">
          <Plus className="w-5 h-5 mr-2" /> Neue Referenz
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Lade Referenzen...</div>
        ) : references.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Keine Referenzen gefunden.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="p-4 font-semibold text-sm">Logo</th>
                  <th className="p-4 font-semibold text-sm">Kunde</th>
                  <th className="p-4 font-semibold text-sm">Unternehmen</th>
                  <th className="p-4 font-semibold text-sm">Sıra</th>
                  <th className="p-4 font-semibold text-sm">Bewertung</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(references as Reference[]).map(ref => (
                  <tr key={ref.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      {ref.logoUrl ? (
                        <img src={ref.logoUrl} alt={ref.company} className="w-14 h-10 object-contain rounded bg-gray-50 border border-gray-100" />
                      ) : (
                        <div className="w-14 h-10 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">–</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{ref.clientName}</div>
                      <div className="text-xs text-muted-foreground">{ref.clientTitle}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {ref.websiteUrl ? (
                        <a href={ref.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent flex items-center gap-1">
                          {ref.company} <LinkIcon className="w-3 h-3" />
                        </a>
                      ) : ref.company}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">{ref.sortOrder}</td>
                    <td className="p-4 text-accent">{"★".repeat(ref.rating || 5)}</td>
                    <td className="p-4">
                      {ref.published ?
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1"/> Aktiv</span> :
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1"/> Entwurf</span>
                      }
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(ref)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ref.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Referenz bearbeiten" : "Neue Referenz"}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* Name + Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name der Person *</label>
              <Input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Unternehmen *</label>
              <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
            </div>
          </div>

          {/* Position + Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Position/Titel (optional)</label>
              <Input value={form.clientTitle} onChange={e => setForm(f => ({ ...f, clientTitle: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bewertung (1–5)</label>
              <Input type="number" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} />
            </div>
          </div>

          {/* Testimonial */}
          <div>
            <label className="text-sm font-medium mb-1 block">Testimonial Text</label>
            <Textarea className="min-h-[90px]" value={form.testimonial} onChange={e => setForm(f => ({ ...f, testimonial: e.target.value }))} />
          </div>

          {/* Logo upload */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
              <ImagePlus className="w-4 h-4" /> Firmenlogo (optional)
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {logoDisplay ? "Logo ersetzen" : "Logo hochladen"}
              </Button>
              {logoDisplay && (
                <div className="flex items-center gap-2">
                  <img src={logoDisplay} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain rounded border border-gray-100 bg-gray-50 p-1" />
                  <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); setExistingLogoUrl(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Website URL */}
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1.5">
              <LinkIcon className="w-4 h-4" /> Website URL (optional, macht Firmennamen klickbar)
            </label>
            <Input
              type="url"
              placeholder="https://firma.de"
              value={form.websiteUrl}
              onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
            />
          </div>

          {/* Sort order */}
          <div>
            <label className="text-sm font-medium mb-1 block">Reihenfolge (0 = zuerst)</label>
            <Input type="number" min="0" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="publishedRef" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="publishedRef" className="text-sm font-medium">Veröffentlichen</label>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abbrechen</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </SimpleModal>
    </AdminLayout>
  );
}
