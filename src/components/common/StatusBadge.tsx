import React from 'react';
import type { CandidateStatus } from '../../types/candidate';
import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: CandidateStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Unprogress':
        return {
          label: 'Unprogress',
          bgClass: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200/70',
          dotClass: 'bg-slate-400',
          icon: Clock,
          iconColor: 'text-slate-500'
        };
      case 'Process':
        return {
          label: 'Process',
          bgClass: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100/80',
          dotClass: 'bg-amber-500 animate-pulse',
          icon: Loader2,
          iconColor: 'text-amber-600'
        };
      case 'Select':
        return {
          label: 'Select',
          bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/80',
          dotClass: 'bg-emerald-500',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600'
        };
      case 'Reject':
        return {
          label: 'Reject',
          bgClass: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100/80',
          dotClass: 'bg-rose-500',
          icon: XCircle,
          iconColor: 'text-rose-600'
        };
      default:
        return {
          label: status,
          bgClass: 'bg-gray-100 text-gray-700 border-gray-300',
          dotClass: 'bg-gray-400',
          icon: Clock,
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors duration-150 font-medium ${sizeClasses[size]} ${config.bgClass} ${className}`}
    >
      {showIcon ? (
        <Icon className={`${iconSizes[size]} ${config.iconColor} ${status === 'Process' ? 'animate-spin' : ''}`} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};
