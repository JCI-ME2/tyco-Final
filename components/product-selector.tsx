"use client";

import { useMemo, useState } from "react";
import { Search, X, Copy, Check, ShoppingCart, Minus, Plus, FileText } from "lucide-react";
import { addToCart } from "@/lib/cart";

const ENTRAPASS_DATASHEET = "/datasheets/EntraPass-Global.pdf";
const MAGLOCK_DATASHEET_MODELS = new Set([
  "ICS-A10001", "ICS-A10002", "ICS-A10004", "ICS-A10005", "ICS-A10010", "ICS-A10020",
  "ICS-A10040", "ICS-A10060", "ICS-A10000R", "ICS-AGL120NTBR", "ICS-SL500", "ICS-10412",
  "ICS-GK310LS", "ACA001", "PB-EXIT", "DRB-IR", "DRB-IR-S", "MCP3A-G000SF-13",
  "ICS-GL1800F-10TB", "ICS-EB300VGL",
  "MCP4A-G000SF-13", "M8A-G000SF-K013-11",
]);
const ENTRAPASS_CORPORATE_DATASHEET = "/datasheets/EntraPass-Corporate.pdf";
const ENTRAPASS_SPECIAL_DATASHEET = "/datasheets/EntraPass-Special.pdf";
const KANTECH_DATASHEET_BY_MODEL: Record<string, string> = {
  "KT-1-EU-PC": "/datasheets/KT-1.pdf",
  "KT-1-EU-MET": "/datasheets/KT-1.pdf",
  "KT-1-EU-MET-POE": "/datasheets/KT-1.pdf",
  "KT-1": "/datasheets/KT-1.pdf",
  "KT-1-M": "/datasheets/KT-1.pdf",
  "KT-1-PCB": "/datasheets/KT-1.pdf",
  "KT-1-CAB-P": "/datasheets/KT-1.pdf",
  "KT-1-CAB-M": "/datasheets/KT-1.pdf",
  "KT-1-CAB-PSU": "/datasheets/KT-1.pdf",
  "KT-1-CAB-POE": "/datasheets/KT-1.pdf",
  "KT-1-CVR": "/datasheets/KT-1.pdf",
  "KT-1-PCB-BP": "/datasheets/KT-1.pdf",
  "KT-2-EU-MET": "/datasheets/KT-2.pdf",
  "KT-2-CAB-PSU": "/datasheets/KT-2.pdf",
  "KT-2-PCB-EU": "/datasheets/KT-2.pdf",
  "KT-2-BP": "/datasheets/KT-2.pdf",
  "KT-2-MP": "/datasheets/KT-2.pdf",
  "KT-4-EU": "/datasheets/KT-4.pdf",
  "KT-4-POE": "/datasheets/KT-4.pdf",
  "KT-4-PCB": "/datasheets/KT-4.pdf",
  "KT-4-MOD-PoE": "/datasheets/KT-4.pdf",
  "KT-4-MOD-WiFi": "/datasheets/KT-4.pdf",
  "KT-4-CABEU": "/datasheets/KT-4.pdf",
  "KT-4-CAB": "/datasheets/KT-4.pdf",
  "KT-CON": "/datasheets/KT-4.pdf",
  "KT-ACC": "/datasheets/KT-4.pdf",
  "TR16100-240V": "/datasheets/KT-4.pdf",
  "KT-MOD-INP16": "/datasheets/KT-4.pdf",
  "KT-MOD-OUT16": "/datasheets/KT-4.pdf",
  "KT-MOD-REL8": "/datasheets/KT-4.pdf",
  "KT-MOD-SPI-16": "/datasheets/KT-4.pdf",
  "KT-MOD-SPI-36": "/datasheets/KT-4.pdf",
  "KT-MOD-IO16": "/datasheets/KT-MOD.pdf",
  "KT-MOD-CABEU": "/datasheets/KT-MOD.pdf",
};
const IOSMART_MODELS = new Set([
  "KT-MUL-SC2", "KT-MUL-SC-KP2", "KT-MUL-MT2", "KT-MUL-MT-KP2",
  "KT-SG-SC2", "KT-SG-SC-KP2", "KT-SG-MT2", "KT-SG-MT-KP2",
]);
const HID_MODELS = new Set([
  "20NKS-00-000000", "20TKS-00-000000", "20KNKS-00-000000", "20KTKS-00-000000",
  "40NKS-00-000000", "40TKS-00-000000", "40KNKS-00-000000", "40KTKS-00-000000",
  "20NKS-02-0002BL", "20TKS-02-0002BL", "20KNKS-02-0002BL", "20KTKS-02-0002BL",
  "40NKS-02-0002BL", "40TKS-02-0002BL", "40KNKS-02-0002BL", "40KTKS-02-0002BL",
  "20NKS-01-00001H", "20TKS-01-00001H", "20KNKS-01-00001H", "20KTKS-01-00001H",
  "40NKS-01-00001H", "40TKS-01-00001H", "40KNKS-01-00001H", "40KTKS-01-00001H",
  "20NWS-00-000000", "20TWS-00-000000", "20KNWS-00-000000", "20KTWS-00-000000",
  "40NWS-00-000000", "40TWS-00-000000", "40KNWS-00-000000", "40KTWS-00-000000",
]);
const STID_DATASHEET_BY_MODEL: Record<string, string> = {
  ARC1SR31BBT1JC11: "/datasheets/STID-MUL.pdf", ARC1SW33BBT1JC11: "/datasheets/STID-MUL.pdf",
  ARCSR31ABT1JC11: "/datasheets/STID-SG.pdf", ARCSW33ABT1JC11: "/datasheets/STID-SG.pdf",
  ARCSR31BBT1JC11: "/datasheets/STID-KP.pdf", ARCSW33BBT1JC11: "/datasheets/STID-KP.pdf",
  ARCSR31AQBT1JC11: "/datasheets/STID-QR.pdf", ARCSW33AQBT1JC11: "/datasheets/STID-QR.pdf",
};
const BIOMETRIC_DATASHEET_BY_MODEL: Record<string, string> = {
  "SUP-BEW3-DB": "/datasheets/BEW3.pdf", "SUP-BEW3-APB": "/datasheets/BEW3.pdf",
  "SUP-BS3-DB": "/datasheets/BS3.pdf", "SUP-BS3-APWB": "/datasheets/BS3.pdf",
  "SUP-FSF2-DB": "/datasheets/FSF2.pdf", "SUP-FSF2-AB": "/datasheets/FSF2.pdf", "SUP-FSF2-ODB": "/datasheets/FSF2.pdf",
  "SUP-BS2A-ODPB": "/datasheets/BS2A.pdf", "SUP-BS2A-OAPWB": "/datasheets/BS2A.pdf",
  "SUP-BEW2-ODPB": "/datasheets/BEW2.pdf", "SUP-BEW2-OHPB": "/datasheets/BEW2.pdf", "SUP-BEW2-OAPB": "/datasheets/BEW2.pdf",
  "SUP-BEP2-OD": "/datasheets/BEP2.pdf", "SUP-BEP2-OA": "/datasheets/BEP2.pdf",
  "SUP-BLN2-ODB": "/datasheets/BLN2.pdf", "SUP-BLN2-OAB": "/datasheets/BLN2.pdf",
  "MOR-293744571": "/datasheets/MVP.pdf", "MOR-293744604": "/datasheets/MVP.pdf",
  "MOR-293678615": "/datasheets/MSL.pdf", "MOR-293638877": "/datasheets/MSW.pdf", "MOR-293638856": "/datasheets/MSW.pdf",
  "MOR-293673665": "/datasheets/MSL.pdf", "MOR-293676863": "/datasheets/MSL.pdf", "MOR-293678628": "/datasheets/MSL.pdf", "MOR-293678678": "/datasheets/MSL.pdf", "MOR-293678660": "/datasheets/MSL.pdf", "MOR-293673644": "/datasheets/MSL.pdf",
  "EYEM-NIXT3": "/datasheets/NIXT.pdf", "EYEM-NEXT2": "/datasheets/NEXT.pdf", "EYEM-FXT": "/datasheets/FXT.pdf", "EYEM-FXTH": "/datasheets/FXT.pdf",
  "EYEM-NFACE2N": "/datasheets/NFACE2N.pdf", "EYEM-NFACE2NP": "/datasheets/NFACE2N.pdf", "EYEM-NFACE2NH": "/datasheets/NFACE2N.pdf", "EYEM-NFACE2NHP": "/datasheets/NFACE2N.pdf",
};

