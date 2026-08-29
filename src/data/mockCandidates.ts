import type { Candidate } from '../types/candidate';

export const INITIAL_MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    name: 'Aravind Swaminathan',
    mobile: '+91 98401 23456',
    email: 'aravind.swami@gmail.com',
    source: 'Website Form',
    position: 'Frontend Developer (React)',
    resumeReceivedDate: '2026-08-25',
    resumeFileName: 'Aravind_Resume_React_3YOE.pdf',
    resumeFileSize: '1.8 MB',
    status: 'Process',
    callStatus: 'Called',
    interviewDate: '2026-08-30T10:30',
    remarks: 'Strong knowledge in React, Tailwind and TypeScript. Technical round scheduled with Senior Tech Lead.',
    lastUpdatedDate: '2026-08-28T14:20:00Z',
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
        type: 'call_log',
        description: 'Call connected with candidate. Confirmed interest and availability.',
        performedBy: 'Kavitha (HR)'
      },
      {
        id: 'log-001-3',
        timestamp: '2026-08-28T14:20:00Z',
        type: 'status_change',
        description: 'Moved status from Unprogress to Process. Scheduled 1st round interview.',
        performedBy: 'Kavitha (HR)',
        details: {
          oldStatus: 'Unprogress',
          newStatus: 'Process',
          interviewDate: '2026-08-30T10:30'
        }
      }
    ]
  },
  {
    id: 'cand-002',
    name: 'Pooja Sundaram',
    mobile: '+91 97890 54321',
    email: 'pooja.sundaram@outlook.com',
    source: 'Job Portal',
    position: 'Full Stack Engineer',
    resumeReceivedDate: '2026-08-24',
    resumeFileName: 'Pooja_Sundaram_FullStack_CV.pdf',
    resumeFileSize: '2.4 MB',
    status: 'Select',
    callStatus: 'Called',
    interviewDate: '2026-08-27T14:00',
    remarks: 'Excellent performance in machine coding & architecture interview. Offer letter rolled out.',
    lastUpdatedDate: '2026-08-28T18:00:00Z',
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
    email: 'karthik.subbu89@gmail.com',
    source: 'Referral',
    position: 'UI/UX Designer',
    resumeReceivedDate: '2026-08-28',
    resumeFileName: 'Karthik_Subramanian_Portfolio_Resume.pdf',
    resumeFileSize: '4.2 MB',
    status: 'Unprogress',
    callStatus: 'Pending',
    remarks: 'Referred by senior developer Manoj. Has Figma and mobile app design experience.',
    lastUpdatedDate: '2026-08-28T09:00:00Z',
    activityLogs: [
      {
        id: 'log-003-1',
        timestamp: '2026-08-28T09:00:00Z',
        type: 'created',
        description: 'Added manually via Internal Employee Referral (Manoj Kumar)',
        performedBy: 'Kavitha (HR)'
      }
    ]
  },
  {
    id: 'cand-004',
    name: 'Deepa Muthukrishnan',
    mobile: '+91 98421 11223',
    email: 'deepa.muthu@yahoo.com',
    source: 'Walk-in',
    position: 'HR Executive',
    resumeReceivedDate: '2026-08-22',
    resumeFileName: 'Deepa_M_HR_Executive.docx',
    resumeFileSize: '850 KB',
    status: 'Reject',
    callStatus: 'Called',
    interviewDate: '2026-08-24T11:30',
    remarks: 'Candidate expected immediate remote role; Daxin requires on-site presence at Tirunelveli branch.',
    lastUpdatedDate: '2026-08-24T12:30:00Z',
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
    email: 'santhosh.velu@gmail.com',
    source: 'Email',
    position: 'QA Automation Engineer',
    resumeReceivedDate: '2026-08-27',
    resumeFileName: 'Santhosh_Selenium_Playwright.pdf',
    resumeFileSize: '1.2 MB',
    status: 'Process',
    callStatus: 'Not Attended',
    remarks: 'Tried calling twice in the morning; phone rang without response. Left a WhatsApp reminder.',
    lastUpdatedDate: '2026-08-28T11:15:00Z',
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
        description: 'Call attempted: Not attended by candidate.',
        performedBy: 'Kavitha (HR)'
      }
    ]
  },
  {
    id: 'cand-006',
    name: 'Meenakshi Sundar',
    mobile: '+91 93600 45678',
    email: 'meenu.sundar.dev@gmail.com',
    source: 'Job Portal',
    position: 'Backend Developer (Node / Python)',
    resumeReceivedDate: '2026-08-19',
    resumeFileName: 'Meenakshi_Backend_Node_Resume.pdf',
    resumeFileSize: '2.1 MB',
    status: 'Select',
    callStatus: 'Called',
    interviewDate: '2026-08-23T15:00',
    remarks: 'Strong database optimization and API architecture skills. Joining confirmed for next month.',
    lastUpdatedDate: '2026-08-26T17:00:00Z',
    activityLogs: [
      {
        id: 'log-006-1',
        timestamp: '2026-08-19T14:00:00Z',
        type: 'created',
        description: 'LinkedIn recruiter export',
        performedBy: 'Kavitha (HR)'
      }
    ]
  },
  {
    id: 'cand-007',
    name: 'Vigneshwaran P.',
    mobile: '+91 97500 88990',
    email: 'vignesh.p.tech@gmail.com',
    source: 'Website Form',
    position: 'Frontend Developer (React)',
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
    email: 'ananya.ramesh.biz@outlook.com',
    source: 'Referral',
    position: 'Sales & Business Development',
    resumeReceivedDate: '2026-08-15',
    resumeFileName: 'Ananya_R_Sales_B2B.pdf',
    resumeFileSize: '980 KB',
    status: 'Process',
    callStatus: 'Called',
    interviewDate: '2026-08-31T11:00',
    remarks: 'Round 1 screening cleared. Presentation on B2B SaaS lead gen scheduled for Monday.',
    lastUpdatedDate: '2026-08-28T16:40:00Z',
    activityLogs: [
      {
        id: 'log-008-1',
        timestamp: '2026-08-15T10:00:00Z',
        type: 'created',
        description: 'Referral submitted by Sales Director',
        performedBy: 'System'
      }
    ]
  },
  {
    id: 'cand-009',
    name: 'Mohammed Faisal',
    mobile: '+91 98940 33221',
    email: 'faisal.m.cloud@gmail.com',
    source: 'Email',
    position: 'DevOps / Cloud Engineer',
    resumeReceivedDate: '2026-08-10',
    resumeFileName: 'Faisal_AWS_DevOps_Resume.pdf',
    resumeFileSize: '3.1 MB',
    status: 'Reject',
    callStatus: 'No Response',
    remarks: 'Candidate did not respond to three follow-up emails and phone calls.',
    lastUpdatedDate: '2026-08-20T10:00:00Z',
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
    email: 'pavithra.natarajan@gmail.com',
    source: 'Walk-in',
    position: 'Frontend Developer (React)',
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

export const AVAILABLE_POSITIONS = [
  'Frontend Developer (React)',
  'Backend Developer (Node / Python)',
  'Full Stack Engineer',
  'UI/UX Designer',
  'QA Automation Engineer',
  'DevOps / Cloud Engineer',
  'HR Executive',
  'Sales & Business Development'
];

export const RESUME_SOURCES: Candidate['source'][] = [
  'Email',
  'Job Portal',
  'Walk-in',
  'Referral',
  'Website Form'
];
