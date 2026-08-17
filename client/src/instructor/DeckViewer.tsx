import { useState } from "react";
import { deckForGrade } from "../shared/decks";

export function DeckViewer({ grade }: { grade: number | null }) {
  const [presenting, setPresenting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const deck = deckForGrade(grade);

  if (!deck) {
    return (
      <div className="section">
        <h2>Slide Deck</h2>
        <p className="empty-state">
          No slide deck found for this session's class{grade ? ` (Class ${grade})` : ""}. Decks exist for Class 6–12.
        </p>
      </div>
    );
  }

  return (
    <div className={presenting ? undefined : "section"}>
      {!presenting && (
        <div className="section-header">
          <h2 style={{ margin: 0 }}>{deck.title}</h2>
          <button className="btn-primary btn-sm" onClick={() => setPresenting(true)}>
            🖥️ Present (fullscreen)
          </button>
        </div>
      )}
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
          key={deck.file}
          src={deck.file}
          title={deck.title}
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
      {!presenting && (
        <p className="faint" style={{ marginTop: "0.5rem" }}>
          Click into the deck and use arrow keys / clicks to navigate — it has its own built-in slide transitions.
        </p>
      )}
    </div>
  );
}
