import React from 'react';
import type { CallStatus } from '../../types/candidate';
import { Phone, PhoneCall, PhoneOff, PhoneMissed } from 'lucide-react';

interface CallStatusBadgeProps {
  status: CallStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const CallStatusBadge: React.FC<CallStatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const getConfig = () => {
    switch (status) {
      case 'Called':
        return {
          icon: PhoneCall,
          colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Called'
        };
      case 'Not Attended':
        return {
          icon: PhoneMissed,
          colorClass: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Not Attended'
        };
      case 'No Response':
        return {
          icon: PhoneOff,
          colorClass: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'No Response'
        };
      case 'Pending':
      default:
        return {
          icon: Phone,
          colorClass: 'bg-slate-100 text-slate-600 border-slate-200',
          label: 'Pending'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2 py-1 gap-1.5'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${sizeClasses[size]} ${config.colorClass} ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};
