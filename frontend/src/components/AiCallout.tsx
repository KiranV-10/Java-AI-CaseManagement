import type { ReactNode } from 'react';

type AiCalloutTone = 'info' | 'success' | 'warning' | 'error';

const toneStyles: Record<AiCalloutTone, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-red-200 bg-red-50 text-red-900',
};

const iconStyles: Record<AiCalloutTone, string> = {
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};

const icons: Record<AiCalloutTone, string> = {
  info: 'AI',
  success: 'AI',
  warning: '!',
  error: '!',
};

interface Props {
  tone?: AiCalloutTone;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function AiCallout({ tone = 'info', title, description, children }: Props) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneStyles[tone]}`}>
      <div className="flex gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${iconStyles[tone]}`}>
          {icons[tone]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>
          {description && <p className="mt-1 text-sm leading-6 opacity-85">{description}</p>}
          {children && <div className="mt-3 text-sm leading-6">{children}</div>}
        </div>
      </div>
    </div>
  );
}
