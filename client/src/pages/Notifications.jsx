import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function Notifications() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchNotifications();
  }, [user, token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("import.meta.env.VITE_API_URL/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
      // mark all as read
      await fetch("import.meta.env.VITE_API_URL/api/notifications/read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1.5rem",
          }}
        >
          Notifications
        </h2>

        {fetching ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--text-muted)",
            }}
          >
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              No notifications yet
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.read ? "var(--bg-card)" : "rgba(209,116,210,0.1)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "1rem 1.2rem",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: n.read ? "transparent" : "#D174D2",
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontSize: "0.9rem" }}>{n.text}</p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: "0.2rem",
                  }}
                >
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
