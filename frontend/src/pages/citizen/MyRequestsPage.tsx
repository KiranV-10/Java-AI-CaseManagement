import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { User, RequestListItem } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import AiCallout from '../../components/AiCallout';

export default function MyRequestsPage({ user }: { user: User }) {
  const [requests, setRequests] = useState<RequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const openRequests = requests.filter(r => !['RESOLVED', 'CLOSED'].includes(r.status)).length;
  const waitingRequests = requests.filter(r => r.status === 'WAITING_FOR_CITIZEN').length;
  const highPriorityRequests = requests.filter(r => r.priority === 'HIGH' || r.priority === 'URGENT').length;

  useEffect(() => {
    api.get(`/requests/my?citizenId=${user.userId}`)
      .then(r => {
        setRequests(r.data);
        setError('');
      })
      .catch(() => setError('Unable to load your requests. Please refresh and try again.'))
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <div className="loading-panel">Loading your requests...</div>;

  return (
    <div className="space-y-6">
      <div className="hero-panel">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Citizen Portal</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">My Requests</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Track submitted cases and see updates from staff in one place.</p>
          </div>
          <Link to="/citizen/new-request" className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50">
            New Request
          </Link>
        </div>
      </div>

      {error && <AiCallout tone="error" title="Requests could not be loaded" description={error} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="metric-card">
          <p className="metric-label">Open Requests</p>
          <p className="metric-value">{openRequests}</p>
          <p className="mt-2 text-xs text-slate-500">Currently active or under review</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Waiting on You</p>
          <p className="metric-value">{waitingRequests}</p>
          <p className="mt-2 text-xs text-slate-500">Requests needing citizen follow-up</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">High Priority</p>
          <p className="metric-value">{highPriorityRequests}</p>
          <p className="mt-2 text-xs text-slate-500">Flagged for closer attention</p>
        </div>
      </div>

      <div className="page-heading">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Submitted Requests</h2>
          <p className="page-subtitle">{requests.length} request{requests.length === 1 ? '' : 's'} on file.</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p className="font-medium text-slate-900">You have no requests yet.</p>
          <p className="mt-1 text-sm text-slate-500">Start a request when you need help with a labor service concern.</p>
          <Link to="/citizen/new-request" className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">Submit your first request</Link>
        </div>
      ) : (
        <div className="app-card overflow-hidden">
          <div className="border-b border-slate-200 bg-white px-5 py-4">
            <h3 className="font-semibold text-slate-900">Request History</h3>
            <p className="mt-1 text-sm text-slate-500">Newest requests are shown first.</p>
          </div>
          <div className="overflow-x-auto">
          <table className="data-table min-w-[860px]">
            <thead>
              <tr>
                <th>Request #</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                      {r.requestNumber}
                    </span>
                  </td>
                  <td>
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{r.citizenName}</p>
                  </td>
                  <td className="text-sm text-slate-600">{r.categoryName}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td><PriorityBadge priority={r.priority} /></td>
                  <td className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <Link to={`/citizen/requests/${r.id}`} className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
