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
        <div className="app-card app-card-body">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">✓</div>
            <h2 className="text-lg font-semibold text-slate-900">Request Submitted</h2>
          </div>
          <p className="text-sm text-slate-600 mb-5">{result.message}</p>
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div><span className="text-slate-500">Request Number:</span> <strong>{result.requestNumber}</strong></div>
            <div><span className="text-slate-500">Status:</span> <strong>{result.status}</strong></div>
            <div><span className="text-slate-500">Priority:</span> <PriorityBadge priority={result.priority} /></div>
            {result.aiStatus === 'SUCCESS' && (
              <>
                <div><span className="text-slate-500">AI Suggested Category:</span> <strong>{result.aiSuggestedCategory}</strong></div>
                <div><span className="text-slate-500">AI Suggested Priority:</span> <PriorityBadge priority={result.aiSuggestedPriority} /></div>
              </>
            )}
          </div>
          {result.aiStatus === 'SUCCESS' && result.citizenGuidance && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
              <p className="font-medium text-blue-800 mb-1">Guidance</p>
              <p className="text-blue-700">{result.citizenGuidance}</p>
            </div>
          )}
          {result.aiStatus === 'FAILED' && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Your request was submitted successfully, but AI recommendation is currently unavailable.
            </div>
          )}
          <AiDisclaimer />
          <button onClick={() => { setResult(null); setForm({ categoryId: '', title: '', description: '', preferredContactMethod: 'EMAIL', phoneNumber: '', employerName: '', incidentDate: '', documentName: '' }); }}
            className="btn-primary mt-4">
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-6">
          <p className="kicker">Request Intake</p>
          <h1 className="page-title mt-2">Submit a Service Request</h1>
          <p className="page-subtitle">Tell us what happened and how staff can follow up with you.</p>
        </div>
        <form onSubmit={handleSubmit} className="app-card app-card-body space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required
              className="form-control">
              <option value="">Select a category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="form-control" placeholder="Brief summary of your issue" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className="form-control" placeholder="Describe your situation in detail" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Contact</label>
            <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange}
              className="form-control">
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="MAIL">Mail</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
              className="form-control" placeholder="555-123-4567" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employer Name</label>
            <input name="employerName" value={form.employerName} onChange={handleChange}
              className="form-control" placeholder="Company name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Incident Date</label>
            <input name="incidentDate" type="date" value={form.incidentDate} onChange={handleChange}
              className="form-control" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
            <input name="documentName" value={form.documentName} onChange={handleChange}
              className="form-control" placeholder="e.g., paystub-april.pdf" />
          </div>
        </div>
        <button type="submit" disabled={submitting}
          className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
        </form>
      </div>
      <aside className="space-y-4">
        <div className="app-card app-card-body">
          <h2 className="font-semibold text-slate-900">Before you submit</h2>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
            <li>Use a short, clear title so staff can route your request quickly.</li>
            <li>Include dates, employer details, and any relevant context in the description.</li>
            <li>AI may suggest a category or priority, but staff will make the final review.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">
          <p className="font-semibold">Need urgent help?</p>
          <p className="mt-2 leading-6">Submit the request with as much detail as possible. Staff can adjust priority after review.</p>
        </div>
      </aside>
    </div>
  );
}
