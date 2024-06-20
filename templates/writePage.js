exports.writePageTemplate = (title, categoryList) => {
  return `
      <!doctype html>
      <html>
      <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
        ${categoryList
          .map((item) => `<li><a href="/?id=${item}">${item}</a></li>`)
          .join("")}
        </ul>
        <a href="/write">write</a>
        <h2>${title}</h2>
        <form action="/write_process" method="post">
          <p><input type="text" name="title" placeholder="제목 쓰셈" /></p>
          <div><textarea name="content" name="content" placeholder="내용 쓰셈"></textarea><div/>          
          <input type="submit" />
        </form>
      </body>
      </html>
      `;
};
