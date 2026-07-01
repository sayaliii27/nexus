import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const [committeePage, setCommitteePage] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user && token) fetchUnread();
    if (user?.role === "committee" && token) fetchMyPage();
  }, [user, token, location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (showProfile && !e.target.closest(".profile-dropdown")) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showProfile]);

  const fetchUnread = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setUnread(data.filter((n) => !n.read).length);
    } catch (err) {}
  };

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
    } catch (err) {}
  };

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
          navigate(
            user?.role === "committee"
              ? `/committee/${committeePage?.id}`
              : "/feed",
          )
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
        {user?.role === "committee" ? (
          <>
            {/* committee name → their page */}
            <span
              onClick={() =>
                committeePage && navigate(`/committee/${committeePage.id}`)
              }
              style={{
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "600",
                opacity: 0.9,
              }}
            >
              {user?.name}
            </span>

            {/* create dropdown */}
            <div style={{ position: "relative" }}>
              <span
                onClick={() => setShowCreate(!showCreate)}
                style={{
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  opacity: 0.8,
                }}
              >
                Create ▾
              </span>
              {showCreate && (
                <div
                  style={{
                    position: "absolute",
                    top: "2rem",
                    right: 0,
                    background: "rgba(30,15,45,0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "0.5rem",
                    minWidth: "160px",
                    zIndex: 200,
                  }}
                >
                  {[
                    { label: "📸 Post", path: "/create-post" },
                    { label: "⭕ Story", path: "/create-story" },
                    { label: "📢 Update", path: "/create-update" },
                  ].map((item) => (
                    <div
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setShowCreate(false);
                      }}
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        color: "#fff",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* manage */}
            <span
              onClick={() => navigate("/manage")}
              style={{
                color: location.pathname === "/manage" ? "#D174D2" : "#fff",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                opacity: 0.8,
              }}
            >
              Manage
            </span>
          </>
        ) : (
          <>
            <span
              onClick={() => navigate("/feed")}
              style={{
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                opacity: location.pathname === "/feed" ? 1 : 0.7,
              }}
            >
              Feed
            </span>
            <span
              onClick={() => navigate("/directory")}
              style={{
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                opacity: location.pathname === "/directory" ? 1 : 0.7,
              }}
            >
              Directory
            </span>
            <span
              onClick={() => navigate("/calendar")}
              style={{
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                opacity: location.pathname === "/calendar" ? 1 : 0.7,
              }}
            >
              Calendar
            </span>
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

            <span
              onClick={() => navigate("/bookmarks")}
              style={{
                color: "#fff",
                cursor: "pointer",
                fontSize: "1.2rem",
                opacity: location.pathname === "/bookmarks" ? 1 : 0.7,
              }}
            >
              🔖
            </span>
          </>
        )}

        <div style={{ position: "relative" }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile(!showProfile);
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

          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "2.5rem",
                right: 0,
                background: "rgba(20,10,35,0.97)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "1rem",
                minWidth: "220px",
                zIndex: 300,
              }}
            >
              {/* user info */}
              <div
                style={{
                  marginBottom: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {user?.name}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {user?.email}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#D174D2",
                    marginTop: "0.25rem",
                  }}
                >
                  {user?.college}
                </p>
              </div>

              {/* role badge */}
              <div
                style={{
                  marginBottom: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "20px",
                    background:
                      user?.role === "committee"
                        ? "rgba(209,116,210,0.15)"
                        : "rgba(63,86,127,0.3)",
                    color: user?.role === "committee" ? "#D174D2" : "#a0b4d6",
                  }}
                >
                  {user?.role === "committee" ? "🏛️ Committee" : "🎓 Student"}
                </span>
              </div>

              {/* logout */}
              <div
                onClick={() => {
                  logout();
                  navigate("/");
                  setShowProfile(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  color: "#E0563F",
                  fontSize: "0.85rem",
                  padding: "0.4rem 0",
                }}
              >
                <span>→</span> Log out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
