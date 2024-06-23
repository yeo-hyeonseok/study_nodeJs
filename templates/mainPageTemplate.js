module.exports = ({ title, categoryList, controls, desc }) => {
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
      <p>${controls}</p>
      <h2>${title}</h2>
      <p>${desc}</p>      
    </body>
    </html>
    `;
};
