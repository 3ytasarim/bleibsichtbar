import { useState } from "react";
import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { CreateTicketModal, categoryLabel } from "@/components/customer/CreateTicketModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useGetPortalSupportTickets,
  useGetPortalSupportTicketMessages,
  useCreatePortalSupportTicketMessage,
  getGetPortalSupportTicketMessagesQueryKey,
  getGetPortalSupportTicketsQueryKey,
  type SupportTicket,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LifeBuoy, Plus, Loader2, Clock, Search, CheckCircle2, Send } from "lucide-react";

const STATUS_META: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  open: { label: "Offen", icon: Clock, className: "bg-slate-100 text-slate-700" },
  in_progress: { label: "In Bearbeitung", icon: Loader2, className: "bg-[#2563eb]/10 text-[#2563eb]" },
  in_review: { label: "Wird geprüft", icon: Search, className: "bg-amber-100 text-amber-700" },
  resolved: { label: "Gelöst", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700" },
  closed: { label: "Geschlossen", icon: CheckCircle2, className: "bg-gray-100 text-gray-600" },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.open!;
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

function TicketThread({ ticket }: { ticket: SupportTicket }) {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useGetPortalSupportTicketMessages(ticket.id);
  const replyMut = useCreatePortalSupportTicketMessage();
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    setError(null);
    if (!reply.trim()) {
      setError("Nachricht darf nicht leer sein.");
      return;
    }
    replyMut.mutate(
      { id: ticket.id, data: { message: reply.trim() } },
      {
        onSuccess: () => {
          setReply("");
          queryClient.invalidateQueries({ queryKey: getGetPortalSupportTicketMessagesQueryKey(ticket.id) });
          queryClient.invalidateQueries({ queryKey: getGetPortalSupportTicketsQueryKey() });
        },
        onError: (err: any) => setError(err?.data?.message || "Antwort konnte nicht gesendet werden."),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/40 rounded-xl border border-border p-4 text-sm">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
          <span>{categoryLabel(ticket.category)}</span>
          <span>·</span>
          <span>{formatDateTime(ticket.createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap text-foreground">{ticket.message}</p>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground text-sm gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Lade Verlauf...
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderType === "customer" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                  m.senderType === "customer" ? "bg-[#2563eb] text-white" : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.message}</p>
                <p className={`text-[10px] mt-1 ${m.senderType === "customer" ? "text-white/70" : "text-muted-foreground"}`}>
                  {m.senderType === "customer" ? "Sie" : "Bleibsichtbar"} · {formatDateTime(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-border space-y-2">
        <Textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Antwort schreiben..."
          rows={3}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end">
          <Button type="button" onClick={handleSend} disabled={replyMut.isPending} className="bg-[#2563eb] hover:bg-[#2563eb]/90">
            {replyMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Antworten
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerSupportTickets() {
  const { data: tickets = [], isLoading } = useGetPortalSupportTickets();
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  return (
    <CustomerPortalLayout>
      <div className="max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
              <LifeBuoy className="w-7 h-7 text-[#2563eb]" /> Support-Tickets
            </h1>
            <p className="text-muted-foreground mt-2">Ihre bisherigen Anfragen und deren Status.</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="bg-[#2563eb] hover:bg-[#2563eb]/90">
            <Plus className="w-4 h-4 mr-2" /> Neues Ticket
          </Button>
        </div>

        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16">
              <LifeBuoy className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Noch keine Tickets erstellt.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-4 font-semibold text-sm">Betreff</th>
                    <th className="p-4 font-semibold text-sm">Kategorie</th>
                    <th className="p-4 font-semibold text-sm">Status</th>
                    <th className="p-4 font-semibold text-sm">Datum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tickets.map((t: SupportTicket) => (
                    <tr key={t.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setSelected(t)}>
                      <td className="p-4 font-medium max-w-xs truncate">{t.subject}</td>
                      <td className="p-4 text-muted-foreground">{categoryLabel(t.category)}</td>
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
      </div>

      <CreateTicketModal open={createOpen} onOpenChange={setCreateOpen} />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
            <DialogDescription>Verlauf und Antwort für dieses Ticket.</DialogDescription>
          </DialogHeader>
          {selected && <TicketThread ticket={selected} />}
        </DialogContent>
      </Dialog>
    </CustomerPortalLayout>
  );
}
