import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Customer } from "@workspace/api-client-react";

interface CustomerComboboxProps {
  customers: Customer[];
  value: string;
  onChange: (id: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * Searchable customer picker — swaps in for a plain <Select> once the
 * customer list grows past a handful of entries. Filters by company name
 * as you type; still resolves to the same string customer id downstream.
 */
export function CustomerCombobox({ customers, value, onChange, isLoading, placeholder = "Kunde auswählen..." }: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = customers.find((c) => c.id.toString() === value);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground h-10">
        <Loader2 className="w-4 h-4 animate-spin" /> Lade Kunden...
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.companyName : placeholder}
          </span>
          <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Kunde suchen..." />
          <CommandList>
            <CommandEmpty>Kein Kunde gefunden.</CommandEmpty>
            <CommandGroup>
              {customers.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.companyName}
                  onSelect={() => {
                    onChange(c.id.toString());
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 w-4 h-4", value === c.id.toString() ? "opacity-100" : "opacity-0")} />
                  {c.companyName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
