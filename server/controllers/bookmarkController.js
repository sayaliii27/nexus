const prisma = require("../lib/prisma");

const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.bookmark.findFirst({
      where: { postId: id, userId: req.user.id },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ bookmarked: false });
    }

    await prisma.bookmark.create({
      data: { postId: id, userId: req.user.id },
    });
    res.json({ bookmarked: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        post: {
          include: {
            committee: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                verified: true,
              },
            },
            likes: true,
            comments: {
              where: { parentId: null },
              include: {
                user: { select: { id: true, name: true } },
                replies: {
                  include: { user: { select: { id: true, name: true } } },
                },
              },
            },
            rsvps: true,
            bookmarks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookmarks.map((b) => b.post));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { toggleBookmark, getBookmarks };
