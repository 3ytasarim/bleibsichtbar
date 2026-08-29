import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetPortalRoadmap, type RoadmapItem } from "@workspace/api-client-react";
import { Kanban, Loader2, Clock, Wrench, CheckCircle2 } from "lucide-react";

const COLUMNS = [
  { status: "in_progress", label: "Im Prozess", icon: Clock, accent: "text-slate-600 bg-slate-100" },
  { status: "preparing", label: "Wird vorbereitet", icon: Wrench, accent: "text-[#2563eb] bg-[#2563eb]/10" },
  { status: "completed", label: "Abgeschlossen", icon: CheckCircle2, accent: "text-emerald-700 bg-emerald-100" },
] as const;

function RoadmapCard({ item }: { item: RoadmapItem }) {
  return (
    <div className="bg-white rounded-xl border border-border p-3.5 shadow-sm">
      <p className="text-sm font-semibold text-foreground">{item.title}</p>
      {item.description && <p className="text-xs text-muted-foreground mt-1.5 whitespace-pre-wrap">{item.description}</p>}
      <p className="text-[11px] text-muted-foreground/70 mt-2">
        {new Date(item.updatedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
      </p>
    </div>
  );
}

/** Read-only Kanban view of the customer's own roadmap — admin moves items across columns from the admin panel. */
export default function CustomerUpdate() {
  const { data: items = [], isLoading } = useGetPortalRoadmap();

  return (
    <CustomerPortalLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <Kanban className="w-7 h-7 text-[#2563eb]" /> Update
        </h1>
        <p className="text-muted-foreground mt-2">Der aktuelle Stand Ihrer Projekte, Schritt für Schritt.</p>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Lade Update...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 bg-card rounded-2xl border border-border p-16 text-center">
            <Kanban className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-medium text-muted-foreground">Noch keine Einträge vorhanden.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {COLUMNS.map((col) => {
              const colItems = items.filter((i) => i.status === col.status);
              const Icon = col.icon;
              return (
                <div key={col.status} className="bg-muted/40 rounded-2xl border border-border p-3">
                  <div className="flex items-center gap-2.5 px-1 pt-1 pb-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${col.accent}`}>
                      {colItems.length}
                    </span>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <p className="font-semibold text-sm text-foreground">{col.label}</p>
                  </div>
                  <div className="space-y-2.5">
                    {colItems.length === 0 ? (
                      <p className="text-xs text-muted-foreground/60 px-1">Keine Einträge</p>
                    ) : (
                      colItems.map((item) => <RoadmapCard key={item.id} item={item} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerPortalLayout>
  );
}
