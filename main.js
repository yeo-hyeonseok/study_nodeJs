const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const mainPageTemplate = require("./templates/mainPageTemplate");
const writePageTemplate = require("./templates/writePageTemplate");
const express = require("express");
const app = express();

const fileNames = fs.readdirSync("data");

app.get("/", (_, res) => {
  const _fileNames = fs.readdirSync("data");

  res.send(
    mainPageTemplate({
      title: "main",
      categoryList: _fileNames,
      controls: '<a href="/write">write</a>',
      desc: "main",
    })
  );
});

app.get("/page/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;
  const _fileNames = fs.readdirSync("data");

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) throw err;

    const sanitizedData = sanitizeHtml(data);

    res.send(
      mainPageTemplate({
        title: filteredId,
        categoryList: _fileNames,
        controls: `
            <a href="/update/${filteredId}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value=${filteredId} />
              <button type="submit">delete</button>
            </form>`,
        desc: sanitizedData,
      })
    );
  });
});

app.get("/write", (_, res) => {
  res.send(
    writePageTemplate({ action: "/write_process", categoryList: fileNames })
  );
});

app.post("/write_process", (req, res) => {
  let body = "";

  req.on("data", (data) => (body += data));
  req.on("end", () => {
    const post = qs.parse(body);

    fs.writeFile(`data/${post.title}`, post.desc, (err) => {
      if (err) throw err;

      res.redirect(302, `/page/${post.title}`);
    });
  });
});

app.get("/update/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) throw err;

    const sanitizedData = sanitizeHtml(data);

    res.send(
      writePageTemplate({
        id: filteredId,
        action: "/update_process",
        categoryList: fileNames,
        title: filteredId,
        desc: sanitizedData,
      })
    );
  });
});

app.post("/update_process", (req, res) => {
  let body = "";

  req.on("data", (data) => (body += data));
  req.on("end", () => {
    const post = qs.parse(body);

    fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
      if (err) throw err;

      fs.writeFile(`data/${post.title}`, post.desc, (err) => {
        if (err) throw err;

        res.redirect(302, `/page/${post.title}`);
      });
    });
  });
});

app.post("/delete_process", (req, res) => {
  let body = "";

  req.on("data", (data) => (body += data));
  req.on("end", () => {
    const post = qs.parse(body);
    const filteredId = path.parse(post.id).name;

    fs.unlink(`data/${filteredId}`, (err) => {
      if (err) throw err;

      res.redirect(302, "/");
    });
  });
});

app.listen(3000, () => console.log("3000번 포트 연결 중..."));
