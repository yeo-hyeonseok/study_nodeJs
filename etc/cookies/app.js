const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

app.set("views", path.join(__dirname));
app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  let isAuth = req.cookies.id === "id" && req.cookies.pw === "pw";

  res.render("main", { isAuth });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login_process", (req, res) => {
  const user = req.body;

  if (user.id === "id" && user.pw === "pw") {
    res.cookie("id", user.id, { httpOnly: true, secure: true, maxAge: 300000 });
    res.cookie("pw", user.pw, { httpOnly: true, secure: true, maxAge: 300000 });
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

app.post("/logout_process", (req, res) => {
  res.clearCookie("id");
  res.clearCookie("pw");
  res.redirect("/");
});

app.listen(4000, () => console.log("4000번 포트 연결 중..."));

/*
    1. maxAge
    - maxAge 설정 시 => 브라우저를 종료해도 남아있는 permanent 쿠키 전송
    - maxAge 설정 안할 시 => 브라우저를 종료하면 사라지는 휘발성의 session 쿠키 전송

    2. secure
    - https 통신 방식일 경우에만 쿠키를 전송하도록 설정

    3. httpOnly
    - 클라이언트측 자바스크립트를 통해서 쿠키에 접근할 수 없도록 설정

    4. path
    - 특정 경로에서만 유효한 쿠키를 전송하고 싶을 때 설정

    5. domain
    - 특정 도메인 또는 하위 도메인에서 유효한 쿠키를 만들고 싶을 때 설정
*/
