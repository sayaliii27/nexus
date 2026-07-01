const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  toggleBookmark,
  getBookmarks,
} = require("../controllers/bookmarkController");

router.post("/:id", auth, toggleBookmark);
router.get("/", auth, getBookmarks);

module.exports = router;
