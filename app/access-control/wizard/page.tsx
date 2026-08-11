"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Check, CheckCircle2 } from "lucide-react";
import { addToCart as addToMainCart, useCart } from "@/lib/cart";

type Answers = Record<string, number>; // key = `${page}.${qIdx}` -> option index
type Checks = Record<string, boolean>; // key = sku -> selected (checkbox pages)

type SheetOpt = { sku: string; label: string };

const CONTROLLER_OPTS: SheetOpt[] = [
  { sku: "KT-1-EU-MET", label: "Centralized — Controller Kit with Metal Housing and PSU" },
  { sku: "KT-1-EU-PC", label: "Centralized — Controller Kit with Plastic Housing and PSU" },
  { sku: "KT-1-EU-MET-POE", label: "Centralized — Controller Kit with Metal Housing and PSU with PoE+ battery charger" },
  { sku: "KT-1", label: "Centralized — Wall Mount Controller, No Housing or PSU" },
  { sku: "KT-1-M", label: "Centralized — Controller Kit with Metal Housing, No PSU" },
  { sku: "KT-2-EU-MET", label: "Distributed — 2 Doors Controller Kit Metal Housing and PSU" },
  { sku: "KT-4-EU", label: "Distributed — 4 Doors Controller Kit Metal Housing and PSU" },
  { sku: "KT-4-POE", label: "Distributed — 4 Doors Controller Kit Metal Housing with PoE Module" },
];

const NO_NEED: SheetOpt = { sku: "NO_NEED", label: "No Need" };

const IO_OPTS: SheetOpt[] = [
  { sku: "KT-MOD-IO16", label: "16 configured Input / Output Module" },
  { sku: "KT-MOD-INP16", label: "16-zone, input expansion module" },
  { sku: "KT-MOD-OUT16", label: "16-zone output expansion module" },
  { sku: "KT-MOD-REL8", label: "Eight-relay expansion module" },
  { sku: "KT-MOD-SPI-16", label: "KT-400 SPI Cable 16 inch" },
  { sku: "KT-MOD-SPI-36", label: "KT-400 SPI Cable 36 inch" },
  NO_NEED,
];

const KANTECH_OPTS: SheetOpt[] = [
  { sku: "KT-MUL-SC2", label: "Mullion, Smart Card Only" },
  { sku: "KT-MUL-SC-KP2", label: "Mullion, Smart Card Only, Keypad" },
  { sku: "KT-MUL-MT2", label: "Mullion, Multi-Tech" },
  { sku: "KT-MUL-MT-KP2", label: "Mullion, Multi-Tech, Keypad" },
  { sku: "KT-SG-SC2", label: "Single Gang, Smart Card Only" },
  { sku: "KT-SG-SC-KP2", label: "Single Gang, Smart Card Only, Keypad" },
  { sku: "KT-SG-MT2", label: "Single Gang, Multi-Tech" },
  { sku: "KT-SG-MT-KP2", label: "Single Gang, Multi-Tech, Keypad" },
  NO_NEED,
];

const STID_OPTS: SheetOpt[] = [
  { sku: "ARC1SR31BBT1JC11", label: "Wiegand, Mullion, Smart Card" },
  { sku: "ARCSR31ABT1JC11", label: "Wiegand, Single Gang, Smart Card" },
  { sku: "ARCSR31BBT1JC11", label: "Wiegand, Single Gang, Smart Card, Keypad" },
  { sku: "ARCSR31AQBT1JC11", label: "Wiegand, Single Gang, Smart Card, QR Code" },
  { sku: "ARC1SW33BBT1JC11", label: "OSDP, Mullion, Smart Card" },
  { sku: "ARCSW33ABT1JC11", label: "OSDP, Single Gang, Smart Card" },
  { sku: "ARCSW33BBT1JC11", label: "OSDP, Single Gang, Smart Card, Keypad" },
  { sku: "ARCSW33AQBT1JC11", label: "OSDP, Single Gang, Smart Card, QR Code" },
  NO_NEED,
];

const IRIS_OPTS: SheetOpt[] = [
  { sku: "EYEM-NIXT3", label: "IRIS - Mifare - Indoor - PoE" },
  { sku: "EYEM-NEXT2", label: "IRIS - Outdoor" },
  { sku: "EYEM-FXT", label: "IRIS+Face - Mifare - Indoor - PoE+" },
  { sku: "EYEM-FXTH", label: "IRIS+Face - iClass - Indoor - PoE+" },
  NO_NEED,
];

