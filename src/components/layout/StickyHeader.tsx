import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

/**
 * Full-bleed header bar that stays pinned to the top of the scrollable
 * content area. Always shows a Close (X) button on the right that
 * discards the current page and returns to the dashboard.
 */
export const StickyHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={
        // -mb-6 cancels the parent's space-y-6 so the form starts flush under the heading
        'sticky top-0 z-20 -mb-6 flex items-center gap-3 border-b border-slate-200 ' +
        'bg-slate-50/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-slate-50/75 sm:px-6 lg:px-8'
      }
    >
      <div className={'min-w-0 flex-1 ' + className}>{children}</div>

      <button
        type="button"
        onClick={() => navigate('/')}
        title="Close and return to Dashboard"
        aria-label="Close and return to Dashboard"
        className="flex-shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
