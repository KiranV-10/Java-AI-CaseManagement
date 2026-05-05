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

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">My Requests</h1>
        <Link to="/citizen/new-request"
          className="px-4 py-2 bg-blue-700 text-white rounded text-sm hover:bg-blue-800">
          New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p>You have no requests yet.</p>
          <Link to="/citizen/new-request" className="text-blue-600 underline text-sm">Submit your first request</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Request #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{r.requestNumber}</td>
                  <td className="px-4 py-3">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600">{r.categoryName}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link to={`/citizen/requests/${r.id}`} className="text-blue-600 hover:underline text-xs">View</Link>
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