export interface SelectorConfig<T extends Record<string, string>> {
  title: string;
  subtitle: string;
  data: T[];
  partKey: keyof T;
  filters: { key: keyof T; label: string }[];
  descriptionKey?: keyof T;
  category: string;
}

const ALL = "all";

export function ProductSelector<T extends Record<string, string>>({
  title,
  subtitle,
  data,
  partKey,
  filters,
  descriptionKey,
  category,
}: SelectorConfig<T>) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);

  const getQty = (pn: string) => qty[pn] ?? 1;
  const setPnQty = (pn: string, n: number) =>
    setQty((q) => ({ ...q, [pn]: Math.max(1, n) }));

  const filteredRows = useMemo(() => {
    return data.filter((row) => {
      for (const f of filters) {
        const v = selected[f.key as string];
        if (v && v !== ALL && String(row[f.key] ?? "") !== v) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        const hay = [row[partKey], descriptionKey ? row[descriptionKey] : ""]
          .map((x) => String(x ?? "").toLowerCase())
          .join(" ");
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, filters, selected, query, partKey, descriptionKey]);

  const optionsFor = (key: keyof T) => {
    const rows = data.filter((row) => {
      for (const f of filters) {
        if (f.key === key) continue;
        const v = selected[f.key as string];
        if (v && v !== ALL && String(row[f.key] ?? "") !== v) return false;
      }
      return true;
    });
    const set = new Set<string>();
    rows.forEach((r) => {
      const v = String(r[key] ?? "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  };

  const reset = () => { setSelected({}); setQuery(""); };
  const copy = async (pn: string) => {
    await navigator.clipboard.writeText(pn);
    setCopied(pn);
    setTimeout(() => setCopied((c) => (c === pn ? null : c)), 1500);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Narrow your selection</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick any combination of attributes to filter part numbers.</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center rounded-md border border-input bg-background px-3 h-10">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()} part numbers or keywords…`}
                className="ml-2 flex-1 bg-transparent outline-none text-sm"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div
            className="mt-6 grid gap-4"
            style={{ gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))` }}
          >
            {filters.map((f) => {
              const opts = optionsFor(f.key);
              const val = selected[f.key as string] ?? ALL;
              return (
                <label key={f.key as string} className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{f.label}</span>
                  <select
                    value={val}
                    onChange={(e) => setSelected((s) => ({ ...s, [f.key as string]: e.target.value }))}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
                  >
                    <option value={ALL}>All</option>
                    {opts.map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                </label>
              );
            })}
            <div className="flex items-end">
              <button
                onClick={reset}
                className="h-10 rounded-md border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-foreground">
            {filteredRows.length} part{filteredRows.length === 1 ? "" : "s"} found
          </h3>
          <span className="text-xs text-muted-foreground">of {data.length} total</span>
        </div>

        <div className="mt-4 space-y-4">
          {filteredRows.map((row, i) => {
            const pn = String(row[partKey]);
            const description = descriptionKey ? String(row[descriptionKey] ?? "") : "";
            const q = getQty(pn);
            const isAdded = added === pn;
            const datasheetUrl =
              category === "Software"
                ? pn.startsWith("E-GLO-")
                  ? ENTRAPASS_DATASHEET
                  : pn.startsWith("E-COR-")
                    ? ENTRAPASS_CORPORATE_DATASHEET
                    : pn.startsWith("E-SPE-")
                      ? ENTRAPASS_SPECIAL_DATASHEET
                      : undefined
                  : category === "MagLocks"
                    ? MAGLOCK_DATASHEET_MODELS.has(pn.trim())
                      ? `/datasheets/${pn.trim()}.pdf`
                      : undefined
                  : category === "Controllers"
                  ? KANTECH_DATASHEET_BY_MODEL[pn.trim()]
                  : category === "Biometric"
                    ? BIOMETRIC_DATASHEET_BY_MODEL[pn.trim()]
                    : category === "Card Readers"
                      ? IOSMART_MODELS.has(pn.trim())
                      ? "/datasheets/IoSmart.pdf"
                      : HID_MODELS.has(pn.trim())
                        ? "/datasheets/hid.pdf"
                        : STID_DATASHEET_BY_MODEL[pn.trim()]
                    : undefined;
            return (
              <div key={pn + i} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {datasheetUrl ? (
                        <a
                          href={datasheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-base font-bold tracking-wide text-brand hover:underline"
                          title="Open product datasheet PDF"
                        >
                          {pn}
                          <FileText className="size-4 opacity-70" />
                        </a>
                      ) : (
                        <h4 className="font-mono text-base font-bold tracking-wide text-brand">{pn}</h4>
                      )}
                      <button
                        onClick={() => copy(pn)}
                        className="text-muted-foreground hover:text-foreground"
                        title="Copy part number"
                      >
                        {copied === pn ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>
                    {description && (
                      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {filters.map((f) => {
                        const v = String(row[f.key] ?? "").trim();
                        if (!v) return null;
                        return (
                          <span key={f.key as string} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                            {f.label}: <span className="font-semibold text-foreground">{v}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <div className="flex w-[112px] items-center rounded-md border border-input">
                      <button onClick={() => setPnQty(pn, q - 1)} className="grid h-9 w-9 place-items-center text-foreground/70 hover:bg-secondary" aria-label="Decrease">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number" min={1} value={q}
                        onChange={(e) => setPnQty(pn, parseInt(e.target.value, 10) || 1)}
                        className="h-9 w-full border-x border-input bg-transparent text-center text-sm outline-none"
                      />
                      <button onClick={() => setPnQty(pn, q + 1)} className="grid h-9 w-9 place-items-center text-foreground/70 hover:bg-secondary" aria-label="Increase">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        addToCart({ partNumber: pn, description, category, quantity: q });
                        setAdded(pn);
                        setTimeout(() => setAdded((a) => (a === pn ? null : a)), 1200);
                      }}
                      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                        isAdded ? "bg-brand-accent text-brand" : "bg-accent text-accent-foreground hover:opacity-90"
                      }`}
                    >
                      {isAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                      {isAdded ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredRows.length === 0 && (
            <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-muted-foreground">
              No parts match the selected filters.
            </div>
          )}
        </div>
      </div>
  );
}
