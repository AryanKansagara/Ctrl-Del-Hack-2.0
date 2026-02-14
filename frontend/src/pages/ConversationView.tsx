import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPerson, getLastConversation, createConversation } from "../api";
import type { Person } from "../api";
import type { Conversation } from "../api";
import { Layout, Card, Button, PageHeading, Input, Textarea } from "../components";

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

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error && !person) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <Card className="max-w-md text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="primary" onClick={load}>Try again</Button>
              <Link to="/people" className="min-h-touch px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-card font-medium hover:border-gray-300 transition shadow-card inline-flex items-center justify-center">Back to People</Link>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !person) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-red-600">{error || "Not found"}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 py-4 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <PageHeading>Last conversation</PageHeading>
          <Link
            to="/live"
            className="min-h-touch px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-card font-medium hover:border-gray-300 transition shadow-card inline-flex items-center justify-center"
          >
            Back to camera
          </Link>
        </div>

        <Card className="mb-4">
          <p className="font-semibold text-gray-900 text-lg">{person.name}</p>
          <p className="text-gray-600">{person.relationship}</p>
        </Card>

        {conversation ? (
          <Card className="mb-4">
            <p className="text-gray-600 text-sm mb-1">Date: {conversation.date}</p>
            <p className="text-gray-900 whitespace-pre-wrap">{conversation.summary}</p>
          </Card>
        ) : (
          <p className="text-gray-600 py-4">No conversation yet.</p>
        )}

        {addMode ? (
          <Card>
            <form onSubmit={handleAddConversation} className="space-y-4">
              <div>
                <label className="block text-gray-900 font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-900 font-medium mb-1">Summary</label>
                <Textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={saving}>Save</Button>
                <Button type="button" variant="secondary" onClick={() => setAddMode(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button variant="ghost" onClick={() => setAddMode(true)}>
            Add conversation
          </Button>
        )}
      </div>
    </Layout>
  );
}
