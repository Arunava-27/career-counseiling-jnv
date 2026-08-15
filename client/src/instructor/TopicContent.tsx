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
    <div style={{ marginTop: "1.5rem" }}>
      <button onClick={() => setPresenting((p) => !p)}>
        {presenting ? "Exit projector view" : "Present (projector view)"}
      </button>
      <div
        style={{
          marginTop: "0.8rem",
          padding: presenting ? "3rem" : "1rem",
          border: "1px solid #ddd",
          fontSize: presenting ? "2rem" : "1rem",
          lineHeight: 1.5,
          background: presenting ? "#fff" : "transparent",
        }}
      >
        <ReactMarkdown>{topic.content_markdown ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
}
