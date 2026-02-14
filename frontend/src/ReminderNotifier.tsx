import { useEffect, useState, useRef } from "react";
import { getReminders, type Reminder } from "./api";

const CHECK_INTERVAL_MS = 60 * 1000; // every minute
const SHOWN_KEY = "reminder_shown";

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function wasShownToday(reminderId: number): boolean {
  try {
    const raw = localStorage.getItem(SHOWN_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw) as Record<string, string>;
    return data[`${reminderId}`] === todayKey();
  } catch {
    return false;
  }
}

function markShownToday(reminderId: number): void {
  try {
    const raw = localStorage.getItem(SHOWN_KEY) || "{}";
    const data = JSON.parse(raw) as Record<string, string>;
    data[`${reminderId}`] = todayKey();
    localStorage.setItem(SHOWN_KEY, JSON.stringify(data));
  } catch (_) {}
}

function currentTimeHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Normalize "9:00" to "09:00" for comparison. */
function normalizeHHMM(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Returns true if reminder at `time` (H:MM or HH:MM) should fire right now (current minute). */
function isTimeNow(time: string): boolean {
  const now = currentTimeHHMM();
  return now === normalizeHHMM(time);
}

export default function ReminderNotifier() {
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
  const permissionAsked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    if (!permissionAsked.current && Notification.permission === "default") {
      permissionAsked.current = true;
      Notification.requestPermission().catch(() => {});
    }

    const check = async () => {
      try {
        const list = await getReminders();
        const enabled = list.filter((r) => r.enabled);
        const now = currentTimeHHMM();

        for (const r of enabled) {
          if (!isTimeNow(r.time)) continue;
          if (wasShownToday(r.id)) continue;

          markShownToday(r.id);

          if (Notification.permission === "granted") {
            try {
              new Notification("Reminder: " + r.label, {
                body: `Scheduled at ${r.time}`,
                tag: `reminder-${r.id}-${todayKey()}`,
              });
            } catch (_) {}
          }

          setActiveReminder(r);
          break; // one at a time in-app
        }
      } catch (_) {}
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (!activeReminder) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-teal-800 text-white rounded-xl shadow-lg p-4 flex items-center justify-between gap-4"
      role="alert"
    >
      <div>
        <p className="font-semibold">Reminder</p>
        <p className="text-teal-200">{activeReminder.label}</p>
        <p className="text-teal-300 text-sm mt-1">{activeReminder.time}</p>
      </div>
      <button
        type="button"
        onClick={() => setActiveReminder(null)}
        className="min-h-touch px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg font-medium shrink-0"
      >
        OK
      </button>
    </div>
  );
}
