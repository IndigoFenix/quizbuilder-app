const express = require("express");
const router = express.Router();

const controller = require('../controllers/quiz-admin');

router.post("/", controller.create);
router.get("/", controller.all);
router.get("/:id", controller.get);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;