import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function Manage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [committeePage, setCommitteePage] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user?.role !== "committee") navigate("/feed");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchData();
  }, [user, token]);

  const fetchData = async () => {
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

      if (myPage) {
        const res2 = await fetch(
          `${import.meta.env.VITE_API_URL}/api/committee/${myPage.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data2 = await res2.json();
        setPosts(data2.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "0.25rem",
              }}
            >
              Manage
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              {posts.length} posts
            </p>
          </div>
          <button
            onClick={() => navigate("/create-post")}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "20px",
              border: "none",
              background: "linear-gradient(135deg, #D174D2, #E0563F)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
            }}
          >
            + New post
          </button>
        </div>

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
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>No posts yet</p>
            <button
              onClick={() => navigate("/create-post")}
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: "20px",
                border: "none",
                background: "linear-gradient(135deg, #D174D2, #E0563F)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "0.85rem 1rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                }}
              >
                {/* thumbnail */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={post.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      marginBottom: "0.4rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "#fff",
                    }}
                  >
                    {post.caption ||
                      (post.isEvent ? "📅 Event post" : "No caption")}
                  </p>
                  <div
                    style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "rgba(209,116,210,0.15)",
                        color: "#D174D2",
                      }}
                    >
                      ❤️ {post.likes?.length || 0} likes
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "rgba(63,86,127,0.3)",
                        color: "#a0b4d6",
                      }}
                    >
                      💬 {post.comments?.length || 0} comments
                    </span>
                    {post.isEvent && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: "rgba(224,86,63,0.15)",
                          color: "#E0563F",
                        }}
                      >
                        🎟️ {post.rsvps?.length || 0} RSVPs
                      </span>
                    )}
                    {post.isEvent && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: "rgba(255,255,255,0.08)",
                          color: "var(--text-muted)",
                        }}
                      >
                        event
                      </span>
                    )}
                  </div>
                </div>

                {/* actions */}
                <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                  <button
                    onClick={() => navigate(`/post/${post.id}`)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(255,255,255,0.4)",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      padding: "0.2rem",
                    }}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(224,86,63,0.7)",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      padding: "0.2rem",
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Manage;
