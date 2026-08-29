import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useGetSupportTickets,
  useUpdateSupportTicket,
  useGetSupportTicketMessages,
  useCreateSupportTicketMessage,
  getGetSupportTicketsQueryKey,
  getGetSupportTicketMessagesQueryKey,
  type SupportTicketAdmin,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LifeBuoy, Loader2, Clock, Search, CheckCircle2, Send } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  invoice: "Rechnung",
  social_media: "Social Media",
  website: "Website",
  other: "Sonstiges",
};

const STATUSES = ["open", "in_progress", "in_review", "resolved", "closed"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_META: Record<Status, { label: string; icon: typeof Clock; className: string }> = {
  open: { label: "Offen", icon: Clock, className: "bg-slate-100 text-slate-700" },
  in_progress: { label: "In Bearbeitung", icon: Loader2, className: "bg-accent/10 text-accent" },
  in_review: { label: "Wird geprüft", icon: Search, className: "bg-amber-100 text-amber-700" },
  resolved: { label: "Gelöst", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
  closed: { label: "Geschlossen", icon: CheckCircle2, className: "bg-gray-100 text-gray-600" },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as Status] ?? STATUS_META.open;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.className}`}>
      <Icon className="w-3.5 h-3.5" /> {meta.label}
    </span>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function TicketDetail({ ticket, onSaved }: { ticket: SupportTicketAdmin; onSaved: () => void }) {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading: messagesLoading } = useGetSupportTicketMessages(ticket.id);
  const updateMut = useUpdateSupportTicket();
  const replyMut = useCreateSupportTicketMessage();

  const [draftStatus, setDraftStatus] = useState<Status>(ticket.status as Status);
  const [reply, setReply] = useState("");

  const statusDirty = draftStatus !== ticket.status;
  const saving = updateMut.isPending || replyMut.isPending;

  const handleSave = async () => {
    const tasks: Promise<unknown>[] = [];
    if (statusDirty) {
      tasks.push(new Promise((resolve, reject) => updateMut.mutate({ id: ticket.id, data: { status: draftStatus } }, { onSuccess: resolve, onError: reject })));
    }
    if (reply.trim()) {
      tasks.push(new Promise((resolve, reject) => replyMut.mutate({ id: ticket.id, data: { message: reply.trim() } }, { onSuccess: resolve, onError: reject })));
    }
    if (tasks.length === 0) return;
    try {
      await Promise.all(tasks);
      queryClient.invalidateQueries({ queryKey: getGetSupportTicketsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetSupportTicketMessagesQueryKey(ticket.id) });
      setReply("");
      onSaved();
    } catch {
      // form stays open, mutation errors already surface via react-query devtools/network tab
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-muted/40 rounded-xl border border-border p-4 space-y-1.5 text-sm">
        <p><span className="text-muted-foreground">Kunde:</span> <span className="font-medium">{ticket.customerCompanyName}</span> ({ticket.customerUsername})</p>
        <p><span className="text-muted-foreground">Kategorie:</span> {CATEGORY_LABELS[ticket.category] ?? ticket.category}</p>
        <p className="text-muted-foreground whitespace-pre-wrap pt-2 border-t border-border mt-2">{ticket.message}</p>
      </div>

      <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
        {messagesLoading ? (
          <div className="flex items-center justify-center py-4 text-muted-foreground text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Lade Verlauf...
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderType === "admin" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${m.senderType === "admin" ? "bg-accent text-white" : "bg-muted text-foreground"}`}>
                <p className="whitespace-pre-wrap">{m.message}</p>
                <p className={`text-[10px] mt-1 ${m.senderType === "admin" ? "text-white/70" : "text-muted-foreground"}`}>
                  {m.senderType === "admin" ? "Bleibsichtbar" : ticket.customerCompanyName} · {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <Label className="mb-1.5 block">Status</Label>
        <Select value={draftStatus} onValueChange={(v) => setDraftStatus(v as Status)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_META[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block">Antwort an Kunde (optional)</Label>
        <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Nachricht an den Kunden..." rows={3} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={handleSave} disabled={saving || (!statusDirty && !reply.trim())}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          Speichern
        </Button>
      </div>
    </div>
  );
}

export default function AdminSupportTickets() {
  const { data: tickets = [], isLoading } = useGetSupportTickets();
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<SupportTicketAdmin | null>(null);

  const filtered = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <LifeBuoy className="w-7 h-7 text-accent" /> Support-Tickets
        </h1>
        <p className="text-muted-foreground">Von Kunden im Portal eröffnete Tickets bearbeiten.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === s
                ? "bg-accent text-white border-accent"
                : "bg-white text-muted-foreground border-border hover:border-accent/40"
            }`}
          >
            {s === "all" ? "Alle" : STATUS_META[s].label}
            {s !== "all" && (
              <span className="ml-1.5 opacity-70">({tickets.filter((t) => t.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Lade Tickets...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Keine Tickets gefunden.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="p-4 font-semibold text-sm">Kunde</th>
                  <th className="p-4 font-semibold text-sm">Kategorie</th>
                  <th className="p-4 font-semibold text-sm">Betreff</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm">Datum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => setSelected(t)}>
                    <td className="p-4 font-medium">
                      {t.customerCompanyName}
                      <div className="text-xs font-normal text-muted-foreground">{t.customerUsername}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{CATEGORY_LABELS[t.category] ?? t.category}</td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">
                      <span className="inline-flex items-center gap-2">
                        {t.unread && <span className="w-2 h-2 rounded-full bg-accent shrink-0" title="Ungelesen" />}
                        {t.subject}
                      </span>
                    </td>
                    <td className="p-4"><StatusBadge status={t.status} /></td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SimpleModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Ticket: ${selected.subject}` : ""}
        widthClassName="max-w-xl"
      >
        {selected && <TicketDetail ticket={selected} onSaved={() => setSelected(null)} />}
      </SimpleModal>
    </AdminLayout>
  );
}
