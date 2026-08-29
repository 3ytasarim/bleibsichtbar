import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { InvoicesSection } from "@/components/admin/InvoicesSection";
import { CustomerCombobox } from "@/components/admin/CustomerCombobox";
import { Label } from "@/components/ui/label";
import { useGetCustomers } from "@workspace/api-client-react";
import { Receipt, Users } from "lucide-react";

export default function AdminInvoices() {
  const { data: customers = [], isLoading } = useGetCustomers();
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedCustomer = customers.find((c) => c.id.toString() === selectedId);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Receipt className="w-7 h-7 text-accent" /> Rechnungen
        </h1>
        <p className="text-muted-foreground">Rechnungen je Kunde anlegen und als PDF hochladen.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-6">
        <div className="max-w-sm">
          <Label className="mb-1.5 block">Kunde</Label>
          <CustomerCombobox customers={customers} value={selectedId} onChange={setSelectedId} isLoading={isLoading} />
        </div>

        {selectedCustomer ? (
          <div className="pt-6 border-t border-border">
            <InvoicesSection customerId={selectedCustomer.id} />
          </div>
        ) : (
          <div className="pt-6 border-t border-border">
            <div className="bg-muted/40 rounded-2xl border border-dashed border-border py-12 text-center">
              <Users className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Bitte oben einen Kunden auswählen, um Rechnungen anzuzeigen.</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
