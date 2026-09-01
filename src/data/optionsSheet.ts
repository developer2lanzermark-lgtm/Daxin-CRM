// Loads dropdown values from a published Google Sheet.
//
// The Google Sheet has ONE TAB PER INPUT (sheet/tab names are case-sensitive):
//
//   Tab "JobFunction"     col A: Job Function
//   Tab "Position"        col A: Job Function     col B: Position
//   Tab "ResumeSource"    col A: Resume Source
//   Tab "CountryCode"     col A: Code   col B: Country   col C: Flag
//   Tab "State"           col A: Country Code   col B: State
//   Tab "City"            col A: State          col B: City
//   Tab "Qualification"   col A: Qualification  col B: Needs Department (Yes/No)
//
// Row 1 of every tab is a header row.
// (Gender and Marital Status are NOT in the sheet - they are fixed in the app.)
//
// SETUP:
//   1. Build the tabs above in a Google Sheet (see README for the starter values).
//   2. File -> Share -> Publish to web -> Publish. Share: Anyone with link = Viewer.
//   3. Copy the id from the URL .../spreadsheets/d/<ID>/edit
//   4. Render -> Environment -> VITE_OPTIONS_SHEET_ID = <ID>  (or set FALLBACK_SHEET_ID below)

import { DEFAULT_OPTIONS, type AppOptions, type CountryCodeOption } from './optionDefaults';

const FALLBACK_SHEET_ID = '';

export const OPTIONS_SHEET_ID: string =
  (import.meta.env.VITE_OPTIONS_SHEET_ID as string | undefined)?.trim() || FALLBACK_SHEET_ID;

const TABS = {
  jobFunction: 'JobFunction',
  position: 'Position',
  resumeSource: 'ResumeSource',
  countryCode: 'CountryCode',
  state: 'State',
  city: 'City',
  qualification: 'Qualification'
} as const;

type GvizCell = { v: unknown } | null;
type GvizRow = { c: GvizCell[] };
type Tab = { cols: string[]; rows: GvizRow[] };

function parseGviz(text: string): Tab {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Unexpected Google Sheet response');
  const json = JSON.parse(text.slice(start, end + 1));
  const cols: string[] = (json.table?.cols || []).map((c: { label?: string }) =>
    (c.label || '').trim().toLowerCase()
  );
  return { cols, rows: json.table?.rows || [] };
}

const cellText = (row: GvizRow, i: number): string => {
  const c = row.c?.[i];
  return c && c.v != null ? String(c.v).trim() : '';
};

const isYes = (s: string) => /^(y|yes|true|1|✓)$/i.test(s.trim());

