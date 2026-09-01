import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { CallStatusBadge } from '../components/common/CallStatusBadge';
import { JobFunctionBadge } from '../components/common/JobFunctionBadge';
import { StickyHeader } from '../components/layout/StickyHeader';
import type { CallStatus, InterviewMode } from '../types/candidate';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Video,
  Send,
  MessageSquare,
  Mail,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';

export const CandidateCallPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCandidateById, updateCandidate } = useCandidates();

  const candidate = id ? getCandidateById(id) : undefined;

  const defaultDateTime = candidate?.interviewDate
    ? candidate.interviewDate.replace(' ', 'T').slice(0, 16)
    : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + 'T10:30';

  const [interviewDateTime, setInterviewDateTime] = useState<string>(
    candidate?.interviewDetails?.interviewDate || defaultDateTime
  );
  const [interviewMode, setInterviewMode] = useState<InterviewMode>(
    candidate?.interviewDetails?.mode || 'Online'
  );
  const [interviewer, setInterviewer] = useState<string>(
    candidate?.interviewDetails?.interviewer || 'Sundar (Lead Tech Panel)'
  );
  const [locationOrLink, setLocationOrLink] = useState<string>(
    candidate?.interviewDetails?.locationOrLink ||
      'https://meet.google.com/dax-inhr-tech'
  );
  const [currentCallStatus, setCurrentCallStatus] = useState<CallStatus>(
    candidate?.callStatus || 'Called'
  );
  const [callNotes, setCallNotes] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string>('');

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

  const isShortlisted =
    candidate.reviewDetails?.decision === 'Shortlisted' ||
    candidate.status === 'Process' ||
    candidate.status === 'Select';

  // Format readable datetime string
  const formattedInterviewDate = interviewDateTime
    ? new Date(interviewDateTime).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Upcoming Interview';

  // WhatsApp Message Template
  const generateWhatsAppMessage = () => {
    return (
      `Hello ${candidate.name},\n\n` +
      `Greetings from Daxin Tech (https://daxin.onrender.com)!\n\n` +
      `We are pleased to invite you for an interview for the *${candidate.position}* position.\n\n` +
      `📅 *Date & Time:* ${formattedInterviewDate}\n` +
      `💻 *Interview Mode:* ${interviewMode}\n` +
      `📍 *Location / Meeting Link:* ${locationOrLink}\n` +
      `👤 *Interviewer:* ${interviewer}\n\n` +
      `Please reply to this message to confirm your availability. Best of luck!\n\n` +
      `— Daxin HR Recruitment Team`
    );
  };

  // Email Subject & Body
  const generateEmailSubject = () => {
    return `Interview Invitation: ${candidate.position} role at Daxin - ${formattedInterviewDate}`;
  };

  const generateEmailBody = () => {
    return (
      `Dear ${candidate.name},\n\n` +
      `Thank you for your application for the ${candidate.position} role with Daxin.\n\n` +
      `We have reviewed your profile and would like to invite you for an interview.\n\n` +
      `Interview Details:\n` +
      `----------------------------------------\n` +
      `• Position: ${candidate.position} (${candidate.jobFunction})\n` +
      `• Date & Time: ${formattedInterviewDate}\n` +
      `• Mode: ${interviewMode}\n` +
      `• Location / Link: ${locationOrLink}\n` +
      `• Interviewer: ${interviewer}\n` +
      `----------------------------------------\n\n` +
      `Please confirm your availability by replying to this email.\n\n` +
      `Best regards,\n` +
      `HR Recruitment Team\n` +
      `Daxin - Apps That Make Business Life Simple\n` +
      `https://daxin.onrender.com`
    );
  };

  // Extract clean digits for WhatsApp URL
  const getWhatsAppCleanPhone = () => {
    const raw = candidate.mobile.replace(/\D/g, '');
    if (raw.length === 10) {
      return `91${raw}`;
    }
    return raw;
  };

  // Handle WhatsApp Trigger
  const handleSendWhatsApp = () => {
    const phoneDigits = getWhatsAppCleanPhone();
    const message = generateWhatsAppMessage();
    const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;

    // Log in activity
    updateCandidate(
      candidate.id,
      {
        status: 'Process',
        callStatus: 'Called',
        interviewDate: interviewDateTime,
        interviewDetails: {
          interviewDate: interviewDateTime,
          mode: interviewMode,
          interviewer,
          locationOrLink,
          lastNotifiedVia: 'WhatsApp',
          lastNotifiedAt: new Date().toISOString()
        }
      },
      {
        type: 'message_sent',
        description: `Interview invite sent via WhatsApp to ${candidate.mobile} for ${formattedInterviewDate}`,
        performedBy: 'HR Team',
        details: {
          messageChannel: 'WhatsApp',
          interviewDate: interviewDateTime,
          callStatus: 'Called'
        }
      }
    );

    setCurrentCallStatus('Called');
    setActionFeedback('WhatsApp invitation dispatched! Activity logged.');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Handle Email Trigger
  const handleSendEmail = () => {
    const subject = generateEmailSubject();
    const body = generateEmailBody();
    const mailtoUrl = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Log in activity
    updateCandidate(
      candidate.id,
      {
        status: 'Process',
        callStatus: 'Called',
        interviewDate: interviewDateTime,
        interviewDetails: {
          interviewDate: interviewDateTime,
          mode: interviewMode,
          interviewer,
          locationOrLink,
          lastNotifiedVia: 'Email',
          lastNotifiedAt: new Date().toISOString()
        }
      },
      {
        type: 'message_sent',
        description: `Interview invitation email sent to ${candidate.email} for ${formattedInterviewDate}`,
        performedBy: 'HR Team',
        details: {
          messageChannel: 'Email',
          interviewDate: interviewDateTime,
          callStatus: 'Called'
        }
      }
    );

    setCurrentCallStatus('Called');
    setActionFeedback('Email client opened with prefilled invite! Activity logged.');
    window.location.href = mailtoUrl;
  };

  // Save Interview Schedule & Call Status
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    updateCandidate(
      candidate.id,
      {
        status: 'Process',
        callStatus: currentCallStatus,
        interviewDate: interviewDateTime,
        interviewDetails: {
          interviewDate: interviewDateTime,
          mode: interviewMode,
          interviewer,
          locationOrLink,
          lastNotifiedVia: candidate.interviewDetails?.lastNotifiedVia,
          lastNotifiedAt: candidate.interviewDetails?.lastNotifiedAt
        }
      },
      {
        type: 'interview_scheduled',
        description: `Interview confirmed for ${formattedInterviewDate} (${interviewMode}) by ${interviewer}. Call status: "${currentCallStatus}"${callNotes ? ` - Notes: ${callNotes}` : ''}`,
        performedBy: 'HR Team',
        details: {
          interviewDate: interviewDateTime,
          callStatus: currentCallStatus,
          remark: callNotes
        }
      }
    );

    setActionFeedback('Interview schedule and call status updated successfully!');
    setTimeout(() => {
      navigate(`/candidate/${candidate.id}`);
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Workflow Navigation Header */}
      <StickyHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                Call for Interview & Notification
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Stage 3: Interview Scheduling
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Schedule interview date, select mode, log call attempt, and dispatch invitations via WhatsApp & Email
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
          <Link
            to={`/candidate/${candidate.id}/review`}
            className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-1"
          >
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
            <span>Review</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white flex items-center gap-1 shadow-sm">
            <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">3</span>
            <span>Call for Interview</span>
          </span>
        </div>
      </StickyHeader>

      {/* Shortlist Warning if candidate was not shortlisted */}
      {!isShortlisted && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-900">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">
                Candidate has not been marked as &quot;Shortlisted&quot; yet.
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Current status: <strong>{candidate.status}</strong>. It is recommended to complete the Review stage first.
              </p>
            </div>
          </div>
          <Link
            to={`/candidate/${candidate.id}/review`}
            className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl hover:bg-amber-900 transition-colors"
          >
            Go to Review Stage &rarr;
          </Link>
        </div>
      )}

      {/* Feedback Alert */}
      {actionFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-semibold">{actionFeedback}</p>
        </div>
      )}

      {/* Candidate Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
              <JobFunctionBadge jobFunction={candidate.jobFunction} size="sm" />
              <StatusBadge status={candidate.status} size="sm" />
              <CallStatusBadge status={candidate.callStatus} size="sm" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              Role: <strong className="text-slate-900">{candidate.position}</strong> • Contact:{' '}
              <span className="font-mono text-slate-800 font-bold">{candidate.mobile}</span>
            </p>
          </div>

          {candidate.reviewDetails && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs text-emerald-900">
              <span className="font-bold block">
                ✓ Review Status: {candidate.reviewDetails.decision}
              </span>
              <span className="text-emerald-700">
                by {candidate.reviewDetails.reviewerName} on {candidate.reviewDetails.reviewDate}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Schedule Form (Left) & Communication Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule Form */}
        <form onSubmit={handleSaveSchedule} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Interview Schedule Details</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure date, time, interview mode, and panel assignment
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Interview Date & Time */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Interview Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={interviewDateTime}
                onChange={(e) => setInterviewDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            {/* Interview Mode */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Interview Mode <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInterviewMode('Online');
                    if (locationOrLink.includes('Office') || locationOrLink.includes('Daxin HQ')) {
                      setLocationOrLink('https://meet.google.com/dax-inhr-tech');
                    }
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    interviewMode === 'Online'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  <span>Online (Meet/Zoom)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInterviewMode('In-Person');
                    if (locationOrLink.includes('meet.google') || locationOrLink.includes('zoom')) {
                      setLocationOrLink('Daxin HQ, Plot No. 743, 2nd Floor, Palayamkottai, Tirunelveli');
                    }
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    interviewMode === 'In-Person'
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>In-Person Office</span>
                </button>
              </div>
            </div>

            {/* Interviewer / Panel */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Interviewer / Panel Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sundar (Lead Tech Panel) / Rajesh (HR)"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            {/* Location or Meeting Link */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Location or Meeting Link <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google Meet URL or Office Address"
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Call / Response Status Tracking */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Call Attempt & Response Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Called', 'Not Attended', 'No Response', 'Pending'] as CallStatus[]).map((cs) => {
                const isActive = currentCallStatus === cs;
                return (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => setCurrentCallStatus(cs)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isActive
                        ? cs === 'Called'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                          : cs === 'Not Attended'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                          : cs === 'No Response'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20'
                          : 'border-slate-400 bg-slate-100 text-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cs}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Call Notes */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
              Call Remarks / Candidate Response Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Candidate confirmed interview slot; requested 10 mins buffer for travel..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(`/candidate/${candidate.id}`)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Schedule & Status</span>
            </button>
          </div>
        </form>

        {/* Right 1 Col: Direct Communication Actions */}
        <div className="space-y-6">
          {/* WhatsApp Action Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <MessageSquare className="w-5 h-5 text-emerald-200" />
                <span>Send via WhatsApp</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Instant
              </span>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed">
              Launch WhatsApp with a pre-filled interview invitation addressed to{' '}
              <strong className="text-white">{candidate.name}</strong> ({candidate.mobile}).
            </p>

            <div className="bg-emerald-950/40 rounded-xl p-3 text-[11px] font-mono text-emerald-100 border border-emerald-400/20 max-h-32 overflow-y-auto">
              {generateWhatsAppMessage()}
            </div>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full py-2.5 px-4 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Open WhatsApp & Send</span>
            </button>
          </div>

          {/* Email Action Card */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <Mail className="w-5 h-5 text-blue-200" />
                <span>Send via Email</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Official
              </span>
            </div>

            <p className="text-xs text-blue-100 leading-relaxed">
              Open your default mail client with pre-filled interview invite template for{' '}
              <strong className="text-white">{candidate.email}</strong>.
            </p>

            <div className="bg-blue-950/40 rounded-xl p-3 text-[11px] font-mono text-blue-100 border border-blue-400/20 max-h-32 overflow-y-auto">
              <p className="font-bold text-white mb-1">Subject: {generateEmailSubject()}</p>
              <p className="whitespace-pre-line">{generateEmailBody()}</p>
            </div>

            <button
              type="button"
              onClick={handleSendEmail}
              className="w-full py-2.5 px-4 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-blue-700" />
              <span>Open Email & Send</span>
            </button>
          </div>

          {/* Tips Info Card */}
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Audit Logging Notice</span>
            </div>
            <p className="text-slate-500">
              Triggering WhatsApp or Email automatically sets the candidate status to{' '}
              <strong className="text-slate-800">In Process</strong>, call status to{' '}
              <strong className="text-slate-800">Called</strong>, and logs the timestamp in the candidate timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
