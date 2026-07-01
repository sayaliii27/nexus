import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";

function EventCalendar() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    if (user && token) fetchEvents();
  }, [user, token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/feed`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setEvents(data.filter((p) => p.isEvent && p.eventDate));
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getEventsForDate = (day) => {
    return events.filter((e) => {
      const eventDate = new Date(e.eventDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1.5rem",
          }}
        >
          Event Calendar
        </h2>

        {/* month navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                ),
              )
            }
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ←
          </button>
          <h3 style={{ fontWeight: "600", fontSize: "1.1rem" }}>{monthName}</h3>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                ),
              )
            }
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            →
          </button>
        </div>

        {/* day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            marginBottom: "4px",
          }}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                padding: "0.5rem 0",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* calendar grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
          }}
        >
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === currentMonth.getMonth() &&
              new Date().getFullYear() === currentMonth.getFullYear();
            const isSelected = selectedDate === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  cursor: dayEvents.length > 0 ? "pointer" : "default",
                  background: isSelected
                    ? "linear-gradient(135deg, #D174D2, #E0563F)"
                    : isToday
                      ? "rgba(209,116,210,0.2)"
                      : dayEvents.length > 0
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  border:
                    isToday && !isSelected
                      ? "1px solid #D174D2"
                      : "1px solid transparent",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: isToday ? "700" : "400",
                  }}
                >
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div
                    style={{ display: "flex", gap: "2px", marginTop: "2px" }}
                  >
                    {dayEvents.slice(0, 3).map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          background: isSelected ? "#fff" : "#D174D2",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* selected date events */}
        {selectedDate && (
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "var(--text-muted)",
              }}
            >
              {selectedEvents.length > 0
                ? `Events on ${currentMonth.toLocaleString("default", { month: "long" })} ${selectedDate}`
                : `No events on ${currentMonth.toLocaleString("default", { month: "long" })} ${selectedDate}`}
            </h3>
            {selectedEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/post/${event.id}`)}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  marginBottom: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <img
                  src={event.image}
                  alt=""
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {event.caption || "Event"}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {event.committee?.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {event.eventTime && <span>🕐 {event.eventTime}</span>}
                    {event.venue && <span>📍 {event.venue}</span>}
                    {event.category && (
                      <span style={{ color: "#D174D2" }}>{event.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* upcoming events list */}
        {!selectedDate && (
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "var(--text-muted)",
              }}
            >
              Upcoming events
            </h3>
            {fetching ? (
              <p style={{ color: "var(--text-muted)" }}>Loading...</p>
            ) : events.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                No upcoming events
              </p>
            ) : (
              events
                .filter((e) => new Date(e.eventDate) >= new Date())
                .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/post/${event.id}`)}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      padding: "1rem",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      marginBottom: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "48px",
                        textAlign: "center",
                        background: "rgba(209,116,210,0.15)",
                        borderRadius: "8px",
                        padding: "0.5rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "700",
                          color: "#D174D2",
                          lineHeight: 1,
                        }}
                      >
                        {new Date(event.eventDate).getDate()}
                      </p>
                      <p style={{ fontSize: "0.65rem", color: "#D174D2" }}>
                        {new Date(event.eventDate).toLocaleString("default", {
                          month: "short",
                        })}
                      </p>
                    </div>
                    <img
                      src={event.image}
                      alt=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {event.caption || "Event"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {event.committee?.name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {event.eventTime && <span>🕐 {event.eventTime}</span>}
                        {event.venue && <span>📍 {event.venue}</span>}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCalendar;
