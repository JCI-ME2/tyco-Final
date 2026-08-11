import mainSoftwareRaw from "./main-software.json";
import softwareModulesRaw from "./software-modules.json";
import controllersRaw from "./controllers.json";
import cardReadersRaw from "./card-readers.json";
import biometricsRaw from "./biometrics.json";
import locksRaw from "./locks.json";

type Row = Record<string, string>;

function clean(rows: unknown[]): Row[] {
  return (rows as Row[]).map((r) => {
    const o: Row = {};
    for (const [k, v] of Object.entries(r)) {
      o[k] = typeof v === "string" ? v.trim() : String(v ?? "");
    }
    return o;
  });
}

export const mainSoftware = clean(mainSoftwareRaw);
export const softwareModules = clean(softwareModulesRaw);
export const controllers = clean(controllersRaw);
export const cardReaders = clean(cardReadersRaw);
export const biometrics = clean(biometricsRaw);
export const locks = clean(locksRaw);
