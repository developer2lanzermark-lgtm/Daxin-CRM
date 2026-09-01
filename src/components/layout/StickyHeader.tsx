import React from 'react';

/**
 * Wraps a page's header row so it stays pinned to the top of the
 * scrollable content area instead of scrolling out of view.
 * The negative margins let the bar span the full width of the
 * <main> padding box so scrolling content never peeks past its edges.
 */
export const StickyHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div
    className={
      'sticky top-0 z-20 -mx-4 -mt-4 mb-2 border-b border-slate-200 bg-slate-50/90 px-4 py-4 ' +
      'backdrop-blur supports-[backdrop-filter]:bg-slate-50/75 ' +
      'sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8 ' +
      className
    }
  >
    {children}
  </div>
);
