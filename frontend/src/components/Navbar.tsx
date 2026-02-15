import { Link } from "react-router-dom";
import CalmModeButton from "./CalmModeButton";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
      <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition">
        Recall
      </Link>
      <nav className="flex items-center gap-4 flex-wrap">
        <CalmModeButton />
        <Link
          to="/live"
          className="min-h-touch px-2 py-2 text-recall-nav font-medium text-base hover:text-gray-900 transition"
        >
          Identify
        </Link>
        <Link
          to="/people"
          className="min-h-touch px-2 py-2 text-recall-nav font-medium text-base hover:text-gray-900 transition"
        >
          People
        </Link>
        <Link
          to="/reminders"
          className="min-h-touch px-2 py-2 text-recall-nav font-medium text-base hover:text-gray-900 transition"
        >
          Reminders
        </Link>
        <Link
          to="/emergency"
          className="min-h-touch px-4 py-2 rounded-full bg-recall-mint text-gray-800 font-medium text-base hover:bg-recall-mint/90 transition"
        >
          Emergency
        </Link>
      </nav>
    </header>
  );
}
