import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { RequestDetail } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import AiDisclaimer from '../../components/AiDisclaimer';
import AiCallout from '../../components/AiCallout';

export default function CitizenRequestDetailPage() {
  const { id } = useParams();
  const [req, setReq] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/requests/${id}`).then(r => setReq(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-panel">Loading request...</div>;
  if (!req) return <AiCallout tone="error" title="Request not found" description="Please return to My Requests and try again." />;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link to="/citizen/my-requests" className="text-sm font-semibold text-blue-700 hover:text-blue-900">&larr; Back to My Requests</Link>

      <div className="app-card app-card-body">
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-blue-50 to-slate-50 p-4">
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
        </div>
        <p className="text-sm leading-6 text-slate-600">{req.description}</p>

        <div className="detail-grid mt-5">
          <div><p className="detail-label">Category</p><p className="detail-value">{req.categoryName}</p></div>
          <div><p className="detail-label">Contact</p><p className="detail-value">{req.preferredContactMethod}</p></div>
          {req.employerName && <div><p className="detail-label">Employer</p><p className="detail-value">{req.employerName}</p></div>}
          {req.incidentDate && <div><p className="detail-label">Incident Date</p><p className="detail-value">{req.incidentDate}</p></div>}
          <div><p className="detail-label">Submitted</p><p className="detail-value">{new Date(req.createdAt).toLocaleString()}</p></div>
          {req.resolvedAt && <div><p className="detail-label">Resolved</p><p className="detail-value">{new Date(req.resolvedAt).toLocaleString()}</p></div>}
        </div>
      </div>

      {req.aiRecommendation && req.aiRecommendation.citizenGuidance && (
        <div className="app-card app-card-body">
          <h3 className="section-title mb-3">Guidance for You</h3>
          <AiCallout tone="info" title="AI guidance" description={req.aiRecommendation.citizenGuidance} />
          {req.aiRecommendation.citizenFriendlyExplanation && (
            <p className="text-sm leading-6 text-slate-600 mt-2">{req.aiRecommendation.citizenFriendlyExplanation}</p>
          )}
          <AiDisclaimer />
        </div>
      )}

      {req.aiRecommendation?.status === 'FAILED' && (
        <AiCallout
          tone="warning"
          title="AI guidance is unavailable"
          description="Your request is still saved and staff can continue reviewing it manually."
        />
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
