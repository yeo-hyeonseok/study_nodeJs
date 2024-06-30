const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const mainPageTemplate = require("./templates/mainPageTemplate");
const writePageTemplate = require("./templates/writePageTemplate");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get("*", (req, _, next) => {
  req.categoryList = fs.readdirSync("data");
  next(); // 다음 미들웨어 실행하쇼 라는 뜻
});

app.get("/", (req, res) => {
  res.send(
    mainPageTemplate({
      title: "web",
      categoryList: req.categoryList,
      controls: '<a href="/write">write</a>',
      desc: `
        <div>
          <img src='/images/susumu.png' width='350px' />
          <p style="margin-top:1rem">
          스타크래프트 립버전 1.16.1다운 스타크래프트 립버전 1.16.1다운 있을 것 같았다. 그건 실로 벅찬 감격이었다.고마워요 본드. 덕분에 마음이 아주 편해졌어요.고마워할 필요는 없어.킴은 미소지으며 손을 내밀었다. 니콜라는 기쁜 얼굴로 악수를
          리를 질렀다. 이건....정말 상황 파악이 느린 녀석이로군. 네가 지금 어디에 스타크래프트 립버전 1.16.1다운 알기나 하는 거야 어리광을 받아주는 것도 여기까지다. 어서 이름이나 말해 어디서 감히 스타크래프트 립버전 1.16.1다운 지르나 천한
          입구가 녹슬어 엉겨붙은 문을 열어 부지내를 마차가 스타크래프트 립버전 1.16.1다운 저택으로 향하는 길만은 어떻게든 풀사리도 되어 있는 것 같지만 스타크래프트 립버전 1.16.1다운 그것을 조금이라도 빗나가면자 거칠어지는 대로의 풀숲뿐만. 그런
          은 1.16.1 스타크래프트 립버전 1.16.1다운 같이 놀아요.토니 박태환 님. 조나단의 상처는 싸이월드에도 있답니다. 저는 싸이월드에서 도토리 2개를 갖고 있거든요. 1부 조나단의 상처 스타크래프트 립버전 1.16.1다운 소년이여 스타크래프트 립버전 1.16.1이 되라.로딩 님. 출석 체크 했습니다.
          를 위해서라도 사랑의빵 님을 그만 보아주세요. 장난기 어린 의 말에 휴스턴은 멍해져 있다가 크게 스타 립버전 1.16.1다운 터트렸다. 귀족들이나 스타크래프트 립버전 1.16.1다운 황족들은 어 웃음을 는 것은 였다. 하
          잖아. 어차피 그들이 우리를 데려가지 못한다고 해도 처벌받거나 하는 스타크래프트 립버전 1.16.1다운 없습니다. 엘프들은 서로를 처벌한다는 것에 익숙하지 못하니까요. 그래도. 어정쩡한 블리자드의 대꾸에 스타크래프트 립버전 1.16.1다운 잠시 머리에 손을
          </p>
        </div>
      `,
    })
  );
});

app.get("/page/:pageId", (req, res, next) => {
  const filteredId = path.parse(req.params.pageId).name;

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) next(err);

    const sanitizedData = sanitizeHtml(data);

    res.send(
      mainPageTemplate({
        title: filteredId,
        categoryList: req.categoryList,
        controls: `
            <a href="/write">write</a>
            <a href="/update/${filteredId}">update</a>
            <form action="/delete_process" method="post" class="delete_form">
              <input type="hidden" name="id" value=${filteredId} />
              <button type="submit" class="delete_button">delete</button>
            </form>`,
        desc: sanitizedData,
      })
    );
  });
});

app.get("/write", (req, res) => {
  res.send(
    writePageTemplate({
      action: "/write_process",
      categoryList: req.categoryList,
    })
  );
});

app.post("/write_process", (req, res) => {
  const post = req.body;

  fs.writeFile(`data/${post.title}`, post.desc, (err) => {
    if (err) throw err;

    res.redirect(302, `/page/${post.title}`);
  });
});

app.get("/update/:pageId", (req, res) => {
  const filteredId = path.parse(req.params.pageId).name;

  fs.readFile(`data/${filteredId}`, "utf-8", (err, data) => {
    if (err) throw err;

    const sanitizedData = sanitizeHtml(data);

    res.send(
      writePageTemplate({
        id: filteredId,
        action: "/update_process",
        categoryList: req.categoryList,
        title: filteredId,
        desc: sanitizedData,
      })
    );
  });
});

app.post("/update_process", (req, res) => {
  const post = req.body;

  fs.rename(`data/${post.id}`, `data/${post.title}`, (err) => {
    if (err) throw err;

    fs.writeFile(`data/${post.title}`, post.desc, (err) => {
      if (err) throw err;

      res.redirect(302, `/page/${post.title}`);
    });
  });
});

app.post("/delete_process", (req, res) => {
  const post = req.body;
  const filteredId = path.parse(post.id).name;

  fs.unlink(`data/${filteredId}`, (err) => {
    if (err) throw err;

    res.redirect(302, "/");
  });
});

app.use((req, res, next) => {
  res.status(404).send("없는 페이지임");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("올바르지 않은 요청임");
});

app.listen(3000, () => console.log("3000번 포트 연결 중..."));
