import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CalmModeProvider } from "./context/CalmModeContext";
import Home from "./pages/Home";
import LiveView from "./pages/LiveView";
import PeopleList from "./pages/PeopleList";
import PersonForm from "./pages/PersonForm";
import ConversationView from "./pages/ConversationView";
import RemindersPage from "./pages/RemindersPage";
import EmergencyPage from "./pages/EmergencyPage";
import ReminderNotifier from "./ReminderNotifier";

export default function App() {
  return (
    <BrowserRouter>
      <CalmModeProvider>
      <ReminderNotifier />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<LiveView />} />
        <Route path="/people" element={<PeopleList />} />
        <Route path="/people/new" element={<PersonForm />} />
        <Route path="/people/:id/edit" element={<PersonForm />} />
        <Route path="/conversation/:personId" element={<ConversationView />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
      </Routes>
      </CalmModeProvider>
    </BrowserRouter>
  );
}
