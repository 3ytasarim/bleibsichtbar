import { lazy, Suspense } from "react";
import { useGetCustomerMe, getGetCustomerMeQueryKey } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";

const CustomerDashboard = lazy(() => import("./Dashboard"));
const CustomerDashboardKI = lazy(() => import("./DashboardKI"));

function FullscreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

/**
 * `/dashboard` fans out to a different page depending on the logged-in
 * customer's `serviceTypes`:
 *  - "social_media" present (alone or combined with anything) → the
 *    existing Instagram-centric CustomerDashboard.
 *  - only "ki_automatisierungen" (no social_media) → CustomerDashboardKI.
 *  - only "website" (no social_media, no ki) → falls back to
 *    CustomerDashboard for now; its own dashboard is a later task.
 * CustomerPortalLayout (used by both target pages) still owns the
 * authenticated-customer redirect-to-login, so this stays a thin dispatcher.
 */
export default function CustomerDashboardRouter() {
  const { data: customer, isLoading } = useGetCustomerMe({ query: { retry: false, queryKey: getGetCustomerMeQueryKey() } });

  if (isLoading) return <FullscreenSpinner />;

  const types = customer?.serviceTypes ?? ["social_media"];
  const isKiOnly = types.includes("ki_automatisierungen") && !types.includes("social_media");

  return (
    <Suspense fallback={<FullscreenSpinner />}>
      {isKiOnly ? <CustomerDashboardKI /> : <CustomerDashboard />}
    </Suspense>
  );
}
