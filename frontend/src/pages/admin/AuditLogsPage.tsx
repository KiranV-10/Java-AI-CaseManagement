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
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Audit Logs</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Entity</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Performed By</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Old Value</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">New Value</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50 text-xs">
                <td className="px-4 py-2 font-medium">{l.action}</td>
                <td className="px-4 py-2 text-gray-500">{l.entityType} #{l.entityId}</td>
                <td className="px-4 py-2">{l.performedByName}</td>
                <td className="px-4 py-2 text-gray-400 max-w-[150px] truncate">{l.oldValue || '—'}</td>
                <td className="px-4 py-2 text-gray-600 max-w-[150px] truncate">{l.newValue || '—'}</td>
                <td className="px-4 py-2 text-gray-400">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50">Prev</button>
          <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
