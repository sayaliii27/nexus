const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const committeeRoutes = require("./routes/committee");
const postRoutes = require("./routes/posts");
const storyRoutes = require("./routes/stories");
const updateRoutes = require("./routes/updates");
const notificationRoutes = require("./routes/notifications");
const prisma = require("./lib/prisma");
const bookmarkRoutes = require("./routes/bookmarks");

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = [
    "https://nexus-orcin-nine.vercel.app",
    "http://localhost:5173",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/committee", committeeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Nexus API running" });
});

// keep database alive — ping every 4 minutes
setInterval(
  async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {}
  },
  4 * 60 * 1000,
);

cron.schedule("0 * * * *", async () => {
  try {
    const deleted = await prisma.story.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    console.log(`Cleaned up ${deleted.count} expired stories`);
  } catch (err) {
    console.error("Cron error:", err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
