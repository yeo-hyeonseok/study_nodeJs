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
      maxAge: 3000000,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("*", (req, _, next) => {
  req.postList = fs.readdirSync("data");
  next();
});

/* 라우터 */
app.use("/", mainRouter);
app.use("/post", postRouter);
app.use("/auth", authRouter);

/* passport */
const authData = {
  username: "id",
  password: "pw",
};

// 2번, 최초 로그인 시 호출
passport.serializeUser(function (user, done) {
  // 세션에다가 db에 접근하기 위한 식별자 저장
  done(null, user.username);
});

// 3번, 이후 로그인 상태일 때부터는 세션에 존재하는 'id' 식별자를 통해서 db의 데이터 접근
passport.deserializeUser(function (id, done) {
  done(null, authData);
});

// 1번, 입력한 정보가 db에 저장된 데이터와 일치하는지 검사
passport.use(
  new LocalStrategy(function (username, password, done) {
    if (username !== authData.username) {
      return done(null, false, { message: "그런 아이디 없음" });
    }

    if (password !== authData.password) {
      return done(null, false, { message: "비밀번호 틀림" });
    }

    // 여기서 넘겨주는 authData는 세션에 저장하기 위한 데이터
    return done(null, authData);
  })
);

// 4번, 최종적으로 인증 성공 여부에 따라 리다이렉션 처리
app.post(
  "/auth/login_process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

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
