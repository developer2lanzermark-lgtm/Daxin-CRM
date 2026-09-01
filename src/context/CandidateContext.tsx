import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Candidate, DuplicateCheckResult, ActivityLog, ResumeSource, CallStatus, JobFunction } from '../types/candidate';
import { INITIAL_MOCK_CANDIDATES } from '../data/mockCandidates';

interface CandidateStats {
  total: number;
  unprogress: number;
  process: number;
  select: number;
  reject: number;
  thisMonthCount: number;
  bySource: Record<string, number>;
  byJobFunction: Record<string, number>;
  byCallStatus: Record<CallStatus, number>;
}

interface CandidateContextType {
  candidates: Candidate[];
  stats: CandidateStats;
  checkDuplicate: (mobile: string, email: string, excludeId?: string) => DuplicateCheckResult;
  addCandidate: (
    candidate: Omit<Candidate, 'id' | 'lastUpdatedDate' | 'activityLogs'>,
    options?: { overrideDuplicate?: boolean }
  ) => { success: boolean; candidate?: Candidate; duplicateResult?: DuplicateCheckResult; error?: string };
  updateCandidate: (
    id: string,
    updates: Partial<Candidate>,
    logInfo?: { type: ActivityLog['type']; description: string; performedBy?: string; details?: ActivityLog['details'] }
  ) => boolean;
  deleteCandidate: (id: string) => boolean;
  getCandidateById: (id: string) => Candidate | undefined;
  resetToMockData: () => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'daxin_hr_crm_candidates_v2';

// Helper to normalize mobile number for strict comparison (strips all non-digit characters)
export const normalizeMobile = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  // If starts with 91 (India) and is 12 digits, return last 10 digits for loose matching against +91 vs 0 vs raw 10 digits
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
};

