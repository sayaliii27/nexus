const prisma = require("../lib/prisma");

const createStory = async (req, res) => {
  try {
    const image = req.file?.path;
    if (!image) return res.status(400).json({ message: "Image is required" });

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });
    if (!committeePage)
      return res.status(403).json({ message: "Not a committee" });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.story.create({
      data: { committeeId: committeePage.id, image, expiresAt },
    });

    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// notify all students
const students = await prisma.user.findMany({
  where: { college: committeePage.college, role: "student" },
});

await prisma.notification.createMany({
  data: students.map((s) => ({
    userId: s.id,
    text: `${committeePage.name} posted a new story`,
  })),
});

const getStoriesByCollege = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const stories = await prisma.story.findMany({
      where: {
        expiresAt: { gt: new Date() },
        committee: { college: user.college, verified: true },
      },
      include: {
        committee: { select: { id: true, name: true, profilePic: true } },
        reactions: true,
        views: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const viewStory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.storyView.findFirst({
      where: { storyId: id, userId: req.user.id },
    });

    if (!existing) {
      await prisma.storyView.create({
        data: { storyId: id, userId: req.user.id },
      });
    }

    res.json({ viewed: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const reactToStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;

    const existing = await prisma.storyReaction.findFirst({
      where: { storyId: id, userId: req.user.id },
    });

    if (existing) {
      await prisma.storyReaction.update({
        where: { id: existing.id },
        data: { emoji },
      });
    } else {
      await prisma.storyReaction.create({
        data: { storyId: id, userId: req.user.id, emoji },
      });
    }

    res.json({ reacted: true, emoji });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });

    const story = await prisma.story.findUnique({ where: { id } });
    if (!story) return res.status(404).json({ message: "Story not found" });

    if (story.committeeId !== committeePage?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.storyReaction.deleteMany({ where: { storyId: id } });
    await prisma.storyView.deleteMany({ where: { storyId: id } });
    await prisma.story.delete({ where: { id } });

    res.json({ message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createStory,
  getStoriesByCollege,
  viewStory,
  reactToStory,
  deleteStory,
};
