import React, { useState } from 'react';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';
import { JobFunctionBadge } from '../components/common/JobFunctionBadge';
import {
  Download,
  Printer,
  Calendar
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { candidates } = useCandidates();
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  // Filter candidates by date range
  const dateFilteredCandidates = candidates.filter((c) => {
    if (!c.resumeReceivedDate) return true;
    return c.resumeReceivedDate >= startDate && c.resumeReceivedDate <= endDate;
  });

  const filteredStats = {
    total: dateFilteredCandidates.length,
    unprogress: dateFilteredCandidates.filter((c) => c.status === 'Unprogress').length,
    process: dateFilteredCandidates.filter((c) => c.status === 'Process').length,
    select: dateFilteredCandidates.filter((c) => c.status === 'Select').length,
    reject: dateFilteredCandidates.filter((c) => c.status === 'Reject').length
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Mobile',
      'Email',
      'Job Function',
      'Position',
      'Source',
      'Reference',
      'Received Date',
      'Status',
      'Review Decision',
      'Call Status',
      'Interview Date'
    ];

    const rows = dateFilteredCandidates.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.mobile}"`,
      `"${c.email}"`,
      `"${c.jobFunction}"`,
      `"${c.position.replace(/"/g, '""')}"`,
      `"${c.source}"`,
      `"${(c.reference || '').replace(/"/g, '""')}"`,
      c.resumeReceivedDate,
      c.status,
      `"${c.reviewDetails?.decision || 'Not Screened'}"`,
      c.callStatus,
      `"${c.interviewDate || 'Not Scheduled'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daxin_candidates_report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header with Export & Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recruitment Reports & Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pipeline metrics, Job Function breakdown, and candidate volume by date range
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Filter Report by Date Range:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Metric Cards in Range */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Received</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{filteredStats.total}</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-300 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Unprogress</span>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{filteredStats.unprogress}</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">In Process</span>
          <p className="text-2xl font-extrabold text-amber-900 mt-1">{filteredStats.process}</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-300 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Selected</span>
          <p className="text-2xl font-extrabold text-emerald-900 mt-1">{filteredStats.select}</p>
        </div>

        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-300 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Rejected</span>
          <p className="text-2xl font-extrabold text-rose-900 mt-1">{filteredStats.reject}</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm flex items-center justify-between">
          <span>Candidates in Selected Window ({dateFilteredCandidates.length})</span>
          <span className="text-xs text-slate-400 font-normal">Includes Job Function & Reference tracking</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Job Function & Position</th>
                <th className="py-3 px-4">Source & Reference</th>
                <th className="py-3 px-4">Received Date</th>
                <th className="py-3 px-4">Review Decision</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dateFilteredCandidates.length > 0 ? (
                dateFilteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <span className="font-mono text-slate-400 text-[11px]">{c.mobile}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <JobFunctionBadge jobFunction={c.jobFunction} size="sm" />
                        <p className="font-medium text-slate-700">{c.position}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <SourceBadge source={c.source} size="sm" />
                        {c.reference && (
                          <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                            Ref: {c.reference}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{c.resumeReceivedDate}</td>
                    <td className="py-3 px-4">
                      {c.reviewDetails ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.reviewDetails.decision === 'Shortlisted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.reviewDetails.decision === 'On Hold'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {c.reviewDetails.decision}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Not Screened</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No candidates found within the selected date window.
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
