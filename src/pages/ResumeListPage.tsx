import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { CallStatusBadge } from '../components/common/CallStatusBadge';
import { JobFunctionBadge } from '../components/common/JobFunctionBadge';
import { useOptions } from '../context/OptionsContext';
import { StickyHeader } from '../components/layout/StickyHeader';
import {
  UserPlus,
  Phone,
  Mail,
  Search,
  X,
  FileCheck2,
  PhoneCall
} from 'lucide-react';

export const ResumeListPage: React.FC = () => {
  const { candidates } = useCandidates();
  const { options } = useOptions();
  const { jobFunctions: JOB_FUNCTIONS, resumeSources: RESUME_SOURCES } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get('status') || 'All';
  const jobFuncParam = searchParams.get('jobFunction') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedStatus, setSelectedStatus] = useState<string>(statusParam);
  const [selectedJobFunction, setSelectedJobFunction] = useState<string>(jobFuncParam);
  const [selectedSource, setSelectedSource] = useState<string>('All');

  // Update URL params
  const updateFilters = (status: string, jobFunc: string, search: string) => {
    const params: Record<string, string> = {};
    if (status !== 'All') params.status = status;
    if (jobFunc !== 'All') params.jobFunction = jobFunc;
    if (search.trim()) params.search = search.trim();
    setSearchParams(params);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateFilters(status, selectedJobFunction, searchInput);
  };

  const handleJobFunctionChange = (jf: string) => {
    setSelectedJobFunction(jf);
    updateFilters(selectedStatus, jf, searchInput);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(selectedStatus, selectedJobFunction, searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedStatus('All');
    setSelectedJobFunction('All');
    setSelectedSource('All');
    setSearchParams({});
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus =
      selectedStatus === 'All' ||
      candidate.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesJobFunction =
      selectedJobFunction === 'All' ||
      candidate.jobFunction === selectedJobFunction;

    const matchesSource =
      selectedSource === 'All' ||
      candidate.source === selectedSource;

    const query = searchInput.toLowerCase().trim();
    const matchesSearch =
      !query ||
      candidate.name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.mobile.includes(query) ||
      candidate.position.toLowerCase().includes(query) ||
      (candidate.reference && candidate.reference.toLowerCase().includes(query));

    return matchesStatus && matchesJobFunction && matchesSource && matchesSearch;
  });

  const hasActiveFilters =
    selectedStatus !== 'All' ||
    selectedJobFunction !== 'All' ||
    selectedSource !== 'All' ||
    Boolean(searchInput.trim());

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Header Bar */}
      <StickyHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Candidate Resumes</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter by Job Function & Status, and progress candidates through screening ({filteredCandidates.length} displayed)
          </p>
        </div>
        <Link
          to="/add-resume"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Resume</span>
        </Link>
      </StickyHeader>

      {/* Filter Control Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate name, mobile, email, position, or reference..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilters(selectedStatus, selectedJobFunction, '');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Job Function Filter Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={selectedJobFunction}
              onChange={(e) => handleJobFunctionChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 text-xs sm:text-sm font-medium outline-none text-slate-800"
            >
              <option value="All">All Job Functions</option>
              {JOB_FUNCTIONS.map((jf) => (
                <option key={jf} value={jf}>
                  {jf} Function
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="w-full lg:w-44">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 text-xs sm:text-sm font-medium outline-none text-slate-800"
            >
              <option value="All">All Pipeline Stages</option>
              <option value="Unprogress">Unprogress</option>
              <option value="Process">Process</option>
              <option value="Select">Select</option>
              <option value="Reject">Reject</option>
            </select>
          </div>

          {/* Source Filter Dropdown */}
          <div className="w-full lg:w-44">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 text-xs sm:text-sm font-medium outline-none text-slate-800"
            >
              <option value="All">All Channels</option>
              {RESUME_SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Candidate Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Candidate Profile</th>
                <th className="py-3.5 px-4">Job Function & Position</th>
                <th className="py-3.5 px-4">Source & Reference</th>
                <th className="py-3.5 px-4">Screening Review</th>
                <th className="py-3.5 px-4">Interview Call</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Workflow Stages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Candidate info */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/candidate/${candidate.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 truncate block text-sm"
                      >
                        {candidate.name}
                      </Link>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {candidate.mobile}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[160px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {candidate.email}
                        </span>
                      </div>
                    </td>

                    {/* Job Function & Position */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <JobFunctionBadge jobFunction={candidate.jobFunction} size="sm" />
                        <p className="text-xs font-semibold text-slate-800 leading-tight">
                          {candidate.position}
                        </p>
                      </div>
                    </td>

                    {/* Source & Reference */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 text-xs">
                        <SourceBadge source={candidate.source} size="sm" />
                        {candidate.reference && (
                          <p className="text-[11px] text-slate-500 truncate max-w-[140px]" title={candidate.reference}>
                            Ref: <span className="font-medium text-slate-700">{candidate.reference}</span>
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {candidate.resumeReceivedDate}
                        </span>
                      </div>
                    </td>

                    {/* Screening Review */}
                    <td className="py-3.5 px-4">
                      {candidate.reviewDetails ? (
                        <div className="text-xs space-y-0.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            candidate.reviewDetails.decision === 'Shortlisted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : candidate.reviewDetails.decision === 'On Hold'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {candidate.reviewDetails.decision}
                          </span>
                          <p className="text-[10px] text-slate-400">{candidate.reviewDetails.reviewDate}</p>
                        </div>
                      ) : (
                        <Link
                          to={`/candidate/${candidate.id}/review`}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline"
                        >
                          + Perform Review
                        </Link>
                      )}
                    </td>

                    {/* Interview Call */}
                    <td className="py-3.5 px-4">
                      {candidate.interviewDate ? (
                        <div className="text-xs space-y-0.5">
                          <CallStatusBadge status={candidate.callStatus} size="sm" />
                          <p className="text-[10px] text-slate-500 font-mono">
                            {new Date(candidate.interviewDate).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <CallStatusBadge status={candidate.callStatus} size="sm" />
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={candidate.status} size="sm" />
                    </td>

                    {/* Action buttons for each stage */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/candidate/${candidate.id}/review`}
                          title="Screening Review"
                          className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FileCheck2 className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/candidate/${candidate.id}/call`}
                          title="Schedule & Call for Interview"
                          className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/candidate/${candidate.id}`}
                          className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-slate-500">
                    No candidates found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
