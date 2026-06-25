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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
          }}
        >
          Manage
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "2rem",
            fontSize: "0.9rem",
          }}
        >
          {posts.length} posts
        </p>

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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={post.image}
                  alt=""
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <div style={{ padding: "0.75rem 1rem" }}>
                  {post.caption && (
                    <p
                      style={{
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.caption}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span>❤️ {post.likes?.length || 0} likes</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                    {post.isEvent && (
                      <span>🎟️ {post.rsvps?.length || 0} RSVPs</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() =>
                        navigate(`/committee/${committeePage?.id}`)
                      }
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "transparent",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "rgba(224, 86, 63, 0.2)",
                        color: "#E0563F",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
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
