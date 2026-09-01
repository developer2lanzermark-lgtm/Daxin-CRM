// Generates dummy resume PDFs in public/ for testing uploads.
// Run: node scripts/gen-sample-resume.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const PEOPLE = [
  {
    file: 'sample-resume.pdf',
    name: 'Anandha Krishnan',
    role: 'Frontend Developer',
    contact: '+91 98400 12345  |  anandha.k@example.com',
    place: 'Tirunelveli, Tamil Nadu',
    summary: 'React / TypeScript developer with 3 years building CRM and dashboard apps.',
    skills: 'React, TypeScript, Tailwind CSS, Vite, REST APIs, Git',
    exp: [
      'Daxin Software - Frontend Developer (2022 - Present)',
      '- Built the HR Resume Tracking CRM front end.',
      '- Implemented dynamic dropdowns and file uploads.'
    ],
    edu: 'B.E. Computer Science - Anna University (2018 - 2022)'
  },
  {
    file: 'sample-resume-priya.pdf',
    name: 'Priya Ramesh',
    role: 'HR Executive',
    contact: '+91 99520 66778  |  priya.ramesh@example.com',
    place: 'Madurai, Tamil Nadu',
    summary: 'HR professional with 5 years in recruitment, onboarding and payroll.',
    skills: 'Recruitment, Onboarding, Payroll, MS Excel, HRMS tools',
    exp: [
      'Zenith Consulting - Senior HR Executive (2020 - Present)',
      '- Handled end-to-end hiring for tech and sales roles.',
      '- Reduced time-to-hire by 30% with a structured pipeline.'
    ],
    edu: 'MBA Human Resources - Madurai Kamaraj University (2015 - 2017)'
  },
  {
    file: 'sample-resume-arjun.pdf',
    name: 'Arjun Nair',
    role: 'Sales & Business Development',
    contact: '+91 97010 22334  |  arjun.nair@example.com',
    place: 'Kochi, Kerala',
    summary: 'B2B SaaS sales specialist with a track record of exceeding quota.',
    skills: 'B2B Sales, Lead Generation, CRM, Negotiation, Account Management',
    exp: [
      'CloudBridge - Account Executive (2021 - Present)',
      '- Closed 40+ enterprise deals worth 2 Cr ARR.',
      '- Built the outbound playbook for the South India region.'
    ],
    edu: 'BBA Marketing - Christ University (2016 - 2019)'
  }
];

const esc = (s) => s.replace(/([()\\])/g, '\\$1');

function buildPdf(p) {
  const rows = [
    ['/F1 20 Tf', 72, 760, p.name],
    ['/F2 11 Tf', 72, 742, `${p.role}  |  ${p.contact}`],
    ['/F2 11 Tf', 72, 726, p.place],
    ['/F1 13 Tf', 72, 696, 'Summary'],
    ['/F2 11 Tf', 72, 680, p.summary],
    ['/F1 13 Tf', 72, 650, 'Skills'],
    ['/F2 11 Tf', 72, 634, p.skills],
    ['/F1 13 Tf', 72, 604, 'Experience'],
    ...p.exp.map((line, i) => ['/F2 11 Tf', line.startsWith('-') ? 90 : 72, 588 - i * 14, line]),
    ['/F1 13 Tf', 72, 604 - 30 - p.exp.length * 14, 'Education'],
    ['/F2 11 Tf', 72, 604 - 46 - p.exp.length * 14, p.edu],
    ['/F2 9 Tf', 72, 90, 'Dummy resume generated for testing the upload feature.']
  ];

  const content =
    'BT\n' +
    rows.map(([f, x, y, t]) => `${f}\n1 0 0 1 ${x} ${y} Tm\n(${esc(t)}) Tj`).join('\n') +
    '\nET\n';

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ' +
      '/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return pdf;
}

for (const p of PEOPLE) {
  const out = join(dir, p.file);
  writeFileSync(out, buildPdf(p), 'latin1');
  console.log('Wrote', out);
}
