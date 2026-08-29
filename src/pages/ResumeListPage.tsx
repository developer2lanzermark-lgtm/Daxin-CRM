import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { CallStatusBadge } from '../components/common/CallStatusBadge';
import { UserPlus, Filter, Phone, Mail } from 'lucide-react';

export const ResumeListPage: React.FC = () => {
  const { candidates } = useCandidates();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'All';
  const searchQuery = searchParams.get('search') || '';

  // Filter candidates based on URL params
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus =
      statusFilter === 'All' || candidate.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.mobile.includes(searchQuery) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Candidate Resumes</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Search, filter and manage candidate pipeline ({filteredCandidates.length} displayed)
          </p>
        </div>
        <Link
          to="/add-resume"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Resume</span>
        </Link>
      </div>

      {/* Placeholder preview note */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">
              Active Filter: <span className="underline">{statusFilter} Status</span>
              {searchQuery && ` | Search: "${searchQuery}"`}
            </p>
            <p className="text-xs text-blue-700">
              Full filter controls, multi-column sorting, and batch actions will be expanded in the dedicated Resume List step.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Candidate Info</th>
                <th className="py-3.5 px-4">Position</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Received Date</th>
                <th className="py-3.5 px-4">Call Status</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/candidate/${candidate.id}`}
                      className="font-bold text-slate-900 hover:text-blue-600 truncate block"
                    >
                      {candidate.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" />
                        {candidate.mobile}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[150px]">
                        <Mail className="w-3 h-3" />
                        {candidate.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {candidate.position}
                  </td>
                  <td className="py-3.5 px-4">
                    <SourceBadge source={candidate.source} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                    {candidate.resumeReceivedDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <CallStatusBadge status={candidate.callStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={candidate.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/candidate/${candidate.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
