import { useState } from 'react';
import api from '../api/client';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      onLogin(data);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (demoEmail: string) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: demoEmail, password: 'password123' });
      onLogin(data);
    } catch {
      setError('Demo login failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-background min-h-screen flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-blue-950 via-blue-900 to-sky-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold ring-1 ring-white/20">
              LS
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Labor Services</p>
            <h1 className="mt-4 max-w-sm text-4xl font-semibold tracking-tight">A simpler way to manage service requests.</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100">
              Citizens can submit requests, staff can triage cases, and administrators can review activity in one calm workspace.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-blue-50">
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Guided request intake</div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Staff dashboard and case workflow</div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">Admin oversight and audit history</div>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-sm font-bold text-white shadow-sm lg:mx-0">
              LS
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to the case management portal.</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="form-control"
              placeholder="Enter your email" required />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="form-control"
              placeholder="Enter your password" required />
          </div>
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading}
              className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 text-center mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => demoLogin('citizen@example.com')}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
              Citizen
            </button>
            <button onClick={() => demoLogin('worker@example.com')}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100">
              Staff
            </button>
            <button onClick={() => demoLogin('admin@example.com')}
                className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100">
              Admin
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
