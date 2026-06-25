import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function CommitteePage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [committee, setCommittee] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [activeStory, setActiveStory] = useState(null);
  const [activeStories, setActiveStories] = useState([]);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchCommittee();
  }, [user, token, id]);

  const fetchCommittee = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/committee/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setCommittee(data);
      setBio(data.bio || "");
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
    fetchCommittee();
  };

  const handleRSVP = async (postId) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/rsvp`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCommittee();
  };

  const viewStory = async (story) => {
    setActiveStory(story);
    const stories =
      committee.stories?.filter((s) => new Date(s.expiresAt) > new Date()) ||
      [];
    setActiveStories(stories);
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/stories/${story.id}/view`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
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

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    await fetch(`${import.meta.env.VITE_API_URL}/api/committee/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    setEditingBio(false);
    fetchCommittee();
  };

  const isMyPage = user?.role === "committee" && committee?.userId === user?.id;

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

  const activeStoriesList =
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
          maxWidth: "700px",
          margin: "0 auto",
          padding: "80px 1rem 2rem",
        }}
      >
        {/* profile section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {/* profile pic with story ring */}
            <div style={{ position: "relative" }}>
              <div
                onClick={() =>
                  activeStoriesList.length > 0 &&
                  viewStory(activeStoriesList[0])
                }
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  padding: activeStoriesList.length > 0 ? "3px" : "0",
                  background:
                    activeStoriesList.length > 0
                      ? "linear-gradient(135deg, #D174D2, #E0563F)"
                      : "rgba(255,255,255,0.1)",
                  cursor: activeStoriesList.length > 0 ? "pointer" : "default",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #D174D2, #E0563F)",
                    border:
                      activeStoriesList.length > 0
                        ? "2px solid rgba(0,0,0,0.5)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
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
              {isMyPage && (
                <label
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#D174D2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                  }}
                >
                  ✏️
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setProfilePic(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            <div style={{ flex: 1 }}>
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

              {editingBio ? (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <input
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Add a bio..."
                    style={{
                      flex: 1,
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.07)",
                      color: "#fff",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleUpdateProfile}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #D174D2, #E0563F)",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBio(false)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "transparent",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {committee.bio || (isMyPage ? "Add a bio..." : "")}
                  </p>
                  {isMyPage && (
                    <button
                      onClick={() => setEditingBio(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#D174D2",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      ✏️
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* updates strip — always visible */}
          <div style={{ marginTop: "1rem" }}>
            <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  width: "max-content",
                }}
              >
                {committee.updates?.length > 0 ? (
                  committee.updates.map((update) => (
                    <div
                      key={update.id}
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(209,116,210,0.3)",
                        borderRadius: "12px",
                        padding: "0.75rem 1rem",
                        minWidth: "200px",
                        maxWidth: "260px",
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
                  ))
                ) : (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      padding: "0.75rem 1.5rem",
                      minWidth: "250px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      📢 No updates yet — check back soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* posts count */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            {committee.posts?.length || 0} posts
          </p>
        </div>

        {/* posts grid */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "3px",
            }}
          >
            {committee.posts?.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                style={{
                  aspectRatio: "1",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.querySelector(".overlay").style.opacity =
                    "1")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.querySelector(".overlay").style.opacity =
                    "0")
                }
              >
                <img
                  src={post.image}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  className="overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                    ❤️ {post.likes?.length || 0}
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                    💬 {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommitteePage;
