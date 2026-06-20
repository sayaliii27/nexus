const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const committeeRoutes = require("./routes/committee");
const postRoutes = require("./routes/posts");
const storyRoutes = require("./routes/stories");
const updateRoutes = require("./routes/updates");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/committee", committeeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Nexus API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
