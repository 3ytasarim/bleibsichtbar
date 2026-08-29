import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCustomerRoadmap,
  useCreateCustomerRoadmapItem,
  useUpdateCustomerRoadmapItem,
  useDeleteCustomerRoadmapItem,
  getGetCustomerRoadmapQueryKey,
  type RoadmapItem,
} from "@workspace/api-client-react";
import type { DragEndEvent } from "@dnd-kit/core";
import { KanbanProvider, KanbanBoard, KanbanHeader, KanbanCards, KanbanCard } from "@/components/ui/kanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Clock, Wrench, CheckCircle2, Loader2 } from "lucide-react";

const COLUMNS = [
  { status: "in_progress", label: "Im Prozess", icon: Clock, accent: "text-slate-600 bg-slate-200" },
  { status: "preparing", label: "Wird vorbereitet", icon: Wrench, accent: "text-white bg-accent" },
  { status: "completed", label: "Abgeschlossen", icon: CheckCircle2, accent: "text-white bg-emerald-600" },
] as const;

/**
 * Drag-and-drop roadmap ("Update") board for one customer — admin drags
 * cards between the three stage columns; each drop fires a status update
 * that notifies the customer. The customer's own view of this data
 * (src/pages/customer/Update.tsx) is read-only.
 */
export function AdminRoadmapBoard({ customerId }: { customerId: number }) {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useGetCustomerRoadmap(customerId);
  const createMut = useCreateCustomerRoadmapItem();
  const updateMut = useUpdateCustomerRoadmapItem();
  const deleteMut = useDeleteCustomerRoadmapItem();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCustomerRoadmapQueryKey(customerId) });

  const handleAdd = () => {
    if (!title.trim()) return;
    createMut.mutate(
      { id: customerId, data: { title: title.trim(), description: description.trim() || undefined } },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          invalidate();
        },
      }
    );
  };

  const handleDelete = (itemId: number) => {
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;
    deleteMut.mutate({ id: customerId, itemId }, { onSuccess: invalidate });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const itemId = Number(active.id);
    const newStatus = String(over.id);
    const item = items.find((i) => i.id === itemId);
    if (!item || item.status === newStatus) return;
    updateMut.mutate({ id: customerId, itemId, data: { status: newStatus } }, { onSuccess: invalidate });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Lade Update...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Neuer Eintrag..." className="flex-1" />
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beschreibung (optional)" className="flex-1" />
        <Button type="button" onClick={handleAdd} disabled={createMut.isPending || !title.trim()}>
          {createMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Hinzufügen
        </Button>
      </div>

      <KanbanProvider onDragEnd={handleDragEnd} className="grid-cols-3">
        {COLUMNS.map((col) => {
          const colItems = items.filter((i) => i.status === col.status);
          const Icon = col.icon;
          return (
            <KanbanBoard key={col.status} id={col.status}>
              <KanbanHeader>
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${col.accent}`}>
                  {colItems.length}
                </span>
                <Icon className="w-4 h-4 text-muted-foreground" />
                <p className="font-semibold text-sm">{col.label}</p>
              </KanbanHeader>
              <KanbanCards>
                {colItems.map((item: RoadmapItem, index) => (
                  <KanbanCard key={item.id} id={String(item.id)} index={index} parent={col.status}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.title}</p>
                        {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="shrink-0 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </KanbanCard>
                ))}
              </KanbanCards>
            </KanbanBoard>
          );
        })}
      </KanbanProvider>
    </div>
  );
}
