import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user && token) fetchUnread();
  }, [user, token, location.pathname]);

  const fetchUnread = async () => {
    try {
      const res = await fetch("import.meta.env.VITE_API_URL/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnread(data.filter((n) => !n.read).length);
    } catch (err) {}
  };

  const navItems =
    user?.role === "committee"
      ? [
          { label: "Dashboard", path: "/dashboard" },
          { label: "Directory", path: "/directory" },
        ]
      : [
          { label: "Feed", path: "/feed" },
          { label: "Directory", path: "/directory" },
        ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(20, 10, 35, 0.4)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1
        onClick={() =>
          navigate(user?.role === "committee" ? "/dashboard" : "/feed")
        }
        style={{
          fontSize: "1.3rem",
          fontWeight: "800",
          background: "linear-gradient(135deg, #D174D2, #E0563F)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          cursor: "pointer",
        }}
      >
        Nexus
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {navItems.map((item) => (
          <span
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              opacity: location.pathname === item.path ? 1 : 0.7,
              transition: "opacity 0.2s",
            }}
          >
            {item.label}
          </span>
        ))}

        {/* notification bell */}
        <div
          onClick={() => navigate("/notifications")}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <span style={{ fontSize: "1.2rem" }}>🔔</span>
          {unread > 0 && (
            <div
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#E0563F",
                fontSize: "0.6rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              {unread}
            </div>
          )}
        </div>

        <div
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #D174D2, #E0563F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "700",
          }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
