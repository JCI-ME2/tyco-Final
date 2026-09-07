'use client'

import { useState } from 'react'
import { read, utils, writeFile, type WorkBook } from 'xlsx'
import { ArrowDownToLine, Check, FileSpreadsheet, LoaderCircle, Upload, X } from 'lucide-react'

type Cell = string | number | null
type Processed = { workbook: WorkBook; rows: Cell[][]; filename: string; sourceRows: number; groups: number }

const regions = [
  'EGYPT',
  'GCC 1',
  'GCC 2',
  'ME 1',
  'ME 2',
  'NE AFRICA',
  'SW AFRICA',
  'GERMANY/AUSTRIA',
  'GREECE/CYPRUS/ITALY',
  'FRANCE/SWISS',
  'IBERIA',
  'ISRAEL',
  'NORDICS',
  'POLAND & BALTICS',
  'TURKEY',
  'UK&I',
  'BALKANS',
  'BENELUX',
  'CENTRAL EUROPE',
] as const
const finalHeaders = ['Planner', 'CUSTOMER NAME', 'Total', 'ORDER NO.', 'PART NUMBER', 'DESCRIPTION', 'QUANTITY', 'UNIT PRICE', 'Unit Price Total', 'REGION']
const normalize = (value: unknown) => String(value ?? '').trim().toUpperCase()
const asNumber = (value: unknown) => {
  const cleaned = String(value ?? '').replaceAll(',', '').replaceAll('$', '').trim()
  const number = Number(cleaned.startsWith('(') && cleaned.endsWith(')') ? `-${cleaned.slice(1, -1)}` : cleaned)
  return Number.isFinite(number) ? number : 0
}
const withoutDollarSigns = (value: Cell): Cell => typeof value === 'string' ? value.replaceAll('$', '') : value

