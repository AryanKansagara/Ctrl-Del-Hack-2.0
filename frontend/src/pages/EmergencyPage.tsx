import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmergencyContacts, createEmergencyContact, type EmergencyContact } from "../api";
import { Layout, Card, Button, PageHeading, Input } from "../components";

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const load = async () => {
    setLoadError(null);
    try {
      const list = await getEmergencyContacts();
      setContacts(list);
    } catch (_) {
      setContacts([]);
      setLoadError("Could not load contacts. Is the API running?");
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
      <div className="flex-1 p-6 flex flex-col items-center gap-6 max-w-lg mx-auto w-full">
        <PageHeading>Emergency</PageHeading>

        {contacts.length === 0 && !addMode ? (
          <Card className="w-full text-center">
            <p className="text-gray-600 mb-4">No emergency contact. Add one below.</p>
            <Button variant="primary" onClick={() => setAddMode(true)} className="w-full">
              Add emergency contact
            </Button>
          </Card>
        ) : addMode ? (
          <Card className="w-full max-w-sm">
            <form onSubmit={handleAddContact} className="space-y-4">
              <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Name" required />
              <Input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Phone" required />
              <div className="flex gap-2">
                <Button type="submit" variant="primary">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setAddMode(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        ) : (
          <>
            <Button variant="emergency" onClick={handleCall} className="w-full max-w-sm min-h-[72px]">
              Call {primary?.name ?? "emergency"}
            </Button>
            <Button variant="secondary" onClick={handleShare} className="w-full max-w-sm min-h-touch py-4 text-lg bg-gray-600 border-gray-600 hover:bg-gray-700 hover:border-gray-700 !text-white">
              Share my location
            </Button>
            {locationError && <p className="text-red-600 text-sm text-center">{locationError}</p>}
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-recall-green hover:underline text-sm font-medium">
                Open location in maps
              </a>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
