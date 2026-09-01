export type CandidateStatus = 'Unprogress' | 'Process' | 'Select' | 'Reject';

// Dropdown values are loaded at runtime from public/options.xlsx
// (see src/data/optionsExcel.ts), so these are open string types.
export type JobFunction = string;

export type Gender = string;

export type MaritalStatus = string;

export type Qualification = string;

export type ResumeSource = string;

export type CallStatus = 'Pending' | 'Called' | 'Not Attended' | 'No Response';

export type ReviewDecision = 'Shortlisted' | 'On Hold' | 'Rejected';

export type InterviewMode = 'In-Person' | 'Online';

export interface ReviewDetails {
  reviewerName: string;
  reviewDate: string;
  decision: ReviewDecision;
  notes: string;
}

export interface InterviewDetails {
  interviewDate: string;
  mode: InterviewMode;
  interviewer: string;
  locationOrLink: string;
  lastNotifiedVia?: 'WhatsApp' | 'Email';
  lastNotifiedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'status_change' | 'call_log' | 'remark' | 'created' | 'review' | 'interview_scheduled' | 'message_sent';
  description: string;
  performedBy?: string;
  details?: {
    oldStatus?: CandidateStatus;
    newStatus?: CandidateStatus;
    callStatus?: CallStatus;
    remark?: string;
    interviewDate?: string;
    reviewDecision?: ReviewDecision;
    messageChannel?: 'WhatsApp' | 'Email';
  };
}

export interface Candidate {
  id: string;
  name: string;
  mobile: string;
  countryCode?: string;
  email: string;
  jobFunction: JobFunction;
  position: string;
  source: ResumeSource;
  reference?: string;
  // Personal details
  dob?: string; // YYYY-MM-DD
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  // Location
  city?: string;
  state?: string;
  area?: string;
  // Education
  qualification?: Qualification;
  qualificationDepartment?: string; // Department / Specialization for UG / PG
  extraQualification?: string;
  // Experience
  hasPreviousExperience?: boolean;
  yearsOfExperience?: number;
  resumeReceivedDate: string; // YYYY-MM-DD
  resumeFileName?: string;
  resumeFileSize?: string;
  status: CandidateStatus;
  callStatus: CallStatus;
  interviewDate?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm
  remarks: string;
  lastUpdatedDate: string; // ISO string
  reviewDetails?: ReviewDetails;
  interviewDetails?: InterviewDetails;
  activityLogs: ActivityLog[];
}

export type CandidateFilterParams = {
  searchQuery?: string;
  status?: CandidateStatus | 'All';
  jobFunction?: JobFunction | 'All';
  source?: ResumeSource | 'All';
  position?: string | 'All';
  startDate?: string;
  endDate?: string;
};

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateField?: 'mobile' | 'email' | 'both';
  existingCandidate?: Candidate;
}
