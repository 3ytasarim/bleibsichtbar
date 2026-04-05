import React, { useState, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2, Check, X, ImagePlus, Minus, Plus, Globe, Images, Users, Heart, Eye, Upload } from "lucide-react";
import { useGetProjects, useDeleteProject, type Project } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type FormState = {
  title: string;
  description: string;
  category: string;
  clientName: string;
  websiteUrl: string;
  tags: string;
  published: boolean;
  sortOrder: number;
  statFollowers: string;
  statLikes: string;
  statViews: string;
};

const defaultForm: FormState = {
  title: "",
  description: "",
  category: "",
  clientName: "",
  websiteUrl: "",
  tags: "",
  published: true,
  sortOrder: 0,
  statFollowers: "",
  statLikes: "",
  statViews: "",
};

type GalleryItem = { file: File | null; preview: string; existing: string };

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useGetProjects();
  const deleteMut = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  // Main image
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
  const mainImageRef = useRef<HTMLInputElement>(null);

  // Gallery images
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const galleryRef = useRef<HTMLInputElement>(null);

  const isSocialMedia = form.category.toLowerCase().includes("social");

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setMainImageFile(null);
    setMainImagePreview(null);
    setExistingMainImage(null);
    setGalleryItems([]);
    setIsModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category,
      clientName: project.clientName || "",
      websiteUrl: (project as any).websiteUrl || "",
      tags: project.tags.join(", "),
      published: project.published,
      sortOrder: project.sortOrder,
      statFollowers: (project as any).statFollowers || "",
      statLikes: (project as any).statLikes || "",
      statViews: (project as any).statViews || "",
    });
    setMainImageFile(null);
    setMainImagePreview(null);
    setExistingMainImage(project.imageUrl || null);
    const existingGallery: GalleryItem[] = ((project as any).galleryImages ?? []).map((url: string) => ({
      file: null, preview: url, existing: url,
    }));
    setGalleryItems(existingGallery);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Wirklich löschen?")) return;
    deleteMut.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/projects"] })
    });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMainImageFile(file);
    if (file) setMainImagePreview(URL.createObjectURL(file));
    else setMainImagePreview(null);
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems: GalleryItem[] = files.map(f => ({
      file: f, preview: URL.createObjectURL(f), existing: "",
    }));
    setGalleryItems(prev => [...prev, ...newItems]);
    e.target.value = "";
  };

  const removeGalleryItem = (idx: number) => {
    setGalleryItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("clientName", form.clientName);
      fd.append("websiteUrl", form.websiteUrl);
      fd.append("tags", form.tags);
      fd.append("published", String(form.published));
      fd.append("sortOrder", String(form.sortOrder));
      fd.append("statFollowers", form.statFollowers);
      fd.append("statLikes", form.statLikes);
      fd.append("statViews", form.statViews);

      if (mainImageFile) {
        fd.append("image", mainImageFile);
      }

      // New gallery files
      galleryItems.forEach(item => {
        if (item.file) fd.append("gallery", item.file);
      });

      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";
      await fetch(url, { method, body: fd });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const mainImageDisplay = mainImagePreview || existingMainImage;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Projekte</h1>
          <p className="text-muted-foreground">Portfolio-Elemente verwalten</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Lade Projekte...</div>
        ) : projects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Keine Projekte gefunden.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="p-4 font-semibold text-sm">Bild</th>
                  <th className="p-4 font-semibold text-sm">Titel</th>
                  <th className="p-4 font-semibold text-sm">Kategorie</th>
                  <th className="p-4 font-semibold text-sm">Galerie</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-16 h-12 object-cover rounded bg-gray-100" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Kein Bild</div>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      <div>{project.title}</div>
                      {project.clientName && <div className="text-xs text-muted-foreground">{project.clientName}</div>}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">{project.category}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Images className="w-3.5 h-3.5" />
                        {((project as any).galleryImages?.length ?? 0)} Foto(s)
                      </div>
                    </td>
                    <td className="p-4">
                      {project.published ?
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1"/> Aktiv</span> :
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1"/> Entwurf</span>
                      }
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(project)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
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
        title={editingId ? "Projekt bearbeiten" : "Neues Projekt erstellen"}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-5">
          {/* Title + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titel *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Projektname" required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategorie *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full rounded-md border border-input px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Bitte wählen…</option>
                <option value="Fotografie">Fotografie</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">Beschreibung *</label>
            <Textarea rows={3} placeholder="Kurze Projektbeschreibung..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>

          {/* Client + Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Kundenname</label>
              <Input placeholder="Firma GmbH" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Website URL
              </label>
              <Input type="url" placeholder="https://kunde.de" value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))} />
            </div>
          </div>

          {/* Main image upload */}
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
              <ImagePlus className="w-3.5 h-3.5" /> Hauptbild
            </label>
            <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => mainImageRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                {mainImageDisplay ? "Bild ersetzen" : "Bild hochladen"}
              </Button>
              {mainImageDisplay && (
                <div className="flex items-center gap-2">
                  <img src={mainImageDisplay} alt="Vorschau" className="h-12 w-auto max-w-[140px] object-cover rounded border border-gray-100" />
                  <button type="button" onClick={() => { setMainImageFile(null); setMainImagePreview(null); setExistingMainImage(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery images upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Images className="w-3.5 h-3.5" /> Galerie-Fotos
              </label>
              <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={() => galleryRef.current?.click()}>
                <Plus className="w-3 h-3 mr-1" /> Fotos hinzufügen
              </Button>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryAdd} />
            {galleryItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {galleryItems.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <img src={item.preview} alt={`Galerie ${idx + 1}`} className="w-16 h-16 object-cover rounded border border-gray-100" />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1.5">Mehrere Fotos auf einmal auswählbar. Hover zum Entfernen.</p>
          </div>

          {/* Tags + Sort */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tags (kommagetrennt)</label>
              <Input placeholder="Social, Branding, ..." value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sortiernummer</label>
              <Input type="number" placeholder="0" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
            </div>
          </div>

          {/* Social Media Stats */}
          {isSocialMedia && (
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <p className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                Social Media Statistiken
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1"><Users className="w-3 h-3" /> Follower</label>
                  <Input placeholder="z.B. 25k" value={form.statFollowers} onChange={e => setForm(f => ({ ...f, statFollowers: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1"><Heart className="w-3 h-3" /> Likes</label>
                  <Input placeholder="z.B. 323k" value={form.statLikes} onChange={e => setForm(f => ({ ...f, statLikes: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1"><Eye className="w-3 h-3" /> Aufrufe</label>
                  <Input placeholder="z.B. 93M" value={form.statViews} onChange={e => setForm(f => ({ ...f, statViews: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="published" className="text-sm font-medium">Veröffentlichen</label>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abbrechen</Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={saving}>
                {saving ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </SimpleModal>
    </AdminLayout>
  );
}
