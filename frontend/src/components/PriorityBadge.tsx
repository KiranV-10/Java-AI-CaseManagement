const colors: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-600 ring-slate-200',
  MEDIUM: 'bg-blue-50 text-blue-700 ring-blue-200',
  HIGH: 'bg-red-50 text-red-700 ring-red-200',
  URGENT: 'bg-red-600 text-white ring-red-600',
};

export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${colors[priority] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
      {priority}
    </span>
  );
}
