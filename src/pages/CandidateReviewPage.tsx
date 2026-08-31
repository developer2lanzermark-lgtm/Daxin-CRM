import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { JobFunctionBadge } from '../components/common/JobFunctionBadge';
import type { ReviewDecision, CandidateStatus } from '../types/candidate';
import {
  ArrowLeft,
  FileCheck2,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  UserCheck,
  FileText,
  Download,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const CandidateReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidate } = useCandidates();

  const candidate = id ? getCandidateById(id) : undefined;

  const [reviewerName, setReviewerName] = useState(
    candidate?.reviewDetails?.reviewerName || 'Kavitha (HR Team)'
  );
  const [reviewDate, setReviewDate] = useState(
    candidate?.reviewDetails?.reviewDate || new Date().toISOString().split('T')[0]
  );
  const [decision, setDecision] = useState<ReviewDecision>(
    candidate?.reviewDetails?.decision || 'Shortlisted'
  );
  const [notes, setNotes] = useState(
    candidate?.reviewDetails?.notes || ''
  );

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!candidate) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto mt-10">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Candidate Not Found</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          The candidate record you are looking for does not exist.
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

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();

    let newStatus: CandidateStatus = candidate.status;
    if (decision === 'Shortlisted') {
      if (candidate.status === 'Unprogress') {
        newStatus = 'Process';
      }
    } else if (decision === 'Rejected') {
      newStatus = 'Reject';
    }

    const reviewDetails = {
      reviewerName: reviewerName.trim(),
      reviewDate,
      decision,
      notes: notes.trim()
    };

    updateCandidate(
      candidate.id,
      {
        reviewDetails,
        status: newStatus
      },
      {
        type: 'review',
        description: `Resume Screened & Reviewed by ${reviewerName.trim()}: Decision [${decision}]${notes.trim() ? ` - Notes: "${notes.trim()}"` : ''}`,
        performedBy: reviewerName.trim(),
        details: {
          reviewDecision: decision,
          oldStatus: candidate.status,
          newStatus
        }
      }
    );

    setSaveSuccess(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Workflow Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/candidate/${candidate.id}`)}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Screen & Review Resume
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Stage 2: Review
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Evaluate candidate qualifications, record shortlisting decision, and add screening remarks
            </p>
          </div>
        </div>

        {/* Workflow Breadcrumb Stepper */}
        <div className="flex items-center gap-1.5 text-xs font-semibold bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm">
          <Link
            to={`/candidate/${candidate.id}`}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-1"
          >
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">1</span>
            <span>Profile</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white flex items-center gap-1 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">2</span>
            <span>Review</span>
          </span>
          <span className="text-slate-300">/</span>
          <button
            type="button"
            onClick={() => {
              if (candidate.reviewDetails?.decision === 'Shortlisted' || decision === 'Shortlisted') {
                navigate(`/candidate/${candidate.id}/call`);
              } else {
                alert('Candidate must be Shortlisted before proceeding to Call for Interview stage.');
              }
            }}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors ${
              candidate.reviewDetails?.decision === 'Shortlisted' || decision === 'Shortlisted'
                ? 'text-blue-700 hover:bg-blue-50 font-bold'
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">3</span>
            <span>Call for Interview</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 shadow-sm animate-in fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">
                Screening review saved successfully for {candidate.name}!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Decision: <strong>{decision}</strong> • Status updated in candidate activity audit trail.
              </p>
            </div>
          </div>
          {decision === 'Shortlisted' && (
            <Link
              to={`/candidate/${candidate.id}/call`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <span>Proceed to Call for Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Candidate Profile Quick Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
              <JobFunctionBadge jobFunction={candidate.jobFunction} size="sm" />
              <StatusBadge status={candidate.status} size="sm" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              Applying for: <strong className="text-slate-900">{candidate.position}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">{candidate.resumeFileName || 'Resume.pdf'}</span>
              <button
                type="button"
                onClick={() => alert(`Simulating viewing ${candidate.resumeFileName}`)}
                className="text-blue-600 hover:text-blue-800 font-bold ml-2 underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View CV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Meta summary grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Contact Phone</span>
            <span className="font-mono font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {candidate.mobile}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Email Address</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 mt-0.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {candidate.email}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Resume Source</span>
            <div className="mt-0.5">
              <SourceBadge source={candidate.source} size="sm" />
            </div>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Reference / Referred By</span>
            <span className="font-medium text-slate-800 mt-0.5 block truncate">
              {candidate.reference || 'None (Direct application)'}
            </span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSaveReview} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <span>Recruiter Screening & Shortlisting Decision</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate key qualifications, communication, and match for the {candidate.position} role
          </p>
        </div>

        {/* Decision Cards */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            Screening Decision <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Shortlisted */}
            <label
              className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                decision === 'Shortlisted'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="Shortlisted"
                checked={decision === 'Shortlisted'}
                onChange={() => setDecision('Shortlisted')}
                className="mt-1 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Shortlisted</span>
                </div>
                <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
                  Candidate meets technical & background criteria. Eligible to schedule interview call.
                </p>
              </div>
            </label>

            {/* On Hold */}
            <label
              className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                decision === 'On Hold'
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="On Hold"
                checked={decision === 'On Hold'}
                onChange={() => setDecision('On Hold')}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-amber-950">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>On Hold</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                  Under evaluation or waiting for secondary review / client feedback.
                </p>
              </div>
            </label>

            {/* Rejected */}
            <label
              className={`relative flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                decision === 'Rejected'
                  ? 'border-rose-500 bg-rose-50/70 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <input
                type="radio"
                name="decision"
                value="Rejected"
                checked={decision === 'Rejected'}
                onChange={() => setDecision('Rejected')}
                className="mt-1 text-rose-600 focus:ring-rose-500"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-rose-950">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Rejected</span>
                </div>
                <p className="text-xs text-rose-800/80 mt-1 leading-relaxed">
                  Does not match experience or requirements. Status will be marked as Reject.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Reviewer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Reviewer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kavitha (HR Recruiter)"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Review Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-medium"
            />
          </div>
        </div>

        {/* Review Remarks / Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Screening Notes & Evaluation Remarks
          </label>
          <textarea
            rows={4}
            placeholder="Document candidate's relevant skills, strengths, compensation expectations, or reasons for shortlisting/rejection..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            * This decision will update the candidate status and be recorded in the audit history.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate(`/candidate/${candidate.id}`)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Save Review Decision</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
