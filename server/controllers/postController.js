const prisma = require("../lib/prisma");

// create a post
const createPost = async (req, res) => {
  try {
    const { caption, link, isEvent, eventDate, eventTime, venue, category } =
      req.body;
    const image = req.file?.path;

    if (!image) return res.status(400).json({ message: "Image is required" });

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });

    if (!committeePage)
      return res.status(403).json({ message: "Not a committee" });

    const post = await prisma.post.create({
      data: {
        committeeId: committeePage.id,
        image,
        caption,
        link,
        isEvent: isEvent === "true",
        eventDate: eventDate ? new Date(eventDate) : null,
        eventTime,
        venue,
        category,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// get feed posts (all committees in same college)
const getFeedPosts = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const posts = await prisma.post.findMany({
      where: {
        committee: { college: user.college, verified: true },
      },
      include: {
        committee: {
          select: { id: true, name: true, profilePic: true, verified: true },
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
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.like.findFirst({
      where: { postId: id, userId: req.user.id },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.json({ liked: false });
    }

    await prisma.like.create({ data: { postId: id, userId: req.user.id } });
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// comment on a post
const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, parentId } = req.body;

    const comment = await prisma.comment.create({
      data: {
        postId: id,
        userId: req.user.id,
        text,
        parentId: parentId || null,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// rsvp to an event
const rsvpPost = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.rSVP.findFirst({
      where: { postId: id, userId: req.user.id },
    });

    if (existing) {
      await prisma.rSVP.delete({ where: { id: existing.id } });
      return res.json({ rsvped: false });
    }

    await prisma.rSVP.create({ data: { postId: id, userId: req.user.id } });
    res.json({ rsvped: true });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });

    if (comment.userId !== req.user.id && !committeePage) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  likePost,
  commentPost,
  rsvpPost,
  deleteComment,
};
