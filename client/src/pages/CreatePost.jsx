import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    caption: "",
    link: "",
    isEvent: false,
    eventDate: "",
    eventTime: "",
    venue: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return setError("Please select an image");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", form.caption);
      formData.append("link", form.link);
      formData.append("isEvent", form.isEvent);
      if (form.isEvent) {
        formData.append("eventDate", form.eventDate);
        formData.append("eventTime", form.eventTime);
        formData.append("venue", form.venue);
        formData.append("category", form.category);
      }

      const res = await fetch("import.meta.env.VITE_API_URL/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1.2rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    marginBottom: "1rem",
  };

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
          Create Post
        </h2>

        {/* image upload */}
        <div
          onClick={() => document.getElementById("img-input").click()}
          style={{
            width: "100%",
            height: "250px",
            borderRadius: "16px",
            border: "2px dashed rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginBottom: "1rem",
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Click to upload image</p>
          )}
        </div>
        <input
          id="img-input"
          type="file"
          accept="image/*"
          onChange={handleImage}
          style={{ display: "none" }}
        />

        <textarea
          placeholder="Caption..."
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          style={{ ...inputStyle, height: "100px", resize: "none" }}
        />

        <input
          style={inputStyle}
          placeholder="Link (optional)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        {/* event toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            onClick={() => setForm({ ...form, isEvent: !form.isEvent })}
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "12px",
              background: form.isEvent
                ? "linear-gradient(135deg, #D174D2, #E0563F)"
                : "rgba(255,255,255,0.15)",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: form.isEvent ? "23px" : "3px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            This is an event
          </span>
        </div>

        {form.isEvent && (
          <>
            <input
              style={inputStyle}
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
            <input
              style={inputStyle}
              type="time"
              value={form.eventTime}
              onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <select
              style={inputStyle}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="General">General</option>
            </select>
          </>
        )}

        {error && (
          <p
            style={{
              color: "#E0563F",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #D174D2, #E0563F)",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
