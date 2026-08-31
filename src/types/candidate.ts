export type CandidateStatus = 'Unprogress' | 'Process' | 'Select' | 'Reject';

export type JobFunction = 
  | 'Service'
  | 'Developer'
  | 'Admin'
  | 'Marketing'
  | 'Sales'
  | 'Management';

export type ResumeSource = 
  | 'Email'
  | 'Job Portal'
  | 'Walk-in'
  | 'Website Form';

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
