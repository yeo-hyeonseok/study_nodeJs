const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const mainPageTemplate = require("../templates/mainPageTemplate");
const writePageTemplate = require("../templates/writePageTemplate");

const router = express.Router();

router.get("/write", (req, res) => {
  res.send(
    writePageTemplate({
      action: "/post/write_process",
      categoryList: req.categoryList,
    })
  );
});

router.post("/write_process", (req, res) => {
  const post = req.body;

  fs.writeFile(`data/${post.title}`, post.desc, (err) => {
    if (err) throw err;

    res.redirect(302, `/post/${post.title}`);
  });
});

router.get("/update/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) throw err;

    const sanitizedData = sanitizeHtml(data);

    res.send(
      writePageTemplate({
        id: filteredId,
        action: "/post/update_process",
        categoryList: req.categoryList,
        title: filteredId,
        desc: sanitizedData,
      })
    );
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

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) next(err);

    const sanitizedData = sanitizeHtml(data);

    res.send(
      mainPageTemplate({
        title: filteredId,
        categoryList: req.categoryList,
        controls: `
              <a href="/post/write">write</a>
              <a href="/post/update/${filteredId}">update</a>
              <form action="/post/delete_process" method="post" class="delete_form">
                <input type="hidden" name="id" value=${filteredId} />
                <button type="submit" class="delete_button">delete</button>
              </form>`,
        desc: sanitizedData,
      })
    );
  });
});

module.exports = router;
