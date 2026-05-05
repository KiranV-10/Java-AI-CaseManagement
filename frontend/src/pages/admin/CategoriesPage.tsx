import { useState, useEffect } from 'react';
import api from '../../api/client';
import { Category } from '../../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', defaultPriority: 'MEDIUM', slaDays: 7 });

  const load = () => api.get('/admin/categories').then(r => setCategories(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, slaDays: Number(form.slaDays) };
    if (editId) {
      await api.put(`/admin/categories/${editId}`, body);
    } else {
      await api.post('/admin/categories', body);
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
    await api.delete(`/admin/categories/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Manage Categories</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', defaultPriority: 'MEDIUM', slaDays: 7 }); }}
          className="px-4 py-2 bg-blue-700 text-white rounded text-sm hover:bg-blue-800">
          Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-5 space-y-3">
          <h3 className="font-semibold text-sm">{editId ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Default Priority</label>
              <select value={form.defaultPriority} onChange={e => setForm(f => ({ ...f, defaultPriority: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SLA Days</label>
              <input type="number" value={form.slaDays} onChange={e => setForm(f => ({ ...f, slaDays: Number(e.target.value) }))}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-1.5 bg-blue-700 text-white rounded text-sm hover:bg-blue-800">
              {editId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-4 py-1.5 border rounded text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Priority</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">SLA</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.description}</td>
                <td className="px-4 py-3 text-xs">{c.defaultPriority}</td>
                <td className="px-4 py-3 text-xs">{c.slaDays} days</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${c.active ? 'text-green-600' : 'text-red-500'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  {c.active && (
                    <button onClick={() => handleDeactivate(c.id)} className="text-red-500 hover:underline text-xs">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
