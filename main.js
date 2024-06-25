const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const mainPageTemplate = require("./templates/mainPageTemplate");
const writePageTemplate = require("./templates/writePageTemplate");
const express = require("express");
const app = express();

const fileNames = fs.readdirSync("data");

app.get("/", (_, res) => {
  res.send(
    mainPageTemplate({
      title: "main",
      categoryList: fileNames,
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
        categoryList: fileNames,
        controls: `
            <a href="/update?id=${filteredId}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value=${filteredId} />
              <button type="submit">delete</button>
            </form>`,
        desc: sanitizedData,
      })
    );
  });
});

app.listen(3000, () => console.log("3000번 포트 연결 중..."));

/*

const app = http.createServer((req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;  

  if (pathname === "/") {
    if (queryData.id) {
      // 상세 페이지 보여주기
    } else {
      // 메인 페이지 보여주기
    }
  } else if (pathname == "/write") {
    res.writeHead(200);
    res.end(
      writePageTemplate({ action: "/write_process", categoryList: fileNames })
    );
  } else if (pathname == "/write_process") {
    let body = "";

    req.on("data", (data) => (body += data));
    req.on("end", () => {
      const post = qs.parse(body);

      fs.writeFile(`data/${post.title}`, post.desc, (err) => {
        if (err) throw err;

        res.writeHead(302, { location: `/?id=${post.title}` });
        res.end();
      });
    });
  } else if (pathname == "/update") {
    const filteredId = path.parse(queryData.id).name;

    fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
      if (err) throw err;

      res.writeHead(200);
      res.end(
        writePageTemplate({
          id: filteredId,
          action: "/update_process",
          categoryList: fileNames,
          title: filteredId,
          desc: data,
        })
      );
    });
  } else if (pathname == "/update_process") {
    let body = "";

    req.on("data", (data) => (body += data));
    req.on("end", () => {
      const post = qs.parse(body);

      fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
        if (err) throw err;

        fs.writeFile(`data/${post.title}`, post.desc, (err) => {
          if (err) throw err;

          res.writeHead(302, { location: `/?id=${post.title}` });
          res.end();
        });
      });
    });
  } else if (pathname == "/delete_process") {
    let body = "";

    req.on("data", (data) => (body += data));
    req.on("end", () => {
      const post = qs.parse(body);
      const filteredId = path.parse(post.id).name;

      fs.unlink(`data/${filteredId}`, (err) => {
        if (err) throw err;

        res.writeHead(302, { location: "/" });
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});
*/
