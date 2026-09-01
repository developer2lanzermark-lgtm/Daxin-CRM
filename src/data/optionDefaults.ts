// Built-in fallback dropdown values.
// The sheet-driven ones are used only when the Google Sheet cannot be loaded.

export interface CountryCodeOption {
  code: string;
  label: string;
  flag: string;
}

// ---- Loaded from the Google Sheet ------------------------------------------
export interface AppOptions {
  jobFunctions: string[];
  positionsByJobFunction: Record<string, string[]>;
  resumeSources: string[];
  countryCodes: CountryCodeOption[];
  statesByCountryCode: Record<string, string[]>;
  citiesByState: Record<string, string[]>;
  qualifications: string[];
  // Qualifications that require a "Department / Specialization" field
  qualificationsNeedingDepartment: string[];
  experienceLevels: string[];
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
  qualifications: ['School', 'Diploma', 'UG', 'PG'],
  qualificationsNeedingDepartment: ['Diploma', 'UG', 'PG'],
  experienceLevels: ['No', '0-1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years']
};

// ---- NOT from the sheet: fixed lists --------------------------------------
export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;
export const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Other'] as const;
