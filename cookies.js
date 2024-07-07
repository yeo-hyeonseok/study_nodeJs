const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.get("/", (req, res) => {
  if (!req.cookies.name) {
    res.cookie("name", "초코칩 쿠키", {
      httpOnly: true,
      maxAge: 5252,
    });
  }

  res.send(`내가 만든 쿠키: ${req.cookies.name ?? "그런 건 없어요~"}`);
});

app.listen(4000, () => console.log("4000번 포트 연결 중..."));
