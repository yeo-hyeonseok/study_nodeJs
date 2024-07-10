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
    cookie: {
      secure: false, // https를 통해서만 쿠키가 전송되도록 설정
      httpOnly: true, // 클라이언트픅 자바스크립트에서 쿠키로 접근할 수 없도록 설정
      maxAge: 60000, // 만료 시간
    },
    secret: process.env.SESSION_SECRET, // 세션 id를 서명하는 데 사용되는 비밀 키, 클라이언트가 세션 쿠키를 변조하지 않도록 보호하는 역할을 함, 민감한 정보이므로 환경변수로 설정할 것
    resave: false, // true => 값의 변경 여부 상관없이 계속 저장, false => 값이 변경되는 경우에만 저장
    saveUninitialized: true, // true => 세션이 필요하기 전까지는 구동 x, false => 세션이 필요하던 안 필요하던 무조건 구동(서버 부담 up)
    store: new FileStore(), // 세션을 sessions 폴더에 저장하도록 설정(기본 세션 스토어는 메모리임)
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

const authData = {
  id: "id",
  pw: "pw",
};

app.get("/", (req, res) => {
  res.render("main", { isAuth: req.session.is_logined });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login_process", (req, res) => {
  const user = req.body;

  if (user.id === authData.id && user.pw === authData.pw) {
    req.session.is_logined = true;
    req.session.userId = authData.id;
    req.session.save(function () {
      res.redirect("/");
    });
  } else {
    res.send("로그인 실패");
  }
});

app.post("/logout_process", (req, res) => {
  req.session.destroy(function () {
    res.redirect("/");
  });
});

app.listen(4000, () => console.log("4000번 포트 연결 중..."));
