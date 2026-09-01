import React from 'react';

/**
 * Full-bleed header bar that stays pinned to the top of the scrollable
 * content area instead of scrolling out of view.
 */
export const StickyHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div
    className={
      'sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 px-4 py-4 ' +
      'backdrop-blur supports-[backdrop-filter]:bg-slate-50/75 sm:px-6 lg:px-8 ' +
      className
    }
  >
    {children}
  </div>
);
