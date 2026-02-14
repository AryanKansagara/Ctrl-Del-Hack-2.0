const API = "/api";
const FETCH_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(id);
    return r;
  } catch (e) {
    clearTimeout(id);
    if ((e as Error).name === "AbortError") throw new Error("Request timed out. Is the API running?");
    throw e;
  }
}

export type Person = {
  id: number;
  name: string;
  relationship: string;
  about?: string | null;
  photo_base64?: string | null;
  face_descriptor?: number[] | null;
  with_you_today: boolean;
};

export type PersonForRecognition = {
  id: number;
  name: string;
  relationship: string;
  face_descriptor: number[] | null;
};

export type Conversation = {
  id: number;
  person_id: number;
  date: string;
  summary: string;
};

export type Reminder = {
  id: number;
  label: string;
  time: string;
  repeat_rule: string;
  enabled: boolean;
};

export type EmergencyContact = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  order_priority: number;
  share_method: string;
};

export async function getPeople(): Promise<Person[]> {
  const r = await fetchWithTimeout(`${API}/people`);
  if (!r.ok) throw new Error("Failed to fetch people");
  return r.json();
}

export async function getPeopleForRecognition(): Promise<PersonForRecognition[]> {
  const r = await fetchWithTimeout(`${API}/people/for-recognition`);
  if (!r.ok) throw new Error("Failed to fetch people for recognition");
  return r.json();
}

export async function getPerson(id: number): Promise<Person> {
  const r = await fetchWithTimeout(`${API}/people/${id}`);
  if (!r.ok) throw new Error("Failed to fetch person");
  return r.json();
}

export async function createPerson(data: {
  name: string;
  relationship: string;
  about?: string | null;
  photo_base64?: string | null;
  face_descriptor?: number[] | null;
  with_you_today?: boolean;
}): Promise<Person> {
  const r = await fetch(`${API}/people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create person");
  return r.json();
}

export async function updatePerson(
  id: number,
  data: Partial<{ name: string; relationship: string; about: string | null; photo_base64: string | null; face_descriptor: number[] | null; with_you_today: boolean }>
): Promise<Person> {
  const r = await fetch(`${API}/people/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to update person");
  return r.json();
}

export async function deletePerson(id: number): Promise<void> {
  const r = await fetch(`${API}/people/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete person");
}

export async function getLastConversation(personId: number): Promise<Conversation | null> {
  const r = await fetchWithTimeout(`${API}/people/${personId}/last-conversation`);
  if (!r.ok) throw new Error("Failed to fetch conversation");
  const data = await r.json();
  return data.id != null ? data : null;
}

export async function createConversation(data: { person_id: number; date: string; summary: string }): Promise<Conversation> {
  const r = await fetch(`${API}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create conversation");
  return r.json();
}

export async function summarizeAndSaveConversation(personId: number, transcript: string): Promise<Conversation> {
  const r = await fetch(`${API}/conversations/summarize-and-save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ person_id: personId, transcript: transcript.trim() }),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Failed to summarize and save");
  }
  return r.json();
}

export async function getReminders(): Promise<Reminder[]> {
  const r = await fetchWithTimeout(`${API}/reminders`);
  if (!r.ok) throw new Error("Failed to fetch reminders");
  return r.json();
}

export async function createReminder(data: { label: string; time: string; repeat_rule?: string; enabled?: boolean }): Promise<Reminder> {
  const r = await fetch(`${API}/reminders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create reminder");
  return r.json();
}

export async function updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder> {
  const r = await fetch(`${API}/reminders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to update reminder");
  return r.json();
}

export async function deleteReminder(id: number): Promise<void> {
  const r = await fetch(`${API}/reminders/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete reminder");
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  const r = await fetchWithTimeout(`${API}/emergency-contacts`);
  if (!r.ok) throw new Error("Failed to fetch emergency contacts");
  return r.json();
}

export async function createEmergencyContact(data: {
  name: string;
  phone: string;
  email?: string | null;
  order_priority?: number;
  share_method?: string;
}): Promise<EmergencyContact> {
  const r = await fetch(`${API}/emergency-contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to create emergency contact");
  return r.json();
}

export async function updateEmergencyContact(id: number, data: Partial<EmergencyContact>): Promise<EmergencyContact> {
  const r = await fetch(`${API}/emergency-contacts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) throw new Error("Failed to update emergency contact");
  return r.json();
}

export async function deleteEmergencyContact(id: number): Promise<void> {
  const r = await fetch(`${API}/emergency-contacts/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete emergency contact");
}
