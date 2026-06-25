const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../lib/cloudinary");
const {
  createStory,
  getStoriesByCollege,
  viewStory,
  reactToStory,
  deleteStory,
} = require("../controllers/storyController");

router.post("/", auth, upload.single("image"), createStory);
router.get("/", auth, getStoriesByCollege);
router.post("/:id/view", auth, viewStory);
router.post("/:id/react", auth, reactToStory);
router.delete("/:id", auth, deleteStory);

module.exports = router;
