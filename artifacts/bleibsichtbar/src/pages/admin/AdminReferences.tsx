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
import { useGetReferences, useCreateReference, useUpdateReference, useDeleteReference, type Reference } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const referenceSchema = z.object({
  clientName: z.string().min(1, "Name erforderlich"),
  clientTitle: z.string().optional().nullable(),
  company: z.string().min(1, "Unternehmen erforderlich"),
  logoUrl: z.string().url("Gültige URL").or(z.literal("")).nullable(),
  testimonial: z.string().optional().nullable(),
  rating: z.coerce.number().min(1).max(5).default(5),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof referenceSchema>;

export default function AdminReferences() {
  const queryClient = useQueryClient();
  const { data: references = [], isLoading } = useGetReferences();
  const createMut = useCreateReference();
  const updateMut = useUpdateReference();
  const deleteMut = useDeleteReference();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(referenceSchema),
    defaultValues: { published: true, sortOrder: 0, rating: 5 }
  });

  const openCreate = () => {
    setEditingId(null);
    reset({ clientName: "", clientTitle: "", company: "", logoUrl: "", testimonial: "", rating: 5, published: true, sortOrder: 0 });
    setIsModalOpen(true);
  };

  const openEdit = (ref: Reference) => {
    setEditingId(ref.id);
    reset({
      clientName: ref.clientName,
      clientTitle: ref.clientTitle || "",
      company: ref.company,
      logoUrl: ref.logoUrl || "",
      testimonial: ref.testimonial || "",
      rating: ref.rating || 5,
      published: ref.published,
      sortOrder: ref.sortOrder
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Referenz wirklich löschen?")) {
      deleteMut.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/references"] })
      });
    }
  };

  const onSubmit = (data: FormValues) => {
    const payload = { 
      ...data, 
      logoUrl: data.logoUrl || null, 
      testimonial: data.testimonial || null,
      clientTitle: data.clientTitle || null
    };
    
    if (editingId) {
      updateMut.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/references"] });
          setIsModalOpen(false);
        }
      });
    } else {
      createMut.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/references"] });
          setIsModalOpen(false);
        }
      });
    }
  };

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
                  <th className="p-4 font-semibold text-sm">Kunde</th>
                  <th className="p-4 font-semibold text-sm">Unternehmen</th>
                  <th className="p-4 font-semibold text-sm">Bewertung</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {references.map(ref => (
                  <tr key={ref.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium">{ref.clientName}</div>
                      <div className="text-xs text-muted-foreground">{ref.clientTitle}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{ref.company}</td>
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
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name der Person</label>
              <Input {...register("clientName")} className={errors.clientName ? "border-destructive" : ""} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Unternehmen</label>
              <Input {...register("company")} className={errors.company ? "border-destructive" : ""} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Position/Titel (optional)</label>
              <Input {...register("clientTitle")} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bewertung (1-5)</label>
              <Input type="number" min="1" max="5" {...register("rating")} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Testimonial Text</label>
            <Textarea {...register("testimonial")} className="min-h-[100px]" />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Logo URL (optional)</label>
            <Input {...register("logoUrl")} placeholder="https://..." />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="publishedRef" {...register("published")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="publishedRef" className="text-sm font-medium">Veröffentlichen</label>
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
