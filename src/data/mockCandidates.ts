import type { Candidate, JobFunction, ResumeSource } from '../types/candidate';

// Alphabetical order
export const JOB_FUNCTIONS: JobFunction[] = [
  'Admin',
  'Developer',
  'Marketing & Sales',
  'Others',
  'Service'
];

export const POSITIONS_BY_JOB_FUNCTION: Record<JobFunction, string[]> = {
  Admin: [
    'HR Executive',
    'Office Administrator',
    'Operations Coordinator'
  ],
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
};

export const ALL_POSITIONS = Object.values(POSITIONS_BY_JOB_FUNCTION).flat();

export const RESUME_SOURCES: ResumeSource[] = [
  'Email',
  'Job Portal',
  'Walk-in',
  'Website Form'
];

export const COUNTRY_CODES = [
  { code: '+91', label: '+91 (India)', flag: '🇮🇳' },
  { code: '+1', label: '+1 (USA/Canada)', flag: '🇺🇸' },
  { code: '+44', label: '+44 (UK)', flag: '🇬🇧' },
  { code: '+65', label: '+65 (Singapore)', flag: '🇸🇬' },
  { code: '+971', label: '+971 (UAE)', flag: '🇦🇪' },
  { code: '+60', label: '+60 (Malaysia)', flag: '🇲🇾' },
  { code: '+61', label: '+61 (Australia)', flag: '🇦🇺' }
];

