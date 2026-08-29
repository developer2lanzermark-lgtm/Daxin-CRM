import React from 'react';

interface DaxinLogoProps {
  collapsed?: boolean;
  className?: string;
}

export const DaxinLogo: React.FC<DaxinLogoProps> = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logo Graphic Symbol */}
      <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 via-daxin-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20">
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h7a8 8 0 0 1 8 8 8 8 0 0 1-8 8H4z" />
          <path d="M8 9l4 3-4 3" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col min-w-0 transition-opacity duration-200">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-xl text-slate-900 leading-none">
              DAXIN
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
              HR
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 truncate tracking-wide mt-0.5">
            Resume Tracking & CRM
          </span>
        </div>
      )}
    </div>
  );
};
