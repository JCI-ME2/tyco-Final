import raw from "./products.json";

type Row = Record<string, string>;
const all = raw as Record<string, Row[]>;

function clean(rows: Row[] | undefined): Row[] {
  if (!rows) return [];
  return rows.map((r) => {
    const o: Row = {};
    for (const [k, v] of Object.entries(r)) o[k] = typeof v === "string" ? v.trim() : String(v ?? "");
    return o;
  });
}

export const software = clean(all["Software"]);
export const controllers = clean(all["Controllers"]);
export const cardReaders = clean(all["Card Readers"]);
export const biometric = clean(all["Biometric"]).map((r) => {
  const o: Row = {};
  for (const [k, v] of Object.entries(r)) {
    if (k.startsWith("__EMPTY") || k.startsWith("Unnamed:")) continue;
    if (["Suprema", "Idemia", "Eyelock", "Face", "Finger", "IRIS", "Prox", "Mifare", "HID_iClass"].includes(k)) continue;
    o[k] = v;
  }
  return o;
});
export const magLocks = clean(all["MagLocks"]);
