const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const db = require("../lib/db");
const shortId = require("shortid");

const router = express.Router();

router.get("/write", (req, res) => {
  if (req.user) {
    res.render("write", {
      action: "/post/write_process",
      postList: req.postList,
    });
  } else {
    res.render("login");
  }
});

router.post("/write_process", (req, res) => {
  const post = {
    id: shortId.generate(),
    userId: req.user.id,
    username: req.user.username,
    title: req.body.title,
    desc: req.body.desc,
  };

  db.get("posts").push(post).write();
  res.redirect(302, `/post/${post.id}`);
});

router.get("/update/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) throw err;

    const sanitizedData = sanitizeHtml(data);

    res.render("write", {
      postList: req.postList,
      action: "/post/update_process",
      id: filteredId,
      title: filteredId,
      desc: sanitizedData,
    });
  });
});

router.post("/update_process", (req, res) => {
  const post = req.body;

  fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
    if (err) throw err;

    fs.writeFile(`data/${post.title}`, post.desc, (err) => {
      if (err) throw err;

      res.redirect(302, `/post/${post.title}`);
    });
  });
});

router.post("/delete_process", (req, res) => {
  const post = req.body;
  const filteredId = path.parse(post.id).name;

  fs.unlink(`data/${filteredId}`, (err) => {
    if (err) throw err;

    res.redirect(302, "/");
  });
});

router.get("/:pageId", (req, res, next) => {
  const filteredId = path.parse(req.params.pageId).name;
  const post = db.get("posts").find({ id: filteredId }).value();

  res.render("post", {
    isLogined: req.user,
    id: filteredId,
    postList: req.postList,
    title: sanitizeHtml(post.title),
    desc: sanitizeHtml(post.desc),
  });
});

module.exports = router;
