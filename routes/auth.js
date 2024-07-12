const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
