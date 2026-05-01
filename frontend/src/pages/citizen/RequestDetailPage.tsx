import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { RequestDetail } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import AiDisclaimer from '../../components/AiDisclaimer';

export default function CitizenRequestDetailPage() {
  const { id } = useParams();
  const [req, setReq] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/requests/${id}`).then(r => setReq(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!req) return <p className="text-sm text-red-500">Request not found.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link to="/citizen/my-requests" className="text-blue-600 text-sm hover:underline">&larr; Back to My Requests</Link>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold">{req.requestNumber}</h1>
          <div className="flex gap-2">
            <StatusBadge status={req.status} />
            <PriorityBadge priority={req.priority} />
          </div>
        </div>
        <h2 className="font-medium mb-2">{req.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{req.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Category:</span> {req.categoryName}</div>
          <div><span className="text-gray-500">Contact:</span> {req.preferredContactMethod}</div>
          {req.employerName && <div><span className="text-gray-500">Employer:</span> {req.employerName}</div>}
          {req.incidentDate && <div><span className="text-gray-500">Incident Date:</span> {req.incidentDate}</div>}
          <div><span className="text-gray-500">Submitted:</span> {new Date(req.createdAt).toLocaleString()}</div>
          {req.resolvedAt && <div><span className="text-gray-500">Resolved:</span> {new Date(req.resolvedAt).toLocaleString()}</div>}
        </div>
      </div>

      {req.aiRecommendation && req.aiRecommendation.citizenGuidance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-2 text-sm">Guidance for You</h3>
          <p className="text-sm text-gray-700">{req.aiRecommendation.citizenGuidance}</p>
          {req.aiRecommendation.citizenFriendlyExplanation && (
            <p className="text-sm text-gray-600 mt-2">{req.aiRecommendation.citizenFriendlyExplanation}</p>
          )}
          <AiDisclaimer />
        </div>
      )}

      {req.statusHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3 text-sm">Status History</h3>
          <div className="space-y-2">
            {req.statusHistory.map(h => (
              <div key={h.id} className="flex items-start gap-3 text-sm border-l-2 border-blue-200 pl-3">
                <div className="flex-1">
                  <span className="text-gray-500">{h.oldStatus || 'Created'}</span>
                  <span className="mx-1">&rarr;</span>
                  <StatusBadge status={h.newStatus} />
                  {h.changeReason && <p className="text-gray-500 text-xs mt-0.5">{h.changeReason}</p>}
                </div>
                <span className="text-xs text-gray-400">{new Date(h.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {req.notes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-3 text-sm">Notes</h3>
          <div className="space-y-2">
            {req.notes.map(n => (
              <div key={n.id} className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{n.authorName}</span>
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p>{n.noteText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
