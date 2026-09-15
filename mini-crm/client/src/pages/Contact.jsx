import { useState } from "react";
import api, { getErrorMessage } from "../api/client";

const empty = { name: "", email: "", phone: "", company: "", message: "", source: "website" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus({ type: "", msg: "" });
    try {
      const { data } = await api.post("/leads", form);
      setStatus({ type: "ok", msg: data.message });
      setForm(empty);
    } catch (err) {
      setStatus({ type: "err", msg: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const field = "mt-1 mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500";

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-lg rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Get in touch</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">Tell us about your project and we'll reply within a day.</p>

        {status.msg && (
          <div className={`mb-4 rounded-md px-3 py-2 text-sm ${status.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {status.msg}
          </div>
        )}

        <label className="block text-sm font-medium">Name *</label>
        <input name="name" required value={form.name} onChange={change} className={field} />

        <label className="block text-sm font-medium">Email *</label>
        <input type="email" name="email" required value={form.email} onChange={change} className={field} />

        <div className="grid gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input name="phone" value={form.phone} onChange={change} className={field} />
          </div>
          <div>
            <label className="block text-sm font-medium">Company</label>
            <input name="company" value={form.company} onChange={change} className={field} />
          </div>
        </div>

        <label className="block text-sm font-medium">How did you hear about us?</label>
        <select name="source" value={form.source} onChange={change} className={field}>
          {["website", "referral", "linkedin", "instagram", "other"].map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>

        <label className="block text-sm font-medium">Message</label>
        <textarea name="message" rows={4} value={form.message} onChange={change} className={field} />

        <button
          disabled={busy}
          className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </div>
  );
}