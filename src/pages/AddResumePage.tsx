import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { JOB_FUNCTIONS, POSITIONS_BY_JOB_FUNCTION, RESUME_SOURCES, COUNTRY_CODES } from '../data/mockCandidates';
import type {
  ResumeSource,
  CandidateStatus,
  JobFunction,
  Gender,
  MaritalStatus,
  Qualification
} from '../types/candidate';
import {
  UserPlus,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

const GENDERS: Gender[] = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES: MaritalStatus[] = ['Single', 'Married', 'Other'];
const QUALIFICATIONS: Qualification[] = ['School', 'Diploma', 'UG', 'PG'];

const inputClass =
  'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all';
const labelClass =
  'block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5';

export const AddResumePage: React.FC = () => {
  const { addCandidate, checkDuplicate } = useCandidates();
  const navigate = useNavigate();

  const [selectedJobFunction, setSelectedJobFunction] = useState<JobFunction | ''>('Developer');
  const [selectedPosition, setSelectedPosition] = useState<string>(
    POSITIONS_BY_JOB_FUNCTION['Developer'][0]
  );
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [rawMobile, setRawMobile] = useState<string>('');
  const [reference, setReference] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: 'Website Form' as ResumeSource,
    resumeReceivedDate: new Date().toISOString().split('T')[0],
    resumeFileName: 'Resume_Candidate.pdf',
    resumeFileSize: '1.5 MB',
    status: 'Unprogress' as CandidateStatus,
    callStatus: 'Pending' as const,
    remarks: '',
    // Personal details
    dob: '',
    gender: '' as Gender | '',
    maritalStatus: '' as MaritalStatus | '',
    // Location
    city: '',
    state: '',
    area: '',
    // Education
    qualification: '' as Qualification | '',
    qualificationDepartment: '',
    extraQualification: '',
    // Experience
    hasPreviousExperience: 'No' as 'Yes' | 'No',
    yearsOfExperience: ''
  });

  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    duplicateField?: 'mobile' | 'email' | 'both';
    existingName?: string;
    existingId?: string;
  } | null>(null);

  const [successMessage, setSuccessMessage] = useState('');

  const isOthers = selectedJobFunction === 'Others';
  const needsDepartment =
    formData.qualification === 'Diploma' ||
    formData.qualification === 'UG' ||
    formData.qualification === 'PG';

  // Available positions based on selected Job Function
  const availablePositions = useMemo(() => {
    if (!selectedJobFunction) return [];
    return POSITIONS_BY_JOB_FUNCTION[selectedJobFunction] || [];
  }, [selectedJobFunction]);

  // Handle Job Function change
  const handleJobFunctionChange = (jobFunc: JobFunction | '') => {
    setSelectedJobFunction(jobFunc);
    if (jobFunc === 'Others') {
      // Free-text position entry for "Others"
      setSelectedPosition('');
    } else if (jobFunc && POSITIONS_BY_JOB_FUNCTION[jobFunc]?.length > 0) {
      setSelectedPosition(POSITIONS_BY_JOB_FUNCTION[jobFunc][0]);
    } else {
      setSelectedPosition('');
    }
  };

  // Helper to get combined formatted mobile number
  const getFullMobile = () => {
    if (!rawMobile.trim()) return '';
    return `${countryCode} ${rawMobile.trim()}`;
  };

  // Live duplicate check on blur
  const handleFieldBlur = () => {
    const fullMobile = getFullMobile();
    if (fullMobile || formData.email.trim()) {
      const check = checkDuplicate(fullMobile, formData.email);
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
    if (!formData.name || !rawMobile.trim() || !formData.email) {
      alert('Please fill in candidate Name, Mobile Number, and Email.');
      return;
    }

    if (!selectedJobFunction || !selectedPosition.trim()) {
      alert('Please select a Job Function and enter the Position Applied For.');
      return;
    }

    const fullMobile = getFullMobile();

    const candidatePayload = {
      ...formData,
      mobile: fullMobile,
      countryCode,
      jobFunction: selectedJobFunction as JobFunction,
      position: selectedPosition.trim(),
      reference: reference.trim() || undefined,
      dob: formData.dob || undefined,
      gender: (formData.gender || undefined) as Gender | undefined,
      maritalStatus: (formData.maritalStatus || undefined) as MaritalStatus | undefined,
      city: formData.city.trim() || undefined,
      state: formData.state.trim() || undefined,
      area: formData.area.trim() || undefined,
      qualification: (formData.qualification || undefined) as Qualification | undefined,
      qualificationDepartment: needsDepartment
        ? formData.qualificationDepartment.trim() || undefined
        : undefined,
      extraQualification: formData.extraQualification.trim() || undefined,
      hasPreviousExperience: formData.hasPreviousExperience === 'Yes',
      yearsOfExperience:
        formData.hasPreviousExperience === 'Yes' && formData.yearsOfExperience
          ? Number(formData.yearsOfExperience)
          : undefined
    };

    const result = addCandidate(candidatePayload, { overrideDuplicate: allowOverride });
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
      setSuccessMessage(`Candidate ${formData.name} added successfully! Redirecting...`);
      setTimeout(() => {
        navigate(`/candidate/${result.candidate?.id}`);
      }, 1200);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Add New Candidate Resume</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Manual entry with Job Function classification & automated duplicate screening (Mobile & Email)
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
                  className="px-3.5 py-1.5 bg-amber-800 text-white text-xs font-semibold rounded-lg hover:bg-amber-900 transition-colors"
                >
                  View Existing Profile &rarr;
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="px-3.5 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors"
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
      <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
        {/* SECTION: Application Details */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Application Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Name */}
            <div>
              <label className={labelClass}>
                Candidate Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`${inputClass} font-medium`}
              />
            </div>

            {/* Mobile Number with Separate Country Code */}
            <div>
              <label className={labelClass}>
                Mobile Number (Unique) <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-28 sm:w-32 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-800 font-mono font-medium"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={rawMobile}
                  onBlur={handleFieldBlur}
                  onChange={(e) => setRawMobile(e.target.value)}
                  className={`flex-1 ${inputClass} font-mono font-medium`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>
                Email Address (Unique) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onBlur={handleFieldBlur}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Job Function (Required, before Position) */}
            <div>
              <label className={labelClass}>
                Job Function <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={selectedJobFunction}
                onChange={(e) => handleJobFunctionChange(e.target.value as JobFunction)}
                className={`${inputClass} font-medium`}
              >
                <option value="" disabled>-- Select Job Function --</option>
                {JOB_FUNCTIONS.map((jf) => (
                  <option key={jf} value={jf}>
                    {jf}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Practice Area / Team Group</p>
            </div>

            {/* Position Applied For - dropdown (filtered) OR free text for "Others" */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Position Applied For <span className="text-rose-500">*</span>
              </label>
              {isOthers ? (
                <input
                  type="text"
                  required
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className={`${inputClass} font-medium`}
                />
              ) : (
                <select
                  required
                  disabled={!selectedJobFunction}
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className={`${inputClass} font-medium disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {!selectedJobFunction && (
                    <option value="">-- Select Job Function first --</option>
                  )}
                  {availablePositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-[11px] text-slate-400 mt-1">
                {isOthers
                  ? 'Enter the exact role title'
                  : `Specific role within ${selectedJobFunction || 'Job Function'}`}
              </p>
            </div>

            {/* Last row: Resume Source Channel + Reference / Referred By together */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Resume Source Channel <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as ResumeSource })}
                  className={inputClass}
                >
                  {RESUME_SOURCES.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">Channel through which CV was received</p>
              </div>

              <div>
                <label className={labelClass}>
                  Reference / Referred By <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[11px] text-slate-400 mt-1">Referral person, agency, or recruiter name</p>
              </div>
            </div>
          </div>
        </fieldset>

        {/* SECTION: Personal Details */}
        <fieldset className="space-y-4 border-t border-slate-100 pt-6">
          <legend className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Personal Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender | '' })}
                className={inputClass}
              >
                <option value="">-- Select --</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Marital Status</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as MaritalStatus | '' })}
                className={inputClass}
              >
                <option value="">-- Select --</option>
                {MARITAL_STATUSES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* SECTION: Location */}
        <fieldset className="space-y-4 border-t border-slate-100 pt-6">
          <legend className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Location
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Area</label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        {/* SECTION: Qualification */}
        <fieldset className="space-y-4 border-t border-slate-100 pt-6">
          <legend className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Qualification
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Qualification</label>
              <select
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualification: e.target.value as Qualification | '',
                    qualificationDepartment: ['Diploma', 'UG', 'PG'].includes(e.target.value)
                      ? formData.qualificationDepartment
                      : ''
                  })
                }
                className={inputClass}
              >
                <option value="">-- Select --</option>
                {QUALIFICATIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {needsDepartment && (
              <div>
                <label className={labelClass}>
                  Department / Specialization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.qualificationDepartment}
                  onChange={(e) => setFormData({ ...formData, qualificationDepartment: e.target.value })}
                  className={inputClass}
                />
                <p className="text-[11px] text-slate-400 mt-1">e.g. B.E. Computer Science, MBA Finance</p>
              </div>
            )}

            <div>
              <label className={labelClass}>
                Extra Qualification <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.extraQualification}
                onChange={(e) => setFormData({ ...formData, extraQualification: e.target.value })}
                className={inputClass}
              />
              <p className="text-[11px] text-slate-400 mt-1">Certifications, diplomas, courses</p>
            </div>
          </div>
        </fieldset>

        {/* SECTION: Experience */}
        <fieldset className="space-y-4 border-t border-slate-100 pt-6">
          <legend className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Experience
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Previous Experience</label>
              <select
                value={formData.hasPreviousExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hasPreviousExperience: e.target.value as 'Yes' | 'No',
                    yearsOfExperience: e.target.value === 'Yes' ? formData.yearsOfExperience : ''
                  })
                }
                className={inputClass}
              >
                <option value="No">No (Fresher)</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {formData.hasPreviousExperience === 'Yes' && (
              <div>
                <label className={labelClass}>
                  Years of Experience <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  required
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </fieldset>

        {/* Upload Placeholder */}
        <div className="border-t border-slate-100 pt-6">
          <label className={labelClass}>
            Resume File (PDF / DOCX Placeholder)
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 rounded-2xl p-6 text-center transition-colors cursor-pointer">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">
              Drag &amp; drop resume file here or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
          </div>
        </div>

        {/* Initial Remarks */}
        <div>
          <label className={labelClass}>
            Initial Remarks / Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className={inputClass}
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
