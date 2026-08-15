import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  api,
  type ClassSection,
  type CurriculumTopic,
  type Session,
} from "../shared/api";

const NEW_CLASS_SENTINEL = "__new__";

export function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [topics, setTopics] = useState<CurriculumTopic[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const [form, setForm] = useState({
    session_number: "",
    date: "",
    scheduled_start_time: "",
    scheduled_end_time: "",
    topic_id: "",
    class_section_id: "",
    instructor_name: "",
  });

  function refresh() {
    api.sessions().then(setSessions).catch((e) => setError(String(e)));
  }

  function refreshClassSections() {
    api.classSections().then(setClassSections).catch(() => undefined);
  }

  useEffect(() => {
    refresh();
    api.curriculum().then(setTopics).catch(() => undefined);
    refreshClassSections();
  }, []);

  async function handleAddSession(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createSession({
        session_number: Number(form.session_number),
        date: form.date || undefined,
        scheduled_start_time: form.scheduled_start_time || undefined,
        scheduled_end_time: form.scheduled_end_time || undefined,
        topic_id: form.topic_id ? Number(form.topic_id) : undefined,
        class_section_id: form.class_section_id ? Number(form.class_section_id) : undefined,
        instructor_name: form.instructor_name || undefined,
      });
      setForm({
        session_number: "",
        date: "",
        scheduled_start_time: "",
        scheduled_end_time: "",
        topic_id: "",
        class_section_id: "",
        instructor_name: "",
      });
      refresh();
    } catch (err) {
      setError(String(err));
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
      setError(String(err));
    }
  }

  async function handleStart(id: number) {
    await api.startSession(id);
    navigate(`/console/sessions/${id}`);
  }

  async function handleComplete(id: number) {
    await api.completeSession(id);
    refresh();
  }

  async function handleDelete(id: number) {
    await api.deleteSession(id);
    refresh();
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

  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Career Counselling — Session Tracker</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/console/report">Psychometry Report</Link>
          <Link to="/console/export">Export Data</Link>
          <button
            type="button"
            onClick={async () => {
              await api.logout();
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <form onSubmit={handleAddSession} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.5rem" }}>
        <input
          placeholder="No."
          type="number"
          value={form.session_number}
          onChange={(e) => setForm({ ...form, session_number: e.target.value })}
          required
          style={{ width: "4rem" }}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          Start
          <input
            type="time"
            value={form.scheduled_start_time}
            onChange={(e) => setForm({ ...form, scheduled_start_time: e.target.value })}
          />
        </label>
        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          End
          <input
            type="time"
            value={form.scheduled_end_time}
            onChange={(e) => setForm({ ...form, scheduled_end_time: e.target.value })}
          />
        </label>
        <select
          value={form.topic_id}
          onChange={(e) => setForm({ ...form, topic_id: e.target.value })}
        >
          <option value="">Topic...</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
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
          placeholder="Instructor"
          value={form.instructor_name}
          onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
        />
        <button type="submit">Add Session</button>
      </form>

      {showAddClass && (
        <form onSubmit={handleAddClass} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            placeholder="New class/section name (e.g. IX A)"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            autoFocus
          />
          <button type="submit">Add Class</button>
          <button
            type="button"
            onClick={() => {
              setShowAddClass(false);
              setNewClassName("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {["No.", "Date", "Time", "Instructor", "Class", "Topic", "Status", "Attendance", "Activity Notes", "Actions"].map((h) => (
              <th key={h} style={{ textAlign: "left", borderBottom: "2px solid #333", padding: "0.4rem" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.4rem" }}>{s.session_number}</td>
              <td style={{ padding: "0.4rem" }}>{s.date ?? "—"}</td>
              <td style={{ padding: "0.4rem" }}>
                {s.scheduled_start_time || s.scheduled_end_time
                  ? `${s.scheduled_start_time ?? "?"}–${s.scheduled_end_time ?? "?"}`
                  : "—"}
              </td>
              <td style={{ padding: "0.4rem" }}>{s.instructor_name ?? "—"}</td>
              <td style={{ padding: "0.4rem" }}>{s.class_section_name ?? "—"}</td>
              <td style={{ padding: "0.4rem" }}>{s.topic_title ?? "—"}</td>
              <td style={{ padding: "0.4rem" }}>{s.status}</td>
              <td style={{ padding: "0.4rem" }}>
                <input
                  type="number"
                  min={0}
                  key={`att-${s.id}-${s.attendance_count}`}
                  defaultValue={s.attendance_count ?? ""}
                  onBlur={(e) => handleAttendanceBlur(s.id, e.target.value)}
                  style={{ width: "3.5rem" }}
                />
              </td>
              <td style={{ padding: "0.4rem" }}>
                <input
                  type="text"
                  placeholder="What was covered..."
                  key={`notes-${s.id}-${s.notes}`}
                  defaultValue={s.notes ?? ""}
                  onBlur={(e) => handleNotesBlur(s.id, e.target.value, s.notes)}
                  style={{ width: "10rem" }}
                />
              </td>
              <td style={{ padding: "0.4rem", display: "flex", gap: "0.4rem" }}>
                {s.status === "scheduled" && <button onClick={() => handleStart(s.id)}>Start</button>}
                {s.status === "in_progress" && (
                  <>
                    <button onClick={() => navigate(`/console/sessions/${s.id}`)}>Manage</button>
                    <button onClick={() => handleComplete(s.id)}>Complete</button>
                  </>
                )}
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
