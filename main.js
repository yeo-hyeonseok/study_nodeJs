const http = require("http");
const fs = require("fs");
const url = require("url");

const app = http.createServer((req, res) => {
  const _url = req.url;
  // url의 쿼리스트링 정보 반환
  const queryData = url.parse(_url, true).query;

  let title = queryData.id;
  if (_url == "/") title = "main";

  if (_url == "/favicon.ico") {
    res.writeHead(404);
    res.end();
    return;
  }

  res.writeHead(200);

  fs.readFile(`data/${title}.html`, "utf-8", (error, data) => {
    if (error) throw error;

    const template = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
        <li><a href="/?id=html">HTML</a></li>
        <li><a href="/?id=css">CSS</a></li>
        <li><a href="/?id=js">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      ${data}
    </body>
    </html>
    `;

    res.end(template);
  });

  /* 
    - 사용자로부터 요청이 들어오면 그에 맞는 페이지를 현재 디렉토리에서 찾아서 응답을 해주는 거임
    - __dirname: nodejs에서 제공하는 전역 변수로 현재 실행 중인 스크립트가 포함된 디렉토리의 절대 경로를 가리킴. 비슷한 걸로 __filename이 있는데,
      얘는 현재 실행 중인 스크립트의 절대 경로를 가리킴.    
  res.end(fs.readFileSync(__dirname + _url));
  */
});

app.listen(3000);
