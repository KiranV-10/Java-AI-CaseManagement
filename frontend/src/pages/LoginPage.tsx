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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-white px-4">
      <div className="app-card w-full max-w-md">
        <div className="app-card-body">
        <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-sm font-bold text-white shadow-sm">
              LS
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Labor Services</h1>
            <p className="text-sm text-slate-500 mt-1">Case Management Portal</p>
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
