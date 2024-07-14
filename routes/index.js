const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("user: ", req.user);
  res.render("main", { postList: req.postList });
});

module.exports = router;
