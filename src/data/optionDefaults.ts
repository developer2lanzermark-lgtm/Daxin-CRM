// Built-in fallback dropdown values.
// These are used only when the Google Sheet cannot be loaded.
// The live values come from the published Google Sheet (see src/data/optionsSheet.ts).

export interface CountryCodeOption {
  code: string;
  label: string;
  flag: string;
}

export interface AppOptions {
  jobFunctions: string[];
  positionsByJobFunction: Record<string, string[]>;
  resumeSources: string[];
  countryCodes: CountryCodeOption[];
  genders: string[];
  maritalStatuses: string[];
  qualifications: string[];
  // Qualifications that require a "Department / Specialization" field
  qualificationsNeedingDepartment: string[];
}

export const DEFAULT_OPTIONS: AppOptions = {
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
    Service: [
      'Technical Support Engineer',
      'Customer Success Specialist',
      'IT Helpdesk Support'
    ]
  },
  resumeSources: ['Email', 'Job Portal', 'Walk-in', 'Website Form'],
  countryCodes: [
    { code: '+91', label: 'India', flag: '🇮🇳' },
    { code: '+1', label: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', label: 'UK', flag: '🇬🇧' },
    { code: '+65', label: 'Singapore', flag: '🇸🇬' },
    { code: '+971', label: 'UAE', flag: '🇦🇪' },
    { code: '+60', label: 'Malaysia', flag: '🇲🇾' },
    { code: '+61', label: 'Australia', flag: '🇦🇺' }
  ],
  genders: ['Male', 'Female', 'Other'],
  maritalStatuses: ['Single', 'Married', 'Other'],
  qualifications: ['School', 'Diploma', 'UG', 'PG'],
  qualificationsNeedingDepartment: ['Diploma', 'UG', 'PG']
};
