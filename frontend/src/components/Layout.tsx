import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-blue-700 text-white shadow-sm' : 'text-blue-100 hover:bg-blue-700/60 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-blue-900 text-white shadow-lg shadow-blue-950/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-base font-bold ring-1 ring-white/20">
              LS
            </span>
            <span>
              <span className="block text-base font-semibold tracking-tight">Labor Services</span>
              <span className="block text-xs text-blue-100">Case Management Portal</span>
            </span>
          </Link>
          {user && (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <nav className="flex flex-wrap gap-1">
                {isCitizen && (
                  <>
                    <NavLink to="/citizen/new-request" className={navClass}>New Request</NavLink>
                    <NavLink to="/citizen/my-requests" className={navClass}>My Requests</NavLink>
                  </>
                )}
                {isStaff && (
                  <>
                    <NavLink to="/staff/dashboard" className={navClass}>Dashboard</NavLink>
                  </>
                )}
                {isAdmin && (
                  <>
                    <NavLink to="/admin/categories" className={navClass}>Categories</NavLink>
                    <NavLink to="/admin/audit-logs" className={navClass}>Audit Logs</NavLink>
                  </>
                )}
              </nav>
              <div className="hidden h-8 w-px bg-white/20 lg:block" />
              <div className="flex items-center gap-3">
                <span className="text-left text-xs text-blue-100">
                  <span className="block font-medium text-white">{user.fullName}</span>
                  <span>{user.role.replace('_', ' ')}</span>
                </span>
              <button onClick={handleLogout}
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20">
                Logout
              </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white text-center text-xs text-slate-500 py-4">
        Labor Services Case Management Portal
      </footer>
    </div>
  );
}
