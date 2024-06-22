const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const { mainPageTemplate } = require("./templates/mainPage");
const { writePageTemplate } = require("./templates/writePage");

const app = http.createServer((req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  const fileNames = fs.readdirSync("data");

  if (pathname === "/") {
    let title = queryData.id;

    if (title) {
      fs.readFile(`data/${title}`, "utf-8", (err, data) => {
        if (err) throw err;

        res.writeHead(200);
        res.end(
          mainPageTemplate({
            title,
            categoryList: fileNames,
            controls: `
            <a href="/update?id=${title}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value=${title} />
              <button type="submit">delete</button>
            </form>`,
            desc: data,
          })
        );
      });
    } else {
      res.writeHead(200);
      res.end(
        mainPageTemplate({
          title: "main",
          categoryList: fileNames,
          controls: '<a href="/write">write</a>',
          desc: "main",
        })
      );
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
    const title = queryData.id;

    fs.readFile(`data/${title}`, "utf-8", (err, data) => {
      if (err) throw err;

      res.writeHead(200);
      res.end(
        writePageTemplate({
          id: title,
          action: "/update_process",
          categoryList: fileNames,
          title: title,
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

      fs.unlink(`data/${post.id}`, (err) => {
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

app.listen(3000);
