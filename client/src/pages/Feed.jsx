import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/ui/PostCard";
import StoriesRow from "../components/ui/StoriesRow";

function Feed() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [activeStories, setActiveStories] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchPosts();
  }, [user, token]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/feed`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleLike = async (postId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const handleComment = async (postId, text, parentId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, parentId }),
    });
    fetchPosts();
  };

  const handleRSVP = async (postId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/rsvp`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };
  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const handleStoryClick = (stories) => {
    setActiveStories(stories);
    setActiveStory(stories[0]);
  };

  const reactToStory = async (emoji) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/stories/${activeStory.id}/react`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji }),
      },
    );
  };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* story viewer */}
      {activeStory && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={() => setActiveStory(null)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            ✕
          </div>

          <img
            src={activeStory.image}
            alt=""
            style={{
              maxHeight: "75vh",
              maxWidth: "90vw",
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            {["❤️", "🔥", "👏", "😮", "🎉"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => reactToStory(emoji)}
                style={{
                  fontSize: "1.8rem",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          {activeStories.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              {activeStories.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveStory(s)}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background:
                      s.id === activeStory.id
                        ? "#fff"
                        : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        <StoriesRow onStoryClick={handleStoryClick} />

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
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              No posts yet
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              Committees haven't posted anything yet
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onRSVP={handleRSVP}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;
