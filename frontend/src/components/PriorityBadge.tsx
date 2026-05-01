const colors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-red-100 text-red-700',
  URGENT: 'bg-red-600 text-white',
};

export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
}
