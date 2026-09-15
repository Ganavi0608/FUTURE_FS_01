import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getErrorMessage } from "../api/client";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"];

const fmt = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/leads/${id}`);
      setLead(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => { load(); }, [id]);

  const changeStatus = async (status) => {
    setBusy(true);
    try {
      const { data } = await api.patch(`/leads/${id}/status`, { status });
      setLead(data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/leads/${id}/notes`, { text: note });
      setLead(data.data);
      setNote("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const removeNote = async (noteId) => {
    if (!confirm("Delete this note?")) return;
    const { data } = await api.delete(`/leads/${id}/notes/${noteId}`);
    setLead(data.data);
  };

  const removeLead = async () => {
    if (!confirm("Delete this lead permanently?")) return;
    await api.delete(`/leads/${id}`);
    navigate("/");
  };

  const saveFollowUp = async (value) => {
    const { data } = await api.put(`/leads/${id}`, { nextFollowUpAt: value || null });
    setLead(data.data);
  };

  if (error && !lead) return <div className="rounded-md bg-red-50 p-4 text-red-700">{error}</div>;
  if (!lead) return <div className="text-slate-500">Loading…</div>;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-indigo-600 hover:underline">← Back to leads</Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
          <p className="text-sm text-slate-500">{lead.company || "Individual"} · received {fmt(lead.createdAt)}</p>
        </div>
        <button onClick={removeLead} className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
          Delete lead
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: details + status */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd>{lead.email}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd>{lead.phone || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Source</dt><dd className="capitalize">{lead.source}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Value</dt><dd>₹{(lead.value || 0).toLocaleString("en-IN")}</dd></div>
            </dl>
            {lead.message && (
              <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{lead.message}</p>
            )}
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Status</h2>
            <div className="mb-3"><StatusBadge status={lead.status} /></div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy || s === lead.status}
                  onClick={() => changeStatus(s)}
                  className="rounded-md border px-2.5 py-1.5 text-xs capitalize hover:bg-slate-50 disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-xs font-medium text-slate-500">Next follow-up</label>
            <input
              type="date"
              value={lead.nextFollowUpAt ? lead.nextFollowUpAt.slice(0, 10) : ""}
              onChange={(e) => saveFollowUp(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Right: notes + timeline */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Follow-up notes ({lead.notes.length})
            </h2>
            <form onSubmit={addNote} className="mb-4">
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Called at 4pm, asked for a proposal by Friday…"
                className="w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500"
              />
              <button
                disabled={busy || !note.trim()}
                className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Add note
              </button>
            </form>

            <ul className="space-y-3">
              {[...lead.notes].reverse().map((n) => (
                <li key={n._id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm text-slate-800">{n.text}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{n.authorName} · {fmt(n.createdAt)}</span>
                    <button onClick={() => removeNote(n._id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
              {lead.notes.length === 0 && <li className="text-sm text-slate-400">No notes yet.</li>}
            </ul>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Status timeline</h2>
            <ol className="space-y-2 text-sm">
              <li className="text-slate-600">Lead created as <b>new</b> · {fmt(lead.createdAt)}</li>
              {lead.statusHistory.map((h, i) => (
                <li key={i} className="text-slate-600">
                  <b className="capitalize">{h.from}</b> → <b className="capitalize">{h.to}</b> by {h.changedByName} · {fmt(h.changedAt)}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}