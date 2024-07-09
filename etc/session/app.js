require("dotenv").config();
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.join(__dirname));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname)));
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션 id를 서명하는 데 사용되는 비밀 키, 클라이언트가 세션 쿠키를 변조하지 않도록 보호하는 역할을 함, 민감한 정보이므로 환경변수로 설정할 것
    resave: false, // true => 값의 변경 여부 상관없이 계속 저장, false => 값이 변경되는 경우에만 저장
    saveUninitialized: true, // true => 세션이 필요하기 전까지는 구동 x, false => 세션이 필요하던 안 필요하던 무조건 구동(서버 부담 up)
    store: new FileStore(), // 세션을 sessions 폴더에 저장하도록 설정(기본 세션 스토어는 메모리임)
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  if (req.session.num === undefined) {
    req.session.num = 0;
  } else {
    req.session.num = req.session.num + 1;
  }
  res.send(`${req.session.num}`);
});

app.listen(4000, () => console.log("4000번 포트 연결 중..."));
