import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import PostCard from "../components/ui/PostCard";

function CommitteePage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [committee, setCommittee] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchCommittee();
  }, [user, token, id]);

  const fetchCommittee = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/committee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCommittee(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleLike = async (postId) => {
    await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCommittee();
  };

  const handleComment = async (postId, text, parentId) => {
    await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, parentId }),
    });
    fetchCommittee();
  };

  const handleRSVP = async (postId) => {
    await fetch(`http://localhost:5000/api/posts/${postId}/rsvp`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCommittee();
  };

  const viewStory = async (story) => {
    setActiveStory(story);
    await fetch(`http://localhost:5000/api/stories/${story.id}/view`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const reactToStory = async (emoji) => {
    await fetch(`http://localhost:5000/api/stories/${activeStory.id}/react`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emoji }),
    });
  };

  if (loading || fetching) return null;

  if (!committee)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)" }}>Committee not found</p>
      </div>
    );

  const activeStories =
    committee.stories?.filter((s) => new Date(s.expiresAt) > new Date()) || [];

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

          {/* reactions */}
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

          {/* story navigation dots */}
          {activeStories.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              {activeStories.map((s) => (
                <div
                  key={s.id}
                  onClick={() => viewStory(s)}
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
        {/* profile section */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {/* profile pic with story ring */}
            <div
              onClick={() =>
                activeStories.length > 0 && viewStory(activeStories[0])
              }
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                padding: activeStories.length > 0 ? "3px" : "0",
                background:
                  activeStories.length > 0
                    ? "linear-gradient(135deg, #D174D2, #E0563F)"
                    : "transparent",
                cursor: activeStories.length > 0 ? "pointer" : "default",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #D174D2, #E0563F)",
                  border:
                    activeStories.length > 0
                      ? "2px solid rgba(0,0,0,0.5)"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                  fontWeight: "700",
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
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.3rem",
                }}
              >
                <h1 style={{ fontSize: "1.3rem", fontWeight: "700" }}>
                  {committee.name}
                </h1>
                {committee.verified && (
                  <span
                    style={{
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
              </div>
              {committee.bio && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {committee.bio}
                </p>
              )}
            </div>
          </div>

          {/* updates strip */}
          {committee.updates?.length > 0 && (
            <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  width: "max-content",
                }}
              >
                {committee.updates.map((update) => (
                  <div
                    key={update.id}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "0.75rem 1rem",
                      minWidth: "200px",
                      maxWidth: "250px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        marginBottom: update.link ? "0.5rem" : "0",
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
                        🔗 Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* posts */}
        <div>
          {committee.posts?.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 0",
                color: "var(--text-muted)",
              }}
            >
              <p>No posts yet</p>
            </div>
          ) : (
            committee.posts?.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, committee }}
                onLike={handleLike}
                onComment={handleComment}
                onRSVP={handleRSVP}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommitteePage;
