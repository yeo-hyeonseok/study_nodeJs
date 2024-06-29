module.exports = ({ title, categoryList, controls, desc }) => {
  return /* HTML */ `
    <!DOCTYPE html>
    <html>
      <head>
        <title>WEB-${title}</title>
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
                      <a href="/page/${item}">↳ ${item}</a>
                    </li>`
                  )
                  .join("")}
              </ul>
            </div>
          </section>
          <section class="right_section">
            <div class="controls">${controls}</div>
            <div class="description">
              <h1 class="section_title">Description</h1>
              <div class="content">
                <h2 class="content_title">${title}</h2>
                <p class="content_desc">${desc}</p>
              </div>
            </div>
          </section>
        </div>
        <footer>Web3-ExpressJs...</footer>
      </body>
    </html>
  `;
};
