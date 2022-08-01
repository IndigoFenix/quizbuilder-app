const express = require("express");
const router = express.Router();

const controller = require('../controllers/quiz');

router.get("/:id/answers", controller.getAnswers);
router.get("/:id", controller.get);

module.exports = router;