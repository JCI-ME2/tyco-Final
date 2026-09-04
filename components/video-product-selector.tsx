"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, ShoppingCart, Check, Search, X, FileText } from "lucide-react";
import { addToCart } from "@/lib/cart";
import data from "@/data/video-solutions/products.json";
import { illustraPdfLinks } from "@/data/video-solutions/illustraPdfLinks";
import { datasheetLinks } from "@/data/video-solutions/datasheetLinks";
import Image from "next/image";

type Row = Record<string, string | number>;

const EXACQ_DATASHEET_BY_MODEL: Record<string, string> = {
  "EVIP-01": "/datasheets/Pro.pdf", "EVENIP-01": "/datasheets/Ent.pdf",
  "EDGE": "/datasheets/Edge.pdf", "EDGEP": "/datasheets/Edge.pdf", "EVIP-EVENIP": "/datasheets/Ent.pdf",
  "EDGE-EDGEP": "/datasheets/Edge.pdf", "EDGE-TRANSFER": "/datasheets/Edge.pdf", "EVIP-TRANSFER": "/datasheets/Pro.pdf",
  "EVEF-64": "/datasheets/Ent.pdf", "EVEF-150": "/datasheets/Ent.pdf", "EVEF-175": "/datasheets/Ent.pdf",
  "SSA-EDGE-C": "/datasheets/Edge.pdf", "SSA-PRO-C": "/datasheets/Pro.pdf", "SSA-ENT-C": "/datasheets/Ent.pdf",
  "SSA-EDGE-01": "/datasheets/Edge.pdf", "SSA-EDGEP-01": "/datasheets/Edge.pdf", "SSA-EVIP-01": "/datasheets/Pro.pdf", "SSA-EVENIP-01": "/datasheets/Ent.pdf",
};

function exacqDatasheet(sheet: Props["sheet"], partNumber: string) {
  const pn = partNumber.trim();
  if (sheet === "Exacq SW") return EXACQ_DATASHEET_BY_MODEL[pn];
  if (sheet !== "Exacq HW") return undefined;
  if (pn.startsWith("IP08-01T-GML")) return "/datasheets/G-Micro.pdf";
  if (pn.startsWith("IP08-") && pn.includes("-GPL")) return "/datasheets/G-PoE.pdf";
  if (pn.startsWith("IP01-") && pn.includes("-1Q")) return "/datasheets/Q-Series.pdf";
  if (pn.startsWith("IP01-") && pn.includes("-2A")) return "/datasheets/A-Series.pdf";
  if (pn.startsWith("IP01-") && pn.includes("X")) return "/datasheets/X-Series.pdf";
  if (pn.startsWith("S-")) return "/datasheets/S-Series.pdf";
  if (pn.startsWith("250-") || pn.startsWith("2K-")) return "/datasheets/EM-Series.pdf";
  if (pn.startsWith("C2-")) return "/datasheets/C-Series.pdf";
  return undefined;
}

type Props = {
  sheet: "Illustra" | "Illustra Standard" | "Holis NVR" | "Exacq SW" | "Exacq HW";
  category: string;
  filterColumns: string[];
  showBanner?: boolean;
  partNumberPrefixes?: string[];
};

