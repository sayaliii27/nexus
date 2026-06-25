const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// admin routes (you manually call these)
router.get("/requests", getPendingRequests);
router.post("/approve/:id", approveRequest);
router.post("/reject/:id", rejectRequest);

// public routes
router.get("/college/:college", getCommitteesByCollege);
router.get("/:id", getCommitteePage);

const { upload } = require("../lib/cloudinary");
const {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getCommitteesByCollege,
  getCommitteePage,
  updateProfile,
} = require("../controllers/committeeController");

router.put("/profile", auth, upload.single("profilePic"), updateProfile);

module.exports = router;
