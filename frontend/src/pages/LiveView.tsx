import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPeopleForRecognition } from "../api";
import type { PersonForRecognition } from "../api";
import {
  loadFaceApiModels,
  detectAndMatch,
  type FaceMatch,
  type DetectionResult,
} from "../faceRecognition";

const FPS = 3; // run recognition every ~333ms to balance CPU and responsiveness

export default function LiveView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [people, setPeople] = useState<PersonForRecognition[]>([]);
  const [matches, setMatches] = useState<FaceMatch[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
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
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStream(stream);
        }
      } catch (e) {
        setError("Camera access denied or unavailable.");
      }
    })();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [modelsReady]);

  // Run detection loop
  const runDetection = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || people.length === 0) return;
    try {
      const result: DetectionResult = await detectAndMatch(video, people);
      setMatches(result.matches);
      // Draw boxes on canvas
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
    } catch (_) {
      // ignore single-frame errors
    }
  }, [people]);

  useEffect(() => {
    if (!stream || !videoRef.current || people.length === 0) return;
    const interval = setInterval(runDetection, 1000 / FPS);
    return () => clearInterval(interval);
  }, [stream, people, runDetection]);

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
    if (clicked) navigate(`/conversation/${clicked.personId}`);
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

      <main className="flex-1 relative flex justify-center items-center p-4">
        <div
          className="relative rounded-xl overflow-hidden shadow-xl bg-black max-w-2xl w-full cursor-pointer"
          onClick={handleAreaClick}
          role="img"
          aria-label="Live camera with face labels. Tap a face to see last conversation."
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
      </main>

      <p className="text-center text-teal-800 text-sm px-4 pb-4">
        Tap a face to see last conversation. Add people from Home first.
      </p>
    </div>
  );
}
