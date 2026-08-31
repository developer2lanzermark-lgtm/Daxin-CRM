import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { DaxinLogo } from '../common/DaxinLogo';
import { useCandidates } from '../../context/CandidateContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { candidates, stats, resetToMockData } = useCandidates();
  const navigate = useNavigate();
  const location = useLocation();

  const pendingReviewCount = candidates.filter(c => !c.reviewDetails && c.status !== 'Reject').length;
  const inProcessCount = stats.process;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Resume List',
      path: '/resumes',
      icon: Users,
      badge: stats.total.toString()
    },
    {
      name: 'Add Resume',
      path: '/add-resume',
      icon: UserPlus,
      highlight: true
    },
    {
      name: 'Reports & Analytics',
      path: '/reports',
      icon: BarChart3,
      badge: null
    }
  ];

  const handleStatusFilterClick = (status: string) => {
    navigate(`/resumes?status=${status}`);
    setMobileOpen(false);
  };

  const handleStartFirstReview = () => {
    const nextCandidate = candidates.find(c => !c.reviewDetails && c.status !== 'Reject') || candidates[0];
    if (nextCandidate) {
      navigate(`/candidate/${nextCandidate.id}/review`);
      setMobileOpen(false);
    }
  };

  const handleStartFirstCall = () => {
    const nextCandidate = candidates.find(c => c.reviewDetails?.decision === 'Shortlisted' || c.status === 'Process') || candidates[0];
    if (nextCandidate) {
      navigate(`/candidate/${nextCandidate.id}/call`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 shadow-sm transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0 bg-slate-50/40">
          <NavLink
            to="/"
            className="flex items-center gap-2 overflow-hidden focus:outline-none"
            onClick={() => setMobileOpen(false)}
          >
            <DaxinLogo collapsed={collapsed} />
          </NavLink>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Menu */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Main Navigation
              </p>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                        : item.highlight
                        ? 'bg-blue-50/70 text-blue-700 hover:bg-blue-100 hover:text-blue-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`flex-shrink-0 w-5 h-5 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : item.highlight ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Recruiter Workflow Quick Actions */}
          <div>
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recruitment Stages
              </p>
            )}
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleStartFirstReview}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-blue-800 bg-blue-50/60 hover:bg-blue-100 transition-colors text-left"
                title={collapsed ? 'Screen & Review Resumes' : undefined}
              >
                <FileCheck2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">Screen & Review</span>
                    <span className="bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded text-[10px]">
                      {pendingReviewCount}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleStartFirstCall}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 transition-colors text-left"
                title={collapsed ? 'Interview Calls & Scheduling' : undefined}
              >
                <PhoneCall className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">Interview Calls</span>
                    <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px]">
                      {inProcessCount}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Pipeline Status Overview */}
          <div>
            {!collapsed ? (
              <>
                <div className="flex items-center justify-between px-3 mb-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Pipeline Status
                  </p>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    {stats.total} total
                  </span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => handleStatusFilterClick('Unprogress')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>Unprogress</span>
                    </div>
                    <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      {stats.unprogress}
                    </span>
                  </button>

                  <button
                    onClick={() => handleStatusFilterClick('Process')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-amber-800 hover:bg-amber-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Process</span>
                    </div>
                    <span className="font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                      {stats.process}
                    </span>
                  </button>

                  <button
                    onClick={() => handleStatusFilterClick('Select')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-emerald-800 hover:bg-emerald-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Select</span>
                    </div>
                    <span className="font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {stats.select}
                    </span>
                  </button>

                  <button
                    onClick={() => handleStatusFilterClick('Reject')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-rose-800 hover:bg-rose-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>Reject</span>
                    </div>
                    <span className="font-semibold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-md">
                      {stats.reject}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-100">
                <span
                  title={`Unprogress: ${stats.unprogress}`}
                  className="w-3 h-3 rounded-full bg-slate-400 cursor-pointer"
                  onClick={() => handleStatusFilterClick('Unprogress')}
                />
                <span
                  title={`Process: ${stats.process}`}
                  className="w-3 h-3 rounded-full bg-amber-500 cursor-pointer animate-pulse"
                  onClick={() => handleStatusFilterClick('Process')}
                />
                <span
                  title={`Select: ${stats.select}`}
                  className="w-3 h-3 rounded-full bg-emerald-500 cursor-pointer"
                  onClick={() => handleStatusFilterClick('Select')}
                />
                <span
                  title={`Reject: ${stats.reject}`}
                  className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer"
                  onClick={() => handleStatusFilterClick('Reject')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Daxin HR Suite
                </span>
                <a
                  href="https://daxin.onrender.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 flex items-center gap-0.5"
                  title="Visit Daxin Website"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all candidate data back to default sample records?')) {
                    resetToMockData();
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sample Data</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all candidate data back to default sample records?')) {
                    resetToMockData();
                  }
                }}
                title="Reset sample data"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
