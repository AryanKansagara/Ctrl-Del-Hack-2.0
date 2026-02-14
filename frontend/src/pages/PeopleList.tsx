import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPeople, deletePerson, type Person } from "../api";

export default function PeopleList() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const list = await getPeople();
      setPeople(list);
      setError(null);
    } catch (e) {
      setError("Could not load people. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deletePerson(id);
      await load();
    } catch (e) {
      setError("Failed to delete.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-6">Loading...</div>;
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-red-700 gap-4">
        <p className="text-center">{error}</p>
        <button type="button" onClick={() => { setError(null); setLoading(true); load(); }} className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">People</h1>
        <div className="flex gap-2">
          <Link to="/people/new" className="min-h-touch px-4 py-2 bg-teal-600 rounded-lg font-medium">Add person</Link>
          <Link to="/" className="min-h-touch px-4 py-2 bg-teal-600 rounded-lg font-medium">Home</Link>
        </div>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        {people.length === 0 ? (
          <p className="text-teal-800 text-center py-8">No people yet. Add someone so the app can recognize them.</p>
        ) : (
          <ul className="space-y-3">
            {people.map((p) => (
              <li
                key={p.id}
                className="bg-white rounded-xl p-4 shadow flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {p.photo_base64 ? (
                    <img
                      src={`data:image/jpeg;base64,${p.photo_base64}`}
                      alt=""
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-teal-200 flex-shrink-0 flex items-center justify-center text-teal-700 font-bold text-lg">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-teal-900 truncate">{p.name}</p>
                    <p className="text-teal-600 text-sm truncate">{p.relationship}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    to={`/people/${p.id}/edit`}
                    className="min-h-touch min-w-touch px-3 py-2 bg-teal-100 text-teal-800 rounded-lg font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.name)}
                    className="min-h-touch min-w-touch px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium"
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
