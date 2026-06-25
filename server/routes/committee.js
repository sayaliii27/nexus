const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../lib/cloudinary");
const {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getCommitteesByCollege,
  getCommitteePage,
  updateProfile,
} = require("../controllers/committeeController");

router.get("/requests", getPendingRequests);
router.post("/approve/:id", approveRequest);
router.post("/reject/:id", rejectRequest);
router.put("/profile", auth, upload.single("profilePic"), updateProfile);
router.get("/college/:college", getCommitteesByCollege);
router.get("/:id", getCommitteePage);

module.exports = router;
