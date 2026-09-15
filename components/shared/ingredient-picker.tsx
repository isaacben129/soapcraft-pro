"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { LEGACY_OILS } from "@/lib/calculations/ingredient-dataset";

interface IngredientPickerProps {
  value: string;
  selectedId: string | null;
  rowLabel: string;
  onChange: (value: string, selectedId: string | null) => void;
}

const catalog = LEGACY_OILS.map((ingredient) => ({
  id: ingredient.id,
  name: ingredient.displayName,
  detail: ingredient.subtype === "standard" ? "Standard" : ingredient.subtype,
}));

export function IngredientPicker({ value, selectedId, rowLabel, onChange }: IngredientPickerProps) {
  const inputId = useId();
  const listboxId = `${inputId}-options`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return catalog.slice(0, 8);
    return catalog.filter((ingredient) => ingredient.name.toLowerCase().includes(query)).slice(0, 8);
  }, [value]);

  const choose = (name: string, id: string | null) => {
    onChange(name, id);
    setOpen(false);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(matches.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (matches[activeIndex]) choose(matches[activeIndex].name, matches[activeIndex].id);
      else if (value.trim()) choose(value.trim(), "custom");
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative min-w-0">
      <label htmlFor={inputId} className="sr-only">{rowLabel}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-label={rowLabel}
          aria-controls={listboxId}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-activedescendant={open && matches[activeIndex] ? `${listboxId}-${matches[activeIndex].id}` : undefined}
          placeholder="Search catalog"
          value={value}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onChange={(event) => {
            onChange(event.target.value, null);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="min-h-11 w-full min-w-0 border border-rule bg-sheet px-9 py-2 pr-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-action focus:ring-2 focus:ring-ring/30"
        />
        <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </div>

      {open && (
        <div id={listboxId} role="listbox" aria-label={`${rowLabel} options`} className="absolute z-30 mt-1 max-h-64 w-full overflow-auto border border-rule bg-sheet py-1 shadow-lg">
          {matches.map((ingredient, index) => (
            <button
              key={ingredient.id}
              id={`${listboxId}-${ingredient.id}`}
              type="button"
              role="option"
              aria-selected={selectedId === ingredient.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(ingredient.name, ingredient.id)}
              className={`flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-foreground hover:bg-ledger ${activeIndex === index ? "bg-ledger" : ""}`}
            >
              <span className="min-w-0 truncate">{ingredient.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                {ingredient.detail}
                {selectedId === ingredient.id && <Check className="h-4 w-4 text-action" aria-hidden="true" />}
              </span>
            </button>
          ))}
          {value.trim() && (
            <button
              type="button"
              role="option"
              aria-selected={selectedId === "custom"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(value.trim(), "custom")}
              className="flex min-h-11 w-full items-center border-t border-rule px-3 py-2 text-left text-sm font-semibold text-action hover:bg-ledger"
            >
              Use custom ingredient “{value.trim()}”
            </button>
          )}
          {!matches.length && !value.trim() && <p className="px-3 py-3 text-sm text-muted-foreground">Type to search the catalog.</p>}
        </div>
      )}
      <p className="mt-1 text-xs text-muted-foreground">Choose a catalog item, or explicitly choose a custom ingredient.</p>
    </div>
  );
}