export const INITIAL_MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Aravind Swaminathan',
    mobile: '+91 98401 23456',
    countryCode: '+91',
    email: 'aravind.swami@gmail.com',
    jobFunction: 'Developer',
    position: 'Frontend Developer (React)',
    source: 'Website Form',
    reference: 'Direct Website Careers Page',
    dob: '1998-04-12',
    gender: 'Male',
    maritalStatus: 'Single',
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    area: 'Palayamkottai',
    qualification: 'UG',
    qualificationDepartment: 'B.E. Computer Science',
    extraQualification: 'AWS Certified Cloud Practitioner',
    hasPreviousExperience: true,
    yearsOfExperience: 3,
    resumeReceivedDate: '2026-08-25',
    resumeFileName: 'Aravind_Resume_React_3YOE.pdf',
    resumeFileSize: '1.8 MB',
    status: 'Process',
    callStatus: 'Called',
    interviewDate: '2026-09-02T10:30',
    remarks: 'Strong knowledge in React, Tailwind and TypeScript. Shortlisted in screening round.',
    lastUpdatedDate: '2026-08-28T14:20:00Z',
    reviewDetails: {
      reviewerName: 'Kavitha (HR Team)',
      reviewDate: '2026-08-26',
      decision: 'Shortlisted',
      notes: 'Strong portfolio with clean React/TypeScript code samples. Recommended for Technical round.'
    },
    interviewDetails: {
      interviewDate: '2026-09-02T10:30',
      mode: 'Online',
      interviewer: 'Sundar (Lead Architect)',
      locationOrLink: 'https://meet.google.com/dax-inhr-tech',
      lastNotifiedVia: 'WhatsApp',
      lastNotifiedAt: '2026-08-28T14:20:00Z'
    },
    activityLogs: [
      {
        id: 'log-001-1',
        timestamp: '2026-08-25T11:00:00Z',
        type: 'created',
        description: 'Candidate profile received via Website Form',
        performedBy: 'System'
      },
      {
        id: 'log-001-2',
        timestamp: '2026-08-26T15:30:00Z',
        type: 'review',
        description: 'Resume screened & Shortlisted by Kavitha (HR)',
        performedBy: 'Kavitha (HR)',
        details: {
          reviewDecision: 'Shortlisted'
        }
      },
      {
        id: 'log-001-3',
        timestamp: '2026-08-28T14:20:00Z',
        type: 'interview_scheduled',
        description: 'Online Interview scheduled for 2026-09-02 10:30. Invitation sent via WhatsApp.',
        performedBy: 'Kavitha (HR)',
        details: {
          oldStatus: 'Unprogress',
          newStatus: 'Process',
          interviewDate: '2026-09-02T10:30',
          messageChannel: 'WhatsApp'
        }
      }
    ]
  },
  {
    id: 'cand-002',
    name: 'Pooja Sundaram',
    mobile: '+91 97890 54321',
    countryCode: '+91',
    email: 'pooja.sundaram@outlook.com',
    jobFunction: 'Developer',
    position: 'Full Stack Engineer',
    source: 'Job Portal',
    reference: 'Naukri Recruiter Portal',
    resumeReceivedDate: '2026-08-24',
    resumeFileName: 'Pooja_Sundaram_FullStack_CV.pdf',
    resumeFileSize: '2.4 MB',
    status: 'Select',
    callStatus: 'Called',
    interviewDate: '2026-08-27T14:00',
    remarks: 'Excellent performance in machine coding & architecture interview. Offer letter rolled out.',
    lastUpdatedDate: '2026-08-28T18:00:00Z',
    reviewDetails: {
      reviewerName: 'Kavitha (HR)',
      reviewDate: '2026-08-24',
      decision: 'Shortlisted',
      notes: '5 years experience across Node.js and PostgreSQL.'
    },
    interviewDetails: {
      interviewDate: '2026-08-27T14:00',
      mode: 'In-Person',
      interviewer: 'Rajesh (Head of HR) & Tech Panel',
      locationOrLink: 'Daxin HQ, Tirunelveli Office (2nd Floor Conference Room)',
      lastNotifiedVia: 'Email',
      lastNotifiedAt: '2026-08-25T10:00:00Z'
    },
    activityLogs: [
      {
        id: 'log-002-1',
        timestamp: '2026-08-24T09:15:00Z',
        type: 'created',
        description: 'Resume fetched from Naukri Job Portal',
        performedBy: 'Kavitha (HR)'
      },
      {
        id: 'log-002-2',
        timestamp: '2026-08-27T16:00:00Z',
        type: 'status_change',
        description: 'Selected after final Director round. Positive recommendation.',
        performedBy: 'Rajesh (Head of HR)',
        details: {
          oldStatus: 'Process',
          newStatus: 'Select'
        }
      }
    ]
  },
  {
    id: 'cand-003',
    name: 'Karthik Subramanian',
    mobile: '+91 94432 98765',
    countryCode: '+91',
    email: 'karthik.subbu89@gmail.com',
    jobFunction: 'Marketing & Sales',
    position: 'UI/UX Designer',
    source: 'Email',
    reference: 'Manoj Kumar (Senior Tech Lead, Employee ID #DX104)',
    resumeReceivedDate: '2026-08-28',
    resumeFileName: 'Karthik_Subramanian_Portfolio_Resume.pdf',
    resumeFileSize: '4.2 MB',
    status: 'Unprogress',
    callStatus: 'Pending',
    remarks: 'Referred by Manoj Kumar. Has Figma, design systems, and mobile UI experience.',
    lastUpdatedDate: '2026-08-28T09:00:00Z',
    activityLogs: [
      {
        id: 'log-003-1',
        timestamp: '2026-08-28T09:00:00Z',
        type: 'created',
        description: 'Added via Email with Reference from Manoj Kumar',
        performedBy: 'Kavitha (HR)'
      }
    ]
  },
  {
    id: 'cand-004',
    name: 'Deepa Muthukrishnan',
    mobile: '+91 98421 11223',
    countryCode: '+91',
    email: 'deepa.muthu@yahoo.com',
    jobFunction: 'Admin',
    position: 'HR Executive',
    source: 'Walk-in',
    reference: 'Self Walk-in at Front Desk',
    resumeReceivedDate: '2026-08-22',
    resumeFileName: 'Deepa_M_HR_Executive.docx',
    resumeFileSize: '850 KB',
    status: 'Reject',
    callStatus: 'Called',
    interviewDate: '2026-08-24T11:30',
    remarks: 'Candidate expected immediate remote role; Daxin requires on-site presence at Tirunelveli branch.',
    lastUpdatedDate: '2026-08-24T12:30:00Z',
    reviewDetails: {
      reviewerName: 'Rajesh (HR Head)',
      reviewDate: '2026-08-23',
      decision: 'Shortlisted',
      notes: 'Good communication skills, proceed for telephonic discussion.'
    },
    activityLogs: [
      {
        id: 'log-004-1',
        timestamp: '2026-08-22T10:00:00Z',
        type: 'created',
        description: 'Walk-in candidate resume submitted at reception',
        performedBy: 'Front Desk'
      },
      {
        id: 'log-004-2',
        timestamp: '2026-08-24T12:30:00Z',
        type: 'status_change',
        description: 'Status updated to Reject due to location mismatch.',
        performedBy: 'Rajesh (Head of HR)',
        details: {
          oldStatus: 'Process',
          newStatus: 'Reject'
        }
      }
    ]
  },
  {
    id: 'cand-005',
    name: 'Santhosh Kumar Velu',
    mobile: '+91 99520 67890',
    countryCode: '+91',
    email: 'santhosh.velu@gmail.com',
    jobFunction: 'Developer',
    position: 'QA Automation Engineer',
    source: 'Email',
    reference: 'LinkedIn InMail outreach',
    resumeReceivedDate: '2026-08-27',
    resumeFileName: 'Santhosh_Selenium_Playwright.pdf',
    resumeFileSize: '1.2 MB',
    status: 'Process',
    callStatus: 'Not Attended',
    remarks: 'Tried calling twice in the morning; phone rang without response. WhatsApp interview reminder sent.',
    lastUpdatedDate: '2026-08-28T11:15:00Z',
    reviewDetails: {
      reviewerName: 'Kavitha (HR)',
      reviewDate: '2026-08-27',
      decision: 'Shortlisted',
      notes: 'Has strong Playwright and TypeScript experience.'
    },
    interviewDetails: {
      interviewDate: '2026-09-03T11:00',
      mode: 'Online',
      interviewer: 'QA Lead',
      locationOrLink: 'https://meet.google.com/dax-inhr-qa',
      lastNotifiedVia: 'WhatsApp',
      lastNotifiedAt: '2026-08-28T11:15:00Z'
    },
    activityLogs: [
      {
        id: 'log-005-1',
        timestamp: '2026-08-27T16:45:00Z',
        type: 'created',
        description: 'Direct email application received at careers@daxin.com',
        performedBy: 'System'
      },
      {
        id: 'log-005-2',
        timestamp: '2026-08-28T11:15:00Z',
        type: 'call_log',
        description: 'Call attempted: Not attended by candidate. Follow-up reminder sent.',
        performedBy: 'Kavitha (HR)'
      }
    ]
  },
  {
    id: 'cand-006',
    name: 'Meenakshi Sundar',
    mobile: '+91 93600 45678',
    countryCode: '+91',
    email: 'meenu.sundar.dev@gmail.com',
    jobFunction: 'Developer',
    position: 'Backend Developer (Node / Python)',
    source: 'Job Portal',
    reference: 'Found on Indeed Jobs',
    resumeReceivedDate: '2026-08-19',
    resumeFileName: 'Meenakshi_Backend_Node_Resume.pdf',
    resumeFileSize: '2.1 MB',
    status: 'Select',
    callStatus: 'Called',
    interviewDate: '2026-08-23T15:00',
    remarks: 'Strong database optimization and API architecture skills. Joining confirmed for next month.',
    lastUpdatedDate: '2026-08-26T17:00:00Z',
    reviewDetails: {
      reviewerName: 'Kavitha (HR)',
      reviewDate: '2026-08-20',
      decision: 'Shortlisted',
      notes: 'Strong profile in Python/FastAPI and PostgreSQL.'
    },
    activityLogs: [
      {
        id: 'log-006-1',
        timestamp: '2026-08-19T14:00:00Z',
        type: 'created',
        description: 'Recruiter job portal export',
        performedBy: 'Kavitha (HR)'
      }
    ]
  },
  {
    id: 'cand-007',
    name: 'Vigneshwaran P.',
    mobile: '+91 97500 88990',
    countryCode: '+91',
    email: 'vignesh.p.tech@gmail.com',
    jobFunction: 'Developer',
    position: 'Frontend Developer (React)',
    source: 'Website Form',
    reference: 'Website Contact Page',
    resumeReceivedDate: '2026-08-29',
    resumeFileName: 'Vignesh_P_Frontend_2026.pdf',
    resumeFileSize: '1.5 MB',
    status: 'Unprogress',
    callStatus: 'Pending',
    remarks: 'New application received via website career portal today.',
    lastUpdatedDate: '2026-08-29T08:30:00Z',
    activityLogs: [
      {
        id: 'log-007-1',
        timestamp: '2026-08-29T08:30:00Z',
        type: 'created',
        description: 'Application submitted through Daxin website form',
        performedBy: 'System'
      }
    ]
  },
  {
    id: 'cand-008',
    name: 'Ananya Ramesh',
    mobile: '+91 98410 77665',
    countryCode: '+91',
    email: 'ananya.ramesh.biz@outlook.com',
    jobFunction: 'Marketing & Sales',
    position: 'Sales & Business Development',
    source: 'Email',
    reference: 'Venkatesh (Sales VP)',
    resumeReceivedDate: '2026-08-15',
    resumeFileName: 'Ananya_R_Sales_B2B.pdf',
    resumeFileSize: '980 KB',
    status: 'Process',
    callStatus: 'Called',
    interviewDate: '2026-09-01T11:00',
    remarks: 'Round 1 screening cleared. Presentation on B2B SaaS lead generation scheduled.',
    lastUpdatedDate: '2026-08-28T16:40:00Z',
    reviewDetails: {
      reviewerName: 'Venkatesh (Sales VP)',
      reviewDate: '2026-08-16',
      decision: 'Shortlisted',
      notes: 'Strong enterprise sales track record in SaaS products.'
    },
    interviewDetails: {
      interviewDate: '2026-09-01T11:00',
      mode: 'In-Person',
      interviewer: 'Sales Leadership Panel',
      locationOrLink: 'Daxin Corporate Office, Main Boardroom',
      lastNotifiedVia: 'Email',
      lastNotifiedAt: '2026-08-28T16:40:00Z'
    },
    activityLogs: [
      {
        id: 'log-008-1',
        timestamp: '2026-08-15T10:00:00Z',
        type: 'created',
        description: 'Referral submitted via direct email',
        performedBy: 'System'
      }
    ]
  },
  {
    id: 'cand-009',
    name: 'Mohammed Faisal',
    mobile: '+91 98940 33221',
    countryCode: '+91',
    email: 'faisal.m.cloud@gmail.com',
    jobFunction: 'Developer',
    position: 'DevOps / Cloud Engineer',
    source: 'Email',
    reference: 'Direct Inbound Application',
    resumeReceivedDate: '2026-08-10',
    resumeFileName: 'Faisal_AWS_DevOps_Resume.pdf',
    resumeFileSize: '3.1 MB',
    status: 'Reject',
    callStatus: 'No Response',
    remarks: 'Candidate did not respond to follow-up emails and phone calls.',
    lastUpdatedDate: '2026-08-20T10:00:00Z',
    reviewDetails: {
      reviewerName: 'Kavitha (HR)',
      reviewDate: '2026-08-11',
      decision: 'On Hold',
      notes: 'Relevant AWS skills, but experience slightly less than required 4 years.'
    },
    activityLogs: [
      {
        id: 'log-009-1',
        timestamp: '2026-08-10T12:00:00Z',
        type: 'created',
        description: 'Application received via email',
        performedBy: 'System'
      }
    ]
  },
  {
    id: 'cand-010',
    name: 'Pavithra Natarajan',
    mobile: '+91 97910 66554',
    countryCode: '+91',
    email: 'pavithra.natarajan@gmail.com',
    jobFunction: 'Developer',
    position: 'Frontend Developer (React)',
    source: 'Walk-in',
    reference: 'Campus Drive Walk-in',
    resumeReceivedDate: '2026-08-26',
    resumeFileName: 'Pavithra_N_CV_2026.pdf',
    resumeFileSize: '1.4 MB',
    status: 'Unprogress',
    callStatus: 'Pending',
    remarks: 'Walked in with hard copy, scanned and uploaded. 2 years experience with Tailwind & Next.js.',
    lastUpdatedDate: '2026-08-26T16:00:00Z',
    activityLogs: [
      {
        id: 'log-010-1',
        timestamp: '2026-08-26T16:00:00Z',
        type: 'created',
        description: 'Uploaded from walk-in application form',
        performedBy: 'Kavitha (HR)'
      }
    ]
  }
];
