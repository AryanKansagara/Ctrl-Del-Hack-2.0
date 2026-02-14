import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReminders, createReminder, updateReminder, deleteReminder, type Reminder } from "../api";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMode, setAddMode] = useState(false);
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("09:00");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const list = await getReminders();
      setReminders(list);
    } catch (_) {
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);
    try {
      await createReminder({ label: label.trim(), time, repeat_rule: "daily", enabled: true });
      setLabel("");
      setTime("09:00");
      setAddMode(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (r: Reminder) => {
    try {
      await updateReminder(r.id, { enabled: !r.enabled });
      await load();
    } catch (_) {}
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await deleteReminder(id);
      await load();
    } catch (_) {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Reminders</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAddMode(true)}
            className="min-h-touch px-4 py-2 bg-teal-600 rounded-lg font-medium"
          >
            Add
          </button>
          <Link to="/" className="min-h-touch px-4 py-2 bg-teal-600 rounded-lg font-medium">Home</Link>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {addMode && (
          <form onSubmit={handleAdd} className="mb-6 p-4 bg-white rounded-xl shadow space-y-3">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Morning medicine"
              className="w-full min-h-touch px-4 rounded-lg border-2 border-teal-200"
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full min-h-touch px-4 rounded-lg border-2 border-teal-200"
            />
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium disabled:opacity-50">Save</button>
              <button type="button" onClick={() => setAddMode(false)} className="min-h-touch px-4 py-2 bg-gray-200 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        )}

        {reminders.length === 0 && !addMode ? (
          <p className="text-teal-800 py-8 text-center">No reminders. Add one to get started.</p>
        ) : (
          <ul className="space-y-3">
            {reminders.map((r) => (
              <li key={r.id} className="bg-white rounded-xl p-4 shadow flex items-center justify-between gap-4">
                <div>
                  <p className={`font-semibold ${r.enabled ? "text-teal-900" : "text-gray-400"}`}>{r.label}</p>
                  <p className="text-teal-600 text-sm">{r.time} · {r.repeat_rule}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleEnabled(r)}
                    className="min-h-touch px-3 py-2 bg-teal-100 text-teal-800 rounded-lg font-medium"
                  >
                    {r.enabled ? "On" : "Off"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="min-h-touch px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
