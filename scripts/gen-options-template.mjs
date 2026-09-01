// Regenerates public/options-template.xlsx from the built-in defaults.
// Import the result into Google Sheets (Drive -> New -> File upload -> Open with Google Sheets).
// Run:  node scripts/gen-options-template.mjs
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'daxin-options-template.xlsx');

const D = {
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
  statesByCountryCode: {
    '+91': ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Delhi']
  },
  citiesByState: {
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Tirunelveli', 'Salem', 'Erode'],
    Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'],
    Telangana: ['Hyderabad', 'Warangal', 'Nizamabad'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
    Delhi: ['New Delhi']
  },
  qualifications: [
    ['School', 'No'],
    ['Diploma', 'Yes'],
    ['UG', 'Yes'],
    ['PG', 'Yes']
  ]
};

const wb = XLSX.utils.book_new();
const add = (name, rows) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name);

add('JobFunction', [['Job Function'], ...D.jobFunctions.map((v) => [v])]);
add('Position', [
  ['Job Function', 'Position'],
  ...Object.entries(D.positionsByJobFunction).flatMap(([jf, list]) => list.map((p) => [jf, p]))
]);
add('ResumeSource', [['Resume Source'], ...D.resumeSources.map((v) => [v])]);
add('CountryCode', [['Code', 'Country', 'Flag'], ...D.countryCodes]);
add('State', [
  ['Country Code', 'State'],
  ...Object.entries(D.statesByCountryCode).flatMap(([cc, list]) => list.map((s) => [cc, s]))
]);
add('City', [
  ['State', 'City'],
  ...Object.entries(D.citiesByState).flatMap(([st, list]) => list.map((c) => [st, c]))
]);
add('Qualification', [['Qualification', 'Needs Department'], ...D.qualifications]);

XLSX.writeFile(wb, out);
console.log('Wrote', out);
