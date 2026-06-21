import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

function CreateUpdate() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return setError("Please enter update text");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/updates", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, link }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1.2rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    marginBottom: "1rem",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
          }}
        >
          Post Update
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Updates appear on your committee page — newest first
        </p>

        <textarea
          placeholder="What's the update?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ ...inputStyle, height: "120px", resize: "none" }}
        />

        <input
          style={inputStyle}
          placeholder="Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {error && (
          <p
            style={{
              color: "#E0563F",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #D174D2, #E0563F)",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading ? "Posting..." : "Post Update"}
        </button>
      </div>
    </div>
  );
}

export default CreateUpdate;
