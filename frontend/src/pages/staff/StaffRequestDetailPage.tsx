import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { User, RequestDetail, AiSummaryResult } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import AiDisclaimer from '../../components/AiDisclaimer';

export default function StaffRequestDetailPage({ user }: { user: User }) {
  const { id } = useParams();
  const [req, setReq] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<AiSummaryResult | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [statusForm, setStatusForm] = useState({ newStatus: '', reason: '' });
  const [noteForm, setNoteForm] = useState({ noteText: '', internalOnly: true });
  const [priorityForm, setPriorityForm] = useState({ priority: '', reason: '' });

  const reload = () => {
    api.get(`/staff/requests/${id}`).then(r => setReq(r.data));
  };

  useEffect(() => {
    api.get(`/staff/requests/${id}`).then(r => setReq(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAssign = async () => {
    await api.put(`/staff/requests/${id}/assign`, { assignedToUserId: user.userId });
    reload();
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/staff/requests/${id}/status`, {
      newStatus: statusForm.newStatus,
      reason: statusForm.reason,
      changedByUserId: user.userId,
    });
    setStatusForm({ newStatus: '', reason: '' });
    reload();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/staff/requests/${id}/notes`, {
      authorUserId: user.userId,
      noteText: noteForm.noteText,
      internalOnly: noteForm.internalOnly,
    });
    setNoteForm({ noteText: '', internalOnly: true });
    reload();
  };

  const handlePriorityOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put(`/staff/requests/${id}/priority`, {
      priority: priorityForm.priority,
      changedByUserId: user.userId,
      reason: priorityForm.reason,
    });
    setPriorityForm({ priority: '', reason: '' });
    reload();
  };

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const { data } = await api.post(`/staff/requests/${id}/ai-summary`);
      setAiSummary(data);
    } catch {
      setAiSummary({ aiStatus: 'FAILED', provider: '', model: '', summary: '', keyFacts: [], missingInformation: [], suggestedNextAction: '', citizenFriendlyExplanation: '', errorMessage: 'Failed to generate summary.' });
    } finally {
      setSummaryLoading(false);
    }
  };

  if (loading) return <div className="app-card app-card-body text-sm text-slate-500">Loading request...</div>;
  if (!req) return <div className="app-card app-card-body text-sm text-red-600">Request not found.</div>;

  return (
    <div className="space-y-5">
      <Link to="/staff/dashboard" className="text-sm font-semibold text-blue-700 hover:text-blue-900">&larr; Back to Dashboard</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
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
              <div><span className="text-slate-500">Citizen:</span> {req.citizenName} ({req.citizenEmail})</div>
              <div><span className="text-slate-500">Category:</span> {req.categoryName}</div>
              <div><span className="text-slate-500">Contact:</span> {req.preferredContactMethod}</div>
              {req.phoneNumber && <div><span className="text-slate-500">Phone:</span> {req.phoneNumber}</div>}
              {req.employerName && <div><span className="text-slate-500">Employer:</span> {req.employerName}</div>}
              {req.incidentDate && <div><span className="text-slate-500">Incident:</span> {req.incidentDate}</div>}
              <div><span className="text-slate-500">Assigned:</span> {req.assignedToName || 'Unassigned'}</div>
              <div><span className="text-slate-500">Created:</span> {new Date(req.createdAt).toLocaleString()}</div>
            </div>
          </div>

          {/* AI Recommendation */}
          {req.aiRecommendation && (
            <div className="app-card app-card-body">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                AI Recommendation
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">{req.aiRecommendation.provider} / {req.aiRecommendation.model}</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-slate-500">Suggested Category:</span> {req.aiRecommendation.suggestedCategory}</div>
                <div><span className="text-slate-500">Suggested Priority:</span> <PriorityBadge priority={req.aiRecommendation.suggestedPriority} /></div>
                <div><span className="text-slate-500">Confidence:</span> {req.aiRecommendation.confidenceScore ? (req.aiRecommendation.confidenceScore * 100).toFixed(0) + '%' : 'N/A'}</div>
              </div>
              {req.aiRecommendation.reasoning && (
                <p className="text-sm text-slate-600 mt-2"><span className="text-slate-500">Reasoning:</span> {req.aiRecommendation.reasoning}</p>
              )}
              {req.aiRecommendation.citizenGuidance && (
                <p className="text-sm text-slate-600 mt-1"><span className="text-slate-500">Citizen Guidance:</span> {req.aiRecommendation.citizenGuidance}</p>
              )}
              <AiDisclaimer />
            </div>
          )}

          {/* AI Summary */}
          <div className="app-card app-card-body">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">AI Case Summary</h3>
              <button onClick={handleGenerateSummary} disabled={summaryLoading}
                className="btn-primary px-3 py-1.5 text-xs">
                {summaryLoading ? 'Generating...' : 'Generate AI Summary'}
              </button>
            </div>
            {aiSummary && aiSummary.aiStatus === 'SUCCESS' && (
              <div className="space-y-3 text-sm">
                <div><span className="text-slate-500 font-medium">Summary:</span> <p className="mt-1">{aiSummary.summary}</p></div>
                {aiSummary.keyFacts.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-medium">Key Facts:</span>
                    <ul className="list-disc ml-5 mt-1">{aiSummary.keyFacts.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </div>
                )}
                {aiSummary.missingInformation.length > 0 && (
                  <div>
                    <span className="text-slate-500 font-medium">Missing Information:</span>
                    <ul className="list-disc ml-5 mt-1 text-orange-700">{aiSummary.missingInformation.map((m, i) => <li key={i}>{m}</li>)}</ul>
                  </div>
                )}
                {aiSummary.suggestedNextAction && (
                  <div><span className="text-gray-500 font-medium">Suggested Next Action:</span> <p className="mt-1 text-blue-700">{aiSummary.suggestedNextAction}</p></div>
                )}
                <AiDisclaimer />
              </div>
            )}
            {aiSummary && aiSummary.aiStatus === 'FAILED' && (
              <p className="text-sm text-red-600">AI recommendation unavailable. {aiSummary.errorMessage}</p>
            )}
            {!aiSummary && <p className="text-sm text-slate-400">Click "Generate AI Summary" to analyze this case.</p>}
          </div>

          {/* Notes */}
          <div className="app-card app-card-body">
            <h3 className="font-semibold text-sm mb-3">Internal Notes</h3>
            <form onSubmit={handleAddNote} className="flex gap-2 mb-3">
              <input value={noteForm.noteText} onChange={e => setNoteForm(f => ({ ...f, noteText: e.target.value }))}
                placeholder="Add a note..." required
                className="form-control flex-1" />
              <label className="flex items-center gap-1 text-xs text-slate-500">
                <input type="checkbox" checked={noteForm.internalOnly}
                  onChange={e => setNoteForm(f => ({ ...f, internalOnly: e.target.checked }))} /> Internal
              </label>
              <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">Add</button>
            </form>
            <div className="space-y-2">
              {req.notes.map(n => (
                <div key={n.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{n.authorName} {n.internalOnly && <span className="text-orange-500">(Internal)</span>}</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{n.noteText}</p>
                </div>
              ))}
              {req.notes.length === 0 && <p className="text-sm text-slate-400">No notes yet.</p>}
            </div>
          </div>

          {/* Status History */}
          <div className="app-card app-card-body">
            <h3 className="font-semibold text-sm mb-3">Status History</h3>
            <div className="space-y-2">
              {req.statusHistory.map(h => (
                <div key={h.id} className="flex items-start gap-3 text-sm border-l-2 border-blue-200 pl-3">
                  <div className="flex-1">
                    <span className="text-slate-500">{h.oldStatus || 'Created'}</span>
                    <span className="mx-1">&rarr;</span>
                    <StatusBadge status={h.newStatus} />
                    <span className="text-xs text-slate-400 ml-2">by {h.changedByName}</span>
                    {h.changeReason && <p className="text-slate-500 text-xs mt-0.5">{h.changeReason}</p>}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(h.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          {req.auditLogs.length > 0 && (
            <div className="app-card app-card-body">
              <h3 className="font-semibold text-sm mb-3">Audit Log</h3>
              <div className="space-y-1 text-xs">
                {req.auditLogs.map(a => (
                  <div key={a.id} className="flex justify-between py-1 border-b border-gray-100">
                    <div>
                      <span className="font-medium">{a.action}</span>
                      <span className="text-slate-400 ml-2">by {a.performedByName}</span>
                      {a.newValue && <span className="text-slate-500 ml-1">({a.newValue})</span>}
                    </div>
                    <span className="text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <div className="app-card app-card-body">
            <h3 className="font-semibold text-sm mb-3">Actions</h3>
            <div className="space-y-3">
              {!req.assignedToId && (
                <button onClick={handleAssign}
                  className="btn-primary w-full">
                  Assign to Me
                </button>
              )}

              <form onSubmit={handleStatusUpdate} className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">Update Status</label>
                <select value={statusForm.newStatus}
                  onChange={e => setStatusForm(f => ({ ...f, newStatus: e.target.value }))}
                  className="form-control">
                  <option value="">Select status</option>
                  {req.status === 'NEW' && <option value="IN_REVIEW">In Review</option>}
                  {req.status === 'IN_REVIEW' && <option value="WAITING_FOR_CITIZEN">Waiting for Citizen</option>}
                  {req.status === 'IN_REVIEW' && <option value="RESOLVED">Resolved</option>}
                  {req.status === 'WAITING_FOR_CITIZEN' && <option value="IN_REVIEW">In Review</option>}
                  {req.status === 'RESOLVED' && <option value="CLOSED">Closed</option>}
                  {req.status === 'RESOLVED' && <option value="IN_REVIEW">Reopen</option>}
                </select>
                <input value={statusForm.reason}
                  onChange={e => setStatusForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Reason" className="form-control" />
                <button type="submit" disabled={!statusForm.newStatus}
                  className="btn-secondary w-full py-1.5 text-xs">
                  Update Status
                </button>
              </form>

              <form onSubmit={handlePriorityOverride} className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">Override Priority</label>
                <select value={priorityForm.priority}
                  onChange={e => setPriorityForm(f => ({ ...f, priority: e.target.value }))}
                  className="form-control">
                  <option value="">Select priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <input value={priorityForm.reason}
                  onChange={e => setPriorityForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Reason" className="form-control" />
                <button type="submit" disabled={!priorityForm.priority}
                  className="btn-secondary w-full py-1.5 text-xs">
                  Override Priority
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
