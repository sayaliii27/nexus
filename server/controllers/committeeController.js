const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// get all pending requests (admin only)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.committeeRequest.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// approve a committee request (admin only)
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const request = await prisma.committeeRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: "Request not found" });

    const hashed = await bcrypt.hash(password, 10);

    // create user account for committee
    const user = await prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: hashed,
        college: request.college,
        role: "committee",
        committeePage: {
          create: {
            name: request.name,
            college: request.college,
            verified: true,
          },
        },
      },
    });

    // update request status
    await prisma.committeeRequest.update({
      where: { id },
      data: { status: "approved" },
    });

    // auto follow this committee for all students in the same college
    const students = await prisma.user.findMany({
      where: { college: request.college, role: "student" },
    });

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: user.id },
    });

    res.json({
      message: "Committee approved successfully",
      user,
      committeePage,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// reject a request
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.committeeRequest.update({
      where: { id },
      data: { status: "rejected" },
    });
    res.json({ message: "Request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// get all verified committees by college
const getCommitteesByCollege = async (req, res) => {
  try {
    const { college } = req.params;
    const committees = await prisma.committeePage.findMany({
      where: { college, verified: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(committees);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// get single committee page
const getCommitteePage = async (req, res) => {
  try {
    const { id } = req.params;
    const committee = await prisma.committeePage.findUnique({
      where: { id },
      include: {
        posts: { orderBy: { createdAt: "desc" } },
        updates: { orderBy: { createdAt: "desc" } },
        stories: {
          where: { expiresAt: { gt: new Date() } },
        },
      },
    });
    if (!committee)
      return res.status(404).json({ message: "Committee not found" });
    res.json(committee);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const updateProfile = async (req, res) => {
  try {
    const { bio } = req.body;
    const profilePic = req.file?.path;

    const committeePage = await prisma.committeePage.findUnique({
      where: { userId: req.user.id },
    });

    if (!committeePage)
      return res.status(403).json({ message: "Not a committee" });

    const updated = await prisma.committeePage.update({
      where: { id: committeePage.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(profilePic && { profilePic }),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getCommitteesByCollege,
  getCommitteePage,
  updateProfile,
};
