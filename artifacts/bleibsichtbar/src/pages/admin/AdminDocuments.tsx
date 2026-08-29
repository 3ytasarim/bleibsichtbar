import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DocumentsSection } from "@/components/admin/DocumentsSection";
import { CustomerCombobox } from "@/components/admin/CustomerCombobox";
import { Label } from "@/components/ui/label";
import { useGetCustomers } from "@workspace/api-client-react";
import { FileStack, Users } from "lucide-react";

export default function AdminDocuments() {
  const { data: customers = [], isLoading } = useGetCustomers();
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedCustomer = customers.find((c) => c.id.toString() === selectedId);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <FileStack className="w-7 h-7 text-accent" /> Dokumente
        </h1>
        <p className="text-muted-foreground">Onboarding-Briefings, Strategien & Markeninformationen je Kunde hochladen.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-6">
        <div className="max-w-sm">
          <Label className="mb-1.5 block">Kunde</Label>
          <CustomerCombobox customers={customers} value={selectedId} onChange={setSelectedId} isLoading={isLoading} />
        </div>

        {selectedCustomer ? (
          <div className="pt-6 border-t border-border">
            <DocumentsSection customerId={selectedCustomer.id} />
          </div>
        ) : (
          <div className="pt-6 border-t border-border">
            <div className="bg-muted/40 rounded-2xl border border-dashed border-border py-12 text-center">
              <Users className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">Bitte oben einen Kunden auswählen, um Dokumente anzuzeigen.</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
