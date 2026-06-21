const prisma = require("../lib/prisma");

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createNotification = async (userId, text) => {
  await prisma.notification.create({
    data: { userId, text },
  });
};

module.exports = { getNotifications, markAllRead, createNotification };
