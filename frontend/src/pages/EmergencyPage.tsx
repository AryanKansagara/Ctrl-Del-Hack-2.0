import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmergencyContacts, createEmergencyContact, type EmergencyContact } from "../api";

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const load = async () => {
    try {
      const list = await getEmergencyContacts();
      setContacts(list);
    } catch (_) {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getLocation = (onSuccess?: (lat: number, lng: number) => void) => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        onSuccess?.(lat, lng);
      },
      () => setLocationError("Location unavailable or denied.")
    );
  };

  const primary = contacts[0];
  const mapUrl = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}` : null;

  const handleCall = () => {
    if (!primary) {
      alert("No emergency contact set. Add one in Settings or from the People area.");
      return;
    }
    window.location.href = `tel:${primary.phone.replace(/\D/g, "").replace(/^(\d)/, "+$1")}`;
  };

  const handleShare = () => {
    if (!primary) {
      alert("No emergency contact set.");
      return;
    }
    getLocation((lat, lng) => {
      const text = `I need help. My location: https://www.google.com/maps?q=${lat},${lng}`;
      if (navigator.share) {
        navigator.share({ title: "Emergency", text }).catch(() => {
          navigator.clipboard?.writeText(text).then(() => alert("Message copied. Paste and send to your contact."));
        });
      } else {
        navigator.clipboard?.writeText(text).then(() => alert("Message copied. Paste and send to your contact."));
      }
    });
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    try {
      await createEmergencyContact({ name: newName.trim(), phone: newPhone.trim(), share_method: "sms" });
      setNewName("");
      setNewPhone("");
      setAddMode(false);
      await load();
    } catch (_) {
      alert("Failed to add contact.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Emergency</h1>
        <Link to="/" className="min-h-touch px-4 py-2 bg-teal-600 rounded-lg font-medium">Home</Link>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center gap-6 max-w-lg mx-auto">
        {contacts.length === 0 && !addMode ? (
          <div className="text-center space-y-4">
            <p className="text-teal-800">No emergency contact. Add one below.</p>
            <button type="button" onClick={() => setAddMode(true)} className="min-h-touch px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold">Add emergency contact</button>
          </div>
        ) : addMode ? (
          <form onSubmit={handleAddContact} className="w-full max-w-sm space-y-3 p-4 bg-white rounded-xl shadow">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" className="w-full min-h-touch px-4 rounded-lg border-2 border-teal-200" required />
            <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" className="w-full min-h-touch px-4 rounded-lg border-2 border-teal-200" required />
            <div className="flex gap-2">
              <button type="submit" className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium">Save</button>
              <button type="button" onClick={() => setAddMode(false)} className="min-h-touch px-4 py-2 bg-gray-200 rounded-lg font-medium">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCall}
              className="w-full max-w-sm min-h-[72px] py-4 px-6 bg-emergency text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-red-600 transition"
            >
              Call {primary?.name ?? "emergency"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="w-full max-w-sm min-h-touch py-4 px-6 bg-teal-600 text-white rounded-2xl font-semibold shadow hover:bg-teal-500 transition"
            >
              Share my location
            </button>
            {locationError && <p className="text-red-600 text-sm text-center">{locationError}</p>}
            {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 underline text-sm">Open location in maps</a>}
          </>
        )}
      </main>
    </div>
  );
}
