const colors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800',
  WAITING_FOR_CITIZEN: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-200 text-gray-700',
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
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}
