const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const mainRouter = require("./routes");
const postRouter = require("./routes/post");

const app = express();

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
  res.status(404).send("없는 페이지임");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("올바르지 않은 요청임");
});

app.listen(3000, () => console.log("3000번 포트 연결 중..."));
