require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mainRouter = require("./routes");
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(helmet());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(
  session({
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 300000,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.get("*", (req, _, next) => {
  req.postList = fs.readdirSync("data");
  next();
});

/* 라우터 */
app.use("/", mainRouter);
app.use("/post", postRouter);
app.use("/auth", authRouter);

/* 에러 처리 */
app.use((_, res) => {
  res
    .status(404)
    .render("error", { errorCode: 404, desc: "존재하지 않는 페이지입니다." });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(500)
    .render("error", { errorCode: 500, desc: "잘못된 요청입니다." });
});

app.listen(3000, () => console.log("3000번 포트 연결 중..."));
