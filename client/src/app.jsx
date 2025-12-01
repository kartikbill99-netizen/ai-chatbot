import { useEffect, useRef, useState } from "react";
import { sendChat, health } from "./api";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m your Gemini-powered assistant. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    health().then(setServerInfo).catch(() => setServerInfo({ status: "error" }));
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChat(newMessages);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <strong>Gemini Chatbot</strong>
          <div style={styles.subHeader}>
            {serverInfo?.status === "ok"
              ? `Connected (${serverInfo.model})`
              : "Connecting..."}
          </div>
        </div>
      </header>

      <div ref={listRef} style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.message, ...(m.role === "user" ? styles.user : styles.assistant) }}>
            <div style={styles.role}>{m.role}</div>
            <div>{m.content}</div>
          </div>
        ))}
        {loading && <div style={styles.loading}>Thinking…</div>}
      </div>

      <div style={styles.inputRow}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          rows={3}
          style={styles.textarea}
        />
        <button onClick={onSend} disabled={loading || !input.trim()} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", height: "100vh" },
  header: { padding: "16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" },
  subHeader: { fontSize: 12, color: "#666" },
  messages: { flex: 1, overflowY: "auto", padding: 16, background: "#fafafa" },
  message: { marginBottom: 12, padding: 12, borderRadius: 8 },
  user: { background: "#e6f7ff", alignSelf: "flex-end" },
  assistant: { background: "#fff", border: "1px solid #eee" },
  role: { fontSize: 11, color: "#999", marginBottom: 6, textTransform: "capitalize" },
  loading: { fontStyle: "italic", color: "#999", padding: 8 },
  inputRow: { display: "flex", gap: 8, padding: 16, borderTop: "1px solid #eee" },
  textarea: { flex: 1, resize: "vertical", padding: 10 },
  button: { padding: "10px 16px" },
};
