import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminLogin, useGetMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  username: z.string().min(1, "Benutzername erforderlich"),
  password: z.string().min(1, "Passwort erforderlich"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useGetMe({ query: { retry: false } });
  
  const { mutate, isPending, error } = useAdminLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && !userLoading) {
      setLocation("/admin");
    }
  }, [user, userLoading, setLocation]);

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation("/admin");
      }
    });
  };

  if (userLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-border">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-display font-bold text-2xl mx-auto mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold font-display">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Willkommen zurück bei Bleibsichtbar.</p>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Benutzername</label>
            <Input {...register("username")} placeholder="admin" className={errors.username ? "border-destructive" : ""} />
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Passwort</label>
            <Input {...register("password")} type="password" placeholder="••••••••" className={errors.password ? "border-destructive" : ""} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
              Ungültige Zugangsdaten
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Einloggen"}
          </Button>
        </form>
      </div>
    </div>
  );
}
