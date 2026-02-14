import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPeopleForRecognition, summarizeAndSaveConversation } from "../api";
import type { PersonForRecognition } from "../api";
import {
  loadFaceApiModels,
  detectAndMatch,
  type FaceMatch,
  type DetectionResult,
} from "../faceRecognition";

const FPS = 3;
const MAX_TRANSCRIPT_LEN = 6000;
const LAST_SAVED_KEY = "live_last_saved_conversation";

type LastSavedConversation = {
  personId: number;
  personName: string;
  summary: string;
  date: string;
};

function loadLastSaved(): LastSavedConversation | null {
  try {
    const raw = sessionStorage.getItem(LAST_SAVED_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastSavedConversation;
  } catch {
    return null;
  }
}

function saveLastSaved(data: LastSavedConversation) {
  try {
    sessionStorage.setItem(LAST_SAVED_KEY, JSON.stringify(data));
  } catch (_) {}
}

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

export default function LiveView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<InstanceType<Window["SpeechRecognition"]> | null>(null);
  const transcriptBufferRef = useRef<string>("");
  const listeningActiveRef = useRef(true);

  const [error, setError] = useState<string | null>(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [people, setPeople] = useState<PersonForRecognition[]>([]);
  const [matches, setMatches] = useState<FaceMatch[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [listeningRequested, setListeningRequested] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<LastSavedConversation | null>(() => loadLastSaved());

  const navigate = useNavigate();

  // Load models and fetch people
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await loadFaceApiModels();
      if (cancelled) return;
      if (!ok) {
        setError("Face recognition models could not be loaded. Add model files to public/models (see README).");
        return;
      }
      setModelsReady(true);
      try {
        const list = await getPeopleForRecognition();
        if (!cancelled) setPeople(list);
      } catch (e) {
        if (!cancelled) setError("Could not load people. Is the API running?");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Start camera
  useEffect(() => {
    if (!modelsReady || !videoRef.current) return;
    let s: MediaStream | null = null;
    (async () => {
      try {
        s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setStream(s);
        }
      } catch (e) {
        setError("Camera access denied or unavailable.");
      }
    })();
    return () => {
      if (s) s.getTracks().forEach((t) => t.stop());
    };
  }, [modelsReady]);

  // Speech recognition: only when user has pressed "Start listening"
  useEffect(() => {
    if (!stream || !listeningRequested) return;
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setSpeechError("Speech recognition not supported in this browser.");
      setListeningRequested(false);
      return;
    }
    const rec = new SpeechRecognitionCtor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let chunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        chunk += e.results[i][0].transcript;
      }
      if (chunk) {
        transcriptBufferRef.current += chunk;
        if (transcriptBufferRef.current.length > MAX_TRANSCRIPT_LEN) {
          transcriptBufferRef.current = transcriptBufferRef.current.slice(-MAX_TRANSCRIPT_LEN);
        }
        setTranscript(transcriptBufferRef.current);
      }
    };
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "not-allowed") setSpeechError("Microphone access denied.");
      else if (e.error !== "aborted" && e.error !== "no-speech") setSpeechError("Speech error.");
    };
    rec.onend = () => {
      if (listeningActiveRef.current) {
        try {
          rec.start();
        } catch (_) {}
      }
    };
    recognitionRef.current = rec;
    listeningActiveRef.current = true;
    setSpeechError(null);
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      setSpeechError("Could not start microphone.");
      setListeningRequested(false);
    }
    return () => {
      listeningActiveRef.current = false;
      setListening(false);
      try {
        rec.abort();
      } catch (_) {}
      recognitionRef.current = null;
    };
  }, [stream, listeningRequested]);

  const runDetection = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || people.length === 0) return;
    try {
      const result: DetectionResult = await detectAndMatch(video, people);
      setMatches(result.matches);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const m of result.matches) {
          ctx.strokeStyle = "#0d9488";
          ctx.lineWidth = 3;
          ctx.strokeRect(m.box.x, m.box.y, m.box.width, m.box.height);
          ctx.fillStyle = "rgba(13, 148, 136, 0.8)";
          ctx.font = "bold 18px system-ui, sans-serif";
          const label = `${m.name} — ${m.relationship}`;
          const tw = ctx.measureText(label).width;
          ctx.fillRect(m.box.x, m.box.y - 28, tw + 12, 24);
          ctx.fillStyle = "#fff";
          ctx.fillText(label, m.box.x + 6, m.box.y - 10);
        }
      }
    } catch (_) {}
  }, [people]);

  useEffect(() => {
    if (!stream || !videoRef.current || people.length === 0) return;
    const interval = setInterval(runDetection, 1000 / FPS);
    return () => clearInterval(interval);
  }, [stream, people, runDetection]);

  const handleAreaClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || matches.length === 0) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * video.videoWidth;
    const y = ((e.clientY - rect.top) / rect.height) * video.videoHeight;
    const clicked = matches.find(
      (m) =>
        x >= m.box.x &&
        x <= m.box.x + m.box.width &&
        y >= m.box.y &&
        y <= m.box.y + m.box.height
    );
    if (!clicked) return;

    const text = transcript.trim();
    if (text && !saving) {
      setSaving(true);
      try {
        const conversation = await summarizeAndSaveConversation(clicked.personId, text);
        transcriptBufferRef.current = "";
        setTranscript("");
        const saved: LastSavedConversation = {
          personId: clicked.personId,
          personName: clicked.name,
          summary: conversation.summary,
          date: conversation.date,
        };
        setLastSaved(saved);
        saveLastSaved(saved);
      } catch (err) {
        alert((err as Error).message || "Failed to save conversation.");
      } finally {
        setSaving(false);
      }
    } else {
      navigate(`/conversation/${clicked.personId}`);
    }
  };

  const clearTranscript = () => {
    transcriptBufferRef.current = "";
    setTranscript("");
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-teal-50">
        <p className="text-lg text-teal-900 mb-4 text-center">{error}</p>
        <a href="/" className="min-h-touch min-w-touch px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold">
          Back
        </a>
      </div>
    );
  }

  if (!modelsReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-teal-50">
        <p className="text-lg text-teal-900">Loading face recognition...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <header className="bg-teal-700 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Who is this?</h1>
        <a
          href="/"
          className="min-h-touch min-w-touch px-4 py-2 bg-teal-600 rounded-lg font-medium"
        >
          Home
        </a>
      </header>

      <main className="flex-1 relative flex flex-col justify-center items-center p-4 gap-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 items-start justify-center">
          <div className="w-full max-w-2xl flex-shrink-0">
        <div
          className="relative rounded-xl overflow-hidden shadow-xl bg-black max-w-2xl w-full cursor-pointer"
          onClick={handleAreaClick}
          role="img"
          aria-label="Live camera with face labels. Tap a face to save conversation and see last conversation."
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto block"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Listening: button to turn on, then transcript bar */}
        <div className="w-full mt-3 p-3 bg-white rounded-xl shadow border border-teal-100">
          {!listeningRequested ? (
            <div className="flex flex-col gap-2">
              <p className="text-teal-700 text-sm">Press the button when you want to capture conversation, then tap a face to save it for that person.</p>
              <button
                type="button"
                onClick={() => setListeningRequested(true)}
                className="min-h-touch px-4 py-2 bg-teal-600 text-white rounded-lg font-medium w-full"
              >
                Start listening for conversation
              </button>
            </div>
          ) : speechError ? (
            <div className="flex flex-col gap-2">
              <p className="text-amber-700 text-sm">{speechError}</p>
              <button
                type="button"
                onClick={() => { setSpeechError(null); setListeningRequested(false); }}
                className="min-h-touch px-4 py-2 bg-gray-200 rounded-lg font-medium"
              >
                Turn off
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-teal-700 text-sm font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${listening ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                  {listening ? "Listening…" : "Starting…"}
                </span>
                <div className="flex gap-2">
                  {transcript.length > 0 && (
                    <button type="button" onClick={clearTranscript} className="text-sm text-teal-600 hover:underline">Clear</button>
                  )}
                  <button
                    type="button"
                    onClick={() => setListeningRequested(false)}
                    className="text-sm text-teal-600 hover:underline font-medium"
                  >
                    Stop listening
                  </button>
                </div>
              </div>
              {transcript.length > 0 && (
                <p className="text-teal-900 text-sm line-clamp-2 break-words">
                  {transcript.slice(-400)}
                </p>
              )}
              <p className="text-teal-500 text-xs mt-1">
                Tap a face to summarize this conversation and save it as their last conversation.
              </p>
            </>
          )}
        </div>
          </div>

          {/* Last conversation saved — shown in the white space */}
          {lastSaved && (
            <div className="w-full max-w-md flex-shrink-0 bg-white rounded-xl shadow-lg border-2 border-teal-200 p-4">
              <h2 className="text-teal-800 font-semibold text-sm uppercase tracking-wide mb-2">Last conversation saved</h2>
              <p className="font-semibold text-teal-900">{lastSaved.personName}</p>
              <p className="text-teal-600 text-xs mb-2">{lastSaved.date}</p>
              <p className="text-teal-800 text-sm whitespace-pre-wrap mb-4">{lastSaved.summary}</p>
              <button
                type="button"
                onClick={() => navigate(`/conversation/${lastSaved.personId}`)}
                className="min-h-touch w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-medium"
              >
                View conversation
              </button>
            </div>
          )}
        </div>

        {saving && (
          <p className="text-teal-700 text-sm">Saving and summarizing…</p>
        )}
      </main>
    </div>
  );
}
