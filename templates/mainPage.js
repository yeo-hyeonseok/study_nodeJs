exports.mainPageTemplate = (title, categoryList, desc) => {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
      ${categoryList
        .map((item) => `<li><a href="/?id=${item}">${item}</a></li>`)
        .join("")}
      </ol>
      <h2>${title}</h2>
      <p></p>
      ${desc}
    </body>
    </html>
    `;
};
