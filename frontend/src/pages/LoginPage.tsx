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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Labor Services</h1>
          <p className="text-sm text-gray-500 mt-1">AI Case Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password" required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded font-medium hover:bg-blue-800 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-500 text-center mb-3">Quick Demo Access</p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => demoLogin('citizen@example.com')}
              className="px-3 py-2 bg-green-50 border border-green-200 rounded text-xs font-medium text-green-700 hover:bg-green-100">
              Citizen
            </button>
            <button onClick={() => demoLogin('worker@example.com')}
              className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs font-medium text-blue-700 hover:bg-blue-100">
              Staff
            </button>
            <button onClick={() => demoLogin('admin@example.com')}
              className="px-3 py-2 bg-purple-50 border border-purple-200 rounded text-xs font-medium text-purple-700 hover:bg-purple-100">
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
