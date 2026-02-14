import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <header className="bg-teal-700 text-white px-4 py-4">
        <h1 className="text-2xl font-bold">Remember Me</h1>
        <p className="text-teal-100 text-sm mt-1">Your companion for people and moments</p>
      </header>

      <main className="flex-1 p-6 flex flex-col gap-4 max-w-lg mx-auto w-full">
        <Link
          to="/live"
          className="min-h-touch w-full py-4 px-6 bg-teal-600 text-white rounded-xl font-semibold text-lg shadow-md hover:bg-teal-500 transition text-center"
        >
          Who is this?
        </Link>
        <Link
          to="/people"
          className="min-h-touch w-full py-4 px-6 bg-white text-teal-800 border-2 border-teal-200 rounded-xl font-semibold text-lg shadow hover:bg-teal-50 transition text-center"
        >
          People
        </Link>
        <Link
          to="/reminders"
          className="min-h-touch w-full py-4 px-6 bg-white text-teal-800 border-2 border-teal-200 rounded-xl font-semibold text-lg shadow hover:bg-teal-50 transition text-center"
        >
          Reminders
        </Link>
        <Link
          to="/emergency"
          className="min-h-touch w-full py-4 px-6 bg-emergency text-white rounded-xl font-semibold text-lg shadow-md hover:bg-red-600 transition text-center"
        >
          Emergency
        </Link>
      </main>
    </div>
  );
}
