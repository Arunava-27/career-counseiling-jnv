const API_BASE = "/api";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// School WiFi/hotspot connections can drop mid-request. Retry a few times on network-level
// failures (fetch throwing) or 5xx responses, but never on 4xx — those are real client errors
// (bad input, wrong join code) that retrying won't fix.
async function request<T>(path: string, options?: RequestInit, retries = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await delay(500 * attempt);
    }
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        ...options,
      });
      if (!res.ok) {
        // Prefer the server's own explanation (e.g. "Cannot delete a session that already has
        // recorded participants or responses") over a generic status line, so the instructor
        // sees why an action was rejected, not just that it was.
        let message = `Request failed: ${res.status} ${res.statusText}`;
        try {
          const body = await res.clone().json();
          if (body && typeof body.error === "string") message = body.error;
        } catch {
          // Body wasn't JSON (or was empty) — fall back to the generic message above.
        }
        lastError = new Error(message);
        if (res.status === 401 && !path.startsWith("/auth/")) {
          // Session expired/missing — bounce to login rather than surfacing a raw error.
          window.location.href = "/login";
        }
        if (res.status >= 500 && attempt < retries) {
          continue; // transient server error — worth a retry
        }
        break; // 4xx (or retries exhausted) — not retryable, stop immediately
      }
      if (res.status === 204) {
        return undefined as T;
      }
      return (await res.json()) as T;
    } catch (err) {
      // fetch itself threw — a real network failure (dropped WiFi, DNS hiccup, etc.), worth retrying
      lastError = err;
      if (attempt >= retries) break;
    }
  }

  throw lastError;
}

// `request()` throws a plain Error whose message is already the server's own explanation (e.g.
// "Cannot delete a session that already has recorded participants or responses") — this just
// strips the redundant "Error: " prefix that `String(err)` would otherwise leave in when
// showing it to an instructor.
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export interface HelloResponse {
  message: string;
}

export interface ServerInfoResponse {
  port: number;
  lanAddresses: string[];
}

export interface CurriculumTopic {
  id: number;
  order_index: number;
  title: string;
  description: string | null;
  content_markdown: string | null;
  min_class_level: number | null;
  max_class_level: number | null;
}

export interface ClassSection {
  id: number;
  name: string;
}

export type SessionStatus = "scheduled" | "in_progress" | "completed";

export interface Session {
  id: number;
  session_number: number;
  date: string | null;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  instructor_name: string | null;
  status: SessionStatus;
  join_code: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  topic_id: number | null;
  topic_title: string | null;
  class_section_id: number | null;
  class_section_name: string | null;
  active_assessment_id: number | null;
  attendance_count: number | null;
}

export interface NewSessionInput {
  session_number: number;
  date?: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  topic_id?: number;
  class_section_id?: number;
  instructor_name?: string;
  notes?: string;
  attendance_count?: number;
}

export type SessionUpdateInput = Partial<NewSessionInput>;

export interface JoinLookupResponse {
  id: number;
  session_number: number;
  status: SessionStatus;
  topic_title: string | null;
  class_section_name: string | null;
}

export interface Participant {
  id: number;
  display_name: string;
  class_name: string | null;
  section: string | null;
  roll_number: string | null;
  joined_at: string;
}

export interface JoinedParticipant {
  participant_id: number;
  device_token: string;
  session_id: number;
}

export type QuestionType = "single" | "multi" | "text" | "scale";

export interface PollQuestion {
  id: number;
  poll_id: number;
  order_index: number;
  text: string;
  type: QuestionType;
  options: string[];
}

export type PollStatus = "draft" | "active" | "closed";

export interface Poll {
  id: number;
  session_id: number | null;
  topic_id: number | null;
  title: string;
  type: "poll" | "quiz";
  status: PollStatus | "template";
  questions: PollQuestion[];
}

export interface NewPollInput {
  title: string;
  type?: "poll" | "quiz";
  questions: { text: string; type?: QuestionType; options?: string[] }[];
}

export interface PollQuestionResult {
  question_id: number;
  text: string;
  type: QuestionType;
  response_count: number;
  tally: Record<string, number>;
  textAnswers: string[];
  correct_answer: string | null;
  correct_count: number | null;
  accuracy: number | null;
}

export interface PollResults {
  poll_id: number;
  title: string;
  results: PollQuestionResult[];
}

export interface AssessmentQuestion {
  id: number;
  instrument_id: number;
  order_index: number;
  text: string;
  options: string[];
  scoring_dimension: string | null;
}

export interface AssessmentInstrument {
  id: number;
  name: string;
  type: string;
  description: string | null;
  min_class_level: number | null;
  max_class_level: number | null;
  // Soft, non-clinical title to show a student taking the test. Falls back to `name` if unset.
  student_label: string | null;
  questions: AssessmentQuestion[];
}

export interface AssessmentParticipantResult {
  participant_id: number;
  display_name: string;
  answers: Record<string, string>;
  dimension_totals: Record<string, number>;
  submitted_at: string;
}

export interface AssessmentResults {
  instrument_id: number;
  name: string;
  participants: AssessmentParticipantResult[];
}

