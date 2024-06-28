module.exports = ({
  id,
  action = "/",
  categoryList,
  title = "",
  desc = "",
}) => {
  return `
      <!doctype html>
      <html>
      <head>
        <title>WEB - ${id ? "update" : "write"}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/css/index.css" />
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
        ${categoryList
          .map((item) => `<li><a href="/?id=${item}">${item}</a></li>`)
          .join("")}
        </ul>
        <h2>${id ? "update" : "write"}</h2>
        <form action=${action} method="post">
          <input type="hidden" name="id" value=${id} />
          <p><input type="text" name="title" placeholder="제목 쓰셈" value="${title}" /></p>
          <div><textarea name="desc" name="desc" placeholder="내용 쓰셈">${desc}</textarea><div/>          
          <input type="submit" />
        </form>
      </body>
      </html>
      `;
};
