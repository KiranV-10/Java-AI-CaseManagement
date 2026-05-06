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
      <div className="page-heading">
        <div>
          <h1 className="page-title">My Requests</h1>
          <p className="page-subtitle">Track submitted cases and see their latest status.</p>
        </div>
        <Link to="/citizen/new-request"
          className="btn-primary">
          New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="app-card app-card-body text-center">
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
