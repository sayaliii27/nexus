import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function Manage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [updates, setUpdates] = useState([]);
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
        setStories(data2.stories || []);
        setUpdates(data2.updates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Delete this story?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/stories/${storyId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm("Delete this update?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/updates/${updateId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const tabStyle = (tab) => ({
    padding: "0.6rem 1.2rem",
    borderRadius: "20px",
    border: "none",
    background:
      activeTab === tab
        ? "linear-gradient(135deg, #D174D2, #E0563F)"
        : "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: activeTab === tab ? "600" : "400",
  });

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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Manage</h2>
          <button
            onClick={() =>
              navigate(
                activeTab === "posts"
                  ? "/create-post"
                  : activeTab === "stories"
                    ? "/create-story"
                    : "/create-update",
              )
            }
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
            + New{" "}
            {activeTab === "posts"
              ? "post"
              : activeTab === "stories"
                ? "story"
                : "update"}
          </button>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button
            style={tabStyle("posts")}
            onClick={() => setActiveTab("posts")}
          >
            Posts ({posts.length})
          </button>
          <button
            style={tabStyle("stories")}
            onClick={() => setActiveTab("stories")}
          >
            Stories ({stories.length})
          </button>
          <button
            style={tabStyle("updates")}
            onClick={() => setActiveTab("updates")}
          >
            Updates ({updates.length})
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
        ) : (
          <>
            {/* posts tab */}
            {activeTab === "posts" &&
              (posts.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 0",
                    color: "var(--text-muted)",
                  }}
                >
                  No posts yet
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
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
                          style={{
                            display: "flex",
                            gap: "0.4rem",
                            flexWrap: "wrap",
                          }}
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
                            ❤️ {post.likes?.length || 0}
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
                            💬 {post.comments?.length || 0}
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
                              🎟️ {post.rsvps?.length || 0}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => navigate(`/post/${post.id}`)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                          }}
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(224,86,63,0.7)",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* stories tab */}
            {activeTab === "stories" &&
              (stories.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 0",
                    color: "var(--text-muted)",
                  }}
                >
                  No active stories
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        position: "relative",
                        aspectRatio: "9/16",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <img
                        src={story.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "0.5rem",
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.7))",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "0.7rem", color: "#fff" }}>
                          👁️ {story.views?.length || 0}
                        </span>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#E0563F",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* updates tab */}
            {activeTab === "updates" &&
              (updates.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem 0",
                    color: "var(--text-muted)",
                  }}
                >
                  No updates posted
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {update.text}
                        </p>
                        {update.link && (
                          <a
                            href={update.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: "0.75rem",
                              color: "#D174D2",
                              textDecoration: "none",
                            }}
                          >
                            🔗 {update.link}
                          </a>
                        )}
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            marginTop: "0.25rem",
                          }}
                        >
                          {new Date(update.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "rgba(224,86,63,0.7)",
                          cursor: "pointer",
                          fontSize: "1.1rem",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Manage;
