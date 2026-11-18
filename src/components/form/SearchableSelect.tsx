"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { narrowOptions } from "@/lib/filter-options";

export type SearchableOption = {
  value: string;
  label: string;
  /** Shown under the label: a role, an office, a workload. */
  detail?: string;
  disabled?: boolean;
};

/**
 * One control for picking one of many, with its own search.
 *
 * Picking a lawyer took two controls: a "Search recipient" box above a plain
 * dropdown, which only narrowed the list underneath it, and a search matching
 * nothing left an empty dropdown saying nothing at all (QA 2026-11-16,
 * row 68).
 *
 * The search is passed up rather than done here, because the list it narrows
 * comes from the API a page at a time.
 */
export default function SearchableSelect({
  label,
  placeholder = "Choose one",
  value,
  options,
  onChange,
  query,
  onQueryChange,
  searchPlaceholder = "Search by name",
  loading = false,
  emptyMessage = "Nothing matches that search.",
  disabled = false,
  searchable = true,
  hideLabel = false,
  className = "",
}: {
  label: string;
  placeholder?: string;
  value: string;
  options: SearchableOption[];
  onChange: (value: string) => void;
  /** Given together with onQueryChange when the list is searched on the server. */
  query?: string;
  onQueryChange?: (query: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  disabled?: boolean;
  /** A short list needs no search box, only the app's own styling. */
  searchable?: boolean;
  /** The label is read by screen readers but not drawn: for a row of filters. */
  hideLabel?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  // Searched here when the whole list is already loaded, and passed up when the
  // API pages it.
  const [typed, setTyped] = useState("");
  const serverSearched = typeof onQueryChange === "function";
  const search = serverSearched ? (query ?? "") : typed;
  const setSearch = serverSearched ? onQueryChange! : setTyped;
  const shown = serverSearched ? options : narrowOptions(options, typed);
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();
  const chosen = options.find(option => option.value === value);

  // Clicking away or pressing Escape closes it, like any other dropdown.
  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent) => {
      if (box.current && !box.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div className="space-y-1" ref={box}>
      <span className={hideLabel ? "sr-only" : "text-sm font-medium"}>{label}</span>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen(!open)}
          className={`flex h-11 w-full items-center justify-between gap-2 rounded border px-3 text-left disabled:opacity-50 ${className}`}
        >
          <span className={chosen ? "" : "text-gray-500"}>{chosen ? chosen.label : placeholder}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded border bg-white shadow-lg">
            {searchable && <div className="relative border-b p-2">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <Input
                autoFocus
                value={search}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-8"
                onChange={event => setSearch(event.target.value)}
              />
            </div>}
            <ul id={listId} role="listbox" className="max-h-60 overflow-y-auto py-1">
              {loading && <li role="status" className="px-3 py-2 text-sm text-gray-500">Loading…</li>}
              {!loading && shown.length === 0 && (
                <li className="px-3 py-2 text-sm text-gray-500">{emptyMessage}</li>
              )}
              {!loading && shown.map(option => (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    disabled={option.disabled}
                    onClick={() => { onChange(option.value); setOpen(false); }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50 ${option.value === value ? "bg-gray-50 font-medium" : ""}`}
                  >
                    {option.label}
                    {option.detail && <span className="block text-xs text-gray-500">{option.detail}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
