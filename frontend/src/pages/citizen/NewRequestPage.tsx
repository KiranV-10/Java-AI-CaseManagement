import { useState, useEffect } from 'react';
import api from '../../api/client';
import { User, Category, CreateRequestResponse } from '../../types';
import AiDisclaimer from '../../components/AiDisclaimer';
import AiCallout from '../../components/AiCallout';
import PriorityBadge from '../../components/PriorityBadge';

export default function NewRequestPage({ user }: { user: User }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
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
    let active = true;

    api.get('/categories/active')
      .then(r => {
        if (active) {
          setCategories(r.data);
          setCategoryError('');
        }
      })
      .catch(() => {
        if (active) setCategoryError('Unable to load request categories. Please refresh or try again later.');
      })
      .finally(() => {
        if (active) setCategoriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
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
      setSubmitError('Failed to submit request. Please check the form and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setSubmitError('');
    setForm({
      categoryId: '',
      title: '',
      description: '',
      preferredContactMethod: 'EMAIL',
      phoneNumber: '',
      employerName: '',
      incidentDate: '',
      documentName: '',
    });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="app-card app-card-body">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">✓</div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Request submitted</h2>
              <p className="mt-1 text-sm text-slate-600">{result.message}</p>
            </div>
          </div>
          <div className="detail-grid">
            <div>
              <p className="detail-label">Request Number</p>
              <p className="detail-value font-mono">{result.requestNumber}</p>
            </div>
            <div>
              <p className="detail-label">Status</p>
              <p className="detail-value">{result.status}</p>
            </div>
            <div>
              <p className="detail-label">Priority</p>
              <div className="mt-1"><PriorityBadge priority={result.priority} /></div>
            </div>
            {result.aiStatus === 'SUCCESS' && (
              <>
                <div>
                  <p className="detail-label">AI Suggested Category</p>
                  <p className="detail-value">{result.aiSuggestedCategory}</p>
                </div>
                <div>
                  <p className="detail-label">AI Suggested Priority</p>
                  <div className="mt-1"><PriorityBadge priority={result.aiSuggestedPriority} /></div>
                </div>
              </>
            )}
          </div>
          {result.aiStatus === 'SUCCESS' && result.citizenGuidance && (
            <div className="mt-4">
              <AiCallout tone="success" title="AI guidance is ready" description={result.citizenGuidance} />
            </div>
          )}
          {result.aiStatus === 'FAILED' && (
            <div className="mt-4">
              <AiCallout
                tone="warning"
                title="AI recommendation is unavailable"
                description="Your request was saved successfully. Staff can still review, assign, and update the case without AI assistance."
              />
            </div>
          )}
          <AiDisclaimer />
          <button onClick={resetForm}
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
        {categoryError && (
          <AiCallout tone="error" title="Categories could not be loaded" description={categoryError} />
        )}
        {submitError && (
          <AiCallout tone="error" title="Request was not submitted" description={submitError} />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label">Category *</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required
              className="form-control" disabled={categoriesLoading || Boolean(categoryError)}>
              <option value="">{categoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required
              className="form-control" placeholder="Brief summary of your issue" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className="form-control" placeholder="Describe your situation in detail" />
          </div>
          <div>
            <label className="field-label">Preferred Contact</label>
            <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange}
              className="form-control">
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="MAIL">Mail</option>
            </select>
          </div>
          <div>
            <label className="field-label">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
              className="form-control" placeholder="555-123-4567" />
          </div>
          <div>
            <label className="field-label">Employer Name</label>
            <input name="employerName" value={form.employerName} onChange={handleChange}
              className="form-control" placeholder="Company name" />
          </div>
          <div>
            <label className="field-label">Incident Date</label>
            <input name="incidentDate" type="date" value={form.incidentDate} onChange={handleChange}
              className="form-control" />
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Document Name</label>
            <input name="documentName" value={form.documentName} onChange={handleChange}
              className="form-control" placeholder="e.g., paystub-april.pdf" />
          </div>
        </div>
        <button type="submit" disabled={submitting || categoriesLoading || Boolean(categoryError)}
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
