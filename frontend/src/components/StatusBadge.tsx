const colors: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-700 ring-blue-200',
  IN_REVIEW: 'bg-amber-50 text-amber-700 ring-amber-200',
  WAITING_FOR_CITIZEN: 'bg-orange-50 text-orange-700 ring-orange-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const labels: Record<string, string> = {
  NEW: 'New',
  IN_REVIEW: 'In Review',
  WAITING_FOR_CITIZEN: 'Waiting for Citizen',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${colors[status] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
      {labels[status] || status}
    </span>
  );
}
