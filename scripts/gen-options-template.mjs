// Regenerates public/options-template.xlsx from the built-in defaults.
// Run:  node scripts/gen-options-template.mjs
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'options-template.xlsx');

const DEFAULTS = {
  jobFunctions: ['Admin', 'Developer', 'Marketing & Sales', 'Others', 'Service'],
  positionsByJobFunction: {
    Admin: ['HR Executive', 'Office Administrator', 'Operations Coordinator'],
    Developer: [
      'Frontend Developer (React)',
      'Backend Developer (Node / Python)',
      'Full Stack Engineer',
      'QA Automation Engineer',
      'DevOps / Cloud Engineer'
    ],
    'Marketing & Sales': [
      'Digital Marketing Specialist',
      'Content & SEO Strategist',
      'UI/UX Designer',
      'Sales & Business Development',
      'B2B Account Executive',
      'Inside Sales Specialist'
    ],
    Others: [],
    Service: ['Technical Support Engineer', 'Customer Success Specialist', 'IT Helpdesk Support']
  },
  resumeSources: ['Email', 'Job Portal', 'Walk-in', 'Website Form'],
  countryCodes: [
    ['+91', 'India', '🇮🇳'],
    ['+1', 'USA/Canada', '🇺🇸'],
    ['+44', 'UK', '🇬🇧'],
    ['+65', 'Singapore', '🇸🇬'],
    ['+971', 'UAE', '🇦🇪'],
    ['+60', 'Malaysia', '🇲🇾'],
    ['+61', 'Australia', '🇦🇺']
  ],
  genders: ['Male', 'Female', 'Other'],
  maritalStatuses: ['Single', 'Married', 'Other'],
  qualifications: [
    ['School', 'No'],
    ['Diploma', 'Yes'],
    ['UG', 'Yes'],
    ['PG', 'Yes']
  ]
};

const wb = XLSX.utils.book_new();

const add = (name, rows) =>
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);

add('JobFunction', [['Job Function'], ...DEFAULTS.jobFunctions.map((v) => [v])]);

add('Position', [
  ['Job Function', 'Position'],
  ...Object.entries(DEFAULTS.positionsByJobFunction).flatMap(([jf, list]) =>
    list.map((p) => [jf, p])
  )
]);

add('ResumeSource', [['Resume Source'], ...DEFAULTS.resumeSources.map((v) => [v])]);

add('CountryCode', [['Code', 'Country', 'Flag'], ...DEFAULTS.countryCodes]);

add('Gender', [['Gender'], ...DEFAULTS.genders.map((v) => [v])]);

add('MaritalStatus', [['Marital Status'], ...DEFAULTS.maritalStatuses.map((v) => [v])]);

add('Qualification', [['Qualification', 'Needs Department'], ...DEFAULTS.qualifications]);

XLSX.writeFile(wb, out);
console.log('Wrote', out);
