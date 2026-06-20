const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  requestCommittee,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/request-committee", requestCommittee);

module.exports = router;
