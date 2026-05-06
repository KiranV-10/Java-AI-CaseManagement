import { useState, useEffect } from 'react';
import api from '../../api/client';
import { AuditLogEntry, PageResponse } from '../../types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    api.get<PageResponse<AuditLogEntry>>(`/admin/audit-logs?page=${page}&size=30`)
      .then(r => { setLogs(r.data.content); setTotalPages(r.data.totalPages); });
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="hero-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Admin Console</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">Review system activity and changes made by staff.</p>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="data-table min-w-[920px]">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Performed By</th>
              <th>Old Value</th>
              <th>New Value</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td className="text-xs font-semibold text-slate-900">{l.action}</td>
                <td className="text-xs text-slate-500">{l.entityType} #{l.entityId}</td>
                <td className="text-xs">{l.performedByName}</td>
                <td className="max-w-[150px] truncate text-xs text-slate-400">{l.oldValue || '—'}</td>
                <td className="max-w-[150px] truncate text-xs text-slate-600">{l.newValue || '—'}</td>
                <td className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="btn-secondary px-3 py-1.5">Prev</button>
          <span className="text-sm text-slate-500">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="btn-secondary px-3 py-1.5">Next</button>
        </div>
      )}
    </div>
  );
}
