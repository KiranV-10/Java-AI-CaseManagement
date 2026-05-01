import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { User, DashboardMetrics, RequestListItem, PageResponse } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

export default function DashboardPage({ user }: { user: User }) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [requests, setRequests] = useState<RequestListItem[]>([]);
  const [filters, setFilters] = useState({ status: '', priority: '', keyword: '' });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    api.get('/dashboard/metrics').then(r => setMetrics(r.data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.keyword) params.set('keyword', filters.keyword);
    params.set('page', String(page));
    params.set('size', '15');

    api.get<PageResponse<RequestListItem>>(`/staff/requests?${params}`)
      .then(r => { setRequests(r.data.content); setTotalPages(r.data.totalPages); });
  }, [filters, page]);

  const MetricCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Staff Dashboard</h1>

      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Requests" value={metrics.totalRequests} color="border-blue-500" />
          <MetricCard label="New" value={metrics.newRequests} color="border-blue-400" />
          <MetricCard label="High Priority" value={metrics.highPriorityRequests} color="border-red-400" />
          <MetricCard label="Urgent" value={metrics.urgentRequests} color="border-red-600" />
          <MetricCard label="Waiting for Citizen" value={metrics.waitingForCitizen} color="border-orange-400" />
          <MetricCard label="Resolved This Week" value={metrics.resolvedThisWeek} color="border-green-500" />
          <MetricCard label="Avg Resolution (days)" value={metrics.averageResolutionDays} color="border-gray-400" />
          <MetricCard label="Aging (>7 days)" value={metrics.agingRequests} color="border-yellow-500" />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(0); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm">
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="WAITING_FOR_CITIZEN">Waiting for Citizen</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={filters.priority} onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(0); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm">
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <input value={filters.keyword}
            onChange={e => { setFilters(f => ({ ...f, keyword: e.target.value })); setPage(0); }}
            placeholder="Search..."
            className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 min-w-[200px]" />
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Request #</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Title</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Citizen</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Category</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Status</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Priority</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Assigned</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs">{r.requestNumber}</td>
                <td className="px-3 py-2 max-w-[200px] truncate">{r.title}</td>
                <td className="px-3 py-2 text-gray-600 text-xs">{r.citizenName}</td>
                <td className="px-3 py-2 text-gray-600 text-xs">{r.categoryName}</td>
                <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                <td className="px-3 py-2"><PriorityBadge priority={r.priority} /></td>
                <td className="px-3 py-2 text-xs text-gray-500">{r.assignedToName || '—'}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <Link to={`/staff/requests/${r.id}`} className="text-blue-600 hover:underline text-xs">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
            <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
