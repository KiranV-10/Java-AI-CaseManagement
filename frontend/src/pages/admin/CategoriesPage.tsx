import { useState, useEffect } from 'react';
import api from '../../api/client';
import { Category } from '../../types';
import AiCallout from '../../components/AiCallout';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', defaultPriority: 'MEDIUM', slaDays: 7 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => api.get('/admin/categories')
    .then(r => {
      setCategories(r.data);
      setError('');
    })
    .catch(() => setError('Unable to load categories. Please try again.'))
    .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, slaDays: Number(form.slaDays) };
    setError('');
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, body);
      } else {
        await api.post('/admin/categories', body);
      }
    } catch {
      setError('Unable to save the category. Please check the values and try again.');
      return;
    }
    setForm({ name: '', description: '', defaultPriority: 'MEDIUM', slaDays: 7 });
    setShowForm(false);
    setEditId(null);
    load();
  };

  const handleEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description || '', defaultPriority: c.defaultPriority, slaDays: c.slaDays });
    setEditId(c.id);
    setShowForm(true);
  };

  const handleDeactivate = async (id: number) => {
    setError('');
    try {
      await api.delete(`/admin/categories/${id}`);
      load();
    } catch {
      setError('Unable to deactivate the category. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="hero-panel">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Admin Console</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Manage Categories</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Keep routing, default priorities, and SLA targets aligned with agency operations.
            </p>
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', defaultPriority: 'MEDIUM', slaDays: 7 }); }}
            className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50">
            Add Category
          </button>
        </div>
      </div>

      {error && <AiCallout tone="error" title="Category action failed" description={error} />}

      {showForm && (
        <form onSubmit={handleSubmit} className="app-card app-card-body space-y-4">
          <h3 className="font-semibold text-slate-900">{editId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="form-control" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Default Priority</label>
              <select value={form.defaultPriority} onChange={e => setForm(f => ({ ...f, defaultPriority: e.target.value }))}
                className="form-control">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SLA Days</label>
              <input type="number" value={form.slaDays} onChange={e => setForm(f => ({ ...f, slaDays: Number(e.target.value) }))}
                className="form-control" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
              className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="table-wrap overflow-x-auto">
        <table className="data-table min-w-[760px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>SLA</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td className="font-medium text-slate-900">{c.name}</td>
                <td className="text-xs text-slate-500">{c.description}</td>
                <td className="text-xs font-medium">{c.defaultPriority}</td>
                <td className="text-xs">{c.slaDays} days</td>
                <td>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-right space-x-3">
                  <button onClick={() => handleEdit(c)} className="text-xs font-semibold text-blue-700 hover:text-blue-900">Edit</button>
                  {c.active && (
                    <button onClick={() => handleDeactivate(c.id)} className="text-xs font-semibold text-red-600 hover:text-red-800">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
