const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createUpdate,
  getUpdates,
  deleteUpdate,
} = require("../controllers/updateController");

router.post("/", auth, createUpdate);
router.get("/:committeeId", getUpdates);
router.delete("/:id", auth, deleteUpdate);

module.exports = router;
