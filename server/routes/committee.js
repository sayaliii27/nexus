const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getCommitteesByCollege,
  getCommitteePage,
} = require("../controllers/committeeController");

// admin routes (you manually call these)
router.get("/requests", getPendingRequests);
router.post("/approve/:id", approveRequest);
router.post("/reject/:id", rejectRequest);

// public routes
router.get("/college/:college", getCommitteesByCollege);
router.get("/:id", getCommitteePage);

module.exports = router;
