const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const mainPageTemplate = require("./templates/mainPageTemplate");
const writePageTemplate = require("./templates/writePageTemplate");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
/*
app.use((req, _, next) => {
  req.categoryList = fs.readdirSync("data");
  next(); // 다음 미들웨어 실행하쇼 라는 뜻
});

- 근데 이렇게 하면 req.categoryList가 필요없는 경우에도 해당 미들웨어를 호출하게 됨
- 아래와 같이 하면 특정 방식 또는 path의 요청이 들어왔을 때만 미들웨어를 호출할 수 있도록 설정할 수 있음 
*/
app.get("*", (req, _, next) => {
  req.categoryList = fs.readdirSync("data");
  next(); // 다음 미들웨어 실행하쇼 라는 뜻
});

app.get("/", (req, res) => {
  res.send(
    mainPageTemplate({
      title: "main",
      categoryList: req.categoryList,
      controls: '<a href="/write">write</a>',
      desc: "main",
    })
  );
});

app.get("/page/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) throw err;

    const sanitizedData = sanitizeHtml(data);

    res.send(
      mainPageTemplate({
        title: filteredId,
        categoryList: req.categoryList,
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

app.get("/write", (req, res) => {
  res.send(
    writePageTemplate({
      action: "/write_process",
      categoryList: req.categoryList,
    })
  );
});

app.post("/write_process", (req, res) => {
  const post = req.body;

  fs.writeFile(`data/${post.title}`, post.desc, (err) => {
    if (err) throw err;

    res.redirect(302, `/page/${post.title}`);
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
        categoryList: req.categoryList,
        title: filteredId,
        desc: sanitizedData,
      })
    );
  });
});

app.post("/update_process", (req, res) => {
  const post = req.body;

  fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
    if (err) throw err;

    fs.writeFile(`data/${post.title}`, post.desc, (err) => {
      if (err) throw err;

      res.redirect(302, `/page/${post.title}`);
    });
  });
});

app.post("/delete_process", (req, res) => {
  const post = req.body;
  const filteredId = path.parse(post.id).name;

  fs.unlink(`data/${filteredId}`, (err) => {
    if (err) throw err;

    res.redirect(302, "/");
  });
});

app.listen(3000, () => console.log("3000번 포트 연결 중..."));
