// Loads all dropdown values from a published Google Sheet (Excel workbook).
//
// The workbook has ONE TAB PER INPUT (sheet names are case-sensitive):
//
//   Tab "JobFunction"     col A: Job Function
//   Tab "Position"        col A: Job Function     col B: Position
//   Tab "ResumeSource"    col A: Resume Source
//   Tab "CountryCode"     col A: Code   col B: Country   col C: Flag
//   Tab "Gender"          col A: Gender
//   Tab "MaritalStatus"   col A: Marital Status
//   Tab "Qualification"   col A: Qualification   col B: Needs Department (Yes/No)
//
// Row 1 of every tab is a header row.
//
// SETUP:
//   1. Import public/options-template.xlsx into Google Sheets (File -> Import).
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
  gender: 'Gender',
  maritalStatus: 'MaritalStatus',
  qualification: 'Qualification'
} as const;

type GvizCell = { v: unknown } | null;
type GvizRow = { c: GvizCell[] };

function parseGviz(text: string): { cols: string[]; rows: GvizRow[] } {
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

async function fetchTab(sheetId: string, tab: string, signal?: AbortSignal): Promise<{ cols: string[]; rows: GvizRow[] }> {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Tab "${tab}" request failed (${res.status})`);
  return parseGviz(await res.text());
}

// Column index by fuzzy header name, else positional fallback
const colIndex = (cols: string[], names: string[], fallback: number): number => {
  const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
  const wanted = names.map(norm);
  for (let i = 0; i < cols.length; i++) {
    if (wanted.includes(norm(cols[i]))) return i;
  }
  return fallback;
};

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
    genderR,
    maritalR,
    qualificationR
  ] = await Promise.allSettled([
    load(TABS.jobFunction),
    load(TABS.position),
    load(TABS.resumeSource),
    load(TABS.countryCode),
    load(TABS.gender),
    load(TABS.maritalStatus),
    load(TABS.qualification)
  ]);

  if (
    [jobFunctionR, positionR, resumeSourceR, countryCodeR, genderR, maritalR, qualificationR]
      .every((r) => r.status === 'rejected')
  ) {
    throw new Error('Could not read any tab from the Google Sheet');
  }

  const firstColValues = (r: PromiseSettledResult<{ cols: string[]; rows: GvizRow[] }>): string[] =>
    r.status === 'fulfilled'
      ? r.value.rows.map((row) => cellText(row, 0)).filter(Boolean)
      : [];

  // Job Functions
  const jobFunctions = firstColValues(jobFunctionR);

  // Positions grouped by Job Function
  const positionsByJobFunction: Record<string, string[]> = {};
  for (const jf of jobFunctions) positionsByJobFunction[jf] = [];
  if (positionR.status === 'fulfilled') {
    const { cols, rows } = positionR.value;
    const gi = colIndex(cols, ['jobfunction', 'group', 'function'], 0);
    const pi = colIndex(cols, ['position', 'value', 'role'], 1);
    for (const row of rows) {
      const grp = cellText(row, gi);
      const pos = cellText(row, pi);
      if (!grp || !pos) continue;
      if (!positionsByJobFunction[grp]) positionsByJobFunction[grp] = [];
      positionsByJobFunction[grp].push(pos);
    }
  }

  // Resume Sources
  const resumeSources = firstColValues(resumeSourceR);

  // Country Codes
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

  // Gender / Marital Status
  const genders = firstColValues(genderR);
  const maritalStatuses = firstColValues(maritalR);

  // Qualifications (+ which need a department field)
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
    genders: genders.length ? genders : DEFAULT_OPTIONS.genders,
    maritalStatuses: maritalStatuses.length ? maritalStatuses : DEFAULT_OPTIONS.maritalStatuses,
    qualifications: qualifications.length ? qualifications : DEFAULT_OPTIONS.qualifications,
    qualificationsNeedingDepartment: qualificationsNeedingDepartment.length
      ? qualificationsNeedingDepartment
      : DEFAULT_OPTIONS.qualificationsNeedingDepartment
  };
}
