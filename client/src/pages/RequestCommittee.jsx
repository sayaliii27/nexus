import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function RequestCommittee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    college: "MNNIT",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email)
      return setError("Name and email are required");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/request-committee",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
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

  if (success)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", maxWidth: "400px" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "0.75rem",
            }}
          >
            Request submitted!
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "2rem",
              fontSize: "0.9rem",
            }}
          >
            We'll review your request and get back to you soon.
          </p>
          <Link
            to="/login"
            style={{
              color: "#D174D2",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Back to login
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #D174D2, #E0563F)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          Nexus
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Request committee access
        </p>

        <input
          style={inputStyle}
          placeholder="Committee name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          style={inputStyle}
          placeholder="Official email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          style={inputStyle}
          value={form.college}
          onChange={(e) => setForm({ ...form, college: e.target.value })}
        >
          <option value="MNNIT">MNNIT Allahabad</option>
        </select>

        <textarea
          placeholder="Why do you want to join Nexus? (optional)"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          style={{ ...inputStyle, height: "100px", resize: "none" }}
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

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
          {loading ? "Submitting..." : "Submit request"}
        </motion.button>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Already have access?{" "}
          <Link
            to="/login"
            style={{
              color: "#D174D2",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RequestCommittee;
