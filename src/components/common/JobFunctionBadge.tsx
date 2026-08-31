import React from 'react';
import type { JobFunction } from '../../types/candidate';
import { Code2, Headphones, ShieldCheck, Megaphone, TrendingUp, Briefcase } from 'lucide-react';

interface JobFunctionBadgeProps {
  jobFunction: JobFunction;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const JobFunctionBadge: React.FC<JobFunctionBadgeProps> = ({
  jobFunction,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getConfig = () => {
    switch (jobFunction) {
      case 'Developer':
        return {
          icon: Code2,
          colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'Service':
        return {
          icon: Headphones,
          colorClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        };
      case 'Admin':
        return {
          icon: ShieldCheck,
          colorClass: 'bg-slate-100 text-slate-700 border-slate-300',
        };
      case 'Marketing':
        return {
          icon: Megaphone,
          colorClass: 'bg-violet-50 text-violet-700 border-violet-200',
        };
      case 'Sales':
        return {
          icon: TrendingUp,
          colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'Management':
        return {
          icon: Briefcase,
          colorClass: 'bg-amber-50 text-amber-800 border-amber-300',
        };
      default:
        return {
          icon: Briefcase,
          colorClass: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-0.5 gap-1.5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${sizeClasses[size]} ${config.colorClass} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 opacity-80" />}
      <span>{jobFunction}</span>
    </span>
  );
};
