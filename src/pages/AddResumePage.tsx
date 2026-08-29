import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { AVAILABLE_POSITIONS, RESUME_SOURCES } from '../data/mockCandidates';
import type { ResumeSource, CandidateStatus } from '../types/candidate';
import {
  UserPlus,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export const AddResumePage: React.FC = () => {
  const { addCandidate, checkDuplicate } = useCandidates();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    source: 'Website Form' as ResumeSource,
    position: AVAILABLE_POSITIONS[0],
    resumeReceivedDate: new Date().toISOString().split('T')[0],
    resumeFileName: 'Resume_Candidate.pdf',
    status: 'Unprogress' as CandidateStatus,
    callStatus: 'Pending' as const,
    remarks: ''
  });

  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    duplicateField?: 'mobile' | 'email' | 'both';
    existingName?: string;
    existingId?: string;
  } | null>(null);

  const [successMessage, setSuccessMessage] = useState('');

  // Live duplicate check on blur
  const handleFieldBlur = () => {
    if (formData.mobile.trim() || formData.email.trim()) {
      const check = checkDuplicate(formData.mobile, formData.email);
      if (check.isDuplicate && check.existingCandidate) {
        setDuplicateWarning({
          isDuplicate: true,
          duplicateField: check.duplicateField,
          existingName: check.existingCandidate.name,
          existingId: check.existingCandidate.id
        });
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent, allowOverride = false) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.email) {
      alert('Please fill in candidate Name, Mobile Number, and Email.');
      return;
    }

    const result = addCandidate(formData, { overrideDuplicate: allowOverride });
    if (!result.success) {
      if (result.duplicateResult?.existingCandidate) {
        setDuplicateWarning({
          isDuplicate: true,
          duplicateField: result.duplicateResult.duplicateField,
          existingName: result.duplicateResult.existingCandidate.name,
          existingId: result.duplicateResult.existingCandidate.id
        });
      }
    } else {
      setSuccessMessage(`Candidate ${formData.name} added successfully!`);
      setTimeout(() => {
        navigate(`/candidate/${result.candidate?.id}`);
      }, 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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
            <h2 className="text-xl font-bold text-slate-900">Add New Candidate Resume</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Manual entry with automated duplicate screening (Mobile & Email)
            </p>
          </div>
        </div>
      </div>

      {/* Duplicate Warning Box */}
      {duplicateWarning && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500 text-white rounded-xl flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold text-amber-900">
                Potential Duplicate Candidate Detected!
              </h4>
              <p className="text-sm text-amber-800 mt-1">
                A candidate matching this{' '}
                <strong className="underline">
                  {duplicateWarning.duplicateField === 'both'
                    ? 'Mobile Number and Email'
                    : duplicateWarning.duplicateField === 'mobile'
                    ? 'Mobile Number'
                    : 'Email Address'}
                </strong>{' '}
                already exists in the database as: <strong>{duplicateWarning.existingName}</strong>.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/candidate/${duplicateWarning.existingId}`)}
                  className="px-3 py-1.5 bg-amber-800 text-white text-xs font-semibold rounded-lg hover:bg-amber-900 transition-colors"
                >
                  View Existing Profile &rarr;
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="px-3 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors"
                >
                  Proceed anyway (Allow duplicate)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-sm font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Candidate Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Candidate Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anandha Krishnan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-medium"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mobile Number (Unique Identifier) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98400 12345"
              value={formData.mobile}
              onBlur={handleFieldBlur}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-mono"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address (Unique Identifier) <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="candidate@example.com"
              value={formData.email}
              onBlur={handleFieldBlur}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
            />
          </div>

          {/* Position Applied For */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Position Applied For <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
            >
              {AVAILABLE_POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Resume Source */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Resume Source Channel <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as ResumeSource })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
            >
              {RESUME_SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Received Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Resume Received Date
            </label>
            <input
              type="date"
              value={formData.resumeReceivedDate}
              onChange={(e) => setFormData({ ...formData, resumeReceivedDate: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Upload Placeholder */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Resume File (PDF / DOCX Placeholder)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 rounded-2xl p-6 text-center transition-colors cursor-pointer">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">
              Drag & drop resume file here or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
          </div>
        </div>

        {/* Initial Remarks */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Initial Remarks / Notes
          </label>
          <textarea
            rows={3}
            placeholder="Key skills, notice period, interview preference..."
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Save Candidate</span>
          </button>
        </div>
      </form>
    </div>
  );
};
