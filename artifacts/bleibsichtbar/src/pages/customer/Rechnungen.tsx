import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetPortalInvoices, type Invoice } from "@workspace/api-client-react";
import { Receipt, Loader2, FileDown } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  open: { label: "Offen", className: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400" },
  paid: { label: "Bezahlt", className: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400" },
  overdue: { label: "Überfällig", className: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400" },
  cancelled: { label: "Storniert", className: "bg-muted text-muted-foreground" },
};

function formatAmount(amount: string | null | undefined, currency: string) {
  if (amount == null) return "—";
  const value = Number(amount);
  return `${value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency === "EUR" ? "€" : currency}`;
}

export default function CustomerRechnungen() {
  const { data: invoices = [], isLoading, isError } = useGetPortalInvoices();

  return (
    <CustomerPortalLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <Receipt className="w-7 h-7 text-accent" /> Rechnungen & Zahlungen
        </h1>
        <p className="text-muted-foreground mt-2">Übersicht Ihrer Rechnungen.</p>

        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Rechnungen...
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="font-medium text-destructive">Rechnungen konnten nicht geladen werden.</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-16">
              <Receipt className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Keine Rechnungen vorhanden.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-4 font-semibold text-sm">Rechnung</th>
                    <th className="p-4 font-semibold text-sm">Datum</th>
                    <th className="p-4 font-semibold text-sm">Betrag</th>
                    <th className="p-4 font-semibold text-sm">Status</th>
                    <th className="p-4 font-semibold text-sm">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((invoice: Invoice) => {
                    const status = STATUS_LABELS[invoice.status] || { label: invoice.status, className: "bg-muted text-muted-foreground" };
                    return (
                      <tr key={invoice.id} className="hover:bg-muted/40">
                        <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(invoice.invoiceDate).toLocaleDateString("de-DE")}
                        </td>
                        <td className="p-4 font-medium">{formatAmount(invoice.amount, invoice.currency)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4">
                          {invoice.pdfFileReference ? (
                            <a
                              href={invoice.pdfFileReference}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm font-medium"
                            >
                              <FileDown className="w-4 h-4" /> Herunterladen
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CustomerPortalLayout>
  );
}
