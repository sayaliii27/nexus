import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #D174D2, #E0563F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Nexus
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Hi, {user?.name}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "4rem 0",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            Feed coming soon
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Posts from all committees will appear here
          </p>
        </div>
      </div>
    </div>
  );
}

export default Feed;
