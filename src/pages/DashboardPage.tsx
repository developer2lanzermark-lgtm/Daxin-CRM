import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  UserPlus
} from 'lucide-react';
import { useCandidates } from '../context/CandidateContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceBadge } from '../components/common/SourceBadge';

export const DashboardPage: React.FC = () => {
  const { candidates, stats } = useCandidates();

  const statusCards = [
    {
      title: 'Unprogress',
      description: 'Not yet contacted / reviewed',
      count: stats.unprogress,
      color: 'slate',
      status: 'Unprogress' as const,
      borderClass: 'border-slate-300',
      bgClass: 'bg-slate-50 hover:bg-slate-100/80 text-slate-700',
      badgeClass: 'bg-slate-200 text-slate-700',
      icon: Clock,
      filterUrl: '/resumes?status=Unprogress'
    },
    {
      title: 'In Process',
      description: 'Calling, scheduling & interviewing',
      count: stats.process,
      color: 'amber',
      status: 'Process' as const,
      borderClass: 'border-amber-300',
      bgClass: 'bg-amber-50 hover:bg-amber-100/60 text-amber-800',
      badgeClass: 'bg-amber-200 text-amber-900',
      icon: Loader2,
      filterUrl: '/resumes?status=Process'
    },
    {
      title: 'Selected',
      description: 'Cleared rounds / offer given',
      count: stats.select,
      color: 'emerald',
      status: 'Select' as const,
      borderClass: 'border-emerald-300',
      bgClass: 'bg-emerald-50 hover:bg-emerald-100/60 text-emerald-800',
      badgeClass: 'bg-emerald-200 text-emerald-900',
      icon: CheckCircle2,
      filterUrl: '/resumes?status=Select'
    },
    {
      title: 'Rejected',
      description: 'Not shortlisted / not matching',
      count: stats.reject,
      color: 'rose',
      status: 'Reject' as const,
      borderClass: 'border-rose-300',
      bgClass: 'bg-rose-50 hover:bg-rose-100/60 text-rose-800',
      badgeClass: 'bg-rose-200 text-rose-900',
      icon: XCircle,
      filterUrl: '/resumes?status=Reject'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Daxin Recruitment Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Track Candidates from Sourcing to Selection
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Multi-channel candidate tracking across 4 pipeline stages with duplicate detection by Mobile & Email.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/add-resume"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-semibold text-sm rounded-xl shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Candidate Resume</span>
            </Link>
            <Link
              to="/resumes"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>View All Resumes ({stats.total})</span>
            </Link>
          </div>
        </div>

        {/* Decorative graphic background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
            <circle cx="150" cy="50" r="80" fill="white" />
            <circle cx="180" cy="160" r="100" fill="white" />
          </svg>
        </div>
      </div>

      {/* Summary KPI Cards per Status & Month */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total This Month Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">This Month</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.thisMonthCount}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Resumes received in August</span>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            Total in Database: <strong className="text-slate-800">{stats.total}</strong>
          </div>
        </div>

        {/* 4 Status Pipeline Cards */}
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.filterUrl}
              className={`rounded-2xl p-5 border transition-all duration-150 flex flex-col justify-between ${card.bgClass} ${card.borderClass} shadow-sm group hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.badgeClass}`}>
                  <Icon className={`w-4 h-4 ${card.status === 'Process' ? 'animate-spin' : ''}`} />
                </div>
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold">{card.count}</span>
                <span className="text-xs opacity-80 block mt-0.5">{card.description}</span>
              </div>
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs font-semibold group-hover:underline">
                <span>View {card.title}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Resumes & Channel Breakdown Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Candidate Resumes</h3>
              <p className="text-xs text-slate-500">Latest applicants across all hiring channels</p>
            </div>
            <Link
              to="/resumes"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.slice(0, 5).map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        to={`/candidate/${candidate.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 truncate block"
                      >
                        {candidate.name}
                      </Link>
                      <span className="text-xs text-slate-400 font-mono">{candidate.mobile}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-700">
                      {candidate.position}
                    </td>
                    <td className="py-3 px-4">
                      <SourceBadge source={candidate.source} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={candidate.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/candidate/${candidate.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Resume Channels Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Resume Inflow Sources</h3>
            <p className="text-xs text-slate-500">Distribution across receipt channels</p>
          </div>

          <div className="space-y-3">
            {Object.entries(stats.bySource).map(([source, count]) => {
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={source} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700">{source}</span>
                    <span className="text-slate-500 font-bold">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/reports"
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <span>View Detailed Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
