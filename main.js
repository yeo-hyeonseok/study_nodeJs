const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const csp = require("helmet-csp");
const mainRouter = require("./routes");
const postRouter = require("./routes/post");

const app = express();

app.set("view engine", "pug");
app.use(helmet());
app.use(
  csp({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'sha256-Zm3YvhPCrKLfocvDtRTsjqgdnN0s/gYtwXGf0A8CzrI='",
      ],
    },
  })
);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (req, _, next) => {
  req.categoryList = fs.readdirSync("data");
  next();
});

/* 라우터 */
app.use("/", mainRouter);
app.use("/post", postRouter);

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
