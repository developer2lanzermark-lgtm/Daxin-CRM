// Shared logic that turns raw tab rows (from a Google Sheet OR an Excel file)
// into the AppOptions object the app uses.

import { DEFAULT_OPTIONS, type AppOptions, type CountryCodeOption } from './optionDefaults';

export type TabRows = string[][]; // row 0 = header row

export const TAB_NAMES = [
  'JobFunction',
  'Position',
  'ResumeSource',
  'CountryCode',
  'State',
  'City',
  'Qualification'
] as const;
export type TabName = (typeof TAB_NAMES)[number];

const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');
const isYes = (s: string) => /^(y|yes|true|1|✓)$/i.test(s.trim());

function colIndex(header: string[], names: string[], fallback: number): number {
  const wanted = names.map(norm);
  for (let i = 0; i < header.length; i++) {
    if (wanted.includes(norm(header[i] || ''))) return i;
  }
  return fallback;
}

// value rows (skip header)
const body = (rows?: TabRows): string[][] => (rows && rows.length > 1 ? rows.slice(1) : []);
const firstCol = (rows?: TabRows): string[] =>
  body(rows)
    .map((r) => (r[0] ?? '').toString().trim())
    .filter(Boolean);

function groupTwoCols(
  rows: TabRows | undefined,
  keyNames: string[],
  valueNames: string[]
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (!rows || rows.length < 2) return out;
  const ki = colIndex(rows[0], keyNames, 0);
  const vi = colIndex(rows[0], valueNames, 1);
  for (const row of rows.slice(1)) {
    const k = (row[ki] ?? '').toString().trim();
    const v = (row[vi] ?? '').toString().trim();
    if (!k || !v) continue;
    (out[k] ||= []).push(v);
  }
  return out;
}

export function buildAppOptions(tabs: Partial<Record<TabName, TabRows>>): AppOptions {
  const jobFunctions = firstCol(tabs.JobFunction);

  const positionsByJobFunction = groupTwoCols(
    tabs.Position,
    ['jobfunction', 'group', 'function'],
    ['position', 'value', 'role']
  );
  for (const jf of jobFunctions) positionsByJobFunction[jf] ||= [];

  const resumeSources = firstCol(tabs.ResumeSource);

  let countryCodes: CountryCodeOption[] = [];
  const cc = tabs.CountryCode;
  if (cc && cc.length > 1) {
    const codeI = colIndex(cc[0], ['code', 'dialcode', 'countrycode'], 0);
    const nameI = colIndex(cc[0], ['country', 'label', 'name'], 1);
    const flagI = colIndex(cc[0], ['flag', 'emoji'], 2);
    countryCodes = cc
      .slice(1)
      .map((r) => ({
        code: (r[codeI] ?? '').toString().trim(),
        label: (r[nameI] ?? '').toString().trim(),
        flag: (r[flagI] ?? '').toString().trim()
      }))
      .filter((c) => c.code);
  }

  const statesByCountryCode = groupTwoCols(
    tabs.State,
    ['countrycode', 'code', 'country'],
    ['state', 'province', 'value']
  );
  const citiesByState = groupTwoCols(tabs.City, ['state', 'province'], ['city', 'value']);

  const qualifications: string[] = [];
  const qualificationsNeedingDepartment: string[] = [];
  const q = tabs.Qualification;
  if (q && q.length > 1) {
    const qi = colIndex(q[0], ['qualification', 'value', 'level'], 0);
    const di = colIndex(q[0], ['needsdepartment', 'department', 'needsspecialization'], 1);
    for (const row of q.slice(1)) {
      const name = (row[qi] ?? '').toString().trim();
      if (!name) continue;
      qualifications.push(name);
      if (isYes((row[di] ?? '').toString())) qualificationsNeedingDepartment.push(name);
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
