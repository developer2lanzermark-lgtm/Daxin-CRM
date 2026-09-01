// Reads dropdown values from a published Google Sheet (optional override).
// Set VITE_OPTIONS_SHEET_ID to enable it. Each tab is fetched as gviz JSON.
// Tab names + columns match public/options.xlsx (see optionsParse.ts / README).

import { buildAppOptions, TAB_NAMES, type TabName, type TabRows } from './optionsParse';
import type { AppOptions } from './optionDefaults';

const FALLBACK_SHEET_ID = '';

export const OPTIONS_SHEET_ID: string =
  (import.meta.env.VITE_OPTIONS_SHEET_ID as string | undefined)?.trim() || FALLBACK_SHEET_ID;

type GvizCell = { v: unknown } | null;
type GvizRow = { c: GvizCell[] };

function gvizToRows(text: string): TabRows {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Unexpected Google Sheet response');
  const json = JSON.parse(text.slice(start, end + 1));
  const header: string[] = (json.table?.cols || []).map((c: { label?: string }) =>
    (c.label || '').trim()
  );
  const rows: string[][] = (json.table?.rows || []).map((r: GvizRow) =>
    (r.c || []).map((c) => (c && c.v != null ? String(c.v).trim() : ''))
  );
  return [header, ...rows];
}

async function fetchTab(sheetId: string, tab: string, signal?: AbortSignal): Promise<TabRows> {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Tab "${tab}" failed (${res.status})`);
  return gvizToRows(await res.text());
}

export async function fetchOptionsFromSheet(signal?: AbortSignal): Promise<AppOptions> {
  if (!OPTIONS_SHEET_ID) {
    throw new Error('No Google Sheet configured (VITE_OPTIONS_SHEET_ID is empty)');
  }

  const results = await Promise.allSettled(
    TAB_NAMES.map((t) => fetchTab(OPTIONS_SHEET_ID, t, signal))
  );

  if (results.every((r) => r.status === 'rejected')) {
    throw new Error('Could not read any tab from the Google Sheet');
  }

  const tabs: Partial<Record<TabName, TabRows>> = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') tabs[TAB_NAMES[i]] = r.value;
  });

  return buildAppOptions(tabs);
}
