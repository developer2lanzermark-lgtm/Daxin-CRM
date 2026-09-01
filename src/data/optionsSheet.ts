// Loads all dropdown values from a published Google Sheet.
//
// SETUP (one time):
//   1. Create a Google Sheet with a single tab named exactly:  Options
//   2. Row 1 headers (exact, case-sensitive):  Category | Group | Value | Label
//   3. Fill rows (see README / options-template.csv for the full list). Examples:
//        JobFunction   |            | Developer                  |
//        Position      | Developer  | Frontend Developer (React) |
//        ResumeSource  |            | Email                      |
//        CountryCode   |            | +91                        | India | 🇮🇳
//        Gender        |            | Male                       |
//        Qualification |            | UG                         | needsDepartment
//   4. File -> Share -> Publish to web -> Entire document -> Publish
//   5. Copy the Sheet ID from the URL:
//        https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit
//   6. In Render: Environment -> add  VITE_OPTIONS_SHEET_ID = <SHEET_ID>
//      (or paste it into FALLBACK_SHEET_ID below and commit)

import { DEFAULT_OPTIONS, type AppOptions, type CountryCodeOption } from './optionDefaults';

// Optional: hard-code the sheet id here instead of using an env var.
const FALLBACK_SHEET_ID = '';

const TAB_NAME = 'Options';

export const OPTIONS_SHEET_ID: string =
  (import.meta.env.VITE_OPTIONS_SHEET_ID as string | undefined)?.trim() || FALLBACK_SHEET_ID;

interface SheetRow {
  category: string;
  group: string;
  value: string;
  label: string;
}

// gviz returns:  /*O_o*/\ngoogle.visualization.Query.setResponse({...});
function parseGvizResponse(text: string): SheetRow[] {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Unexpected Google Sheet response');

  const json = JSON.parse(text.slice(start, end + 1));
  const cols: string[] = (json.table.cols || []).map((c: { label?: string }) =>
    (c.label || '').trim().toLowerCase()
  );

  // Support either labelled header row OR positional columns A-D
  const idx = (name: string, fallback: number) => {
    const found = cols.indexOf(name);
    return found === -1 ? fallback : found;
  };
  const ci = idx('category', 0);
  const gi = idx('group', 1);
  const vi = idx('value', 2);
  const li = idx('label', 3);

  const cell = (row: { c: ({ v: unknown } | null)[] }, i: number) => {
    const c = row.c?.[i];
    return c && c.v != null ? String(c.v).trim() : '';
  };

  return (json.table.rows || [])
    .map((r: { c: ({ v: unknown } | null)[] }) => ({
      category: cell(r, ci),
      group: cell(r, gi),
      value: cell(r, vi),
      label: cell(r, li)
    }))
    .filter((r: SheetRow) => r.category && r.value);
}

function rowsToOptions(rows: SheetRow[]): AppOptions {
  const norm = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');

  const jobFunctions: string[] = [];
  const positionsByJobFunction: Record<string, string[]> = {};
  const resumeSources: string[] = [];
  const countryCodes: CountryCodeOption[] = [];
  const genders: string[] = [];
  const maritalStatuses: string[] = [];
  const qualifications: string[] = [];
  const qualificationsNeedingDepartment: string[] = [];

  for (const row of rows) {
    switch (norm(row.category)) {
      case 'jobfunction':
      case 'jobfunctions':
        if (!jobFunctions.includes(row.value)) jobFunctions.push(row.value);
        if (!positionsByJobFunction[row.value]) positionsByJobFunction[row.value] = [];
        break;
      case 'position':
      case 'positions': {
        const grp = row.group || 'Others';
        if (!positionsByJobFunction[grp]) positionsByJobFunction[grp] = [];
        positionsByJobFunction[grp].push(row.value);
        break;
      }
      case 'resumesource':
      case 'resumesources':
      case 'source':
        resumeSources.push(row.value);
        break;
      case 'countrycode':
      case 'countrycodes':
        countryCodes.push({
          code: row.value,
          label: row.label || row.group || '',
          flag: row.group && row.group.length <= 4 ? row.group : ''
        });
        break;
      case 'gender':
      case 'genders':
        genders.push(row.value);
        break;
      case 'maritalstatus':
      case 'maritalstatuses':
        maritalStatuses.push(row.value);
        break;
      case 'qualification':
      case 'qualifications':
        qualifications.push(row.value);
        if (norm(row.label) === 'needsdepartment' || norm(row.label) === 'department') {
          qualificationsNeedingDepartment.push(row.value);
        }
        break;
      default:
        break;
    }
  }

  // Ensure every job function has a positions bucket
  for (const jf of jobFunctions) {
    if (!positionsByJobFunction[jf]) positionsByJobFunction[jf] = [];
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

export async function fetchOptionsFromSheet(signal?: AbortSignal): Promise<AppOptions> {
  if (!OPTIONS_SHEET_ID) {
    throw new Error('No Google Sheet configured (VITE_OPTIONS_SHEET_ID is empty)');
  }

  const url =
    `https://docs.google.com/spreadsheets/d/${OPTIONS_SHEET_ID}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(TAB_NAME)}`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Google Sheet request failed (${res.status})`);

  const text = await res.text();
  const rows = parseGvizResponse(text);
  if (!rows.length) throw new Error('Google Sheet "Options" tab is empty');

  return rowsToOptions(rows);
}