async function fetchTab(sheetId: string, tab: string, signal?: AbortSignal): Promise<Tab> {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Tab "${tab}" request failed (${res.status})`);
  return parseGviz(await res.text());
}

const colIndex = (cols: string[], names: string[], fallback: number): number => {
  const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
  const wanted = names.map(norm);
  for (let i = 0; i < cols.length; i++) {
    if (wanted.includes(norm(cols[i]))) return i;
  }
  return fallback;
};

const firstColValues = (r: PromiseSettledResult<Tab>): string[] =>
  r.status === 'fulfilled' ? r.value.rows.map((row) => cellText(row, 0)).filter(Boolean) : [];

// Build a grouped map from a two-column tab: key column -> list of value column
function groupTwoCols(
  r: PromiseSettledResult<Tab>,
  keyNames: string[],
  valueNames: string[]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (r.status !== 'fulfilled') return out;
  const ki = colIndex(r.value.cols, keyNames, 0);
  const vi = colIndex(r.value.cols, valueNames, 1);
  for (const row of r.value.rows) {
    const k = cellText(row, ki);
    const v = cellText(row, vi);
    if (!k || !v) continue;
    (out[k] ||= []).push(v);
  }
  return out;
}

export async function fetchOptionsFromSheet(signal?: AbortSignal): Promise<AppOptions> {
  if (!OPTIONS_SHEET_ID) {
    throw new Error('No Google Sheet configured (VITE_OPTIONS_SHEET_ID is empty)');
  }

  const load = (tab: string) => fetchTab(OPTIONS_SHEET_ID, tab, signal);

  const [
    jobFunctionR,
    positionR,
    resumeSourceR,
    countryCodeR,
    stateR,
    cityR,
    qualificationR
  ] = await Promise.allSettled([
    load(TABS.jobFunction),
    load(TABS.position),
    load(TABS.resumeSource),
    load(TABS.countryCode),
    load(TABS.state),
    load(TABS.city),
    load(TABS.qualification)
  ]);

  if (
    [jobFunctionR, positionR, resumeSourceR, countryCodeR, stateR, cityR, qualificationR]
      .every((r) => r.status === 'rejected')
  ) {
    throw new Error('Could not read any tab from the Google Sheet');
  }

  const jobFunctions = firstColValues(jobFunctionR);

  const positionsByJobFunction = groupTwoCols(
    positionR,
    ['jobfunction', 'group', 'function'],
    ['position', 'value', 'role']
  );
  for (const jf of jobFunctions) positionsByJobFunction[jf] ||= [];

  const resumeSources = firstColValues(resumeSourceR);

  let countryCodes: CountryCodeOption[] = [];
  if (countryCodeR.status === 'fulfilled') {
    const { cols, rows } = countryCodeR.value;
    const codeI = colIndex(cols, ['code', 'dialcode', 'countrycode'], 0);
    const nameI = colIndex(cols, ['country', 'label', 'name'], 1);
    const flagI = colIndex(cols, ['flag', 'emoji'], 2);
    countryCodes = rows
      .map((row) => ({
        code: cellText(row, codeI),
        label: cellText(row, nameI),
        flag: cellText(row, flagI)
      }))
      .filter((c) => c.code);
  }

  const statesByCountryCode = groupTwoCols(
    stateR,
    ['countrycode', 'code', 'country'],
    ['state', 'province', 'value']
  );

  const citiesByState = groupTwoCols(cityR, ['state', 'province'], ['city', 'value']);

  const qualifications: string[] = [];
  const qualificationsNeedingDepartment: string[] = [];
  if (qualificationR.status === 'fulfilled') {
    const { cols, rows } = qualificationR.value;
    const qi = colIndex(cols, ['qualification', 'value', 'level'], 0);
    const di = colIndex(cols, ['needsdepartment', 'department', 'needsspecialization'], 1);
    for (const row of rows) {
      const q = cellText(row, qi);
      if (!q) continue;
      qualifications.push(q);
      if (isYes(cellText(row, di))) qualificationsNeedingDepartment.push(q);
    }
  }

  return {
    jobFunctions: jobFunctions.length ? jobFunctions : DEFAULT_OPTIONS.jobFunctions,
    positionsByJobFunction: Object.keys(positionsByJobFunction).length
      ? positionsByJobFunction
      : DEFAULT_OPTIONS.positionsByJobFunction,
    resumeSources: resumeSources.length ? resumeSources : DEFAULT_OPTIONS.resumeSources,
    countryCodes: countryCodes.length ? countryCodes : DEFAULT_OPTIONS.countryCodes,
    statesByCountryCode: Object.keys(statesByCountryCode).length
      ? statesByCountryCode
      : DEFAULT_OPTIONS.statesByCountryCode,
    citiesByState: Object.keys(citiesByState).length
      ? citiesByState
      : DEFAULT_OPTIONS.citiesByState,
    qualifications: qualifications.length ? qualifications : DEFAULT_OPTIONS.qualifications,
    qualificationsNeedingDepartment: qualificationsNeedingDepartment.length
      ? qualificationsNeedingDepartment
      : DEFAULT_OPTIONS.qualificationsNeedingDepartment
  };
}
