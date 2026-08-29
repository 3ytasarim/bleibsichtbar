import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, FileStack, Plus, FileText, Upload } from "lucide-react";
import {
  useGetCustomerDocuments,
  useDeleteCustomerDocument,
  getGetCustomerDocumentsQueryKey,
  type CustomerDocument,
} from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "briefing", label: "Briefing" },
  { value: "strategy", label: "Social Media Strategie" },
  { value: "brand", label: "Brand Information" },
  { value: "other", label: "Sonstiges" },
];

function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}
export function DocumentsSection({ customerId }: { customerId: number }) {
  const queryClient = useQueryClient();
  const { data: documents = [], isLoading } = useGetCustomerDocuments(customerId);
  const deleteMut = useDeleteCustomerDocument();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("briefing");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCustomerDocumentsQueryKey(customerId) });

  const handleUpload = async () => {
    setUploadError(null);
    const file = fileInputRef.current?.files?.[0];
    if (!title.trim()) return setUploadError("Bitte einen Titel eingeben.");
    if (!file) return setUploadError("Bitte eine Datei auswählen.");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("file", file);
      const res = await fetch(`/api/customers/${customerId}/documents`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Dokument konnte nicht hochgeladen werden.");
      }
      invalidate();
      setTitle("");
      setCategory("briefing");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setUploadError(err?.message || "Dokument konnte nicht hochgeladen werden.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (doc: CustomerDocument) => {
    if (!confirm(`"${doc.title}" wirklich löschen?`)) return;
    deleteMut.mutate({ id: customerId, documentId: doc.id }, { onSuccess: invalidate });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <FileStack className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Dokumente</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Briefings, Strategien & Markeninformationen — im Kundenportal nur lesend sichtbar.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6"><Loader2 className="w-4 h-4 animate-spin" /> Lade Dokumente...</div>
      ) : documents.length === 0 ? (
        <div className="bg-muted/40 rounded-2xl border border-dashed border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">Noch keine Dokumente vorhanden.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Titel</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Kategorie</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Datei</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Hochgeladen</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-3.5 font-medium">{doc.title}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{categoryLabel(doc.category)}</span>
                    </td>
                    <td className="p-3.5">
                      <a href={doc.fileReference} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                        <FileText className="w-3.5 h-3.5" /> {doc.fileName}
                      </a>
                    </td>
                    <td className="p-3.5 text-muted-foreground whitespace-nowrap">{formatDate(doc.createdAt)}</td>
                    <td className="p-3.5 text-right">
                      <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(doc)} disabled={deleteMut.isPending}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gray-50/70 rounded-2xl border border-border p-4">
        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5 text-accent" /> Dokument hochladen</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Titel</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9 bg-white" placeholder="z. B. Onboarding Briefing" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Kategorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Datei</Label>
            <Input ref={fileInputRef} type="file" className="h-9 bg-white pt-1.5" />
          </div>
        </div>
        <div className="mt-3">
          <Button type="button" onClick={handleUpload} disabled={uploading} className="bg-accent hover:bg-accent/90">
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Dokument hochladen
          </Button>
        </div>
      </div>
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );
}
