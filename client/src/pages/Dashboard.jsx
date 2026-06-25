import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function Dashboard() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [committeePage, setCommitteePage] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user?.role !== "committee") navigate("/feed");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchMyPage();
  }, [user, token]);

  const fetchMyPage = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/committee/college/${user.college}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      const myPage = data.find((c) => c.userId === user.id);
      setCommitteePage(myPage);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
          }}
        >
          Welcome, {user?.name}
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Committee dashboard
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              label: "Create Post",
              icon: "📸",
              action: () => navigate("/create-post"),
            },
            {
              label: "Create Story",
              icon: "⭕",
              action: () => navigate("/create-story"),
            },
            {
              label: "Post Update",
              icon: "📢",
              action: () => navigate("/create-update"),
            },
            {
              label: "View My Page",
              icon: "👁️",
              action: () =>
                committeePage && navigate(`/committee/${committeePage.id}`),
            },
          ].map((item) => (
            <div
              key={item.label}
              onClick={item.action}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                padding: "1.5rem",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                {item.icon}
              </div>
              <p style={{ fontWeight: "600" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
