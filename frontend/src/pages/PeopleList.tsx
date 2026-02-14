import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPeople, deletePerson, type Person } from "../api";
import { Layout, Card, Button, PageHeading } from "../components";

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

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <Card className="max-w-md text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="primary" onClick={() => { setError(null); setLoading(true); load(); }}>
              Try again
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 py-4 max-w-2xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <PageHeading>My People</PageHeading>
          <div className="flex gap-2">
            <Link
              to="/people/new"
              className="min-h-touch px-4 py-2 bg-gray-600 text-white rounded-card font-medium hover:bg-gray-700 transition inline-flex items-center justify-center"
            >
              Add person
            </Link>
          </div>
        </div>

        {people.length === 0 ? (
          <Card>
            <p className="text-gray-600 text-center py-6">No people yet. Add someone so the app can recognize them.</p>
          </Card>
        ) : (
          <ul className="space-y-4">
            {people.map((p) => (
              <li key={p.id}>
                <Card className="p-4 flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.photo_base64 ? (
                      <img
                        src={`data:image/jpeg;base64,${p.photo_base64}`}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-recall-mint flex-shrink-0 flex items-center justify-center text-recall-green font-bold text-lg">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-gray-600 text-sm truncate">{p.relationship}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      to={`/people/${p.id}/edit`}
                      className="min-h-touch min-w-touch px-4 py-2 text-recall-nav font-medium rounded-card hover:bg-gray-100 transition inline-flex items-center justify-center"
                    >
                      Edit
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(p.id, p.name)}>
                      Delete
                    </Button>
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
