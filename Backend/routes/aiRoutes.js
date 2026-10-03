const express = require("express");
const router = express.Router();
const { getAiRecommendation } = require("../controllers/aiController");

router.post("/recommend", getAiRecommendation);
router.post("/chat", getAiRecommendation);

module.exports = router;