// Helper to normalize email
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: Candidate[] = JSON.parse(saved);
        // Graceful migration if any old record has 'Referral' source or missing jobFunction
        const migrateJobFunction = (jf: unknown): JobFunction => {
          if (jf === 'Marketing' || jf === 'Sales') return 'Marketing & Sales';
          if (jf === 'Management') return 'Others';
          if (jf === 'Admin' || jf === 'Developer' || jf === 'Service' || jf === 'Others' || jf === 'Marketing & Sales') {
            return jf;
          }
          return 'Developer';
        };
        return parsed.map(c => ({
          ...c,
          jobFunction: migrateJobFunction(c.jobFunction),
          source: ((c.source as string) === 'Referral' ? 'Email' : c.source) as ResumeSource,
          reference: c.reference || ((c.source as string) === 'Referral' ? 'Referred Candidate' : undefined)
        }));
      }
    } catch (e) {
      console.error('Failed to parse candidates from localStorage', e);
    }
    return INITIAL_MOCK_CANDIDATES;
  });

  // Save to localStorage whenever candidates state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(candidates));
    } catch (e) {
      console.error('Failed to save candidates to localStorage', e);
    }
  }, [candidates]);

  // Unique identification duplicate check
  const checkDuplicate = (mobile: string, email: string, excludeId?: string): DuplicateCheckResult => {
    const targetMobile = normalizeMobile(mobile);
    const targetEmail = normalizeEmail(email);

    if (!targetMobile && !targetEmail) {
      return { isDuplicate: false };
    }

    const matchedCandidate = candidates.find(c => {
      if (excludeId && c.id === excludeId) return false;
      const cMobile = normalizeMobile(c.mobile);
      const cEmail = normalizeEmail(c.email);

      const mobileMatch = Boolean(targetMobile && cMobile && (targetMobile === cMobile || cMobile.endsWith(targetMobile) || targetMobile.endsWith(cMobile)));
      const emailMatch = Boolean(targetEmail && cEmail && targetEmail === cEmail);

      return mobileMatch || emailMatch;
    });

    if (matchedCandidate) {
      const cMobile = normalizeMobile(matchedCandidate.mobile);
      const cEmail = normalizeEmail(matchedCandidate.email);
      const mobileMatch = Boolean(targetMobile && cMobile && (targetMobile === cMobile || cMobile.endsWith(targetMobile) || targetMobile.endsWith(cMobile)));
      const emailMatch = Boolean(targetEmail && cEmail && targetEmail === cEmail);

      let duplicateField: 'mobile' | 'email' | 'both' = 'mobile';
      if (mobileMatch && emailMatch) {
        duplicateField = 'both';
      } else if (emailMatch) {
        duplicateField = 'email';
      }

      return {
        isDuplicate: true,
        duplicateField,
        existingCandidate: matchedCandidate
      };
    }

    return { isDuplicate: false };
  };

  // Add new candidate with duplicate prevention
  const addCandidate = (
    candidateData: Omit<Candidate, 'id' | 'lastUpdatedDate' | 'activityLogs'>,
    options?: { overrideDuplicate?: boolean }
  ) => {
    const duplicateResult = checkDuplicate(candidateData.mobile, candidateData.email);

    if (duplicateResult.isDuplicate && !options?.overrideDuplicate) {
      return {
        success: false,
        duplicateResult,
        error: `A candidate with this ${duplicateResult.duplicateField === 'both' ? 'email and mobile number' : duplicateResult.duplicateField} already exists in the system (${duplicateResult.existingCandidate?.name}).`
      };
    }

    const newId = `cand-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const initialLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: nowIso,
      type: 'created',
      description: `Resume added from source: ${candidateData.source}${candidateData.reference ? ` (Ref: ${candidateData.reference})` : ''}`,
      performedBy: 'HR Team'
    };

    const newCandidate: Candidate = {
      ...candidateData,
      id: newId,
      // Resume received date is always stamped server-side as the current date
      resumeReceivedDate: nowIso.split('T')[0],
      lastUpdatedDate: nowIso,
      activityLogs: [initialLog]
    };

    setCandidates(prev => [newCandidate, ...prev]);

    return {
      success: true,
      candidate: newCandidate
    };
  };

  // Update existing candidate
  const updateCandidate = (
    id: string,
    updates: Partial<Candidate>,
    logInfo?: { type: ActivityLog['type']; description: string; performedBy?: string; details?: ActivityLog['details'] }
  ) => {
    const existing = candidates.find(c => c.id === id);
    if (!existing) return false;

    const nowIso = new Date().toISOString();
    let updatedLogs = [...existing.activityLogs];

    if (logInfo) {
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: nowIso,
        type: logInfo.type,
        description: logInfo.description,
        performedBy: logInfo.performedBy || 'HR User',
        details: logInfo.details || {
          oldStatus: existing.status,
          newStatus: updates.status || existing.status,
          callStatus: updates.callStatus || existing.callStatus,
          interviewDate: updates.interviewDate || existing.interviewDate
        }
      };
      updatedLogs = [newLog, ...updatedLogs];
    } else if (updates.status && updates.status !== existing.status) {
      const statusLog: ActivityLog = {
        id: `log-${Date.now()}`,
        timestamp: nowIso,
        type: 'status_change',
        description: `Status changed from ${existing.status} to ${updates.status}`,
        performedBy: 'HR User',
        details: {
          oldStatus: existing.status,
          newStatus: updates.status
        }
      };
      updatedLogs = [statusLog, ...updatedLogs];
    }

    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, lastUpdatedDate: nowIso, activityLogs: updatedLogs } : c))
    );

    return true;
  };

  const deleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    return true;
  };

  const getCandidateById = (id: string) => {
    return candidates.find(c => c.id === id);
  };

  const resetToMockData = () => {
    setCandidates(INITIAL_MOCK_CANDIDATES);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CANDIDATES));
  };

  // Dynamic statistics calculation
  const stats: CandidateStats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let unprogress = 0;
    let process = 0;
    let select = 0;
    let reject = 0;
    let thisMonthCount = 0;

    // Dropdown values are dynamic (Google Sheet driven), so these
    // buckets are accumulated from whatever values the candidates have.
    const bySource: Record<string, number> = {};
    const byJobFunction: Record<string, number> = {};

    const byCallStatus: Record<CallStatus, number> = {
      'Pending': 0,
      'Called': 0,
      'Not Attended': 0,
      'No Response': 0
    };

    candidates.forEach(c => {
      // Status count
      if (c.status === 'Unprogress') unprogress++;
      else if (c.status === 'Process') process++;
      else if (c.status === 'Select') select++;
      else if (c.status === 'Reject') reject++;

      // Sources
      if (c.source) {
        bySource[c.source] = (bySource[c.source] || 0) + 1;
      }

      // Job Function
      if (c.jobFunction) {
        byJobFunction[c.jobFunction] = (byJobFunction[c.jobFunction] || 0) + 1;
      }

      // Call status
      if (byCallStatus[c.callStatus] !== undefined) {
        byCallStatus[c.callStatus]++;
      }

      // Month calculation (using resumeReceivedDate)
      if (c.resumeReceivedDate) {
        const d = new Date(c.resumeReceivedDate);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          thisMonthCount++;
        }
      }
    });

    return {
      total: candidates.length,
      unprogress,
      process,
      select,
      reject,
      thisMonthCount,
      bySource,
      byJobFunction,
      byCallStatus
    };
  }, [candidates]);

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        stats,
        checkDuplicate,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        getCandidateById,
        resetToMockData
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidateProvider');
  }
  return context;
};
