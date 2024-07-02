module.exports = ({
  id,
  action = "/",
  categoryList,
  title = "",
  desc = "",
}) => {
  return /* HTML */ `
    <!DOCTYPE html>
    <html>
      <head>
        <title>WEB - ${id ? "update" : "write"}</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/css/index.css" />
      </head>
      <body>
        <div class="container">
          <section class="left_section">
            <h1 class="section_title">Routes</h1>
            <div>
              <a href="/">WEB</a>
              <ul>
                ${categoryList
                  .map(
                    (item) =>
                      `<li class="post_item">
                        <a href="/post/${item}">↳ ${item}</a>
                      </li>`
                  )
                  .join("")}
              </ul>
            </div>
          </section>
          <section class="right_section">
            <div class="description">
              <h1 class="section_title">${id ? "Update" : "Write"}</h1>
              <div class="content">
                <form action=${action} class="write_form" method="post">
                  <input type="hidden" name="id" value=${id} />
                  <input
                    type="text"
                    name="title"
                    class="title_input"
                    placeholder="title..."
                    value="${title}"
                  />
                  <textarea
                    name="desc"
                    class="desc_textarea"
                    placeholder="desc..."
                  >
${desc}</textarea
                  >
                  <div>
                    <button id="goBackButton" type="button">back</button>
                    <button type="submit">submit</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
        <script>
          document
            .getElementById("goBackButton")
            .addEventListener("click", function () {
              history.back();
            });
        </script>
        <footer>Web3-ExpressJs...</footer>
      </body>
    </html>
  `;
};
