// Turns the current AppOptions back into an options.xlsx download,
// so edits made on the Settings page can replace public/options.xlsx.

import type { AppOptions } from './optionDefaults';

export async function downloadOptionsXlsx(options: AppOptions, fileName = 'options.xlsx') {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();
  const add = (name: string, rows: (string | number)[][]) =>
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);

  add('JobFunction', [['Job Function'], ...options.jobFunctions.map((v) => [v])]);

  add('Position', [
    ['Job Function', 'Position'],
    ...Object.entries(options.positionsByJobFunction).flatMap(([jf, list]) =>
      list.map((p) => [jf, p])
    )
  ]);

  add('ResumeSource', [['Resume Source'], ...options.resumeSources.map((v) => [v])]);

  add('CountryCode', [
    ['Code', 'Country', 'Flag'],
    ...options.countryCodes.map((c) => [c.code, c.label, c.flag])
  ]);

  add('State', [
    ['Country Code', 'State'],
    ...Object.entries(options.statesByCountryCode).flatMap(([cc, list]) =>
      list.map((s) => [cc, s])
    )
  ]);

  add('City', [
    ['State', 'City'],
    ...Object.entries(options.citiesByState).flatMap(([st, list]) => list.map((c) => [st, c]))
  ]);

  add('Qualification', [
    ['Qualification', 'Needs Department'],
    ...options.qualifications.map((q) => [
      q,
      options.qualificationsNeedingDepartment.includes(q) ? 'Yes' : 'No'
    ])
  ]);

  XLSX.writeFile(wb, fileName);
}
