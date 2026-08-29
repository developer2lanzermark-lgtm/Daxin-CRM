export type CandidateStatus = 'Unprogress' | 'Process' | 'Select' | 'Reject';

export type ResumeSource = 
  | 'Email'
  | 'Job Portal'
  | 'Walk-in'
  | 'Referral'
  | 'Website Form';

export type CallStatus = 'Pending' | 'Called' | 'Not Attended' | 'No Response';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'status_change' | 'call_log' | 'remark' | 'created';
  description: string;
  performedBy?: string;
  details?: {
    oldStatus?: CandidateStatus;
    newStatus?: CandidateStatus;
    callStatus?: CallStatus;
    remark?: string;
    interviewDate?: string;
  };
}

export interface Candidate {
  id: string;
  name: string;
  mobile: string;
  email: string;
  source: ResumeSource;
  position: string;
  resumeReceivedDate: string; // YYYY-MM-DD
  resumeFileName?: string;
  resumeFileSize?: string;
  status: CandidateStatus;
  callStatus: CallStatus;
  interviewDate?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm
  remarks: string;
  lastUpdatedDate: string; // ISO string
  activityLogs: ActivityLog[];
}

export type CandidateFilterParams = {
  searchQuery?: string;
  status?: CandidateStatus | 'All';
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
