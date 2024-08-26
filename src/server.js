const http = require("http");
const booksRoute = require("./routes");

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/books")) {
    booksRoute(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ status: "fail", message: "Resource not found" }));
  }
});

const HOST = "localhost";
const PORT = 9000;
server.listen(PORT, HOST, () => {
  console.log(`Server running on port http://${HOST}:${PORT}`);
});
