import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Check, X, ImagePlus, Minus, Globe, Images, Users, Heart, Eye } from "lucide-react";
import { useGetProjects, useCreateProject, useUpdateProject, useDeleteProject, type Project } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const projectSchema = z.object({
  title: z.string().min(1, "Titel erforderlich"),
  description: z.string().min(1, "Beschreibung erforderlich"),
  category: z.string().min(1, "Kategorie erforderlich"),
  imageUrl: z.string().url("Gültige URL erforderlich").or(z.literal("")).nullable(),
  clientName: z.string().optional().nullable(),
  websiteUrl: z.string().url("Gültige URL erforderlich").or(z.literal("")).nullable(),
  tags: z.string().transform(val => val.split(",").map(t => t.trim()).filter(Boolean)),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
  statFollowers: z.string().optional().nullable(),
  statLikes: z.string().optional().nullable(),
  statViews: z.string().optional().nullable(),
});

type FormValues = z.input<typeof projectSchema>;

export default function AdminProjects() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useGetProjects();
  const createMut = useCreateProject();
  const updateMut = useUpdateProject();
  const deleteMut = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([""]);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { published: true, sortOrder: 0, tags: "" }
  });

  const watchedCategory = useWatch({ control, name: "category" });
  const isSocialMedia = watchedCategory?.toLowerCase().includes("social");

  const openCreate = () => {
    setEditingId(null);
    setGalleryImages([""]);
    reset({ title: "", description: "", category: "", imageUrl: "", clientName: "", websiteUrl: "", tags: "", published: true, sortOrder: 0, statFollowers: "", statLikes: "", statViews: "" });
    setIsModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    const gallery = (project as any).galleryImages ?? [];
    setGalleryImages(gallery.length > 0 ? gallery : [""]);
    reset({
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.imageUrl || "",
      clientName: project.clientName || "",
      websiteUrl: (project as any).websiteUrl || "",
      tags: project.tags.join(", "),
      published: project.published,
      sortOrder: project.sortOrder,
      statFollowers: (project as any).statFollowers || "",
      statLikes: (project as any).statLikes || "",
      statViews: (project as any).statViews || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Wirklich löschen?")) {
      deleteMut.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/projects"] })
      });
    }
  };

  const addGalleryImage = () => setGalleryImages(prev => [...prev, ""]);
  const removeGalleryImage = (idx: number) => setGalleryImages(prev => prev.filter((_, i) => i !== idx));
  const updateGalleryImage = (idx: number, val: string) => {
    setGalleryImages(prev => prev.map((img, i) => i === idx ? val : img));
  };

  const onSubmit = (data: any) => {
    const cleanGallery = galleryImages.filter(url => url.trim() !== "");
    const payload = {
      ...data,
      imageUrl: data.imageUrl || null,
      clientName: data.clientName || null,
      websiteUrl: data.websiteUrl || null,
      galleryImages: cleanGallery,
      statFollowers: data.statFollowers || null,
      statLikes: data.statLikes || null,
      statViews: data.statViews || null,
    };

    if (editingId) {
      updateMut.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
          setIsModalOpen(false);
        }
      });
    } else {
      createMut.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
          setIsModalOpen(false);
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Projekte</h1>
          <p className="text-muted-foreground">Portfolio-Elemente verwalten</p>
        </div>
        <Button onClick={openCreate} className="bg-accent hover:bg-accent/90">
          <Plus className="w-5 h-5 mr-2" /> Neues Projekt
        </Button>
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
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titel *</label>
              <Input {...register("title")} placeholder="Projektname" className={errors.title ? "border-destructive" : ""} />
              {errors.title && <span className="text-xs text-destructive">{errors.title.message as string}</span>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategorie *</label>
              <Input {...register("category")} placeholder="z.B. Social Media" className={errors.category ? "border-destructive" : ""} />
              {errors.category && <span className="text-xs text-destructive">{errors.category.message as string}</span>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">Beschreibung *</label>
            <Textarea {...register("description")} rows={3} placeholder="Kurze Projektbeschreibung..." className={errors.description ? "border-destructive" : ""} />
            {errors.description && <span className="text-xs text-destructive">{errors.description.message as string}</span>}
          </div>

          {/* Client + Website */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Kundenname</label>
              <Input {...register("clientName")} placeholder="Firma GmbH" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Website URL
              </label>
              <Input {...register("websiteUrl")} placeholder="https://kunde.de" />
              {errors.websiteUrl && <span className="text-xs text-destructive">{errors.websiteUrl.message as string}</span>}
            </div>
          </div>

          {/* Main image */}
          <div>
            <label className="text-sm font-medium mb-1 block flex items-center gap-1">
              <ImagePlus className="w-3.5 h-3.5" /> Hauptbild URL
            </label>
            <Input {...register("imageUrl")} placeholder="https://..." />
            {errors.imageUrl && <span className="text-xs text-destructive">{errors.imageUrl.message as string}</span>}
          </div>

          {/* Gallery images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Images className="w-3.5 h-3.5" /> Galerie-Fotos (weitere Screenshots)
              </label>
              <Button type="button" variant="outline" size="sm" onClick={addGalleryImage} className="h-7 text-xs">
                <Plus className="w-3 h-3 mr-1" /> Foto hinzufügen
              </Button>
            </div>
            <div className="space-y-2">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={img}
                    onChange={e => updateGalleryImage(idx, e.target.value)}
                    placeholder={`https://... (Bild ${idx + 1})`}
                    className="flex-1"
                  />
                  {galleryImages.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeGalleryImage(idx)} className="shrink-0 h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:border-red-300">
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Diese Bilder erscheinen in der Galerie der Detailseite.</p>
          </div>

          {/* Tags + Sort */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tags (kommagetrennt)</label>
              <Input {...register("tags")} placeholder="Social, Branding, ..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Sortiernummer</label>
              <Input {...register("sortOrder")} type="number" placeholder="0" />
            </div>
          </div>

          {/* Social Media Stats — only for Social Media category */}
          {isSocialMedia && (
            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <p className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                Social Media Statistiken (für Anasayfa-Slider)
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                    <Users className="w-3 h-3" /> Follower
                  </label>
                  <Input {...register("statFollowers")} placeholder="z.B. 25k" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Likes
                  </label>
                  <Input {...register("statLikes")} placeholder="z.B. 323k" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Aufrufe
                  </label>
                  <Input {...register("statViews")} placeholder="z.B. 93M" />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" {...register("published")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="published" className="text-sm font-medium">Veröffentlichen</label>
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abbrechen</Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={createMut.isPending || updateMut.isPending}>
                {createMut.isPending || updateMut.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </SimpleModal>
    </AdminLayout>
  );
}
