import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import type { CandidateStatus, CallStatus } from '../types/candidate';
import {
  ArrowLeft,
  FileText,
  Send,
  Trash2,
  Download,
  AlertCircle
} from 'lucide-react';

export const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidate, deleteCandidate } = useCandidates();

  const candidate = id ? getCandidateById(id) : undefined;

  const [interviewDate, setInterviewDate] = useState<string>(
    candidate?.interviewDate || ''
  );
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
        description: `Status changed to ${status}`,
        performedBy: 'HR User'
      }
    );
    setStatusUpdatedToast(`Status changed to ${status}`);
    setTimeout(() => setStatusUpdatedToast(''), 3000);
  };

  const handleCallStatusChange = (status: CallStatus) => {
    updateCandidate(
      candidate.id,
      { callStatus: status },
      {
        type: 'call_log',
        description: `Call status updated to "${status}"`,
        performedBy: 'HR User'
      }
    );
    setStatusUpdatedToast(`Call status updated to ${status}`);
    setTimeout(() => setStatusUpdatedToast(''), 3000);
  };

  const handleSaveInterviewDate = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidate(
      candidate.id,
      { interviewDate, status: 'Process' },
      {
        type: 'status_change',
        description: `Interview scheduled on ${interviewDate}`,
        performedBy: 'HR User'
      }
    );
    setStatusUpdatedToast('Interview date updated & candidate moved to Process');
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
    setStatusUpdatedToast('Remark added to activity timeline');
    setTimeout(() => setStatusUpdatedToast(''), 3000);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete candidate ${candidate.name}?`)) {
      deleteCandidate(candidate.id);
      navigate('/resumes');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top navigation & Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
              <StatusBadge status={candidate.status} size="sm" />
            </div>
            <p className="text-xs text-slate-400 font-mono">ID: {candidate.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candidate Overview & Actions */}
        <div className="space-y-6">
          {/* Candidate Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Candidate Information
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Position</span>
                <span className="font-bold text-slate-900">{candidate.position}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Mobile (Unique)</span>
                <span className="font-mono text-slate-800 font-semibold">{candidate.mobile}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Email (Unique)</span>
                <span className="text-slate-800 break-all">{candidate.email}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Resume Source Channel</span>
                <div className="mt-1">
                  <SourceBadge source={candidate.source} />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Received Date</span>
                <span className="font-mono text-slate-700 text-xs">
                  {candidate.resumeReceivedDate}
                </span>
              </div>
            </div>

            {/* Resume File Card */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 block mb-2">Attached Resume</span>
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
                  onClick={() => alert(`Simulating download for ${candidate.resumeFileName}`)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pipeline Status Transitions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Update Pipeline Status
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

            {/* Call Status quick toggle */}
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

            {/* Schedule Interview */}
            <form onSubmit={handleSaveInterviewDate} className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Schedule / Change Interview Date
              </label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Activity Log & Remarks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Remark Box */}
          <form
            onSubmit={handleAddRemark}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900">Add Notes / Log Call Remarks</h3>
            <textarea
              rows={3}
              placeholder="Add feedback, interview score, or follow-up note..."
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
            <h3 className="text-sm font-bold text-slate-900">Activity History & Audit Trail</h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {candidate.activityLogs.map((log) => (
                <div key={log.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
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
