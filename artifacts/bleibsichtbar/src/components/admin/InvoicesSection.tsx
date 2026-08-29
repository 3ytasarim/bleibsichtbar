import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit2, Trash2, Receipt, FileText, Upload, FileUp } from "lucide-react";
import {
  useGetCustomerInvoices,
  useUpdateCustomerInvoice,
  useDeleteCustomerInvoice,
  getGetCustomerInvoicesQueryKey,
  type Invoice,
} from "@workspace/api-client-react";

const STATUSES = [
  { value: "open", label: "Offen" },
  { value: "paid", label: "Bezahlt" },
  { value: "overdue", label: "Überfällig" },
  { value: "cancelled", label: "Storniert" },
];

const STATUS_CLASS: Record<string, string> = {
  open: "bg-blue-50 text-blue-700",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => String(CURRENT_YEAR + 1 - i));

function statusLabel(value: string) {
  return STATUSES.find((s) => s.value === value)?.label ?? value;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}
function formatAmount(amount: string | null | undefined, currency: string) {
  if (amount == null) return "—";
  const value = Number(amount);
  return `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency === "EUR" ? "€" : currency}`;
}

interface EditFormValues {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: string;
  status: string;
}

export function InvoicesSection({ customerId }: { customerId: number }) {
  const queryClient = useQueryClient();
  const { data: invoices = [], isLoading } = useGetCustomerInvoices(customerId);
  const updateMut = useUpdateCustomerInvoice();
  const deleteMut = useDeleteCustomerInvoice();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditFormValues>({ invoiceNumber: "", invoiceDate: "", dueDate: "", amount: "", status: "open" });
  const [editError, setEditError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const [uploadYear, setUploadYear] = useState<string>(String(CURRENT_YEAR));
  const [uploadDate, setUploadDate] = useState<string>("");
  const [uploadDueDate, setUploadDueDate] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const newInvoiceFileInput = useRef<HTMLInputElement>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCustomerInvoicesQueryKey(customerId) });

  const handleUploadNewInvoice = async (file: File) => {
    setUploadError(null);
    if (file.type !== "application/pdf") {
      setUploadError("Bitte eine PDF-Datei auswählen.");
      return;
    }
    if (!uploadDate) {
      setUploadError("Rechnungsdatum ist erforderlich.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("year", uploadYear);
      formData.append("invoiceDate", uploadDate);
      if (uploadDueDate) formData.append("dueDate", uploadDueDate);

      const res = await fetch(`/api/customers/${customerId}/invoices/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Rechnung konnte nicht hochgeladen werden.");
      }
      invalidate();
      setUploadDate("");
      setUploadDueDate("");
    } catch (err: any) {
      setUploadError(err?.message || "Rechnung konnte nicht hochgeladen werden.");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (inv: Invoice) => {
    setEditingId(inv.id);
    setEditError(null);
    setEditForm({
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate.slice(0, 10),
      dueDate: inv.dueDate ? inv.dueDate.slice(0, 10) : "",
      amount: inv.amount ?? "",
      status: inv.status,
    });
  };

  const handleSaveEdit = (inv: Invoice) => {
    setEditError(null);
    updateMut.mutate(
      {
        id: customerId,
        invoiceId: inv.id,
        data: {
          invoiceNumber: editForm.invoiceNumber.trim(),
          invoiceDate: editForm.invoiceDate,
          dueDate: editForm.dueDate || null,
          amount: editForm.amount === "" ? null : editForm.amount,
          status: editForm.status,
        },
      },
      {
        onSuccess: () => {
          invalidate();
          setEditingId(null);
        },
        onError: (err: any) => setEditError(err?.data?.message || "Änderung konnte nicht gespeichert werden"),
      }
    );
  };

  const handleDelete = (inv: Invoice) => {
    if (!confirm(`Rechnung ${inv.invoiceNumber} wirklich löschen?`)) return;
    deleteMut.mutate({ id: customerId, invoiceId: inv.id }, { onSuccess: invalidate });
  };

  const handlePdfSelected = async (inv: Invoice, file: File) => {
    if (file.type !== "application/pdf") {
      alert("Bitte eine PDF-Datei auswählen.");
      return;
    }
    setUploadingId(inv.id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/customers/${customerId}/invoices/${inv.id}/pdf`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "PDF konnte nicht hochgeladen werden.");
      }
      invalidate();
    } catch (err: any) {
      alert(err?.message || "PDF konnte nicht hochgeladen werden.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
          <Receipt className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Rechnungen</h3>
          <p className="text-xs text-muted-foreground mt-0.5">PDF-Rechnung hochladen — Rechnungsnummer wird automatisch vergeben, im Kundenportal sichtbar.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-6"><Loader2 className="w-4 h-4 animate-spin" /> Lade Rechnungen...</div>
      ) : invoices.length === 0 ? (
        <div className="bg-muted/40 rounded-2xl border border-dashed border-border py-8 text-center">
          <p className="text-sm text-muted-foreground">Noch keine Rechnungen vorhanden.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Nr.</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Datum</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Fällig</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground text-right">Betrag</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground">PDF</th>
                  <th className="p-3.5 font-semibold text-xs uppercase tracking-wide text-muted-foreground text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => {
                  const isEditing = editingId === inv.id;
                  return (
                    <tr key={inv.id} className={isEditing ? "bg-accent/[0.03] align-top" : "hover:bg-gray-50/60 align-top transition-colors"}>
                      {isEditing ? (
                        <>
                          <td className="p-2.5"><Input value={editForm.invoiceNumber} onChange={(e) => setEditForm((f) => ({ ...f, invoiceNumber: e.target.value }))} className="h-9 w-28" /></td>
                          <td className="p-2.5"><Input type="date" value={editForm.invoiceDate} onChange={(e) => setEditForm((f) => ({ ...f, invoiceDate: e.target.value }))} className="h-9 w-36" /></td>
                          <td className="p-2.5"><Input type="date" value={editForm.dueDate} onChange={(e) => setEditForm((f) => ({ ...f, dueDate: e.target.value }))} className="h-9 w-36" /></td>
                          <td className="p-2.5"><Input value={editForm.amount} onChange={(e) => setEditForm((f) => ({ ...f, amount: e.target.value }))} className="h-9 w-24 text-right" placeholder="optional" /></td>
                          <td className="p-2.5">
                            <Select value={editForm.status} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}>
                              <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>{STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                            </Select>
                          </td>
                          <td className="p-2.5 text-muted-foreground">—</td>
                          <td className="p-2.5 text-right whitespace-nowrap">
                            <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)} className="mr-1.5">Abbrechen</Button>
                            <Button type="button" size="sm" onClick={() => handleSaveEdit(inv)} disabled={updateMut.isPending} className="bg-accent hover:bg-accent/90">Speichern</Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3.5 font-medium whitespace-nowrap">{inv.invoiceNumber}</td>
                          <td className="p-3.5 whitespace-nowrap">{formatDate(inv.invoiceDate)}</td>
                          <td className="p-3.5 whitespace-nowrap text-muted-foreground">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                          <td className="p-3.5 text-right font-medium tabular-nums whitespace-nowrap">{formatAmount(inv.amount, inv.currency)}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLASS[inv.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {statusLabel(inv.status)}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              ref={(el) => { fileInputs.current[inv.id] = el; }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePdfSelected(inv, file);
                                e.target.value = "";
                              }}
                            />
                            {uploadingId === inv.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            ) : inv.pdfFileReference ? (
                              <a href={inv.pdfFileReference} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline text-xs font-medium">
                                <FileText className="w-3.5 h-3.5" /> Ansehen
                              </a>
                            ) : (
                              <button type="button" onClick={() => fileInputs.current[inv.id]?.click()} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs">
                                <Upload className="w-3.5 h-3.5" /> Hochladen
                              </button>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                            <Button type="button" size="sm" variant="outline" onClick={() => startEdit(inv)}><Edit2 className="w-3.5 h-3.5" /></Button>
                            <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(inv)} disabled={deleteMut.isPending}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {editError && <p className="text-xs text-destructive">{editError}</p>}

      <div className="bg-gray-50/70 rounded-2xl border border-border p-4">
        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><FileUp className="w-3.5 h-3.5 text-accent" /> Rechnung hochladen</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Jahr</Label>
            <Select value={uploadYear} onValueChange={setUploadYear}>
              <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>{YEAR_OPTIONS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Rechnungsdatum</Label>
            <Input type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} className="h-9 bg-white" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Fälligkeitsdatum</Label>
            <Input type="date" value={uploadDueDate} onChange={(e) => setUploadDueDate(e.target.value)} className="h-9 bg-white" placeholder="optional" />
          </div>
        </div>
        <div className="mt-3">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={newInvoiceFileInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadNewInvoice(file);
              e.target.value = "";
            }}
          />
          <Button type="button" onClick={() => newInvoiceFileInput.current?.click()} disabled={uploading} className="bg-accent hover:bg-accent/90">
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileUp className="w-4 h-4 mr-2" />}
            PDF auswählen & hochladen
          </Button>
        </div>
        {uploadError && <p className="text-xs text-destructive mt-2">{uploadError}</p>}
      </div>
    </div>
  );
}
