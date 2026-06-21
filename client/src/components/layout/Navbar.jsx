import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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
        background: "rgba(30, 15, 45, 0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
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
              color:
                location.pathname === item.path
                  ? "#D174D2"
                  : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "color 0.2s",
            }}
          >
            {item.label}
          </span>
        ))}

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