function transform(workbook: WorkBook, filename: string, selectedRegion?: string): Processed {
  const source = workbook.Sheets[workbook.SheetNames.find((name) => normalize(name) === 'ACVS OPEN SO DATA') ?? workbook.SheetNames[0]]
  const matrix = utils.sheet_to_json(source, { header: 1, defval: null, raw: false }) as Cell[][]
  const headerIndex = matrix.findIndex((row) => row.some((cell) => normalize(cell) === 'ORDER NO.'))
  if (headerIndex < 0) throw new Error('Could not find an ORDER NO. header in the selected sheet.')
  const headers = matrix[headerIndex].map((cell) => String(cell ?? '').trim())
  const index = new Map(headers.map((header, i) => [normalize(header), i]))
  const needed = ['PLANNER', 'CUSTOMER NAME', 'ORDER NO.', 'PART NUMBER', 'DESCRIPTION', 'QUANTITY', 'UNIT PRICE', 'UNIT PRICE TOTAL', 'REGION']
  const missing = needed.filter((header) => !index.has(header))
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(', ')}`)
  const rows = matrix.slice(headerIndex + 1).map((row) => needed.map((header) => row[index.get(header)!] ?? null)).filter((row) => row.some((cell) => cell !== null && String(cell).trim() !== '')).filter((row) => !selectedRegion || normalize(row[8]) === normalize(selectedRegion))
  rows.sort((a, b) => String(a[1] ?? '').localeCompare(String(b[1] ?? ''), undefined, { numeric: true }) || String(a[2] ?? '').localeCompare(String(b[2] ?? ''), undefined, { numeric: true }))
  const output: Cell[][] = [
    finalHeaders,
    ...rows.map((row) => [row[0], row[1], null, row[2], row[3], row[4], row[5], asNumber(row[6]), asNumber(row[7]), row[8]].map(withoutDollarSigns)),
  ]
  let groups = 0
  for (let start = 1; start < output.length;) {
    let end = start
    while (end + 1 < output.length && normalize(output[end + 1][1]) === normalize(output[start][1]) && normalize(output[end + 1][2]) === normalize(output[start][2])) end++
    if (end > start) { groups++ }
    start = end + 1
  }
  const sheet = utils.aoa_to_sheet(output)
  const merges: NonNullable<typeof sheet['!merges']> = []
  for (const column of [1, 2, 3]) {
    for (let start = 1; start < output.length;) {
      let end = start
      while (
        end + 1 < output.length &&
        (column === 2
          ? normalize(output[end + 1][1]) === normalize(output[start][1]) && normalize(output[end + 1][3]) === normalize(output[start][3])
          : normalize(output[end + 1][column]) === normalize(output[start][column]))
      ) end++
      if (end > start) merges.push({ s: { r: start, c: column }, e: { r: end, c: column } })
      start = end + 1
    }
  }
  for (const merge of merges.filter(({ s }) => s.c === 2)) {
    const address = utils.encode_cell(merge.s)
    sheet[address] = {
      f: `SUM(I${merge.s.r + 1}:I${merge.e.r + 1})`,
      t: 'n',
      s: { alignment: { horizontal: 'center', vertical: 'center' } },
    }
  }
  sheet['!merges'] = merges
  sheet['!cols'] = finalHeaders.map((header) => ({ wch: Math.max(12, Math.min(28, header.length + 4)) }))
  const range = utils.decode_range(sheet['!ref'] ?? 'A1')
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let column = range.s.c; column <= range.e.c; column++) {
      const address = utils.encode_cell({ r: row, c: column })
      if (sheet[address]) sheet[address].s = { ...(sheet[address].s ?? {}), alignment: { horizontal: 'center', vertical: 'center' } }
    }
  }
  const result = utils.book_new(); utils.book_append_sheet(result, sheet, 'ACVS Open SO DATA')
  return { workbook: result, rows: output, filename: `${filename.replace(/\.xlsx?$/i, '')}-processed.xlsx`, sourceRows: rows.length, groups }
}

export default function BacklogPage() {
  const [processed, setProcessed] = useState<Processed | null>(null); const [sourceWorkbook, setSourceWorkbook] = useState<WorkBook | null>(null); const [sourceFilename, setSourceFilename] = useState(''); const [selectedRegion, setSelectedRegion] = useState(''); const [status, setStatus] = useState('Waiting for workbook'); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function handleFile(file?: File) { if (!file) return; setBusy(true); setError(''); setSelectedRegion(''); setStatus('Reading workbook…'); try { const workbook = read(await file.arrayBuffer(), { cellDates: true }); const result = transform(workbook, file.name); setSourceWorkbook(workbook); setSourceFilename(file.name); setProcessed(result); setStatus('Select a region to export') } catch (caught) { setStatus('Could not process workbook'); setError(caught instanceof Error ? caught.message : 'Unexpected workbook error') } finally { setBusy(false) } }
  function handleRegionChange(region: string) { setSelectedRegion(region); if (sourceWorkbook && sourceFilename && region) { setProcessed(transform(sourceWorkbook, sourceFilename, region)); setStatus('Ready to export') } }
  function exportFile() { if (processed && selectedRegion) writeFile(processed.workbook, processed.filename, { compression: true, cellStyles: true }) }
  const preview = processed?.rows.slice(0, 7) ?? []
  return <main className="min-h-screen bg-background text-foreground"><header className="border-b border-border bg-card"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5"><div className="flex items-center gap-3"><img src="/JCI_logo.png" alt="Johnson Controls" className="h-10 w-auto object-contain" /><div className="h-8 w-px bg-border" /><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Backlog Filed</p></div></div><span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">v1.0 · EMEA</span></div></header><div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.8fr_1.2fr]"><section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold">Process a report</h3><p className="mt-1 text-sm text-muted-foreground">.xlsx files only · nothing leaves this browser</p></div>{busy ? <LoaderCircle className="animate-spin text-primary" /> : processed ? <Check className="text-primary" /> : <FileSpreadsheet className="text-muted-foreground" />}</div><label className="mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary/40 bg-primary/[0.03] px-6 text-center transition hover:bg-primary/[0.06]"><Upload className="mb-3 text-primary" size={25} /><span className="font-medium">Choose the latest workbook</span><span className="mt-1 text-sm text-muted-foreground">Select a file to begin the transformation</span><input type="file" accept=".xlsx,.xls" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0])} /></label><div className="mt-5 border-t border-border pt-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="flex-1"><label htmlFor="region" className="text-sm font-medium">Region for export</label><select id="region" value={selectedRegion} onChange={(event) => handleRegionChange(event.target.value)} disabled={!processed || busy} className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"><option value="">Select a region</option>{regions.map((region) => <option key={region} value={region}>{region}</option>)}</select></div><button onClick={exportFile} disabled={!processed || !selectedRegion || busy} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"><ArrowDownToLine size={16} /> Download XLSX</button></div><div className="mt-3"><p className="text-sm font-medium">{status}</p>{processed && <p className="mt-1 text-xs text-muted-foreground">{processed.sourceRows.toLocaleString()} rows · {processed.groups} grouped orders</p>}</div></div>{error && <div className="mt-4 flex gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><X size={16} className="mt-0.5 shrink-0" />{error}</div>}</section></div>{processed && <section className="mx-auto max-w-6xl px-6 pb-12"><div className="mb-4 flex items-end justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Output preview</p><h3 className="mt-1 text-xl font-semibold">First rows after formatting</h3></div><p className="font-mono text-xs text-muted-foreground">{processed.filename}</p></div><div className="overflow-hidden rounded-xl border border-border bg-card"><div className="overflow-x-auto"><table className="min-w-[900px] w-full border-collapse text-left text-sm"><thead className="bg-muted/60"><tr>{preview[0]?.map((cell, i) => <th key={i} className="border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{String(cell ?? '')}</th>)}</tr></thead><tbody>{preview.slice(1).map((row, i) => <tr key={i} className="hover:bg-muted/30">{row.map((cell, j) => <td key={j} className="border-b border-border px-4 py-3 last:border-0">{String(cell ?? '')}</td>)}</tr>)}</tbody></table></div></div></section>}</main>
}
