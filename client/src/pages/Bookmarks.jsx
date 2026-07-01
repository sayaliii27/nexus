import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/ui/PostCard";

function Bookmarks() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchBookmarks();
  }, [user, token]);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    fetchBookmarks();
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
    fetchBookmarks();
  };

  const handleRSVP = async (postId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/rsvp`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBookmarks();
  };

  const handleBookmark = async (postId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/bookmarks/${postId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBookmarks();
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
          Saved posts
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
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              No saved posts yet
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              Tap 🔖 on any post to save it here
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
              onBookmark={handleBookmark}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Bookmarks;
