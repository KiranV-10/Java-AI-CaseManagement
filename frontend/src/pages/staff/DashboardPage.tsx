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
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState('');
  const [requestsError, setRequestsError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/dashboard/metrics')
      .then(r => {
        if (active) {
          setMetrics(r.data);
          setMetricsError('');
        }
      })
      .catch(() => {
        if (active) setMetricsError('Unable to load dashboard metrics.');
      })
      .finally(() => {
        if (active) setMetricsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setRequestsLoading(true);
    setRequestsError('');

    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.keyword) params.set('keyword', filters.keyword);
    params.set('page', String(page));
    params.set('size', '15');

    api.get<PageResponse<RequestListItem>>(`/staff/requests?${params}`)
      .then(r => {
        setRequests(r.data.content);
        setTotalPages(r.data.totalPages);
      })
      .catch(() => {
        setRequests([]);
        setTotalPages(0);
        setRequestsError('Unable to load staff requests.');
      })
      .finally(() => setRequestsLoading(false));
  }, [filters, page]);

  const MetricCard = ({ label, value, color }: { label: string; value: number | string; color: string }) => (
    <div className="metric-card">
      <div className={`mb-4 h-1.5 w-12 rounded-full ${color}`} />
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="hero-panel">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Staff Workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Good to see you, {user.fullName.split(' ')[0]}.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Review new requests, prioritize urgent cases, and keep citizen follow-ups moving.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 text-sm ring-1 ring-white/15 sm:min-w-[320px]">
            <div>
              <p className="text-blue-100">Current Queue</p>
              <p className="mt-1 text-2xl font-semibold">{metrics?.totalRequests ?? '...'}</p>
            </div>
            <div>
              <p className="text-blue-100">Needs Review</p>
              <p className="mt-1 text-2xl font-semibold">{metrics?.newRequests ?? '...'}</p>
            </div>
          </div>
        </div>
      </div>

      {(metricsError || requestsError) && (
        <div className="space-y-2">
          {metricsError && (
            <div className="soft-alert border-red-200 bg-red-50 text-red-700">
              {metricsError}
            </div>
          )}
          {requestsError && (
            <div className="soft-alert border-red-200 bg-red-50 text-red-700">
              {requestsError}
            </div>
          )}
        </div>
      )}

      {metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Total Requests" value={metrics.totalRequests} color="bg-blue-500" />
          <MetricCard label="New" value={metrics.newRequests} color="bg-sky-400" />
          <MetricCard label="High Priority" value={metrics.highPriorityRequests} color="bg-red-400" />
          <MetricCard label="Urgent" value={metrics.urgentRequests} color="bg-red-600" />
          <MetricCard label="Waiting for Citizen" value={metrics.waitingForCitizen} color="bg-orange-400" />
          <MetricCard label="Resolved This Week" value={metrics.resolvedThisWeek} color="bg-emerald-500" />
          <MetricCard label="Avg Resolution (days)" value={metrics.averageResolutionDays} color="bg-slate-400" />
          <MetricCard label="Aging (>7 days)" value={metrics.agingRequests} color="bg-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <p className="text-sm text-slate-500">{metricsLoading ? 'Loading dashboard metrics...' : 'No dashboard metrics available'}</p>
          </div>
        </div>
      )}

      <div className="app-card">
        <div className="app-card-body">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Requests</h2>
            <p className="text-sm text-slate-500">Filter and open cases that need attention.</p>
          </div>
        </div>
        <div className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[180px_180px_1fr]">
          <select value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(0); }}
            className="form-control">
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="WAITING_FOR_CITIZEN">Waiting for Citizen</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select value={filters.priority} onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(0); }}
            className="form-control">
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <input value={filters.keyword}
            onChange={e => { setFilters(f => ({ ...f, keyword: e.target.value })); setPage(0); }}
            placeholder="Search request number or title..."
            className="form-control" />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="data-table min-w-[900px]">
          <thead>
            <tr>
              <th>Request #</th>
              <th>Title</th>
              <th>Citizen</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map(r => (
              <tr key={r.id}>
                <td className="font-mono text-xs text-slate-600">{r.requestNumber}</td>
                <td className="max-w-[220px] truncate font-medium text-slate-900">{r.title}</td>
                <td className="text-xs">{r.citizenName}</td>
                <td className="text-xs">{r.categoryName}</td>
                <td><StatusBadge status={r.status} /></td>
                <td><PriorityBadge priority={r.priority} /></td>
                <td className="text-xs text-slate-500">{r.assignedToName || 'Unassigned'}</td>
                <td className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="text-right">
                  <Link to={`/staff/requests/${r.id}`} className="text-xs font-semibold text-blue-700 hover:text-blue-900">Open</Link>
                </td>
              </tr>
            )) : !requestsLoading && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-sm text-slate-500">
                  No requests found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="btn-secondary px-3 py-1.5">Prev</button>
            <span className="text-sm text-slate-500">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="btn-secondary px-3 py-1.5">Next</button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