const FACE_OPTS: SheetOpt[] = [
  { sku: "EYEM-NFACE2N", label: "(Eyelock - Mifare - Indoor - LCD Display)" },
  { sku: "EYEM-NFACE2NP", label: "(Eyelock - Mifare - Indoor - LCD Display - PoE)" },
  { sku: "EYEM-NFACE2NH", label: "(Eyelock - iClass - Indoor - LCD Display)" },
  { sku: "EYEM-NFACE2NHP", label: "(Eyelock - iClass - Indoor - LCD Display - PoE)" },
  { sku: "MOR-293744571", label: "(Morpho - Mifare - Outdoor - LCD Display)" },
  { sku: "SUP-BEW3-DB", label: "(Suprema - Prox-Mifare - Outdoor)" },
  { sku: "SUP-BS3-DB", label: "(Suprema - Prox-Mifare - Outdoor IK10 - LCD Display)" },
  { sku: "SUP-FSF2-DB", label: "(Suprema - Prox-Mifare - Outdoor - LCD Display)" },
  { sku: "SUP-FSF2-ODB", label: "(Suprema - Prox-Mifare - Fingerprint - Outdoor - LCD Display)" },
  { sku: "SUP-BEW3-APB", label: "(Suprema - Prox-Mifare-iClass - Outdoor)" },
  { sku: "SUP-FSF2-AB", label: "(Suprema - Prox-Mifare-iClass - Outdoor - LCD Display)" },
  { sku: "MOR-293744604", label: "(Morpho - Prox-Mifare-iClass - Outdoor - LCD Display)" },
  { sku: "SUP-BS3-APWB", label: "(Suprema - Prox-Mifare-iClass - Outdoor - LCD Display - Videophone - Wifi)" },
  NO_NEED,
];

const MORPHO_OPTS: SheetOpt[] = [
  { sku: "MOR-293678615", label: "(Outdoor - PoE)" },
  { sku: "MOR-293673665", label: "(Outdoor - PoE - Prox)" },
  { sku: "MOR-293678636", label: "(Outdoor - PoE - Mifare)" },
  { sku: "MOR-293678628", label: "(Outdoor - PoE - iClass)" },
  { sku: "MOR-293678678", label: "(Outdoor - PoE - Prox - LCD Display)" },
  { sku: "MOR-293678660", label: "(Outdoor - PoE - Mifare - LCD Display)" },
  { sku: "MOR-293673644", label: "(Outdoor - PoE - iClass - LCD Display)" },
  { sku: "MOR-293638877", label: "(Outdoor - PoE - Mifare - LCD Display - Videophone)" },
  { sku: "MOR-293638856", label: "(Outdoor - PoE - iClass - LCD Display - Videophone)" },
  NO_NEED,
];

const SUPREMA_OPTS: SheetOpt[] = [
  { sku: "SUP-BEP2-OD", label: "(Indoor - Prox-Mifare)" },
  { sku: "SUP-BEP2-OA", label: "(Indoor - Prox-Mifare-iClass)" },
  { sku: "SUP-BEW2-OHPB", label: "(Outdoor - PoE - HID Prox-Mifare)" },
  { sku: "SUP-BEW2-ODPB", label: "(Outdoor - PoE - Prox-Mifare)" },
  { sku: "SUP-BEW2-OAPB", label: "(Outdoor - PoE - Prox-Mifare-iClass)" },
  { sku: "SUP-BLN2-ODB", label: "(Outdoor - Prox-Mifare - Small Display)" },
  { sku: "SUP-BLN2-OAB", label: "(Outdoor - Prox-Mifare-iClass - Small Display - Wi-Fi)" },
  { sku: "SUP-BS2A-ODPB", label: "(Outdoor - Prox-Mifare - LCD Display)" },
  { sku: "SUP-BS2A-OAPWB", label: "(Outdoor - Prox-Mifare-iClass - LCD Display)" },
  NO_NEED,
];

const MAGNET_OPTS: SheetOpt[] = [
  { sku: "ICS-A10001", label: "Mini Magnet-Single Door-Unmonitored" },
  { sku: "ICS-A10002", label: "Mini Magnet-Single Door-Monitored" },
  { sku: "ICS-A10004", label: "Mini Magnet-Double Door-Unmonitored" },
  { sku: "ICS-A10005", label: "Mini Magnet-Double Door-Monitored" },
  { sku: "ICS-A10010", label: "Standard Magnet-Single Door-Unmonitored" },
  { sku: "ICS-A10020", label: "Standard Magnet-Single Door-Monitored" },
  { sku: "ICS-A10040", label: "Standard Magnet-Double Door-Monitored" },
  { sku: "ICS-A10060", label: "Standard Magnet-Double Door-Unmonitored" },
  { sku: "ICS-A10000R", label: "Mortice Magnet-Single Door-Monitored" },
  { sku: "ICS-AGL120NTBR", label: "Standard Magnet-External Gate-Unmonitored" },
  { sku: "ICS-GL1800F-10TB", label: "High Security-Sliding Door-Unmonitored" },
  NO_NEED,
];

