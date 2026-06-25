import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StoriesRow({ onStoryClick }) {
  const { token } = useAuth();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // group by committee
      const grouped = {};
      data.forEach((story) => {
        if (!grouped[story.committeeId]) {
          grouped[story.committeeId] = {
            committee: story.committee,
            stories: [],
          };
        }
        grouped[story.committeeId].stories.push(story);
      });
      setStories(Object.values(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  if (stories.length === 0) return null;

  return (
    <div
      style={{
        overflowX: "auto",
        marginBottom: "1.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          width: "max-content",
          padding: "0.5rem 0",
        }}
      >
        {stories.map(({ committee, stories: committeeStories }) => (
          <div
            key={committee.id}
            onClick={() => onStoryClick(committeeStories)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                padding: "2px",
                background: "linear-gradient(135deg, #D174D2, #E0563F)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "2px solid rgba(0,0,0,0.5)",
                  background: "linear-gradient(135deg, #D174D2, #E0563F)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
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
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                maxWidth: "64px",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {committee.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesRow;
