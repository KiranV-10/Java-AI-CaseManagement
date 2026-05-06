import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { User, RequestListItem } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';

export default function MyRequestsPage({ user }: { user: User }) {
  const [requests, setRequests] = useState<RequestListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/requests/my?citizenId=${user.userId}`)
      .then(r => setRequests(r.data))
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <div className="app-card app-card-body text-sm text-slate-500">Loading your requests...</div>;

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
        <div className="table-wrap overflow-x-auto">
          <table className="data-table min-w-[760px]">
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
                  <td className="font-mono text-xs text-slate-600">{r.requestNumber}</td>
                  <td className="font-medium text-slate-900">{r.title}</td>
                  <td>{r.categoryName}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td><PriorityBadge priority={r.priority} /></td>
                  <td className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="text-right">
                    <Link to={`/citizen/requests/${r.id}`} className="text-xs font-semibold text-blue-700 hover:text-blue-900">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
