import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Loader2, Instagram, UserPlus, HardDrive, CalendarDays, Search, Users, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CustomerDataTable, type CustomerSortKey } from "@/components/admin/CustomerDataTable";
import {
  useGetCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useTestInstagramConnection,
  useGetBufferChannels,
  type InstagramTestResult,
  type Customer,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type SortKey = CustomerSortKey;

/**
 * Which service(s) a customer is booked for — decides which dashboard
 * variant they land on after login. "social_media" (alone or combined with
 * anything) → the existing Instagram-centric dashboard; "website"-only is a
 * placeholder for now; "ki_automatisierungen"-only gets its own dashboard.
 */
const SERVICE_TYPE_OPTIONS = [
  { value: "social_media", label: "Social Media" },
  { value: "website", label: "Website" },
  { value: "ki_automatisierungen", label: "KI & Automatisierungen" },
] as const;

function ServiceTypesField({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const toggle = (v: string) => {
    if (value.includes(v)) {
      const next = value.filter((x) => x !== v);
      onChange(next.length > 0 ? next : [v]); // keep at least one selected
    } else {
      onChange([...value, v]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {SERVICE_TYPE_OPTIONS.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
              active ? "bg-accent text-white border-accent" : "bg-white text-muted-foreground border-border hover:border-accent/40"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const customerSchema = z.object({
  companyName: z.string().min(1, "Firmenname erforderlich"),
  username: z.string().min(1, "Benutzername erforderlich"),
  password: z.string().min(6, "Mindestens 6 Zeichen"),
  passwordConfirm: z.string().min(1, "Passwort bestätigen erforderlich"),
  status: z.enum(["active", "inactive"]),
  contactPerson: z.string().optional(),
  email: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.literal("")),
  phone: z.string().optional(),
  startDate: z.string().optional(),
  quickbooksId: z.string().optional(),
  crmId: z.string().optional(),
  instagramAccountId: z.string().optional(),
  instagramUsername: z.string().optional(),
  facebookPageId: z.string().optional(),
  metaAccessToken: z.string().optional(),
  nextcloudShareLink: z.string().optional(),
  bufferChannelName: z.string().optional(),
  serviceTypes: z.array(z.string()).min(1, "Mindestens ein Bereich erforderlich"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

type FormValues = z.infer<typeof customerSchema>;

const editSchema = z.object({
  companyName: z.string().min(1, "Firmenname erforderlich"),
  username: z.string().min(1, "Benutzername erforderlich"),
  password: z.string().min(6, "Mindestens 6 Zeichen").optional().or(z.literal("")),
  passwordConfirm: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
  contactPerson: z.string().optional(),
  email: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.literal("")),
  phone: z.string().optional(),
  startDate: z.string().optional(),
  quickbooksId: z.string().optional(),
  crmId: z.string().optional(),
  instagramAccountId: z.string().optional(),
  instagramUsername: z.string().optional(),
  facebookPageId: z.string().optional(),
  metaAccessToken: z.string().optional(),
  nextcloudShareLink: z.string().optional(),
  bufferChannelName: z.string().optional(),
  serviceTypes: z.array(z.string()).min(1, "Mindestens ein Bereich erforderlich"),
}).refine((data) => !data.password || data.password === data.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

type EditFormValues = z.infer<typeof editSchema>;

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data: customers = [], isLoading } = useGetCustomers();
  const createMut = useCreateCustomer();
  const updateMut = useUpdateCustomer();
  const deleteMut = useDeleteCustomer();
  const testMut = useTestInstagramConnection();
  const { data: bufferChannels = [] } = useGetBufferChannels();
  const [testResult, setTestResult] = useState<InstagramTestResult | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editTestResult, setEditTestResult] = useState<InstagramTestResult | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("companyName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [c.companyName, c.username, c.contactPerson, c.email, c.instagramUsername, c.bufferChannelName]
      .some((v) => v?.toLowerCase().includes(q));
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const av = (a[sortKey] ?? "") as string;
    const bv = (b[sortKey] ?? "") as string;
    const cmp = String(av).localeCompare(String(bv), "de");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const invalidateCustomers = () => queryClient.invalidateQueries({ queryKey: ["/api/customers"] });

  const { register, handleSubmit, reset, getValues, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { status: "active", serviceTypes: ["social_media"] },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
  });

  const handleTestConnection = () => {
    const { instagramAccountId, metaAccessToken } = getValues();
    if (!instagramAccountId || !metaAccessToken) {
      setTestResult({ success: false, error: "Instagram Professional Account ID und Meta Access Token angeben" });
      return;
    }
    setTestResult(null);
    testMut.mutate(
      { data: { instagramAccountId, metaAccessToken } },
      {
        onSuccess: (result) => {
          setTestResult(result);
          if (result.username) setValue("instagramUsername", result.username);
        },
        onError: (err: any) => {
          setTestResult(err?.data ?? { success: false, error: "Instagram-Verbindung fehlgeschlagen" });
        },
      }
    );
  };

  const handleEditTestConnection = () => {
    const { instagramAccountId, metaAccessToken } = editForm.getValues();
    if (!instagramAccountId || !metaAccessToken) {
      setEditTestResult({ success: false, error: "Instagram Professional Account ID und Meta Access Token angeben" });
      return;
    }
    setEditTestResult(null);
    testMut.mutate(
      { data: { instagramAccountId, metaAccessToken } },
      {
        onSuccess: (result) => {
          setEditTestResult(result);
          if (result.username) editForm.setValue("instagramUsername", result.username);
        },
        onError: (err: any) => {
          setEditTestResult(err?.data ?? { success: false, error: "Instagram-Verbindung fehlgeschlagen" });
        },
      }
    );
  };

  const onSubmit = (data: FormValues) => {
    setCreateError(null);
    createMut.mutate(
      { data },
      {
        onSuccess: () => {
          invalidateCustomers();
          reset({ companyName: "", username: "", password: "", passwordConfirm: "", status: "active", contactPerson: "", email: "", phone: "", startDate: "", quickbooksId: "", crmId: "", instagramAccountId: "", instagramUsername: "", facebookPageId: "", metaAccessToken: "", nextcloudShareLink: "", bufferChannelName: "", serviceTypes: ["social_media"] });
          setTestResult(null);
        },
        onError: (err: any) => {
          setCreateError(err?.data?.message || "Kunde konnte nicht erstellt werden");
        },
      }
    );
  };

  const openEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditTestResult(null);
    setEditError(null);
    editForm.reset({
      companyName: customer.companyName,
      username: customer.username,
      password: "",
      passwordConfirm: "",
      status: customer.status as "active" | "inactive",
      contactPerson: customer.contactPerson || "",
      email: customer.email || "",
      phone: customer.phone || "",
      startDate: customer.startDate ? new Date(customer.startDate).toISOString().slice(0, 10) : "",
      quickbooksId: customer.quickbooksId || "",
      crmId: customer.crmId || "",
      instagramAccountId: customer.instagramAccountId || "",
      instagramUsername: customer.instagramUsername || "",
      facebookPageId: customer.facebookPageId || "",
      metaAccessToken: "",
      nextcloudShareLink: customer.nextcloudShareLink || "",
      bufferChannelName: customer.bufferChannelName || "",
      serviceTypes: customer.serviceTypes && customer.serviceTypes.length > 0 ? customer.serviceTypes : ["social_media"],
    });
  };

  const onEditSubmit = (data: EditFormValues) => {
    if (!editingCustomer) return;
    setEditError(null);
    const payload: Record<string, unknown> = {
      companyName: data.companyName,
      username: data.username,
      status: data.status,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      startDate: data.startDate || null,
      quickbooksId: data.quickbooksId,
      crmId: data.crmId,
      instagramAccountId: data.instagramAccountId,
      instagramUsername: data.instagramUsername,
      facebookPageId: data.facebookPageId,
      nextcloudShareLink: data.nextcloudShareLink,
      bufferChannelName: data.bufferChannelName,
      serviceTypes: data.serviceTypes,
    };
    if (data.password) {
      payload.password = data.password;
      payload.passwordConfirm = data.passwordConfirm;
    }
    if (data.metaAccessToken) {
      payload.metaAccessToken = data.metaAccessToken;
    }

    updateMut.mutate(
      { id: editingCustomer.id, data: payload as any },
      {
        onSuccess: () => {
          invalidateCustomers();
          setEditingCustomer(null);
        },
        onError: (err: any) => {
          setEditError(err?.data?.message || "Kunde konnte nicht aktualisiert werden");
        },
      }
    );
  };

  const handleToggleStatus = (customer: Customer) => {
    const nextStatus = customer.status === "active" ? "inactive" : "active";
    updateMut.mutate(
      { id: customer.id, data: { status: nextStatus } as any },
      { onSuccess: () => invalidateCustomers() }
    );
  };

  const handleDelete = (customer: Customer) => {
    if (confirm(`"${customer.companyName}" wirklich löschen?`)) {
      deleteMut.mutate({ id: customer.id }, { onSuccess: () => invalidateCustomers() });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <UserPlus className="w-7 h-7 text-accent" /> Kunden
        </h1>
        <p className="text-muted-foreground">Kunden-Accounts verwalten und neue Kunden anlegen.</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list"><Users className="w-4 h-4 mr-1.5" /> Kunden-Übersicht</TabsTrigger>
          <TabsTrigger value="create"><UserPlus className="w-4 h-4 mr-1.5" /> Neuer Kunde</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg font-display">Kundendaten</h2>

          <div>
            <Label className="mb-1.5 block">Firmenname</Label>
            <Input {...register("companyName")} className={errors.companyName ? "border-destructive" : ""} />
            {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName.message}</p>}
          </div>

          <div>
            <Label className="mb-1.5 block">Benutzername</Label>
            <Input {...register("username")} className={errors.username ? "border-destructive" : ""} />
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Ansprechpartner</Label>
              <Input {...register("contactPerson")} placeholder="Name des Ansprechpartners" />
            </div>
            <div>
              <Label className="mb-1.5 block">E-Mail</Label>
              <Input type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Telefon</Label>
              <Input {...register("phone")} placeholder="+49 ..." />
            </div>
            <div>
              <Label className="mb-1.5 block">Startdatum</Label>
              <Input type="date" {...register("startDate")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">QuickBooks ID</Label>
              <Input {...register("quickbooksId")} placeholder="optional" />
            </div>
            <div>
              <Label className="mb-1.5 block">CRM ID</Label>
              <Input {...register("crmId")} placeholder="optional" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Passwort</Label>
              <Input type="password" {...register("password")} className={errors.password ? "border-destructive" : ""} />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label className="mb-1.5 block">Passwort bestätigen</Label>
              <Input type="password" {...register("passwordConfirm")} className={errors.passwordConfirm ? "border-destructive" : ""} />
              {errors.passwordConfirm && <p className="text-xs text-destructive mt-1">{errors.passwordConfirm.message}</p>}
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block">Status</Label>
            <Select defaultValue="active" onValueChange={(v) => setValue("status", v as "active" | "inactive")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Bereich</Label>
            <ServiceTypesField value={watch("serviceTypes") || ["social_media"]} onChange={(v) => setValue("serviceTypes", v)} />
            {errors.serviceTypes && <p className="text-xs text-destructive mt-1">{errors.serviceTypes.message}</p>}
            <p className="text-xs text-muted-foreground mt-1.5">Bestimmt, welches Dashboard der Kunde nach dem Login sieht.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg font-display flex items-center gap-2">
            <Instagram className="w-5 h-5 text-accent" /> Instagram / Meta API
          </h2>

          <div>
            <Label className="mb-1.5 block">Instagram Professional Account ID</Label>
            <Input {...register("instagramAccountId")} placeholder="17841400000000000" />
          </div>

          <div>
            <Label className="mb-1.5 block">Meta Access Token</Label>
            <Input type="password" {...register("metaAccessToken")} placeholder="EAAG..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Facebook Page ID (optional)</Label>
              <Input {...register("facebookPageId")} />
            </div>
            <div>
              <Label className="mb-1.5 block">Instagram Username</Label>
              <Input {...register("instagramUsername")} placeholder="wird beim Test ausgefüllt" />
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleTestConnection} disabled={testMut.isPending}>
            {testMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Instagram className="w-4 h-4 mr-2" />}
            Instagram-Verbindung testen
          </Button>

          {testResult && (
            <div className={`p-4 rounded-xl text-sm ${testResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
              {testResult.success ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Instagram-Verbindung erfolgreich</p>
                    <p>@{testResult.username}</p>
                    <p>Follower: {testResult.followers?.toLocaleString("de-DE")}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <p>{testResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg font-display flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-accent" /> Dateispeicher / Nextcloud
          </h2>

          <div>
            <Label className="mb-1.5 block">Nextcloud-Freigabelink</Label>
            <Input {...register("nextcloudShareLink")} placeholder="https://speicher.bleibsichtbar.com/s/..." />
            <p className="text-xs text-muted-foreground mt-1.5">Öffentlicher Nextcloud-Freigabelink für diesen Kunden — leer lassen, um den Dateibereich zu deaktivieren.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <h2 className="font-semibold text-lg font-display flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-accent" /> Content Calendar / Buffer
          </h2>
          <div>
            <Label className="mb-1.5 block">Buffer-Kanal</Label>
            <Select value={watch("bufferChannelName") || ""} onValueChange={(v) => setValue("bufferChannelName", v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Kanal auswählen..." /></SelectTrigger>
              <SelectContent>
                {bufferChannels.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.displayName} (@{c.name}) — {c.service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">Verbundener Buffer-Kanal dieses Kunden — steuert, wohin Content-Calendar-Beiträge veröffentlicht werden.</p>
          </div>
        </div>
        </div>
        </div>

        {createError && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
            {createError}
          </div>
        )}

        <Button type="submit" size="lg" disabled={createMut.isPending} className="bg-accent hover:bg-accent/90">
          {createMut.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
          Kunde erstellen
        </Button>
      </form>
        </TabsContent>

        <TabsContent value="list">
          <div className="relative max-w-sm mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Firma, Benutzername, E-Mail..."
              className="pl-9 bg-white"
            />
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center text-muted-foreground">Lade Kunden...</div>
          ) : customers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center text-muted-foreground">Noch keine Kunden angelegt.</div>
          ) : sortedCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center text-muted-foreground">Kein Kunde gefunden für "{search}".</div>
          ) : (
            <CustomerDataTable
              customers={sortedCustomers}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
              onRowClick={openEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              togglePending={updateMut.isPending}
            />
          )}
        </TabsContent>
      </Tabs>

      <SimpleModal
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        title={`Kunde bearbeiten: ${editingCustomer?.companyName ?? ""}`}
        widthClassName="max-w-6xl"
      >
        <form noValidate onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-display">Kundendaten</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Firmenname</Label>
                  <Input {...editForm.register("companyName")} className={editForm.formState.errors.companyName ? "border-destructive" : ""} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Benutzername</Label>
                  <Input {...editForm.register("username")} className={editForm.formState.errors.username ? "border-destructive" : ""} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Ansprechpartner</Label>
                  <Input {...editForm.register("contactPerson")} />
                </div>
                <div>
                  <Label className="mb-1.5 block">E-Mail</Label>
                  <Input type="email" {...editForm.register("email")} className={editForm.formState.errors.email ? "border-destructive" : ""} />
                  {editForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{editForm.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Telefon</Label>
                  <Input {...editForm.register("phone")} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Startdatum</Label>
                  <Input type="date" {...editForm.register("startDate")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">QuickBooks ID</Label>
                  <Input {...editForm.register("quickbooksId")} placeholder="optional" />
                </div>
                <div>
                  <Label className="mb-1.5 block">CRM ID</Label>
                  <Input {...editForm.register("crmId")} placeholder="optional" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Neues Passwort (optional)</Label>
                  <Input type="password" {...editForm.register("password")} className={editForm.formState.errors.password ? "border-destructive" : ""} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Passwort bestätigen</Label>
                  <Input type="password" {...editForm.register("passwordConfirm")} className={editForm.formState.errors.passwordConfirm ? "border-destructive" : ""} />
                  {editForm.formState.errors.passwordConfirm && <p className="text-xs text-destructive mt-1">{editForm.formState.errors.passwordConfirm.message}</p>}
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Status</Label>
                <Select value={editForm.watch("status")} onValueChange={(v) => editForm.setValue("status", v as "active" | "inactive")}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktiv</SelectItem>
                    <SelectItem value="inactive">Inaktiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Bereich</Label>
                <ServiceTypesField
                  value={editForm.watch("serviceTypes") || ["social_media"]}
                  onChange={(v) => editForm.setValue("serviceTypes", v)}
                />
                {editForm.formState.errors.serviceTypes && (
                  <p className="text-xs text-destructive mt-1">{editForm.formState.errors.serviceTypes.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Bestimmt, welches Dashboard der Kunde nach dem Login sieht.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-display flex items-center gap-2"><Instagram className="w-5 h-5 text-accent" /> Instagram / Meta API</h3>
              {editingCustomer?.instagramTokenExpiresAt && (
                <p className="text-xs text-muted-foreground -mt-2">
                  Token gültig bis {new Date(editingCustomer.instagramTokenExpiresAt).toLocaleDateString("de-DE")} (wird automatisch verlängert)
                </p>
              )}

              <div>
                <Label className="mb-1.5 block">Instagram Professional Account ID</Label>
                <Input {...editForm.register("instagramAccountId")} />
              </div>
              <div>
                <Label className="mb-1.5 block">Neuer Meta Access Token (optional, leer lassen für unverändert)</Label>
                <Input type="password" {...editForm.register("metaAccessToken")} placeholder="EAAG..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">Facebook Page ID</Label>
                  <Input {...editForm.register("facebookPageId")} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Instagram Username</Label>
                  <Input {...editForm.register("instagramUsername")} />
                </div>
              </div>

              <Button type="button" variant="outline" onClick={handleEditTestConnection} disabled={testMut.isPending}>
                {testMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Instagram className="w-4 h-4 mr-2" />}
                Instagram-Verbindung testen
              </Button>

              {editTestResult && (
                <div className={`p-4 rounded-xl text-sm ${editTestResult.success ? "bg-green-50 text-green-800 border border-green-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                  {editTestResult.success ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-semibold">Instagram-Verbindung erfolgreich</p>
                        <p>@{editTestResult.username}</p>
                        <p>Follower: {editTestResult.followers?.toLocaleString("de-DE")}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 shrink-0" />
                      <p>{editTestResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-display flex items-center gap-2"><HardDrive className="w-5 h-5 text-accent" /> Dateispeicher / Nextcloud</h3>

              <div>
                <Label className="mb-1.5 block">Nextcloud-Freigabelink</Label>
                <Input {...editForm.register("nextcloudShareLink")} placeholder="https://speicher.bleibsichtbar.com/s/..." />
                <p className="text-xs text-muted-foreground mt-1.5">Öffentlicher Nextcloud-Freigabelink für diesen Kunden — leer lassen, um den Dateibereich zu deaktivieren.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg font-display flex items-center gap-2"><CalendarDays className="w-5 h-5 text-accent" /> Content Calendar / Buffer</h3>
              <div>
                <Label className="mb-1.5 block">Buffer-Kanal</Label>
                <Select value={editForm.watch("bufferChannelName") || ""} onValueChange={(v) => editForm.setValue("bufferChannelName", v)}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Kanal auswählen..." /></SelectTrigger>
                  <SelectContent>
                    {bufferChannels.map((c) => (
                      <SelectItem key={c.id} value={c.name}>{c.displayName} (@{c.name}) — {c.service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1.5">Verbundener Buffer-Kanal dieses Kunden — steuert, wohin Content-Calendar-Beiträge veröffentlicht werden.</p>
              </div>
            </div>
          </div>

          {editError && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
              {editError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingCustomer(null)}>Abbrechen</Button>
            <Button type="submit" disabled={updateMut.isPending}>
              {updateMut.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Speichern
            </Button>
          </div>
        </form>
      </SimpleModal>
    </AdminLayout>
  );
}
