const booksHandler = require("./handlers");

const booksRoute = (req, res) => {
  if (req.method === "POST" && req.url === "/books") {
    booksHandler.addBook(req, res);
  } else if (req.method === "GET" && req.url === "/books") {
    booksHandler.getAllBooks(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/books/")) {
    booksHandler.getBookById(req, res);
  } else if (req.method === "PUT" && req.url.startsWith("/books/")) {
    booksHandler.updateBook(req, res);
  } else if (req.method === "DELETE" && req.url.startsWith("/books/")) {
    booksHandler.deleteBook(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ status: "fail", message: "Route not found" }));
  }
};

module.exports = booksRoute;
