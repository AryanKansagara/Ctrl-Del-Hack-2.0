import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function IconCamera({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function IconPeople({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function IconClock({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconEmergency({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 6v4h2V8h-2zm0 6v2h2v-2h-2z" clipRule="evenodd" />
    </svg>
  );
}

function IconBubble({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function IconShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-6 pb-16">
        {/* Hero: oval + recall */}
        <div className="flex flex-col items-center justify-center pt-6 pb-10">
          <div className="w-full max-w-xl flex flex-col items-center justify-center py-14 px-16 rounded-pill bg-recall-mint">
            {/* Decorative dots — circular pattern above text */}
            <div className="relative w-16 h-12 mb-5 flex items-center justify-center">
              <div className="absolute w-2 h-2 rounded-full bg-recall-green top-0 left-1/2 -translate-x-1/2" />
              <div className="absolute w-2 h-2 rounded-full bg-recall-green top-2 left-2" />
              <div className="absolute w-2 h-2 rounded-full bg-recall-green top-2 right-2" />
              <div className="absolute w-2 h-2 rounded-full bg-recall-green bottom-2 left-4" />
              <div className="absolute w-2 h-2 rounded-full bg-recall-green bottom-2 right-4" />
              <div className="absolute w-2 h-2 rounded-full bg-recall-green bottom-0 left-1/2 -translate-x-1/2" />
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold text-recall-green tracking-tight">recall</h2>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-5 max-w-4xl w-full mb-20">
          <Link
            to="/live"
            className="min-h-touch min-w-[140px] flex flex-col items-center justify-center gap-2 py-5 px-6 bg-white border border-gray-200 rounded-card shadow-card hover:border-gray-300 transition"
          >
            <IconCamera className="w-8 h-8 text-gray-700" />
            <span className="text-sm font-medium text-gray-800">Identify Person</span>
          </Link>
          <Link
            to="/people"
            className="min-h-touch min-w-[140px] flex flex-col items-center justify-center gap-2 py-5 px-6 bg-white border border-gray-200 rounded-card shadow-card hover:border-gray-300 transition"
          >
            <IconPeople className="w-8 h-8 text-gray-700" />
            <span className="text-sm font-medium text-gray-800">My People</span>
          </Link>
          <Link
            to="/reminders"
            className="min-h-touch min-w-[140px] flex flex-col items-center justify-center gap-2 py-5 px-6 bg-white border border-gray-200 rounded-card shadow-card hover:border-gray-300 transition"
          >
            <IconClock className="w-8 h-8 text-gray-700" />
            <span className="text-sm font-medium text-gray-800">Reminders</span>
          </Link>
          <Link
            to="/emergency"
            className="min-h-touch min-w-[140px] flex flex-col items-center justify-center gap-2 py-5 px-6 bg-gray-800 border border-gray-800 rounded-card shadow-card hover:bg-gray-700 transition"
          >
            <span className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <IconEmergency className="w-5 h-5 text-white" />
            </span>
            <span className="text-sm font-medium text-white">Emergency</span>
          </Link>
        </div>

        {/* How it helps */}
        <h3 className="text-3xl font-bold text-gray-900 mb-10">How it helps</h3>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-cardIcon-orange flex items-center justify-center mb-4">
              <IconCamera className="w-6 h-6 text-gray-800" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Recognize Faces</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Show a photo or use your camera. The app tells you who they are and how you know them.
            </p>
          </div>
          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-cardIcon-blue flex items-center justify-center mb-4">
              <IconBubble className="w-6 h-6 text-gray-800" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Recall Conversations</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              See what you last talked about with each person, so you can pick up naturally.
            </p>
          </div>
          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-cardIcon-green flex items-center justify-center mb-4">
              <IconShield className="w-6 h-6 text-gray-800" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Private & Safe</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              All data stays on your device. No cloud, no sharing, your memories, your control.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