const ACCESSORY_OPTS: SheetOpt[] = [
  { sku: "ACA001", label: "Push Button-Surface Mount-Plastic" },
  { sku: "PB-EXIT", label: "Push Button-Flush Mount-Stainless Steel" },
  { sku: "DRB-IR", label: "Touch Free PB-Flush Mount-Stainless Steel" },
  { sku: "DRB-IR-S", label: "Touch Free PB-Surface Mount-Stainless Steel" },
  { sku: "MCP3A-G000SF-13", label: "Green Call Points-Surface Mount-Single Pole" },
  { sku: "MCP4A-G000SF-13", label: "Green Call Points-Surface Mount-Double Pole" },
  { sku: "M8A-G000SF-K013-11", label: "Green Call Points-Surface Mount-Triple Pole" },
  NO_NEED,
];

const TOTAL_PAGES = 29;

export default function WizardPage() {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [checks, setChecks] = useState<Checks>({});
  const [qty, setQty] = useState<Record<string, number>>({});

  const cartItems = useCart();
  const inCart = (sku: string) =>
    cartItems.find((i) => i.partNumber === sku)?.quantity ?? 0;

  const a = (p: number, q: number) => answers[`${p}.${q}`];
  const setA = (p: number, q: number, v: number) =>
    setAnswers((prev) => ({ ...prev, [`${p}.${q}`]: v }));

  const getQty = (sku: string) => qty[sku] ?? 1;
  const setQ = (sku: string, n: number) =>
    setQty((p) => ({ ...p, [sku]: Math.max(1, n) }));

  const addToCart = (sku: string, description: string) =>
    addToMainCart({
      partNumber: sku,
      description,
      category: "EntraPass Wizard",
      quantity: getQty(sku),
    });

  function goTo(nextStep: number) {
    setHistory((h) => [...h, page]);
    setPage(nextStep);
  }
  function back() {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setPage(prev);
      return h.slice(0, -1);
    });
  }

  // ─── Navigation rules ───────────────────────────────────────────────
  function nextPage(): number | null {
    switch (page) {
      case 1: {
        const v = a(1, 0);
        if (v === 0) return 4; // New installation
        if (v === 1) return 2; // Upgrade
        return null;
      }
      case 2: {
        const v = a(2, 0);
        if (v === 0) return 4; // Newer → New installation flow
        if (v === 1) return 3; // v3.18 or below
        return null;
      }
      case 3: {
        const v = a(3, 0);
        if (v === 0) return 11; // Special edition
        if (v === 1) return 6; // Corporate
        if (v === 2) return 15; // Global edition
        return null;
      }
      case 4: {
        const v = a(4, 0);
        if (v === 0) return 13; // Special edition
        if (v === 1) return 5; // Corporate edition
        if (v === 2) return 14; // Global edition
        return null;
      }
      case 5:
        return a(5, 0) !== undefined || a(5, 1) !== undefined ? 6 : null;
      case 6:
        return a(6, 0) !== undefined ? 7 : null;
      case 7:
        return 8;
      case 8:
        return a(8, 0) !== undefined ? 9 : null;
      case 9:
        return a(9, 0) !== undefined ? 10 : null;
      case 10:
        return 20;
      case 11:
        return 12;
      case 12:
        return 20;
      case 13:
        return a(13, 0) !== undefined ? 11 : null;
      case 14:
        return a(14, 0) !== undefined || a(14, 1) !== undefined ? 15 : null;
      case 15:
        return a(15, 0) !== undefined ? 16 : null;
      case 16:
        return 17;
      case 17:
        return a(17, 0) !== undefined ? 18 : null;
      case 18:
        return a(18, 0) !== undefined ? 19 : null;
      case 19:
        return 20;
      case 20:
        return a(20, 0) !== undefined ? 21 : null;
      case 21:
        return a(21, 0) !== undefined ? 22 : null;
      case 22:
        return a(22, 0) !== undefined ? 23 : null;
      case 23:
        return a(23, 0) !== undefined ? 24 : null;
      case 24:
        return a(24, 0) !== undefined ? 25 : null;
      case 25:
        return a(25, 0) !== undefined ? 26 : null;
      case 26:
        return a(26, 0) !== undefined ? 27 : null;
      case 27:
        return a(27, 0) !== undefined ? 28 : null;
      case 28:
        return a(28, 0) !== undefined ? 29 : null;
      case 29:
        return null;
    }
    return null;
  }

  const next = nextPage();
  const nextLabel = page === 9 ? "To Token" : page === 10 ? "To Controllers" : "Next";

  return (
    <div className="bg-secondary/40">
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Top bar: progress + cart */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>
                Step {page} of {TOTAL_PAGES}
              </span>
              <span>{Math.round(((page - 1) / (TOTAL_PAGES - 1)) * 100)}%</span>
            </div>
            <div className="mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-gradient-to-r from-accent to-brand-accent transition-all"
                style={{ width: `${((page - 1) / (TOTAL_PAGES - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* LEFT: question */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            {renderLeft(page, a, setA, checks, setChecks)}

            <div className="mt-8 flex justify-between">
              <button
                onClick={back}
                disabled={history.length === 0}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {next === null && page === 29 ? (
                <Link
                  href="/access-control/cart"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90"
                >
                  <ShoppingCart className="h-4 w-4" /> Go to Cart
                </Link>
              ) : (
                <button
                  onClick={() => next !== null && goTo(next)}
                  disabled={next === null}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {nextLabel} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          {/* RIGHT: parts */}
          <aside className="space-y-4">
            {renderRight(page, a, checks, getQty, setQ, addToCart, inCart)}
          </aside>
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// LEFT (questions)
// ──────────────────────────────────────────────────────────────────────
function renderLeft(
  page: number,
  a: (p: number, q: number) => number | undefined,
  setA: (p: number, q: number, v: number) => void,
  checks: Checks,
  setChecks: React.Dispatch<React.SetStateAction<Checks>>,
) {
  switch (page) {
    case 1:
      return (
        <Question title="Is this an upgrade or a new installation?">
          <Radios page={1} q={0} a={a} setA={setA} options={["New installation", "Upgrade"]} />
        </Question>
      );
    case 2:
      return (
        <Question title="Is your current software version v3.18 or below?">
          <Radios page={2} q={0} a={a} setA={setA} options={["Newer", "v3.18 or below"]} />
        </Question>
      );
    case 3:
      return (
        <Question title="What is your software category?">
          <Radios
            page={3}
            q={0}
            a={a}
            setA={setA}
            options={["Special Edition", "Corporate edition", "Global edition"]}
          />
        </Question>
      );
    case 4:
      return (
        <Question title="Select your software category.">
          <Radios
            page={4}
            q={0}
            a={a}
            setA={setA}
            options={[
              "Special Edition (limited to 1 Workstation / 256 Doors)",
              "Corporate edition (limited to 21 workstations / No guard tour or Cross Controllers events)",
              "Global edition",
            ]}
          />
        </Question>
      );
    case 5:
      return (
        <div className="space-y-8">
          <Question title="Do you want the Server license on a USB or by E-mail?">
            <Radios page={5} q={0} a={a} setA={setA} options={["By Email", "On a USB Drive", "No need"]} />
          </Question>
          <Question title="Do you want the Server Redundancy or gateway license?">
            <Radios page={5} q={1} a={a} setA={setA} options={["Yes", "No Need"]} />
          </Question>
        </div>
      );
    case 6:
      return (
        <Question title="Corporate edition comes with two additional Workstation licenses, one Server/Workstation license, one Multi-Site Gateway license and one web license. Do you need more?">
          <Radios page={6} q={0} a={a} setA={setA} options={["Yes", "No"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-COR-WS(X) are the workstation license, where (X) is the number of workstations.
            <br />
            E-COR-WEB(X) are the Web Stations license, where (X) is the number of concurrent web licenses.
          </p>
        </Question>
      );
    case 7: {
      const p7Options = [
        { sku: "E-COR-CONNECT", label: "Third Party Integration Option, license for 1 concurrent integration" },
        { sku: "E-COR-GLY", label: "License enabling integration with the Honeywell Intruder Alarm Panel" },
        { sku: "E-COR-LDAP", label: "Active Directory (LDAP) license — synchronize EntraPass operators and users" },
        { sku: "E-COR-SQL", label: "License for Oracle/MS-SQL HR Interface" },
        { sku: "E-COR-VVM", label: "Video Vault option: order to unlock this feature" },
        { sku: "E-COR-DVR-1", label: "License for single 3rd party recorder" },
      ];
      return (
        <Question title="Select all options and integrations available for EntraPass Corporate edition.">
          <CheckList options={p7Options} checks={checks} setChecks={setChecks} />
        </Question>
      );
    }
    case 8:
      return (
        <Question title="Corporate edition comes with 5 Mobile credentials. Do you need more?">
          <Radios page={8} q={0} a={a} setA={setA} options={["Yes", "No"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-COR-PASS-(X) are the mobile credential packs of 10, 50, 100 &amp; 500.
          </p>
        </Question>
      );
    case 9:
      return (
        <Question title="Which Wireless lock Brand?">
          <Radios page={9} q={0} a={a} setA={setA} options={["Aperio", "Salto", "No need"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-COR-DOOR-(X) are the Aperio wireless locks packs of 1, 4, 8, 24, 48 &amp; 96.
            <br />
            E-COR-SALTO-(X) are the Salto wireless locks packs of 1, 5, 10, 50 &amp; 100.
          </p>
        </Question>
      );
    case 10:
      return (
        <Question title="Do you need tokens for additional support and new versions download?">
          <Radios
            page={10}
            q={0}
            a={a}
            setA={setA}
            options={["I just upgraded from v3.18 or below", "No Need", "I will need to add tokens"]}
          />
          <div className="mt-4 rounded-md border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">
              Add Tokens according to your system components, single or packs of 2, 3, 5 or 10:
            </p>
            <ul className="grid grid-cols-2 gap-y-1">
              <li>System — 1</li>
              <li>Mirror DB / Redundant — 1</li>
              <li>Oracle/MS-SQL Interface — 1</li>
              <li>EntraPass Web — 1</li>
              <li>Database access — 1</li>
              <li>EntraPass LDAP — 1</li>
              <li>Go Pass — 1</li>
            </ul>
          </div>
        </Question>
      );
    case 11: {
      const p11Options = [
        { sku: "E-SPE-GLY", label: "License enabling integration with the Honeywell Intruder Alarm Panel" },
      ];
      return (
        <Question title="Select all options and integrations available for EntraPass Special edition.">
          <CheckList options={p11Options} checks={checks} setChecks={setChecks} />
        </Question>
      );
    }
    case 12:
      return (
        <Question title="Do you need wireless locks integration?">
          <Radios page={12} q={0} a={a} setA={setA} options={["Aperio", "No need"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-SPE-DOOR-(X) are the Aperio wireless locks packs of 1, 4, 8, 24, 48 &amp; 96.
          </p>
        </Question>
      );
    case 13:
      return (
        <Question title="Do you want the Server license on a USB or by E-mail?">
          <Radios page={13} q={0} a={a} setA={setA} options={["By Email", "On a USB Drive"]} />
        </Question>
      );
    case 14:
      return (
        <div className="space-y-8">
          <Question title="Do you want the Server license on a USB or by E-mail?">
            <Radios page={14} q={0} a={a} setA={setA} options={["By Email", "On a USB Drive", "No need"]} />
          </Question>
          <Question title="Do you want the Server Redundancy or gateway license?">
            <Radios page={14} q={1} a={a} setA={setA} options={["Yes", "No Need"]} />
          </Question>
        </div>
      );
    case 15:
      return (
        <Question title="Global edition comes with four additional Workstation licenses, one Server/Workstation license, one Multi-Site Gateway license and one web license. Do you need more?">
          <Radios page={15} q={0} a={a} setA={setA} options={["Yes", "No"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-GLO-WS(X) are the workstation license, where (X) is the number of workstations.
            <br />
            E-GLO-WEB(X) are the Web Stations license, where (X) is the number of concurrent web licenses.
          </p>
        </Question>
      );
    case 16: {
      const p16Options = [
        { sku: "E-GLO-CONNECT", label: "Third Party Integration Option, license for 1 concurrent integration" },
        { sku: "E-GLO-GLY", label: "License enabling integration with the Honeywell Intruder Alarm Panel" },
        { sku: "E-GLO-LDAP", label: "Active Directory (LDAP) license — synchronize EntraPass operators and users" },
        { sku: "E-GLO-SQL", label: "License for Oracle/MS-SQL HR Interface" },
        { sku: "E-GLO-VVM", label: "Video Vault option: order to unlock this feature" },
        { sku: "E-GLO-DVR-1", label: "License for single 3rd party recorder" },
        { sku: "E-GLO-DVR-UNL", label: "License for unlimited 3rd party recorder" },
      ];
      return (
        <Question title="Select all options and integrations available for EntraPass Global edition.">
          <CheckList options={p16Options} checks={checks} setChecks={setChecks} />
        </Question>
      );
    }
    case 17:
      return (
        <Question title="Global edition comes with 5 Mobile credentials. Do you need more?">
          <Radios page={17} q={0} a={a} setA={setA} options={["Yes", "No"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-GLO-PASS-(X) are the mobile credential packs of 10, 50, 100 &amp; 500.
          </p>
        </Question>
      );
    case 18:
      return (
        <Question title="Which Wireless lock Brand?">
          <Radios page={18} q={0} a={a} setA={setA} options={["Aperio", "Salto", "No need"]} />
          <p className="mt-4 text-xs text-muted-foreground">
            E-GLO-DOOR-(X) are the Aperio wireless locks packs of 1, 4, 8, 24, 48 &amp; 96.
            <br />
            E-GLO-SALTO-(X) are the Salto wireless locks packs of 1, 5, 10, 50 &amp; 100.
          </p>
        </Question>
      );
    case 19:
      return (
        <Question title="Do you need tokens for additional support and new versions download?">
          <Radios
            page={19}
            q={0}
            a={a}
            setA={setA}
            options={["I just upgraded from v3.18 or below", "No Need", "I will need to add tokens"]}
          />
          <div className="mt-4 rounded-md border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
            <p className="mb-2 font-semibold text-foreground">
              Add Tokens according to your system components, single or packs of 2, 3, 5, 10 or 20:
            </p>
            <ul className="grid grid-cols-2 gap-y-1">
              <li>System — 3</li>
              <li>Mirror DB / Redundant — 1</li>
              <li>Oracle/MS-SQL Interface — 1</li>
              <li>EntraPass Web — 1</li>
              <li>Database access — 1</li>
              <li>EntraPass LDAP — 1</li>
              <li>Go Pass — 1</li>
            </ul>
          </div>
        </Question>
      );
    case 20: {
      const stripPrefix = (s: string) => s.replace(/^(Centralized|Distributed)\s*—\s*/, "");
      const centralized = CONTROLLER_OPTS.slice(0, 5).map((o) => stripPrefix(o.label));
      const distributed = CONTROLLER_OPTS.slice(5).map((o) => stripPrefix(o.label));
      const val = a(20, 0);
      const renderGroup = (heading: string, opts: string[], offset: number) => (
        <div>
          <h3 className="mb-3 text-base font-semibold text-foreground">{heading}</h3>
          <ul className="space-y-2">
            {opts.map((opt, i) => {
              const idx = offset + i;
              const sel = val === idx;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => setA(20, 0, idx)}
                    className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                      sel
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-background hover:border-accent/60 hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                        sel ? "border-accent bg-accent" : "border-muted-foreground/50"
                      }`}
                    >
                      {sel && <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />}
                    </span>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
      return (
        <Question title="Do you want your controllers to be Centralized or Distributed?">
          <div className="space-y-6">
            {renderGroup("Centralized", centralized, 0)}
            {renderGroup("or Distributed?", distributed, 5)}
          </div>
        </Question>
      );
    }
    case 21:
      return (
        <Question title="Do you need any of the below additional Input/Output Modules?">
          <Radios page={21} q={0} a={a} setA={setA} options={IO_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 22:
      return (
        <Question title="Select Kantech ioSmart Reader Type">
          <Radios page={22} q={0} a={a} setA={setA} options={KANTECH_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 23:
      return (
        <Question title="Do you want a 3rd party reader? (STiD Readers) — select according to features below:">
          <Radios page={23} q={0} a={a} setA={setA} options={STID_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 24:
      return (
        <Question title="What Type of IRIS reader do you want?— select according to features below:">
          <Radios page={24} q={0} a={a} setA={setA} options={IRIS_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 25:
      return (
        <Question title="What Type of Face recognition reader do you want?">
          <Radios page={25} q={0} a={a} setA={setA} options={FACE_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 26:
      return (
        <Question title="What Type of Morpho Fingerprint reader do you want?">
          <Radios page={26} q={0} a={a} setA={setA} options={MORPHO_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 27:
      return (
        <Question title="What Type of Suprema Fingerprint reader do you want?">
          <Radios page={27} q={0} a={a} setA={setA} options={SUPREMA_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 28:
      return (
        <Question title="What Type of Magnetic Lock do you want?">
          <Radios page={28} q={0} a={a} setA={setA} options={MAGNET_OPTS.map((o) => o.label)} />
        </Question>
      );
    case 29:
      return (
        <Question title="Select Door Accessories that you want">
          <Radios page={29} q={0} a={a} setA={setA} options={ACCESSORY_OPTS.map((o) => o.label)} />
        </Question>
      );
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────────
// RIGHT (parts)
// ──────────────────────────────────────────────────────────────────────
function renderRight(
  page: number,
  a: (p: number, q: number) => number | undefined,
  checks: Checks,
  getQty: (sku: string) => number,
  setQ: (sku: string, n: number) => void,
  addToCart: (sku: string, description: string) => void,
  inCart: (sku: string) => number,
) {
  const wrap = (parts: Array<string | { sku: string; label: string }>, note?: string) => (
    <PartsPanel parts={parts} note={note} getQty={getQty} setQ={setQ} addToCart={addToCart} inCart={inCart} />
  );

  switch (page) {
    case 3: {
      const v = a(3, 0);
      if (v === 0) return wrap(["E-SPE-UPG-V6-LIC"]);
      if (v === 1) return wrap(["E-COR-UPG-V6-LIC"]);
      if (v === 2) return wrap(["E-GLO-UPG-V6-LIC"]);
      return <Hint />;
    }
    case 4:
      return <Hint />;
    case 5: {
      const q0 = a(5, 0);
      const q1 = a(5, 1);
      if (q0 === undefined && q1 !== 0) return <Hint />;
      const items: Array<string | { sku: string; label: string }> = [];
      if (q0 === 0) items.push("E-COR-LIC");
      if (q0 === 1) items.push("E-COR-V9");
      if (q1 === 0) {
        items.push({ sku: "E-COR-RDN", label: "Redundancy" }, { sku: "E-COR-COM", label: "Gateway" });
      }
      if (items.length === 0) return <Hint />;
      return wrap(items);
    }
    case 6:
      return a(6, 0) === 0
        ? wrap([
            { sku: "E-COR-WS1", label: "(1 workstation)" },
            { sku: "E-COR-WS6", label: "(6 workstations)" },
            { sku: "E-COR-WEB-1", label: "(1 web station)" },
            { sku: "E-COR-WEB-3", label: "(3 web stations)" },
            { sku: "E-COR-WEB-10", label: "(10 web stations)" },
            { sku: "E-COR-WEB-25", label: "(25 web stations)" },
          ])
        : <Hint />;
    case 7: {
      const selected = Object.entries(checks).filter(([, v]) => v).map(([k]) => k);
      if (selected.length === 0)
        return <Hint message="Select one or more options on the left to see matching parts." />;
      return wrap(selected);
    }
    case 8:
      return a(8, 0) === 0
        ? wrap(["E-COR-PASS-10", "E-COR-PASS-50", "E-COR-PASS-100", "E-COR-PASS-500"])
        : <Hint />;
    case 9: {
      const v = a(9, 0);
      if (v === undefined) return <Hint />;
      if (v === 0)
        return wrap(["E-COR-DOOR-1", "E-COR-DOOR-4", "E-COR-DOOR-8", "E-COR-DOOR-24", "E-COR-DOOR-48", "E-COR-DOOR-96"]);
      if (v === 1)
        return wrap(["E-COR-SALTO-1", "E-COR-SALTO-5", "E-COR-SALTO-10", "E-COR-SALTO-50", "E-COR-SALTO-100"]);
      return <Hint />;
    }
    case 10:
      return a(10, 0) !== undefined && a(10, 0) !== 1
        ? wrap(["E-COR-KTK-1", "E-COR-KTK-2", "E-COR-KTK-3", "E-COR-KTK-5", "E-COR-KTK-10"])
        : <Hint />;
    case 11: {
      const selected = Object.entries(checks).filter(([, v]) => v).map(([k]) => k);
      const p11 = selected.filter((s) => s === "E-SPE-GLY");
      if (p11.length === 0) return <Hint message="Select the option on the left to see matching parts." />;
      return wrap(p11);
    }
    case 12: {
      const v = a(12, 0);
      if (v === 0)
        return wrap(["E-SPE-DOOR-1", "E-SPE-DOOR-4", "E-SPE-DOOR-8", "E-SPE-DOOR-24", "E-SPE-DOOR-48", "E-SPE-DOOR-96"]);
      return <Hint />;
    }
    case 13: {
      const v = a(13, 0);
      if (v === 0) return wrap(["E-SPE-LIC"]);
      if (v === 1) return wrap(["E-SPE-V8"]);
      return <Hint />;
    }
    case 14: {
      const q0 = a(14, 0);
      const q1 = a(14, 1);
      const items: Array<string | { sku: string; label: string }> = [];
      if (q0 === 0) items.push("E-GLO-LIC");
      if (q0 === 1) items.push("E-GLO-V9");
      if (q1 === 0) {
        items.push(
          { sku: "E-GLO-RDN", label: "Redundancy" },
          { sku: "E-GLO-COM-WIN", label: "16 Gateways" },
          { sku: "E-GLO-CORCOM", label: "40 add Cor Gateways" },
        );
      }
      if (items.length === 0) return <Hint />;
      return wrap(items);
    }
    case 15:
      return a(15, 0) === 0
        ? wrap([
            { sku: "E-GLO-WS1", label: "(1 workstation)" },
            { sku: "E-GLO-WS8", label: "(8 workstations)" },
            { sku: "E-GLO-WEB-1", label: "(1 web station)" },
            { sku: "E-GLO-WEB-3", label: "(3 web stations)" },
            { sku: "E-GLO-WEB-10", label: "(10 web stations)" },
            { sku: "E-GLO-WEB-25", label: "(25 web stations)" },
            { sku: "E-GLO-WEB-50", label: "(50 web stations)" },
          ])
        : <Hint />;
    case 16: {
      const selected = Object.entries(checks).filter(([, v]) => v).map(([k]) => k);
      const p16 = selected.filter((s) => s.startsWith("E-GLO-"));
      if (p16.length === 0)
        return <Hint message="Select one or more options on the left to see matching parts." />;
      return wrap(p16);
    }
    case 17:
      return a(17, 0) === 0
        ? wrap(["E-GLO-PASS-10", "E-GLO-PASS-50", "E-GLO-PASS-100", "E-GLO-PASS-500"])
        : <Hint />;
    case 18: {
      const v = a(18, 0);
      if (v === undefined) return <Hint />;
      if (v === 0)
        return wrap(["E-GLO-DOOR-1", "E-GLO-DOOR-4", "E-GLO-DOOR-8", "E-GLO-DOOR-24", "E-GLO-DOOR-48", "E-GLO-DOOR-96"]);
      if (v === 1)
        return wrap(["E-GLO-SALTO-1", "E-GLO-SALTO-5", "E-GLO-SALTO-10", "E-GLO-SALTO-50", "E-GLO-SALTO-100"]);
      return <Hint />;
    }
    case 19:
      return a(19, 0) !== undefined && a(19, 0) !== 1
        ? wrap(["E-GLO-KTK-1", "E-GLO-KTK-2", "E-GLO-KTK-3", "E-GLO-KTK-5", "E-GLO-KTK-10", "E-GLO-KTK-20"])
        : <Hint />;
    case 20:
      return sheetPart(a(20, 0), CONTROLLER_OPTS, wrap);
    case 21:
      return sheetPart(a(21, 0), IO_OPTS, wrap);
    case 22:
      return sheetPart(a(22, 0), KANTECH_OPTS, wrap);
    case 23:
      return sheetPart(a(23, 0), STID_OPTS, wrap);
    case 24:
      return sheetPart(a(24, 0), IRIS_OPTS, wrap);
    case 25:
      return sheetPart(a(25, 0), FACE_OPTS, wrap);
    case 26:
      return sheetPart(a(26, 0), MORPHO_OPTS, wrap);
    case 27:
      return sheetPart(a(27, 0), SUPREMA_OPTS, wrap);
    case 28:
      return sheetPart(a(28, 0), MAGNET_OPTS, wrap);
    case 29:
      return sheetPart(a(29, 0), ACCESSORY_OPTS, wrap);
    default:
      return <Hint />;
  }
}

function sheetPart(
  v: number | undefined,
  opts: SheetOpt[],
  wrap: (parts: Array<string | { sku: string; label: string }>, note?: string) => React.ReactElement,
) {
  if (v === undefined) return <Hint />;
  const opt = opts[v];
  if (!opt || opt.sku === "NO_NEED") return <Hint message="No parts needed for this selection." />;
  return wrap([opt.sku]);
}

// ──────────────────────────────────────────────────────────────────────
// UI bits
// ──────────────────────────────────────────────────────────────────────
function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground text-balance">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Radios({
  page,
  q,
  a,
  setA,
  options,
}: {
  page: number;
  q: number;
  a: (p: number, q: number) => number | undefined;
  setA: (p: number, q: number, v: number) => void;
  options: string[];
}) {
  const val = a(page, q);
  return (
    <ul className="space-y-2">
      {options.map((opt, i) => {
        const sel = val === i;
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => setA(page, q, i)}
              className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                sel
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-background hover:border-accent/60 hover:bg-secondary"
              }`}
            >
              <span
                className={`inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                  sel ? "border-accent bg-accent" : "border-muted-foreground/50"
                }`}
              >
                {sel && <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />}
              </span>
              {opt}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function CheckList({
  options,
  checks,
  setChecks,
}: {
  options: { sku: string; label: string }[];
  checks: Checks;
  setChecks: React.Dispatch<React.SetStateAction<Checks>>;
}) {
  return (
    <ul className="space-y-2">
      {options.map((o) => {
        const sel = !!checks[o.sku];
        return (
          <li key={o.sku}>
            <button
              type="button"
              onClick={() => setChecks((c) => ({ ...c, [o.sku]: !c[o.sku] }))}
              className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                sel
                  ? "border-accent bg-accent/10"
                  : "border-border bg-background hover:border-accent/60 hover:bg-secondary"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-sm border ${
                  sel ? "border-accent bg-accent" : "border-muted-foreground/50"
                }`}
              >
                {sel && <Check className="h-3 w-3 text-accent-foreground" />}
              </span>
              <span>{o.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Hint({ message }: { message?: string } = {}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
      {message ?? "Make a selection on the left to see matching parts."}
    </div>
  );
}

function PartsPanel({
  parts,
  note,
  getQty,
  setQ,
  addToCart,
  inCart,
}: {
  parts: Array<string | { sku: string; label: string }>;
  note?: string;
  getQty: (sku: string) => number;
  setQ: (sku: string, n: number) => void;
  addToCart: (sku: string, description: string) => void;
  inCart: (sku: string) => number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Parts</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {note ?? `${parts.length} part${parts.length === 1 ? "" : "s"} found`}
        </span>
      </div>
      <ul className="space-y-2">
        {parts.map((item) => {
          const sku = typeof item === "string" ? item : item.sku;
          const description = typeof item === "string" ? "" : item.label;
          const q = getQty(sku);
          const count = inCart(sku);
          return (
            <li key={sku} className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-base font-bold tracking-wide text-brand">{sku}</div>
                {description && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">{description}</p>
                )}
                {count > 0 && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-brand-accent">
                    <CheckCircle2 className="h-3 w-3" /> {count} in cart
                  </div>
                )}
              </div>
              <div className="flex items-center rounded-md border border-border">
                <button
                  type="button"
                  onClick={() => setQ(sku, q - 1)}
                  className="px-2 py-1 text-muted-foreground hover:text-foreground"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{q}</span>
                <button
                  type="button"
                  onClick={() => setQ(sku, q + 1)}
                  className="px-2 py-1 text-muted-foreground hover:text-foreground"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => addToCart(sku, description)}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:opacity-90"
              >
                <ShoppingCart className="h-3.5 w-3.5" /> Add
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
