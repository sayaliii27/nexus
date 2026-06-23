import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function Directory() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [committees, setCommittees] = useState([]);
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchCommittees();
  }, [user, token]);

  const fetchCommittees = async () => {
    try {
      const res = await fetch(
        `import.meta.env.VITE_API_URL/api/committee/college/${user.college}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setCommittees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const filtered = committees.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "800px",
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
          Committees
        </h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search committees..."
          style={{
            width: "100%",
            padding: "0.9rem 1.2rem",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontSize: "1rem",
            outline: "none",
            marginBottom: "2rem",
          }}
        />

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
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--text-muted)",
            }}
          >
            No committees found
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {filtered.map((committee) => (
              <div
                key={committee.id}
                onClick={() => navigate(`/committee/${committee.id}`)}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#D174D2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #D174D2, #E0563F)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    margin: "0 auto 1rem",
                    overflow: "hidden",
                  }}
                >
                  {committee.profilePic ? (
                    <img
                      src={committee.profilePic}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    committee.name?.[0]
                  )}
                </div>
                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    marginBottom: "0.3rem",
                  }}
                >
                  {committee.name}
                </p>
                {committee.bio && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {committee.bio}
                  </p>
                )}
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "20px",
                    background: "rgba(209, 116, 210, 0.15)",
                    color: "#D174D2",
                    marginTop: "0.5rem",
                    display: "inline-block",
                  }}
                >
                  verified
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Directory;
