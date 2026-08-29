import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Calendar,
  X,
  ChevronRight
} from 'lucide-react';
import { useCandidates } from '../../context/CandidateContext';
import { StatusBadge } from '../common/StatusBadge';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { candidates, stats } = useCandidates();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Search candidate filter
  const searchResults = searchTerm.trim()
    ? candidates.filter(
        c =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.mobile.includes(searchTerm) ||
          c.position.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectCandidate = (candidateId: string) => {
    navigate(`/candidate/${candidateId}`);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/resumes?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current page title
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard Overview';
    if (location.pathname.startsWith('/resumes')) return 'Resume Directory';
    if (location.pathname.startsWith('/add-resume')) return 'Add New Candidate';
    if (location.pathname.startsWith('/candidate')) return 'Candidate Profile & Activity';
    if (location.pathname.startsWith('/reports')) return 'Reports & Pipeline Analytics';
    return 'HR Portal';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200/90 shadow-sm">
      {/* Left Section: Mobile Menu & Breadcrumbs / Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="hover:text-slate-600">Daxin HR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center/Right Section: Search Bar & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Global Quick Search */}
        <div ref={searchRef} className="relative hidden md:block w-64 lg:w-80">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, email, role..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-400 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Search Dropdown Preview */}
          {isSearchOpen && searchTerm.trim() && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 py-2">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex justify-between items-center">
                <span>Matching Resumes</span>
                <span>{searchResults.length} results</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCandidate(c.id)}
                      className="w-full text-left px-3 py-2.5 hover:bg-blue-50/60 transition-colors flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {c.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {c.position} • <span className="font-mono">{c.mobile}</span>
                        </p>
                      </div>
                      <StatusBadge status={c.status} size="sm" />
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    View all matching in list &rarr;
                  </button>
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-xs text-slate-500">
                  No candidate matches &quot;{searchTerm}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Month Received Stats Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-xs font-medium text-blue-800">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Received this month:</span>
          <span className="font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-md">
            {stats.thisMonthCount}
          </span>
        </div>

        {/* Quick Add Resume Button */}
        <Link
          to="/add-resume"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/30 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Resume</span>
          <span className="sm:hidden">Add</span>
        </Link>

        {/* Notification Bell with recent updates */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Simple Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Recent Candidate Activity
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {candidates.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate(`/candidate/${c.id}`);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {c.name}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {c.remarks || `Applied for ${c.position}`}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Source: {c.source} • {c.resumeReceivedDate}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <Link
                  to="/resumes"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All in Directory &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            HR
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">Daxin HR Team</p>
            <p className="text-[10px] text-slate-400 font-medium">Recruitment Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