export interface PsychometryReportParticipant {
  display_name: string;
  roll_number: string | null;
  class_section_name: string | null;
  session_date: string | null;
  submitted_at: string;
  dimension_totals: Record<string, number>;
}

export interface PsychometryReportInstrument {
  instrument_id: number;
  name: string;
  description: string | null;
  dimensions: string[];
  participants: PsychometryReportParticipant[];
}

export const api = {
  hello: () => request<HelloResponse>("/hello"),
  serverInfo: () => request<ServerInfoResponse>("/server-info"),

  login: (username: string, password: string) =>
    request<{ ok: true; username: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),
  me: () => request<{ username: string }>("/auth/me"),

  curriculum: () => request<CurriculumTopic[]>("/curriculum"),
  classSections: () => request<ClassSection[]>("/curriculum/class-sections"),
  createClassSection: (name: string) =>
    request<ClassSection>("/curriculum/class-sections", { method: "POST", body: JSON.stringify({ name }) }),

  sessions: () => request<Session[]>("/sessions"),
  createSession: (input: NewSessionInput) =>
    request<Session>("/sessions", { method: "POST", body: JSON.stringify(input) }),
  updateSession: (id: number, input: SessionUpdateInput) =>
    request<Session>(`/sessions/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  deleteSession: (id: number) => request<void>(`/sessions/${id}`, { method: "DELETE" }),
  startSession: (id: number) => request<Session>(`/sessions/${id}/start`, { method: "POST" }),
  completeSession: (id: number) => request<Session>(`/sessions/${id}/complete`, { method: "POST" }),

  lookupJoinCode: (code: string) => request<JoinLookupResponse>(`/join/${code}`),
  joinSession: (sessionId: number, info: { displayName: string; className: string; section: string; rollNumber: string }) =>
    request<JoinedParticipant>(`/sessions/${sessionId}/participants`, {
      method: "POST",
      body: JSON.stringify({
        display_name: info.displayName,
        class_name: info.className,
        section: info.section,
        roll_number: info.rollNumber,
      }),
    }),
  participants: (sessionId: number) => request<Participant[]>(`/sessions/${sessionId}/participants`),

  polls: (sessionId: number) => request<Poll[]>(`/sessions/${sessionId}/polls`),
  createPoll: (sessionId: number, input: NewPollInput) =>
    request<Poll>(`/sessions/${sessionId}/polls`, { method: "POST", body: JSON.stringify(input) }),
  launchPoll: (sessionId: number, pollId: number) =>
    request<Poll>(`/sessions/${sessionId}/polls/${pollId}/launch`, { method: "POST" }),
  closePoll: (sessionId: number, pollId: number) =>
    request<Poll>(`/sessions/${sessionId}/polls/${pollId}/close`, { method: "POST" }),
  activePoll: (sessionId: number) => request<Poll | null>(`/sessions/${sessionId}/active-poll`),
  pollResults: (sessionId: number, pollId: number) =>
    request<PollResults>(`/sessions/${sessionId}/polls/${pollId}/results`),
  pollTemplates: (topicId: number) => request<Poll[]>(`/curriculum/${topicId}/poll-templates`),
  createPollFromTemplate: (sessionId: number, templatePollId: number) =>
    request<Poll>(`/sessions/${sessionId}/polls/from-template/${templatePollId}`, { method: "POST" }),
  recordTally: (sessionId: number, pollId: number, questionId: number, tallies: Record<string, number>) =>
    request<{ ok: true }>(`/sessions/${sessionId}/polls/${pollId}/questions/${questionId}/tally`, {
      method: "POST",
      body: JSON.stringify({ tallies }),
    }),

  submitResponse: (deviceToken: string, questionId: number, answer: unknown) =>
    request<{ ok: true }>("/responses", {
      method: "POST",
      body: JSON.stringify({ device_token: deviceToken, question_id: questionId, answer }),
    }),

  assessmentLibrary: () => request<AssessmentInstrument[]>("/assessments"),
  launchAssessment: (sessionId: number, instrumentId: number) =>
    request<AssessmentInstrument>(`/sessions/${sessionId}/assessments/${instrumentId}/launch`, { method: "POST" }),
  closeAssessment: (sessionId: number) =>
    request<{ ok: true }>(`/sessions/${sessionId}/assessments/close`, { method: "POST" }),
  activeAssessment: (sessionId: number) =>
    request<AssessmentInstrument | null>(`/sessions/${sessionId}/active-assessment`),
  assessmentResults: (sessionId: number, instrumentId: number) =>
    request<AssessmentResults>(`/sessions/${sessionId}/assessments/${instrumentId}/results`),
  submitAssessmentResponse: (deviceToken: string, instrumentId: number, answers: Record<string, string>) =>
    request<{ ok: true }>("/assessment-responses", {
      method: "POST",
      body: JSON.stringify({ device_token: deviceToken, instrument_id: instrumentId, answers }),
    }),

  psychometryReport: () => request<PsychometryReportInstrument[]>("/reports/psychometry"),
};
