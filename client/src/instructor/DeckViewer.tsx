import { useState } from "react";
import { deckForGrade } from "../shared/decks";
import { labsForGrade } from "../shared/labs";

type Mode = "deck" | "labs";

export function DeckViewer({ grade }: { grade: number | null }) {
  const deck = deckForGrade(grade);
  const labs = labsForGrade(grade);

  // Default to whichever content type this grade actually has; a grade with only labs (or,
  // in future, only a deck) shouldn't open on an empty tab.
  const [mode, setMode] = useState<Mode>(deck ? "deck" : "labs");
  const [selectedLabId, setSelectedLabId] = useState<string | null>(labs[0]?.id ?? null);
  const [presenting, setPresenting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!deck && labs.length === 0) {
    return (
      <div className="section">
        <h2>Slide Deck</h2>
        <p className="empty-state">
          No slide deck or labs found for this session's class{grade ? ` (Class ${grade})` : ""}.
          Decks exist for Class 6–12; interactive labs currently exist for Class 7.
        </p>
      </div>
    );
  }

  const selectedLab = labs.find((l) => l.id === selectedLabId) ?? null;
  const active = mode === "deck" ? deck : selectedLab;

  function switchMode(next: Mode) {
    setMode(next);
    setLoaded(false);
    if (next === "labs" && !selectedLabId && labs.length > 0) {
      setSelectedLabId(labs[0].id);
    }
  }

  return (
    <div className={presenting ? undefined : "section"}>
      {!presenting && (
        <div className="section-header" style={{ flexWrap: "wrap", gap: "0.6rem" }}>
          <div className="row" style={{ gap: "0.4rem" }}>
            {deck && (
              <button
                type="button"
                className={`btn-sm ${mode === "deck" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => switchMode("deck")}
              >
                📊 Slide Deck
              </button>
            )}
            {labs.length > 0 && (
              <button
                type="button"
                className={`btn-sm ${mode === "labs" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => switchMode("labs")}
              >
                🧪 Interactive Labs
              </button>
            )}
          </div>
          {active && (
            <button className="btn-primary btn-sm" onClick={() => setPresenting(true)}>
              🖥️ Present (fullscreen)
            </button>
          )}
        </div>
      )}

      {!presenting && mode === "labs" && labs.length > 0 && (
        <div className="row" style={{ flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.7rem" }}>
          {labs.map((l) => (
            <button
              key={l.id}
              type="button"
              title={l.prompt}
              className={`btn-sm ${l.id === selectedLabId ? "btn-primary" : ""}`}
              onClick={() => {
                setSelectedLabId(l.id);
                setLoaded(false);
              }}
            >
              {l.order}. {l.title} <span className="faint">· {l.minutes}</span>
            </button>
          ))}
        </div>
      )}

      {active ? (
        <div
          style={{
            position: presenting ? "fixed" : "relative",
            inset: presenting ? 0 : undefined,
            zIndex: presenting ? 1000 : undefined,
            background: "#000",
            borderRadius: presenting ? 0 : "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: presenting ? "none" : "var(--shadow)",
            height: presenting ? "100vh" : "70vh",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <iframe
            key={active.file}
            src={active.file}
            title={active.title}
            onLoad={() => setLoaded(true)}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            allow="fullscreen"
          />
          {presenting && (
            <button
              className="btn-sm"
              onClick={() => setPresenting(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 1001,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              ✕ Exit
            </button>
          )}
        </div>
      ) : (
        <p className="empty-state">Choose a lab above to open it.</p>
      )}

      {!presenting && mode === "deck" && deck && (
        <p className="faint" style={{ marginTop: "0.5rem" }}>
          Click into the deck and use arrow keys / clicks to navigate — it has its own built-in slide transitions.
        </p>
      )}
      {!presenting && mode === "labs" && selectedLab && (
        <p className="faint" style={{ marginTop: "0.5rem" }}>
          Ask: “{selectedLab.prompt}” — touch or mouse only, no typing needed. Reset button at the bottom right returns it to its opening state.
        </p>
      )}
    </div>
  );
}
