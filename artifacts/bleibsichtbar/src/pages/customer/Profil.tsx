import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetCustomerMe, getGetCustomerMeQueryKey } from "@workspace/api-client-react";
import { UserRound } from "lucide-react";

export default function CustomerProfil() {
  const { data: customer } = useGetCustomerMe({ query: { retry: false, queryKey: getGetCustomerMeQueryKey() } });

  return (
    <CustomerPortalLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <UserRound className="w-7 h-7 text-accent" /> Profil
        </h1>
        <p className="text-muted-foreground mt-2">Ihre Kontodaten.</p>

        <div className="mt-8 bg-card rounded-2xl border border-border divide-y divide-border">
          <div className="p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Firmenname</p>
            <p className="mt-1 font-medium">{customer?.companyName}</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Benutzername</p>
            <p className="mt-1 font-medium">{customer?.username}</p>
          </div>
        </div>
      </div>
    </CustomerPortalLayout>
  );
}
