import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getCalmReassurance, getCalmReply, getCalmSpeakAudio } from "../api";

const PAUSE_BETWEEN_LINES_MS = 900;
/** Delay before starting mic after we finish speaking, so we don't hear our own TTS. */
const POST_SPEECH_DELAY_MS = 2500;

export type CalmConversationTurn = { role: "user" | "assistant"; content: string };

type CalmModeContextValue = {
  active: boolean;
  /** Chat history for display. */
  conversation: CalmConversationTurn[];
  /** Lines of the current assistant message (for highlighting while speaking). */
  currentAssistantLines: string[];
  speakingLineIndex: number;
  listening: boolean;
  activate: (options?: { location?: string; nearbyPerson?: string }) => Promise<void>;
  deactivate: () => void;
};

const CalmModeContext = createContext<CalmModeContextValue | null>(null);

export function useCalmMode(): CalmModeContextValue {
  const ctx = useContext(CalmModeContext);
  if (!ctx) throw new Error("useCalmMode must be used within CalmModeProvider");
  return ctx;
}

// Speech recognition types (same as LiveView)
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: Event & { resultIndex: number; results: SpeechRecognitionResultList }) => void) | null;
  onerror: ((e: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

export function CalmModeProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [conversation, setConversation] = useState<CalmConversationTurn[]>([]);
  const [currentAssistantLines, setCurrentAssistantLines] = useState<string[]>([]);
  const [speakingLineIndex, setSpeakingLineIndex] = useState(-1);
  const [listening, setListening] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const cancelledRef = useRef(false);
  const calmOptionsRef = useRef<{ location?: string; nearbyPerson?: string }>({});
  const conversationRef = useRef<CalmConversationTurn[]>([]);
  const replyingRef = useRef(false);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  const stopAllSpeech = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setListening(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    cancelledRef.current = true;
    replyingRef.current = false;
  }, []);

  const deactivate = useCallback(() => {
    stopAllSpeech();
    setIsExiting(true);
    setTimeout(() => {
      setActive(false);
      setConversation([]);
      setCurrentAssistantLines([]);
      setSpeakingLineIndex(-1);
      setListening(false);
      setIsExiting(false);
    }, 300);
  }, [stopAllSpeech]);

  function speakWithWebSpeech(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1;
      u.volume = 1;
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("en")) || window.speechSynthesis.getVoices()[0];
      if (voice) u.voice = voice;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function playLine(line: string, useElevenLabs: boolean): Promise<void> {
    if (cancelledRef.current) return;
    if (useElevenLabs) {
      try {
        const blob = await getCalmSpeakAudio(line);
        if (cancelledRef.current || !blob?.size) {
          await speakWithWebSpeech(line);
          return;
        }
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
            audioRef.current = null;
            resolve();
          };
          audio.onerror = () => resolve();
          audio.play().catch(reject);
        });
        return;
      } catch {
        await speakWithWebSpeech(line);
      }
    } else {
      await speakWithWebSpeech(line);
    }
  }

  async function speakAssistantLines(lines: string[]): Promise<void> {
    const useElevenLabs = true;
    for (let i = 0; i < lines.length && !cancelledRef.current; i++) {
      setSpeakingLineIndex(i);
      await playLine(lines[i], useElevenLabs);
      if (cancelledRef.current) break;
      if (i < lines.length - 1) {
        await new Promise((r) => setTimeout(r, PAUSE_BETWEEN_LINES_MS));
      }
    }
    if (!cancelledRef.current) setSpeakingLineIndex(-1);
  }

  const startListening = useCallback(() => {
    if (cancelledRef.current || typeof window === "undefined") return;
    const Ctor = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance; webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
    if (!Ctor) {
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    let finalTranscript = "";

    rec.onresult = (e: Event & { resultIndex: number; results: SpeechRecognitionResultList }) => {
      const results = e.results;
      for (let i = e.resultIndex; i < results.length; i++) {
        const item = results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        }
      }
    };

    rec.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      if (cancelledRef.current) return;
      const userText = (finalTranscript || "").trim();
      if (userText) {
        if (replyingRef.current) return;
        replyingRef.current = true;
        const userTurn = { role: "user" as const, content: userText };
        const withUser = [...conversationRef.current, userTurn];
        conversationRef.current = withUser;
        setConversation(withUser);
        const opts = calmOptionsRef.current;
        const history = withUser.map((t) => ({ role: t.role, content: t.content }));
        getCalmReply({
          userMessage: userText,
          location: opts.location ?? null,
          nearbyPerson: opts.nearbyPerson ?? null,
          history,
        })
          .then((res) => {
            if (cancelledRef.current) return;
            const lines = res.messages?.length ? res.messages : [res.message];
            const full = res.message || lines.join(" ");
            setConversation((p) => [...p, { role: "assistant", content: full }]);
            setCurrentAssistantLines(lines);
            speakAssistantLines(lines).then(() => {
              if (cancelledRef.current) return;
              setTimeout(() => {
                if (!cancelledRef.current) startListening();
              }, POST_SPEECH_DELAY_MS);
            });
          })
          .catch(() => {
            if (cancelledRef.current) return;
            const fallback = "You're safe. I'm here with you.";
            setConversation((p) => [...p, { role: "assistant", content: fallback }]);
            setCurrentAssistantLines([fallback]);
            speakAssistantLines([fallback]).then(() => {
              if (cancelledRef.current) return;
              setTimeout(() => {
                if (!cancelledRef.current) startListening();
              }, POST_SPEECH_DELAY_MS);
            });
          })
          .finally(() => {
            replyingRef.current = false;
          });
      } else {
        startListening();
      }
    };

    rec.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
      if (!cancelledRef.current) startListening();
    };

    setListening(true);
    try {
      rec.start();
    } catch (_) {
      setListening(false);
    }
  }, []);

  const activate = useCallback(
    async (options?: { location?: string; nearbyPerson?: string }) => {
      stopAllSpeech();
      cancelledRef.current = false;
      replyingRef.current = false;
      calmOptionsRef.current = options ?? {};
      setActive(true);
      setConversation([]);
      conversationRef.current = [];
      setCurrentAssistantLines([]);
      setSpeakingLineIndex(-1);
      setListening(false);

      let fullMessage = "You're safe. I'm here with you. What's on your mind?";
      let lines: string[] = ["You're safe.", "I'm here with you.", "What's on your mind?"];
      try {
        const res = await getCalmReassurance({
          location: options?.location ?? null,
          nearbyPerson: options?.nearbyPerson ?? null,
        });
        fullMessage = res.message || fullMessage;
        lines = res.messages?.length ? res.messages : [fullMessage];
      } catch {
        // Keep fallback
      }
      setConversation([{ role: "assistant", content: fullMessage }]);
      setCurrentAssistantLines(lines);

      await speakAssistantLines(lines);
      if (!cancelledRef.current) {
        setTimeout(() => {
          if (!cancelledRef.current) startListening();
        }, POST_SPEECH_DELAY_MS);
      }
    },
    [stopAllSpeech, startListening],
  );

  const value: CalmModeContextValue = {
    active,
    conversation,
    currentAssistantLines,
    speakingLineIndex,
    listening,
    activate,
    deactivate,
  };

  return (
    <CalmModeContext.Provider value={value}>
      {children}
      {active && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 transition-opacity duration-300 ${
            isExiting ? "opacity-0" : "opacity-100"
          }`}
          aria-live="polite"
          role="dialog"
          aria-label="Calm Mode conversation"
          onClick={(e) => e.target === e.currentTarget && deactivate()}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-2xl shadow-card p-6 bg-white/98 border border-gray-100/80 transition-all duration-300 ${
              isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ boxShadow: "0 8px 32px rgba(22, 101, 52, 0.12)" }}
          >
            <div className="space-y-4">
              {conversation.map((turn, idx) => (
                <div
                  key={idx}
                  className={`flex ${turn.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      turn.role === "user"
                        ? "bg-recall-green text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-base md:text-lg font-medium leading-relaxed whitespace-pre-wrap">
                      {turn.content}
                    </p>
                  </div>
                </div>
              ))}
              {listening && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 bg-calm/20 text-calm font-medium">
                    Listening…
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-recall-green mt-4 text-center font-medium">
              Tap &ldquo;I feel confused&rdquo; again to close
            </p>
          </div>
        </div>
      )}
    </CalmModeContext.Provider>
  );
}
