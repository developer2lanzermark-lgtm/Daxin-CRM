import React from 'react';
import type { ResumeSource } from '../../types/candidate';
import { Mail, Globe, Footprints, Users, FormInput } from 'lucide-react';

interface SourceBadgeProps {
  source: ResumeSource;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  source,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getSourceConfig = () => {
    switch (source) {
      case 'Email':
        return {
          icon: Mail,
          colorClass: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70',
        };
      case 'Job Portal':
        return {
          icon: Globe,
          colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100/70',
        };
      case 'Walk-in':
        return {
          icon: Footprints,
          colorClass: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/70',
        };
      case 'Referral':
        return {
          icon: Users,
          colorClass: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100/70',
        };
      case 'Website Form':
        return {
          icon: FormInput,
          colorClass: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100/70',
        };
      default:
        return {
          icon: FormInput,
          colorClass: 'bg-slate-50 text-slate-700 border-slate-200',
        };
    }
  };

  const config = getSourceConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-0.5 gap-1.5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium transition-colors ${sizeClasses[size]} ${config.colorClass} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 opacity-80" />}
      <span>{source}</span>
    </span>
  );
};
