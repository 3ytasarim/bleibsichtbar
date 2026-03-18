import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useGetProjects, useCreateProject, useUpdateProject, useDeleteProject, type Project } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const projectSchema = z.object({
  title: z.string().min(1, "Titel erforderlich"),
  description: z.string().min(1, "Beschreibung erforderlich"),
  category: z.string().min(1, "Kategorie erforderlich"),
  imageUrl: z.string().url("Muss eine gültige URL sein").or(z.literal("")).nullable(),
  clientName: z.string().optional().nullable(),
  tags: z.string().transform(val => val.split(",").map(t => t.trim()).filter(Boolean)),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
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

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { published: true, sortOrder: 0, tags: "" }
  });

  const openCreate = () => {
    setEditingId(null);
    reset({ title: "", description: "", category: "", imageUrl: "", clientName: "", tags: "", published: true, sortOrder: 0 });
    setIsModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    reset({
      title: project.title,
      description: project.description,
      category: project.category,
      imageUrl: project.imageUrl || "",
      clientName: project.clientName || "",
      tags: project.tags.join(", "),
      published: project.published,
      sortOrder: project.sortOrder
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

  const onSubmit = (data: any) => {
    // Schema transforms tags string to array
    const payload = { ...data, imageUrl: data.imageUrl || null, clientName: data.clientName || null };
    
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
                    <td className="p-4 font-medium">{project.title}</td>
                    <td className="p-4 text-muted-foreground">{project.category}</td>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titel</label>
              <Input {...register("title")} className={errors.title ? "border-destructive" : ""} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kategorie</label>
              <Input {...register("category")} placeholder="z.B. Webdesign" className={errors.category ? "border-destructive" : ""} />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Beschreibung</label>
            <Textarea {...register("description")} className={errors.description ? "border-destructive" : ""} />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Bild URL</label>
            <Input {...register("imageUrl")} placeholder="https://..." />
            {errors.imageUrl && <span className="text-xs text-destructive">{errors.imageUrl.message as string}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Kundenname (optional)</label>
              <Input {...register("clientName")} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tags (kommagetrennt)</label>
              <Input {...register("tags")} placeholder="Social, Branding, ..." />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" {...register("published")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="published" className="text-sm font-medium">Veröffentlichen</label>
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abbrechen</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {createMut.isPending || updateMut.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </SimpleModal>
    </AdminLayout>
  );
}
