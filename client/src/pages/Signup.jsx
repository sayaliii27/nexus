import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "MNNIT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      login(data.token, data.user);
      navigate("/feed");
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #412653 0%, #3F567F 100%)",
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
          Create your account
        </p>

        <input
          style={inputStyle}
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          style={inputStyle}
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          style={inputStyle}
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <select
          name="college"
          value={form.college}
          onChange={handleChange}
          style={{ ...inputStyle, marginBottom: "1.5rem" }}
        >
          <option value="MNNIT">MNNIT Allahabad</option>
        </select>

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
          {loading ? "Creating account..." : "Sign up"}
        </motion.button>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
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

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          Are you a committee?{" "}
          <Link
            to="/request-committee"
            style={{
              color: "#E0563F",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Request access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
