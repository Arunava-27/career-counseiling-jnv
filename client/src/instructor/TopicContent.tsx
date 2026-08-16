import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api, type CurriculumTopic } from "../shared/api";

export function TopicContent({ topicId }: { topicId: number | null }) {
  const [topic, setTopic] = useState<CurriculumTopic | null>(null);
  const [presenting, setPresenting] = useState(false);

  useEffect(() => {
    if (!topicId) return;
    api.curriculum().then((topics) => {
      setTopic(topics.find((t) => t.id === topicId) ?? null);
    });
  }, [topicId]);

  if (!topic) return null;

  return (
    <div className="section">
      <div className="section-header">
        <h2 style={{ margin: 0 }}>Facilitator Script</h2>
        <button className="btn-primary btn-sm" onClick={() => setPresenting((p) => !p)}>
          {presenting ? "✕ Exit projector view" : "🖥️ Present (projector view)"}
        </button>
      </div>
      <div className={`projector${presenting ? " is-presenting" : ""}`}>
        <ReactMarkdown>{topic.content_markdown ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
}