export function VideoProductSelector({ sheet, category, filterColumns, showBanner, partNumberPrefixes }: Props) {
  const sheetData = (data as Record<string, { columns: string[]; rows: Row[] }>)[sheet];
  const rows = partNumberPrefixes 
    ? sheetData.rows.filter((r) => {
        const pn = String(r["Part Number"]);
        return partNumberPrefixes.some((prefix) => pn.startsWith(prefix));
      }) 
    : sheetData.rows;
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      for (const c of filterColumns) {
        const v = filters[c];
        if (v && v !== "all" && String(r[c] ?? "") !== v) return false;
      }
      if (q) {
        const hay = `${String(r["Part Number"] ?? "")} ${String(r["Description"] ?? "")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filters, filterColumns, query]);

  const optionsFor = (col: string) => {
    const subset = rows.filter((r) =>
      filterColumns.every((c) => {
        if (c === col) return true;
        const v = filters[c];
        if (!v || v === "all") return true;
        return String(r[c] ?? "") === v;
      }),
    );
    const set = new Set<string>();
    subset.forEach((r) => {
      const v = String(r[col] ?? "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort();
  };

  const setFilter = (col: string, val: string) =>
    setFilters((prev) => ({ ...prev, [col]: val }));

  const getQty = (pn: string) => qty[pn] ?? 1;

  const handleAdd = (r: Row) => {
    const pn = String(r["Part Number"]);
    addToCart({
      partNumber: pn,
      description: String(r["Description"] ?? ""),
      category,
      quantity: getQty(pn),
    });
    setJustAdded(pn);
    setTimeout(() => setJustAdded((p) => (p === pn ? null : p)), 1200);
  };

  return (
    <>
      {showBanner && (
        <section className="w-full">
          <Image
            src="/images/illustra-banner.png"
            alt="Select your camera — filter by features below"
            className="w-full h-auto block"
            width={1600}
            height={400}
            priority
          />
        </section>
      )}
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Narrow your selection</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pick any combination of attributes to filter part numbers.</p>

          <div className="mt-5">
            <div className="flex h-10 items-center rounded-md border border-input bg-background px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${category.toLowerCase()} part numbers or keywords…`}
                className="ml-2 flex-1 bg-transparent text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div
            className="mt-6 grid gap-4"
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))` }}
          >
            {filterColumns.map((col) => {
              const opts = optionsFor(col);
              const val = filters[col] ?? "all";
              return (
                <label key={col} className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{col}</span>
                  <select
                    value={val}
                    onChange={(e) => setFilter(col, e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
                  >
                    <option value="all">All</option>
                    {opts.map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                </label>
              );
            })}
            <div className="flex items-end">
              <button
                onClick={() => { setFilters({}); setQuery(""); }}
                className="h-10 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {filtered.length} part{filtered.length === 1 ? "" : "s"} found
          </h3>
        </div>

        <div className="mt-4 space-y-4">
          {filtered.map((r, i) => {
            const pn = String(r["Part Number"]);
            const q = getQty(pn);
            const added = justAdded === pn;
            const datasheetUrl =
              sheet === "Illustra"
                ? illustraPdfLinks[pn.trim()]
                : sheet === "Holis NVR" || sheet === "Illustra Standard"
                  ? datasheetLinks[pn.trim()]
                  : exacqDatasheet(sheet, pn);
            return (
              <div key={pn + i} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {datasheetUrl ? (
                      <a
                        href={datasheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-base font-bold tracking-wide text-brand hover:underline"
                        title="Open datasheet PDF"
                      >
                        {pn}
                        <FileText className="h-4 w-4 opacity-70" />
                      </a>
                    ) : (
                      <h4 className="font-mono text-base font-bold tracking-wide text-brand">{pn}</h4>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{String(r["Description"] ?? "")}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {filterColumns.map((c) => {
                        const v = String(r[c] ?? "").trim();
                        if (!v) return null;
                        return (
                          <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                            {c}: <span className="font-semibold text-foreground">{v}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <div className="flex w-[112px] items-center rounded-md border border-input">
                      <button
                        onClick={() => setQty((p) => ({ ...p, [pn]: Math.max(1, (p[pn] ?? 1) - 1) }))}
                        className="grid h-9 w-9 place-items-center text-foreground/70 hover:bg-secondary"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number" min={1} value={q}
                        onChange={(e) => setQty((p) => ({ ...p, [pn]: Math.max(1, parseInt(e.target.value || "1", 10)) }))}
                        className="h-9 w-full border-x border-input bg-transparent text-center text-sm outline-none"
                      />
                      <button
                        onClick={() => setQty((p) => ({ ...p, [pn]: (p[pn] ?? 1) + 1 }))}
                        className="grid h-9 w-9 place-items-center text-foreground/70 hover:bg-secondary"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleAdd(r)}
                      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                        added ? "bg-brand-accent text-brand" : "bg-accent text-accent-foreground hover:opacity-90"
                      }`}
                    >
                      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                      {added ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-muted-foreground">
              No parts match the selected filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
