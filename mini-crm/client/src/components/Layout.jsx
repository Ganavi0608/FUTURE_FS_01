import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-slate-900">Mini<span className="text-indigo-600">CRM</span></Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
            <NavLink to="/contact" className={linkClass}>Public Form</NavLink>
            <span className="ml-2 hidden text-sm text-slate-500 sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-md border px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}