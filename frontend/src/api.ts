const API = "/api";

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
  const r = await fetch(`${API}/people`);
  if (!r.ok) throw new Error("Failed to fetch people");
  return r.json();
}

export async function getPeopleForRecognition(): Promise<PersonForRecognition[]> {
  const r = await fetch(`${API}/people/for-recognition`);
  if (!r.ok) throw new Error("Failed to fetch people for recognition");
  return r.json();
}

export async function getPerson(id: number): Promise<Person> {
  const r = await fetch(`${API}/people/${id}`);
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
  const r = await fetch(`${API}/people/${personId}/last-conversation`);
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

export async function getReminders(): Promise<Reminder[]> {
  const r = await fetch(`${API}/reminders`);
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
  const r = await fetch(`${API}/emergency-contacts`);
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
