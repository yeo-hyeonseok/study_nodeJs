const express = require("express");

const router = express.Router();

router.get("/", (req, res) => res.render("main", { postList: req.postList }));

module.exports = router;
