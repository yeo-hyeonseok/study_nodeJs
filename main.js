let http = require("http");
let fs = require("fs");

let app = http.createServer((req, res) => {
  let url = req.url;

  if (url == "/") {
    url = "/index.html";
  }

  if (url == "/favicon.ico") {
    res.writeHead(404);
    res.end();
    return;
  }

  res.writeHead(200);

  /* 
    - 사용자로부터 요청이 들어오면 그에 맞는 페이지를 현재 디렉토리에서 찾아서 응답을 해주는 거임
    - __dirname: nodejs에서 제공하는 전역 변수로 현재 실행 중인 스크립트가 포함된 디렉토리의 절대 경로를 가리킴. 비슷한 걸로 __filename이 있는데,
      얘는 현재 실행 중인 스크립트의 절대 경로를 가리킴.  
  */
  res.end(fs.readFileSync(__dirname + url));
  console.log("__dirname + url: ", __dirname + url);
});

app.listen(3000);
