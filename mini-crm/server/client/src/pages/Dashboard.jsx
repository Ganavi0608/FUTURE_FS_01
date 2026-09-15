import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../api/client";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["all", "new", "contacted", "qualified", "converted", "lost"];
const SOURCES = ["all", "website", "referral", "linkedin", "instagram", "cold-call", "other"];

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: "all", source: "all", search: "", page: 1 });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/leads", {
        params: {
          status: filters.status,
          source: filters.source,
          search: debouncedSearch,
          page: filters.page,
          limit: 10,
        },
      });
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.source, filters.page, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/leads/stats/summary");
      setStats(data.data);
    } catch { /* stats are non-critical */ }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const setFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value, page: key === "page" ? value : 1 }));

  const cards = stats
    ? [
        { label: "Total Leads", value: stats.total, tone: "text-slate-900" },
        { label: "New", value: stats.byStatus.new, tone: "text-blue-600" },
        { label: "Contacted", value: stats.byStatus.contacted, tone: "text-amber-600" },
        { label: "Converted", value: stats.byStatus.converted, tone: "text-emerald-600" },
        { label: "Conversion Rate", value: `${stats.conversionRate}%`, tone: "text-indigo-600" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-sm text-slate-500">Track every enquiry from first contact to conversion.</p>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 sm:flex-row">
        <input
          placeholder="Search name, email, company, phone…"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm capitalize"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
        </select>
        <select
          value={filters.source}
          onChange={(e) => setFilter("source", e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm capitalize"
        >
          {SOURCES.map((s) => <option key={s} value={s}>{s === "all" ? "All sources" : s}</option>)}
        </select>
      </div>

      {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Loading…</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No leads match these filters.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.company || "—"}</td>
                  <td className="px-4 py-3 capitalize text-slate-600">{lead.source}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/leads/${lead._id}`} className="font-medium text-indigo-600 hover:underline">
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{pagination.total} lead(s) · page {pagination.page} of {pagination.pages}</span>
        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setFilter("page", pagination.page - 1)}
            className="rounded-md border px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => setFilter("page", pagination.page + 1)}
            className="rounded-md border px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}