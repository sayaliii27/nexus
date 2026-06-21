const prisma = require("../lib/prisma");

const createUpdate = async (req, res) => {
  try {
    const { text, link } = req.body;

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });
    if (!committeePage)
      return res.status(403).json({ message: "Not a committee" });

    const update = await prisma.update.create({
      data: { committeeId: committeePage.id, text, link },
    });

    res.status(201).json(update);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUpdates = async (req, res) => {
  try {
    const { committeeId } = req.params;

    const updates = await prisma.update.findMany({
      where: { committeeId },
      orderBy: { createdAt: "desc" },
    });

    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });

    const update = await prisma.update.findUnique({ where: { id } });
    if (!update) return res.status(404).json({ message: "Update not found" });

    if (update.committeeId !== committeePage?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.update.delete({ where: { id } });
    res.json({ message: "Update deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createUpdate, getUpdates, deleteUpdate };
