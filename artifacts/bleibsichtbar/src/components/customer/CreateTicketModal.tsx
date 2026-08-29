import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePortalSupportTicket, getGetPortalSupportTicketsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TICKET_CATEGORIES = [
  { value: "invoice", label: "Rechnung" },
  { value: "social_media", label: "Social Media" },
  { value: "website", label: "Website" },
  { value: "other", label: "Sonstiges" },
] as const;

export function categoryLabel(value: string) {
  return TICKET_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Shared create-ticket form — used from the Dashboard entry point and from the full Tickets page. */
export function CreateTicketModal({ open, onOpenChange }: CreateTicketModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createMut = useCreatePortalSupportTicket();

  const [category, setCategory] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategory("");
    setSubject("");
    setMessage("");
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) reset();
    onOpenChange(next);
  };

  const handleSubmit = () => {
    setError(null);
    if (!category) {
      setError("Bitte wählen Sie ein Thema aus.");
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setError("Betreff und Nachricht sind erforderlich.");
      return;
    }
    createMut.mutate(
      { data: { category, subject: subject.trim(), message: message.trim() } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetPortalSupportTicketsQueryKey() });
          onOpenChange(false);
          toast({ title: "Ticket erstellt", description: "Wir melden uns so schnell wie möglich bei Ihnen." });
        },
        onError: (err: any) => {
          setError(err?.data?.message || "Ticket konnte nicht erstellt werden.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ticket erstellen</DialogTitle>
          <DialogDescription>Beschreiben Sie kurz Ihr Anliegen — wir melden uns per E-Mail.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Thema</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Thema auswählen..." />
              </SelectTrigger>
              <SelectContent>
                {TICKET_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Betreff</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Kurze Zusammenfassung" />
          </div>

          <div>
            <Label className="mb-1.5 block">Nachricht</Label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Beschreiben Sie Ihr Anliegen..." rows={4} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button type="button" onClick={handleSubmit} disabled={createMut.isPending} className="bg-[#2563eb] hover:bg-[#2563eb]/90">
            {createMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Ticket senden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
