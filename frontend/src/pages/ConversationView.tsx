import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPerson, getLastConversation, createConversation } from "../api";
import type { Person } from "../api";
import type { Conversation } from "../api";

export default function ConversationView() {
  const { personId } = useParams<"personId">();
  const id = Number(personId);
  const [person, setPerson] = useState<Person | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newSummary, setNewSummary] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getPerson(id), getLastConversation(id)]);
      setPerson(p);
      setConversation(c);
    } catch {
      setError("Could not load. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAddConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;
    setSaving(true);
    try {
      const created = await createConversation({ person_id: id, date: newDate, summary: newSummary.trim() });
      setConversation(created);
      setAddMode(false);
      setNewSummary("");
    } catch (err) {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-6">Loading...</div>;
  if (error && !person) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
        <p className="text-red-700 text-center">{error}</p>
        <button type="button" onClick={load} className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium">Try again</button>
        <Link to="/people" className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium">Back to People</Link>
      </div>
    );
  }
  if (error || !person) return <div className="min-h-screen flex flex-col items-center justify-center p-6 text-red-700">{error || "Not found"}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Last conversation</h1>
        <Link to="/live" className="min-h-touch px-4 py-2 bg-teal-600 rounded-lg font-medium">Back to camera</Link>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-xl p-4 shadow mb-4">
          <p className="font-semibold text-teal-900 text-lg">{person.name}</p>
          <p className="text-teal-600">{person.relationship}</p>
        </div>

        {conversation ? (
          <div className="bg-white rounded-xl p-4 shadow">
            <p className="text-teal-600 text-sm mb-1">Date: {conversation.date}</p>
            <p className="text-teal-900 whitespace-pre-wrap">{conversation.summary}</p>
          </div>
        ) : (
          <p className="text-teal-700 py-4">No conversation yet.</p>
        )}

        {addMode ? (
          <form onSubmit={handleAddConversation} className="mt-4 space-y-3">
            <div>
              <label className="block font-medium mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full min-h-touch px-4 rounded-lg border-2 border-teal-200"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Summary</label>
              <textarea
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                rows={4}
                className="w-full min-h-touch px-4 py-2 rounded-lg border-2 border-teal-200"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium disabled:opacity-50">Save</button>
              <button type="button" onClick={() => setAddMode(false)} className="min-h-touch px-4 py-2 bg-gray-200 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setAddMode(true)}
            className="mt-4 min-h-touch px-4 py-2 bg-teal-100 text-teal-800 rounded-lg font-medium"
          >
            Add conversation
          </button>
        )}
      </main>
    </div>
  );
}
