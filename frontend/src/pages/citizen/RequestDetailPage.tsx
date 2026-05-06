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

  if (loading) return <div className="app-card app-card-body text-sm text-slate-500">Loading request...</div>;
  if (!req) return <div className="app-card app-card-body text-sm text-red-600">Request not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link to="/citizen/my-requests" className="text-sm font-semibold text-blue-700 hover:text-blue-900">&larr; Back to My Requests</Link>

      <div className="app-card app-card-body">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{req.requestNumber}</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900">{req.title}</h1>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={req.status} />
            <PriorityBadge priority={req.priority} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{req.description}</p>

        <div className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div><span className="text-slate-500">Category:</span> {req.categoryName}</div>
          <div><span className="text-slate-500">Contact:</span> {req.preferredContactMethod}</div>
          {req.employerName && <div><span className="text-slate-500">Employer:</span> {req.employerName}</div>}
          {req.incidentDate && <div><span className="text-slate-500">Incident Date:</span> {req.incidentDate}</div>}
          <div><span className="text-slate-500">Submitted:</span> {new Date(req.createdAt).toLocaleString()}</div>
          {req.resolvedAt && <div><span className="text-slate-500">Resolved:</span> {new Date(req.resolvedAt).toLocaleString()}</div>}
        </div>
      </div>

      {req.aiRecommendation && req.aiRecommendation.citizenGuidance && (
        <div className="app-card app-card-body">
          <h3 className="font-semibold mb-2 text-slate-900">Guidance for You</h3>
          <p className="text-sm leading-6 text-slate-700">{req.aiRecommendation.citizenGuidance}</p>
          {req.aiRecommendation.citizenFriendlyExplanation && (
            <p className="text-sm leading-6 text-slate-600 mt-2">{req.aiRecommendation.citizenFriendlyExplanation}</p>
          )}
          <AiDisclaimer />
        </div>
      )}

      {req.statusHistory.length > 0 && (
        <div className="app-card app-card-body">
          <h3 className="font-semibold mb-3 text-slate-900">Status History</h3>
          <div className="space-y-2">
            {req.statusHistory.map(h => (
              <div key={h.id} className="flex items-start gap-3 border-l-2 border-blue-200 pl-3 text-sm">
                <div className="flex-1">
                  <span className="text-slate-500">{h.oldStatus || 'Created'}</span>
                  <span className="mx-1">&rarr;</span>
                  <StatusBadge status={h.newStatus} />
                  {h.changeReason && <p className="text-slate-500 text-xs mt-1">{h.changeReason}</p>}
                </div>
                <span className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {req.notes.length > 0 && (
        <div className="app-card app-card-body">
          <h3 className="font-semibold mb-3 text-slate-900">Notes</h3>
          <div className="space-y-2">
            {req.notes.map(n => (
              <div key={n.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{n.authorName}</span>
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-slate-700">{n.noteText}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
