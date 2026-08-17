import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  api,
  errorMessage,
  type ClassSection,
  type Session,
  type SessionStatus,
} from "../shared/api";
import { parseGradeFromClassName } from "../shared/classLevels";
import { deckForGrade } from "../shared/decks";

const NEW_CLASS_SENTINEL = "__new__";

const STATUS_META: Record<SessionStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "badge-neutral" },
  in_progress: { label: "In Progress", className: "badge-success" },
  completed: { label: "Completed", className: "badge-info" },
};

function StatusBadge({ status }: { status: SessionStatus }) {
  const meta = STATUS_META[status] ?? { label: status, className: "badge-neutral" };
  return (
    <span className={`badge ${meta.className}`}>
      <span className="dot" />
      {meta.label}
    </span>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const [form, setForm] = useState({
    session_number: "",
    date: "",
    scheduled_start_time: "",
    scheduled_end_time: "",
    class_section_id: "",
    instructor_name: "",
  });

  function refresh() {
    api.sessions().then(setSessions).catch((e) => setError(errorMessage(e)));
  }

  function refreshClassSections() {
    api.classSections().then(setClassSections).catch(() => undefined);
  }

  useEffect(() => {
    refresh();
    refreshClassSections();
  }, []);

  // Date, start time, class, and instructor(s) are all mandatory now — this app is purely for
  // taking tests and tracking sessions, so a session with none of that recorded isn't useful,
  // and there's no longer a "quick start, fill in details later" shortcut for it.
  const requiredFilled =
    form.session_number.trim() && form.date.trim() && form.scheduled_start_time.trim() && form.class_section_id && form.instructor_name.trim();

  async function handleAddSession(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!requiredFilled) {
      setError("Please fill in the session number, date, start time, class, and instructor(s) first.");
      return;
    }
    try {
      await api.createSession({
        session_number: Number(form.session_number),
        date: form.date,
        scheduled_start_time: form.scheduled_start_time,
        scheduled_end_time: form.scheduled_end_time || undefined,
        class_section_id: Number(form.class_section_id),
        instructor_name: form.instructor_name.trim(),
      });
      setForm({
        session_number: "",
        date: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        class_section_id: "",
        instructor_name: "",
      });
      refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleAddClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setError(null);
    try {
      const created = await api.createClassSection(newClassName.trim());
      setNewClassName("");
      setShowAddClass(false);
      await refreshClassSections();
      setForm((f) => ({ ...f, class_section_id: String(created.id) }));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleStart(id: number) {
    setError(null);
    try {
      await api.startSession(id);
      navigate(`/console/sessions/${id}`);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleComplete(id: number) {
    setError(null);
    try {
      await api.completeSession(id);
      refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleDelete(id: number, session: Session) {
    // Deleting is unconditional server-side now (including any recorded participants/responses
    // for that session) — this confirmation is the only thing standing between a stray click
    // and permanently losing real student data, so it names what's actually at stake.
    const label = `Session ${session.session_number}`;
    if (!window.confirm(`Delete ${label}? This permanently removes it and any recorded participants or responses. This cannot be undone.`)) {
      return;
    }
    setError(null);
    try {
      await api.deleteSession(id);
      refresh();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function handleAttendanceBlur(id: number, value: string) {
    const attendance_count = value.trim() === "" ? undefined : Number(value);
    if (attendance_count === undefined || Number.isNaN(attendance_count)) return;
    await api.updateSession(id, { attendance_count });
    refresh();
  }

  async function handleNotesBlur(id: number, value: string, previous: string | null) {
    if (value === (previous ?? "")) return;
    await api.updateSession(id, { notes: value });
    refresh();
  }

  // End time is deliberately optional at session creation — a session's actual end can run
  // long or short, so instructors fill this in after the fact (or leave it blank) rather than
  // being forced to guess it upfront.
  async function handleEndTimeBlur(id: number, value: string, previous: string | null) {
    if (value === (previous ?? "")) return;
    await api.updateSession(id, { scheduled_end_time: value || undefined });
    refresh();
  }

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h1>Career Counselling</h1>
          <p className="muted">Session Tracker</p>
        </div>
        <div className="topbar-actions">
          <Link to="/console/session-report">🖨️ Session Records</Link>
          <Link to="/console/report">📋 Psychometry Report</Link>
          <Link to="/console/export">⬇️ Export Data</Link>
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={async () => {
              await api.logout();
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <div className="form-card">
        <h2 style={{ marginBottom: "0.9rem" }}>Add a session</h2>
        <form onSubmit={handleAddSession} className="row">
          <input
            placeholder="No."
            type="number"
            value={form.session_number}
            onChange={(e) => setForm({ ...form, session_number: e.target.value })}
            required
            style={{ width: "4.2rem" }}
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            Start
            <input
              type="time"
              value={form.scheduled_start_time}
              onChange={(e) => setForm({ ...form, scheduled_start_time: e.target.value })}
              required
            />
          </label>
          <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            End
            <input
              type="time"
              value={form.scheduled_end_time}
              onChange={(e) => setForm({ ...form, scheduled_end_time: e.target.value })}
            />
          </label>
          <select
            value={form.class_section_id}
            onChange={(e) => {
              if (e.target.value === NEW_CLASS_SENTINEL) {
                setForm({ ...form, class_section_id: "" });
                setShowAddClass(true);
              } else {
                setForm({ ...form, class_section_id: e.target.value });
              }
            }}
            required
          >
            <option value="">Class...</option>
            {classSections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value={NEW_CLASS_SENTINEL}>+ New class...</option>
          </select>
          <input
            placeholder="Instructor(s), e.g. Arunava, Khushi"
            value={form.instructor_name}
            onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
            required
            style={{ width: "13rem" }}
          />
          <button type="submit" className="btn-primary" disabled={!requiredFilled}>
            + Add Session
          </button>
        </form>

        {showAddClass && (
          <form onSubmit={handleAddClass} className="row" style={{ marginTop: "0.8rem" }}>
            <input
              placeholder="New class/section name (e.g. IX A)"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              autoFocus
              style={{ width: "16rem" }}
            />
            <button type="submit" className="btn-primary">
              Add Class
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setShowAddClass(false);
                setNewClassName("");
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {error && (
        <p className="error-text" style={{ marginTop: "0.8rem" }}>
          {error}
        </p>
      )}

      <div className="table-wrap" style={{ marginTop: "1.25rem" }}>
        <table className="table">
          <thead>
            <tr>
              {["No.", "Date", "Time", "Instructor(s)", "Class", "Deck", "Status", "Attendance", "Activity Notes", "Actions"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              const deck = deckForGrade(s.class_section_name ? parseGradeFromClassName(s.class_section_name) : null);
              return (
                <tr key={s.id}>
                  <td>{s.session_number}</td>
                  <td>{s.date ?? "—"}</td>
                  <td>
                    <div className="row" style={{ gap: "0.3rem", flexWrap: "nowrap" }}>
                      <span className="faint">{s.scheduled_start_time ?? "—"}</span>–
                      <input
                        type="time"
                        title="End time — fine to leave blank and fill in after the session actually runs"
                        key={`end-${s.id}-${s.scheduled_end_time}`}
                        defaultValue={s.scheduled_end_time ?? ""}
                        onBlur={(e) => handleEndTimeBlur(s.id, e.target.value, s.scheduled_end_time)}
                        style={{ width: "6.5rem" }}
                      />
                    </div>
                  </td>
                  <td>{s.instructor_name ?? "—"}</td>
                  <td>{s.class_section_name ?? "—"}</td>
                  <td>{deck ? `Class ${deck.grade}` : <span className="faint">no deck</span>}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      key={`att-${s.id}-${s.attendance_count}`}
                      defaultValue={s.attendance_count ?? ""}
                      onBlur={(e) => handleAttendanceBlur(s.id, e.target.value)}
                      style={{ width: "3.8rem" }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="What was covered..."
                      key={`notes-${s.id}-${s.notes}`}
                      defaultValue={s.notes ?? ""}
                      onBlur={(e) => handleNotesBlur(s.id, e.target.value, s.notes)}
                      style={{ width: "11rem" }}
                    />
                  </td>
                  <td>
                    <div className="row" style={{ flexWrap: "nowrap" }}>
                      {s.status === "scheduled" && (
                        <button className="btn-primary btn-sm" onClick={() => handleStart(s.id)}>
                          Start
                        </button>
                      )}
                      {s.status === "in_progress" && (
                        <>
                          <button className="btn-sm" onClick={() => navigate(`/console/sessions/${s.id}`)}>
                            Manage
                          </button>
                          <button className="btn-sm" onClick={() => handleComplete(s.id)}>
                            Complete
                          </button>
                        </>
                      )}
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(s.id, s)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {sessions.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-state">
                  No sessions yet — add one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
