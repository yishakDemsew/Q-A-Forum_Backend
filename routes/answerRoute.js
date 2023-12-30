const express = require("express");
const router = express.Router();

const { post_answer, get_answer } = require("../controller/answerController");

// give/post answer
router.post("/postanswer/:questionid", post_answer);

router.get("/answers/:questionid", get_answer);

module.exports = router;
