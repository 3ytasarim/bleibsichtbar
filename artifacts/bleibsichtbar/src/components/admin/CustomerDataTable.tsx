import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit2, Trash2 } from "lucide-react";
import type { Customer } from "@workspace/api-client-react";

export type CustomerSortKey =
  | "companyName"
  | "contactPerson"
  | "email"
  | "startDate"
  | "status"
  | "instagramUsername"
  | "bufferChannelName";

interface CustomerDataTableProps {
  customers: Customer[];
  sortKey: CustomerSortKey;
  sortDir: "asc" | "desc";
  onSort: (key: CustomerSortKey) => void;
  onRowClick: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  togglePending?: boolean;
}

const statusBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-75",
  {
    variants: {
      variant: {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
      },
    },
    defaultVariants: { variant: "active" },
  }
);

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "?";
}

function SortableHead({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  column: CustomerSortKey;
  sortKey: CustomerSortKey;
  sortDir: "asc" | "desc";
  onSort: (key: CustomerSortKey) => void;
  className?: string;
}) {
  const active = sortKey === column;
  return (
    <TableHead className={cn("p-4 font-semibold text-sm select-none", className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 hover:text-accent transition-colors"
      >
        {label}
        {active ? (
          sortDir === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/40" />
        )}
      </button>
    </TableHead>
  );
}

// Rows fade + slide in with a short stagger — capped so a long list doesn't
// keep animating for seconds after the page settles.
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i, 12) * 0.035, duration: 0.25, ease: "easeOut" as const },
  }),
};

/**
 * Animated, sortable customer table — adapted from a 21st.dev "project data
 * table" registry component to this app's real Customer model. Sorting/
 * filtering state itself stays owned by the parent page (AdminUsers), which
 * also renders the search box above; this component is the presentational
 * table + row-level actions.
 */
export function CustomerDataTable({
  customers,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  onToggleStatus,
  onDelete,
  togglePending,
}: CustomerDataTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <SortableHead label="Firmenname" column="companyName" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Ansprechpartner" column="contactPerson" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="E-Mail" column="email" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Startdatum" column="startDate" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Status" column="status" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Instagram" column="instagramUsername" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <SortableHead label="Buffer-Kanal" column="bufferChannelName" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
            <TableHead className="p-4 font-semibold text-sm">QuickBooks</TableHead>
            <TableHead className="p-4 font-semibold text-sm text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length > 0 ? (
            customers.map((c, index) => (
              <motion.tr
                key={c.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                onClick={() => onRowClick(c)}
                className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-muted cursor-pointer"
              >
                <TableCell className="p-4 font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-border shrink-0">
                      <AvatarFallback className="text-xs bg-accent/10 text-accent">{initials(c.companyName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      {c.companyName}
                      <div className="text-xs font-normal text-muted-foreground">{c.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-4 text-muted-foreground">{c.contactPerson || "—"}</TableCell>
                <TableCell className="p-4 text-muted-foreground">{c.email || "—"}</TableCell>
                <TableCell className="p-4 text-muted-foreground whitespace-nowrap">
                  {c.startDate
                    ? new Date(c.startDate).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                    : "—"}
                </TableCell>
                <TableCell className="p-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(c);
                    }}
                    disabled={togglePending}
                    title="Status umschalten"
                    className={cn(statusBadgeVariants({ variant: c.status === "active" ? "active" : "inactive" }))}
                  >
                    {c.status === "active" ? "Aktiv" : "Inaktiv"}
                  </button>
                </TableCell>
                <TableCell className="p-4 text-muted-foreground">
                  {c.instagramUsername ? `@${c.instagramUsername}` : "—"}
                </TableCell>
                <TableCell className="p-4 text-muted-foreground">{c.bufferChannelName || "—"}</TableCell>
                <TableCell className="p-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      c.quickbooksId ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {c.quickbooksId ? "Verbunden" : "Nicht verbunden"}
                  </span>
                </TableCell>
                <TableCell className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onRowClick(c)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(c)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                Kein Kunde gefunden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
