// Generates public/sample-resume.pdf - a dummy resume for testing uploads.
// Run: node scripts/gen-sample-resume.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sample-resume.pdf');

const lines = [
  ['/F1 20 Tf', 72, 760, 'Anandha Krishnan'],
  ['/F2 11 Tf', 72, 742, 'Frontend Developer  |  +91 98400 12345  |  anandha.k@example.com'],
  ['/F2 11 Tf', 72, 726, 'Tirunelveli, Tamil Nadu'],
  ['/F1 13 Tf', 72, 696, 'Summary'],
  ['/F2 11 Tf', 72, 680, 'React / TypeScript developer with 3 years building CRM and dashboard apps.'],
  ['/F1 13 Tf', 72, 650, 'Skills'],
  ['/F2 11 Tf', 72, 634, 'React, TypeScript, Tailwind CSS, Vite, REST APIs, Git'],
  ['/F1 13 Tf', 72, 604, 'Experience'],
  ['/F2 11 Tf', 72, 588, 'Daxin Software - Frontend Developer (2022 - Present)'],
  ['/F2 11 Tf', 90, 574, '- Built the HR Resume Tracking CRM front end.'],
  ['/F2 11 Tf', 90, 560, '- Implemented dynamic dropdowns and file uploads.'],
  ['/F1 13 Tf', 72, 530, 'Education'],
  ['/F2 11 Tf', 72, 514, 'B.E. Computer Science - Anna University (2018 - 2022)'],
  ['/F2 9 Tf', 72, 120, 'This is a dummy resume generated for testing the upload feature.']
];

const esc = (s) => s.replace(/([()\\])/g, '\\$1');
const content =
  'BT\n' +
  lines.map(([f, x, y, t]) => `${f}\n1 0 0 1 ${x} ${y} Tm\n(${esc(t)}) Tj`).join('\n') +
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

writeFileSync(out, pdf, 'latin1');
console.log('Wrote', out, `(${pdf.length} bytes)`);
