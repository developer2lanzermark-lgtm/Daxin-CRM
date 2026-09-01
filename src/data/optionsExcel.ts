// Reads dropdown values from an Excel workbook bundled with the app
// (public/options.xlsx). This is what a company editing their own copy
// would change: edit the file, commit, redeploy.

import { buildAppOptions, TAB_NAMES, type TabName, type TabRows } from './optionsParse';
import type { AppOptions } from './optionDefaults';

// Vite serves /public at BASE_URL; this file ships in the build output.
export const OPTIONS_EXCEL_URL = `${import.meta.env.BASE_URL}options.xlsx`;

export async function fetchOptionsFromExcel(signal?: AbortSignal): Promise<AppOptions> {
  const res = await fetch(OPTIONS_EXCEL_URL, { signal, cache: 'no-cache' });
  if (!res.ok) throw new Error(`options.xlsx not found (${res.status})`);

  const buf = await res.arrayBuffer();
  const XLSX = await import('xlsx'); // lazy: keeps the parser out of the initial bundle
  const wb = XLSX.read(buf, { type: 'array' });

  const tabs: Partial<Record<TabName, TabRows>> = {};
  for (const name of TAB_NAMES) {
    const sheet = wb.Sheets[name];
    if (!sheet) continue;
    tabs[name] = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      blankrows: false,
      defval: ''
    }) as TabRows;
  }

  if (Object.keys(tabs).length === 0) {
    throw new Error('options.xlsx has none of the expected tabs');
  }

  return buildAppOptions(tabs);
}
