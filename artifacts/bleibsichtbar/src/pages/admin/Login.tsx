import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useLogin, useGetMe, getGetMeQueryKey, useGetCustomerMe, getGetCustomerMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LightTrustBackground } from "@/components/shared/LightTrustBackground";

const loginSchema = z.object({
  username: z.string().min(1, "Benutzername erforderlich"),
  password: z.string().min(1, "Passwort erforderlich"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const queryClient = useQueryClient();
  const { data: adminUser, isLoading: adminLoading } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const { data: customer, isLoading: customerLoading } = useGetCustomerMe({ query: { retry: false, queryKey: getGetCustomerMeQueryKey() } });

  const { mutate, isPending, error } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const checking = adminLoading || customerLoading;

  // Redirect if already logged in — as whichever role
  React.useEffect(() => {
    if (checking) return;
    if (adminUser) setLocation("/admin");
    else if (customer) setLocation("/dashboard");
  }, [adminUser, customer, checking, setLocation]);

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    mutate({ data }, {
      onSuccess: (response) => {
        // Store token for iframe-compatible auth fallback (admin only)
        const token = (response as any)?.token;
        if (token) {
          localStorage.setItem("bs_auth_token", token);
        } else {
          localStorage.removeItem("bs_auth_token");
        }

        // Drop (not just invalidate) so the next page's fresh mount doesn't
        // race an in-flight request cancelled by this component unmounting.
        if (response.role === "customer") {
          queryClient.removeQueries({ queryKey: ["/api/customer-auth/me"] });
          setLocation("/dashboard");
        } else {
          queryClient.removeQueries({ queryKey: ["/api/auth/me"] });
          setLocation("/admin");
        }
      }
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 bg-slate-50">
      <LightTrustBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="text-center mb-8">
          <span className="font-display font-black text-[22px] tracking-[0.18em] uppercase text-slate-900">
            Bleibsichtbar
          </span>
          <p className="text-slate-500 mt-3 text-sm">Willkommen zurück bei Bleibsichtbar.</p>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Benutzername</label>
            <input
              {...register("username")}
              className={`w-full px-4 py-2.5 rounded-xl text-slate-900 bg-slate-50 outline-none transition-colors border ${errors.username ? "border-red-400" : "border-slate-200"} focus:border-sky-500`}
            />
            {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Passwort</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2.5 pr-11 rounded-xl text-slate-900 bg-slate-50 outline-none transition-colors border ${errors.password ? "border-red-400" : "border-slate-200"} focus:border-sky-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-200">
              Ungültige Zugangsdaten
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)",
              boxShadow: "0 8px 24px rgba(14,165,233,0.28)",
            }}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Einloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
