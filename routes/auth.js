const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

/*router.post("/login_process", (req, res) => {
  res.send("로그인 했다 치고");
});*/

module.exports = router;
