import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReminders, createReminder, updateReminder, deleteReminder, type Reminder } from "../api";
import { Layout, Card, Button, PageHeading, Input } from "../components";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("09:00");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoadError(null);
    try {
      const list = await getReminders();
      setReminders(list);
    } catch (e) {
      setReminders([]);
      setLoadError("Could not load reminders. Is the API running?");
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

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (loadError) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <Card className="max-w-md text-center">
            <p className="text-red-600 mb-4">{loadError}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="primary" onClick={() => { setLoading(true); load(); }}>Try again</Button>
              <Link to="/" className="min-h-touch px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-card font-medium hover:border-gray-300 transition shadow-card inline-flex items-center justify-center">Home</Link>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 py-4 max-w-2xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <PageHeading>Reminders</PageHeading>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAddMode(true)} className="bg-gray-600 border-gray-600 hover:bg-gray-700 hover:border-gray-700 !text-white">Add</Button>
          </div>
        </div>

        {addMode && (
          <Card className="mb-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Morning medicine"
                required
              />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={saving}>Save</Button>
                <Button type="button" variant="secondary" onClick={() => setAddMode(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {reminders.length === 0 && !addMode ? (
          <Card>
            <p className="text-gray-600 text-center py-8">No reminders. Add one to get started.</p>
          </Card>
        ) : (
          <ul className="space-y-4">
            {reminders.map((r) => (
              <li key={r.id}>
                <Card className="p-4 flex flex-row items-center justify-between gap-4">
                  <div>
                    <p className={`font-semibold ${r.enabled ? "text-gray-900" : "text-gray-400"}`}>{r.label}</p>
                    <p className="text-gray-600 text-sm">{r.time} · {r.repeat_rule}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => toggleEnabled(r)}>
                      {r.enabled ? "On" : "Off"}
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(r.id)}>Delete</Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
