import { Link, Outlet, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface Props {
  user: User | null;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isStaff = user?.role === 'CASE_WORKER' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isCitizen = user?.role === 'CITIZEN';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Labor Services Case Management
          </Link>
          {user && (
            <div className="flex items-center gap-4 text-sm">
              <nav className="flex gap-3">
                {isCitizen && (
                  <>
                    <Link to="/citizen/new-request" className="hover:text-blue-200">New Request</Link>
                    <Link to="/citizen/my-requests" className="hover:text-blue-200">My Requests</Link>
                  </>
                )}
                {isStaff && (
                  <>
                    <Link to="/staff/dashboard" className="hover:text-blue-200">Dashboard</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin/categories" className="hover:text-blue-200">Categories</Link>
                    <Link to="/admin/audit-logs" className="hover:text-blue-200">Audit Logs</Link>
                  </>
                )}
              </nav>
              <span className="text-blue-200 text-xs">
                {user.fullName} ({user.role.replace('_', ' ')})
              </span>
              <button onClick={handleLogout}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-xs">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 border-t text-center text-xs text-gray-500 py-3">
        Labor Services AI Case Management Portal
      </footer>
    </div>
  );
}
