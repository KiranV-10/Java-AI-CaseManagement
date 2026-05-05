import { useState, useEffect } from 'react';
import api from '../../api/client';
import { User, Category, CreateRequestResponse } from '../../types';
import AiDisclaimer from '../../components/AiDisclaimer';
import PriorityBadge from '../../components/PriorityBadge';

export default function NewRequestPage({ user }: { user: User }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreateRequestResponse | null>(null);

  const [form, setForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    preferredContactMethod: 'EMAIL',
    phoneNumber: '',
    employerName: '',
    incidentDate: '',
    documentName: '',
  });

  useEffect(() => {
    api.get('/categories/active').then(r => setCategories(r.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/requests', {
        citizenId: user.userId,
        categoryId: Number(form.categoryId),
        title: form.title,
        description: form.description,
        preferredContactMethod: form.preferredContactMethod,
        phoneNumber: form.phoneNumber || null,
        employerName: form.employerName || null,
        incidentDate: form.incidentDate || null,
        documentName: form.documentName || null,
      });
      setResult(data);
    } catch {
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
            <h2 className="text-lg font-semibold">Request Submitted</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{result.message}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Request Number:</span> <strong>{result.requestNumber}</strong></div>
            <div><span className="text-gray-500">Status:</span> <strong>{result.status}</strong></div>
            <div><span className="text-gray-500">Priority:</span> <PriorityBadge priority={result.priority} /></div>
            {result.aiStatus === 'SUCCESS' && (
              <>
                <div><span className="text-gray-500">AI Suggested Category:</span> <strong>{result.aiSuggestedCategory}</strong></div>
                <div><span className="text-gray-500">AI Suggested Priority:</span> <PriorityBadge priority={result.aiSuggestedPriority} /></div>
              </>
            )}
          </div>
          {result.aiStatus === 'SUCCESS' && result.citizenGuidance && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <p className="font-medium text-blue-800 mb-1">Guidance</p>
              <p className="text-blue-700">{result.citizenGuidance}</p>
            </div>
          )}
          {result.aiStatus === 'FAILED' && (
            <div className="mt-4 p-3 bg-gray-50 border rounded text-sm text-gray-600">
              Your request was submitted successfully, but AI recommendation is currently unavailable.
            </div>
          )}
          <AiDisclaimer />
          <button onClick={() => { setResult(null); setForm({ categoryId: '', title: '', description: '', preferredContactMethod: 'EMAIL', phoneNumber: '', employerName: '', incidentDate: '', documentName: '' }); }}
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded text-sm hover:bg-blue-800">
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Submit a Service Request</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">Select a category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Brief summary of your issue" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Describe your situation in detail" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
            <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="MAIL">Mail</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="555-123-4567" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
            <input name="employerName" value={form.employerName} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Company name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date</label>
            <input name="incidentDate" type="date" value={form.incidentDate} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
            <input name="documentName" value={form.documentName} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="e.g., paystub-april.pdf" />
          </div>
        </div>
        <button type="submit" disabled={submitting}
          className="w-full bg-blue-700 text-white py-2 rounded font-medium hover:bg-blue-800 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
