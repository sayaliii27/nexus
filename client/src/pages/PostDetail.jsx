import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/ui/PostCard";

function PostDetail() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchPost();
  }, [user, token, id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setPost(data);
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
    fetchPost();
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
    fetchPost();
  };

  const handleRSVP = async (postId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/rsvp`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPost();
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate(-1);
  };

  if (loading || fetching) return null;

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
        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: 0,
          }}
        >
          ← Back
        </button>

        {post && (
          <PostCard
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onRSVP={handleRSVP}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default PostDetail;
