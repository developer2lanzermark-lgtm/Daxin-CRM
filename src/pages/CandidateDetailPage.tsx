import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { CallStatusBadge } from '../components/common/CallStatusBadge';
import { JobFunctionBadge } from '../components/common/JobFunctionBadge';
import type { CandidateStatus, CallStatus } from '../types/candidate';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Send,
  Trash2,
  Download,
  AlertCircle,
  FileCheck2,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

export const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidate, deleteCandidate } = useCandidates();

  const candidate = id ? getCandidateById(id) : undefined;

  const [newRemark, setNewRemark] = useState('');
  const [statusUpdatedToast, setStatusUpdatedToast] = useState('');

  if (!candidate) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Candidate Not Found</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          The candidate record you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/resumes"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate List</span>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: CandidateStatus) => {
    updateCandidate(
      candidate.id,
      { status },
      {
        type: 'status_change',
        description: `Pipeline status updated to "${status}"`,
        performedBy: 'HR User'
      }
    );
    setStatusUpdatedToast(`Status updated to ${status}`);
    setTimeout(() => setStatusUpdatedToast(''), 3000);
  };

  const handleCallStatusChange = (status: CallStatus) => {
    updateCandidate(
      candidate.id,
      { callStatus: status },
      {
        type: 'call_log',
        description: `Call status marked as "${status}"`,
        performedBy: 'HR User'
      }
    );
    setStatusUpdatedToast(`Call status updated to ${status}`);
    setTimeout(() => setStatusUpdatedToast(''), 3000);
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemark.trim()) return;

    updateCandidate(
      candidate.id,
      { remarks: newRemark.trim() },
      {
        type: 'remark',
        description: newRemark.trim(),
        performedBy: 'HR User'
      }
    );
    setNewRemark('');
    setStatusUpdatedToast('Remark added to candidate activity timeline');
    setTimeout(() => setStatusUpdatedToast(''), 3000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete candidate ${candidate.name}?`)) {
      deleteCandidate(candidate.id);
      navigate('/resumes');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top navigation & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/resumes')}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{candidate.name}</h2>
              <JobFunctionBadge jobFunction={candidate.jobFunction} size="sm" />
              <StatusBadge status={candidate.status} size="sm" />
              <CallStatusBadge status={candidate.callStatus} size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Candidate ID: {candidate.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/candidate/${candidate.id}/review`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors border border-blue-200"
          >
            <FileCheck2 className="w-4 h-4 text-blue-600" />
            <span>Review Stage</span>
          </Link>

          <Link
            to={`/candidate/${candidate.id}/call`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call / Schedule Interview</span>
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Delete candidate"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {statusUpdatedToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold rounded-2xl p-3 shadow-sm animate-in fade-in flex items-center justify-between">
          <span>✓ {statusUpdatedToast}</span>
        </div>
      )}

      {/* 3-Stage Pipeline Workflow Stepper Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recruitment Workflow Progress
            </h3>
            <p className="text-xs text-slate-500">Resume Receipt &rarr; Screening Review &rarr; Interview Call</p>
          </div>
          <span className="text-xs font-bold text-slate-400">3 Stages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1: Resume Received */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                1. Resume Received
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ✓ Completed
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800">
              {candidate.resumeReceivedDate}
            </p>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>Source: <strong>{candidate.source}</strong></p>
              <p className="truncate">Reference: <strong>{candidate.reference || 'None'}</strong></p>
            </div>
          </div>

          {/* Stage 2: Review Page */}
          <div className={`border rounded-2xl p-4 space-y-2 transition-all ${
            candidate.reviewDetails
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-blue-50/40 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                2. Screening Review
              </span>
              {candidate.reviewDetails ? (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  candidate.reviewDetails.decision === 'Shortlisted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : candidate.reviewDetails.decision === 'On Hold'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {candidate.reviewDetails.decision}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 animate-pulse">
                  Pending Review
                </span>
              )}
            </div>

            {candidate.reviewDetails ? (
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">
                  Reviewed by {candidate.reviewDetails.reviewerName}
                </p>
                <p className="text-slate-500 text-[11px] line-clamp-2">
                  &quot;{candidate.reviewDetails.notes || 'No review notes'}&quot;
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Recruiter screening not logged yet.
              </p>
            )}

            <Link
              to={`/candidate/${candidate.id}/review`}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 pt-1"
            >
              <span>{candidate.reviewDetails ? 'Update Review' : 'Perform Review'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stage 3: Call for Interview */}
          <div className={`border rounded-2xl p-4 space-y-2 transition-all ${
            candidate.interviewDate
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                3. Call for Interview
              </span>
              {candidate.interviewDate ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Scheduled
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Not Scheduled
                </span>
              )}
            </div>

            {candidate.interviewDate ? (
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{new Date(candidate.interviewDate).toLocaleString()}</span>
                </p>
                <p className="text-slate-500 text-[11px]">
                  Mode: <strong>{candidate.interviewDetails?.mode || 'Online'}</strong> • Status: <strong className="text-slate-800">{candidate.callStatus}</strong>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Schedule slot & notify via WhatsApp/Email.
              </p>
            )}

            <Link
              to={`/candidate/${candidate.id}/call`}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1"
            >
              <span>{candidate.interviewDate ? 'Manage Interview & Invites' : 'Schedule Interview'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Details & Right Column Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candidate Full Information & Quick Status Controls */}
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Candidate Profile Information
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Job Function</span>
                <div className="mt-1">
                  <JobFunctionBadge jobFunction={candidate.jobFunction} />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Position Applied For</span>
                <span className="font-bold text-slate-900 block mt-0.5">{candidate.position}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Mobile (Unique Identifier)</span>
                <span className="font-mono text-slate-800 font-bold block mt-0.5">{candidate.mobile}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Email (Unique Identifier)</span>
                <span className="text-slate-800 break-all block mt-0.5">{candidate.email}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Resume Source Channel</span>
                <div className="mt-1">
                  <SourceBadge source={candidate.source} />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Reference / Referred By</span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  {candidate.reference || 'None (Direct Inflow)'}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Resume Received Date</span>
                <span className="font-mono text-slate-700 text-xs block mt-0.5">
                  {candidate.resumeReceivedDate}
                </span>
              </div>
            </div>

            {/* Resume File Card */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Attached Resume File</span>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {candidate.resumeFileName || 'Resume.pdf'}
                    </p>
                    <p className="text-[10px] text-slate-400">{candidate.resumeFileSize || '1.5 MB'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Simulating viewing ${candidate.resumeFileName}`)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Status Transitions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pipeline Stage Quick Switch
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['Unprogress', 'Process', 'Select', 'Reject'] as CandidateStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    candidate.status === st
                      ? 'ring-2 ring-blue-500 shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <StatusBadge status={st} size="sm" />
                </button>
              ))}
            </div>

            {/* Call Status Quick Toggle */}
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Call Attempt Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Called', 'Not Attended', 'No Response', 'Pending'] as CallStatus[]).map(
                  (cs) => (
                    <button
                      key={cs}
                      type="button"
                      onClick={() => handleCallStatusChange(cs)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        candidate.callStatus === cs
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cs}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Add Note & Activity Audit Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Remark Box */}
          <form
            onSubmit={handleAddRemark}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900">Add Log Note / Call Remark</h3>
            <textarea
              rows={3}
              placeholder="Add interview feedback, notes, salary discussion, or follow-up note..."
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newRemark.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Note</span>
              </button>
            </div>
          </form>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Activity History & Audit Trail</h3>
              <span className="text-xs text-slate-400 font-mono">{candidate.activityLogs.length} events</span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {candidate.activityLogs.map((log) => (
                <div key={log.id} className="relative group">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                    log.type === 'review'
                      ? 'bg-purple-600'
                      : log.type === 'interview_scheduled' || log.type === 'message_sent'
                      ? 'bg-emerald-600'
                      : 'bg-blue-600'
                  }`} />
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1 hover:bg-slate-100/70 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        {log.performedBy || 'System'}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
