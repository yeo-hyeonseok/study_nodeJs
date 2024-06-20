const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const { mainPageTemplate } = require("./templates/mainPage");
const { writePageTemplate } = require("./templates/writePage");

const app = http.createServer((req, res) => {
  const _url = req.url;
  // url의 쿼리스트링 정보 반환
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
  const fileNames = fs.readdirSync("data");

  if (pathname === "/") {
    let title = queryData.id;

    if (title) {
      fs.readFile(`data/${title}`, "utf-8", (error, data) => {
        if (error) throw error;

        res.writeHead(200);
        res.end(mainPageTemplate(title, fileNames, data));
      });
    } else {
      res.writeHead(200);
      res.end(mainPageTemplate("main", fileNames, "main"));
    }
  } else if (pathname == "/write") {
    res.writeHead(200);
    res.end(writePageTemplate("write", fileNames));
  } else if (pathname == "/write_process") {
    let body = "";

    req.on("data", (data) => (body += data));
    req.on("end", () => {
      const post = qs.parse(body);

      fs.writeFile(`data/${post.title}`, post.content, (err) => {
        if (err) throw err;

        res.writeHead(302, { location: `/?id=${post.title}` });
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }

  /* 
    - 사용자로부터 요청이 들어오면 그에 맞는 페이지를 현재 디렉토리에서 찾아서 응답을 해주는 거임
    - __dirname: nodejs에서 제공하는 전역 변수로 현재 실행 중인 스크립트가 포함된 디렉토리의 절대 경로를 가리킴. 비슷한 걸로 __filename이 있는데,
      얘는 현재 실행 중인 스크립트의 절대 경로를 가리킴.    
  res.end(fs.readFileSync(__dirname + _url));
  */
});

app.listen(3000);
