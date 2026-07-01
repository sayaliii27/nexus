import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PostCard({ post, onLike, onComment, onRSVP, onDelete, onBookmark }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const isLiked = post.likes?.some((l) => l.userId === user?.id);
  const isRSVPed = post.rsvps?.some((r) => r.userId === user?.id);
  const isBookmarked = post.bookmarks?.some((b) => b.userId === user?.id);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    await onComment(post.id, commentText, replyTo);
    setCommentText("");
    setReplyTo(null);
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        marginBottom: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        onClick={() => navigate(`/committee/${post.committee.id}`)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #D174D2, #E0563F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: "700",
            overflow: "hidden",
          }}
        >
          {post.committee.profilePic ? (
            <img
              src={post.committee.profilePic}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            post.committee.name?.[0]
          )}
        </div>
        <div>
          <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>
            {post.committee.name}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {post.committee.verified && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.7rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "20px",
              background: "rgba(209, 116, 210, 0.15)",
              color: "#D174D2",
            }}
          >
            verified
          </span>
        )}
        {user?.role === "committee" && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: "1rem",
              padding: "0.2rem 0.5rem",
            }}
          >
            🗑️
          </button>
        )}
      </div>

      {/* image */}
      <img
        src={post.image}
        alt=""
        style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
      />

      {/* event info */}
      {post.isEvent && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(209, 116, 210, 0.08)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {post.eventDate && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              📅 {new Date(post.eventDate).toLocaleDateString()}
            </span>
          )}
          {post.eventTime && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              🕐 {post.eventTime}
            </span>
          )}
          {post.venue && (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              📍 {post.venue}
            </span>
          )}
          {post.category && (
            <span
              style={{
                fontSize: "0.8rem",
                padding: "0.2rem 0.6rem",
                borderRadius: "20px",
                background: "rgba(224, 86, 63, 0.15)",
                color: "#E0563F",
              }}
            >
              {post.category}
            </span>
          )}
        </div>
      )}

      {/* caption */}
      {post.caption && (
        <div style={{ padding: "0.75rem 1rem" }}>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
            {post.caption}
          </p>
        </div>
      )}

      {/* link */}
      {post.link && (
        <div style={{ padding: "0 1rem 0.75rem" }}>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.85rem",
              color: "#D174D2",
              textDecoration: "none",
            }}
          >
            🔗 {post.link}
          </a>
        </div>
      )}

      {/* actions */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => onLike(post.id)}
          style={{
            background: "none",
            border: "none",
            color: isLiked ? "#D174D2" : "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          💬 {post.comments?.length || 0}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/post/${post.id}`,
            );
            alert("Link copied!");
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          🔗
        </button>
        <button
          onClick={() => onBookmark && onBookmark(post.id)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: isBookmarked ? "#D174D2" : "var(--text-muted)",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          {isBookmarked ? "🔖" : "🔖"}
        </button>

        {post.isEvent && (
          <button
            onClick={() => onRSVP(post.id)}
            style={{
              marginLeft: "auto",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              border: "none",
              background: isRSVPed
                ? "linear-gradient(135deg, #D174D2, #E0563F)"
                : "rgba(255,255,255,0.08)",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "600",
            }}
          >
            {isRSVPed ? "Going ✓" : "RSVP"}
          </button>
        )}
      </div>

      {/* comments */}
      {showComments && (
        <div
          style={{
            padding: "0 1rem 1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {post.comments?.map((comment) => (
            <div key={comment.id} style={{ marginTop: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    color: "#D174D2",
                  }}
                >
                  {comment.user?.name}
                </span>
                <span
                  style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}
                >
                  {comment.text}
                </span>
              </div>
              <button
                onClick={() => setReplyTo(comment.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  marginTop: "0.2rem",
                }}
              >
                Reply
              </button>
              {comment.replies?.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    marginLeft: "1rem",
                    marginTop: "0.5rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "0.8rem",
                      color: "#D174D2",
                    }}
                  >
                    {reply.user?.name}
                  </span>
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}
                  >
                    {reply.text}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {replyTo && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#D174D2",
                marginTop: "0.75rem",
              }}
            >
              Replying to comment{" "}
              <span
                onClick={() => setReplyTo(null)}
                style={{ cursor: "pointer", color: "var(--text-muted)" }}
              >
                ✕ cancel
              </span>
            </p>
          )}

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              style={{
                flex: 1,
                padding: "0.6rem 1rem",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <button
              onClick={handleComment}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "20px",
                border: "none",
                background: "linear-gradient(135deg, #D174D2, #E0563F)",
                color: "#fff",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
