import { useCalmMode } from "../context/CalmModeContext";

export default function CalmModeButton() {
  const { active, activate, deactivate } = useCalmMode();

  const handleClick = () => {
    if (active) {
      deactivate();
    } else {
      activate();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        min-h-touch px-4 py-2 rounded-full font-medium text-base transition
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-recall-green/40
        ${active
          ? "bg-recall-green text-white shadow-md ring-2 ring-recall-green/30"
          : "bg-calm text-white hover:bg-calm/90 shadow-card"
        }
      `}
      aria-pressed={active}
      aria-label={active ? "Calm Mode is on. Click to turn off." : "I feel confused. Click for reassurance."}
    >
      {active ? "Calm Mode on" : "I feel confused"}
    </button>
  );
}
