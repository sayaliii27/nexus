const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../lib/cloudinary");
const {
  createPost,
  getFeedPosts,
  likePost,
  commentPost,
  rsvpPost,
  deleteComment,
} = require("../controllers/postController");

router.post("/", auth, upload.single("image"), createPost);
router.get("/feed", auth, getFeedPosts);
router.post("/:id/like", auth, likePost);
router.post("/:id/comment", auth, commentPost);
router.post("/:id/rsvp", auth, rsvpPost);
router.delete("/comment/:id", auth, deleteComment);

module.exports = router;
