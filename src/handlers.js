const { nanoid } = require("nanoid");
const { books } = require("./data");
const url = require("url");

const addBook = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = JSON.parse(body);

    if (!name) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          status: "fail",
          message: "Gagal menambahkan buku. Mohon isi nama buku",
        })
      );
      return;
    }

    if (readPage > pageCount) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          status: "fail",
          message:
            "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        })
      );
      return;
    }

    const id = nanoid();
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: { bookId: id },
      })
    );
  });
};

const getAllBooks = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { name, reading, finished } = parsedUrl.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading === "0") {
    filteredBooks = filteredBooks.filter((book) => book.reading === false);
  } else if (reading === "1") {
    filteredBooks = filteredBooks.filter((book) => book.reading === true);
  }

  if (finished === "0") {
    filteredBooks = filteredBooks.filter((book) => book.finished === false);
  } else if (finished === "1") {
    filteredBooks = filteredBooks.filter((book) => book.finished === true);
  }

  const result = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ status: "success", data: { books: result } }));
};

const getBookById = (req, res) => {
  const id = req.url.split("/")[2];
  const book = books.find((b) => b.id === id);

  if (book) {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ status: "success", data: { book } }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({ status: "fail", message: "Buku tidak ditemukan" })
    );
  }
};

const updateBook = (req, res) => {
  const id = req.url.split("/")[2];
  let body = [];
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = JSON.parse(body);

      // Check if the book exists
      const bookIndex = books.findIndex((b) => b.id === id);
      if (bookIndex === -1) {
        res.writeHead(404, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
          })
        );
        return;
      }

      // Check if name is provided
      if (!name) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
          })
        );
        return;
      }

      // Check if readPage is not greater than pageCount
      if (readPage > pageCount) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "fail",
            message:
              "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
          })
        );
        return;
      }

      const updatedAt = new Date().toISOString();
      const finished = pageCount === readPage;

      books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
      };

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          status: "success",
          message: "Buku berhasil diperbarui",
        })
      );
    } catch (err) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          status: "fail",
          message: "Gagal memperbarui buku",
        })
      );
    }
  });
};

const deleteBook = (req, res) => {
  const id = req.url.split("/")[2];
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
    );
    return;
  }

  books.splice(bookIndex, 1);

  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(
    JSON.stringify({ status: "success", message: "Buku berhasil dihapus" })
  );
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
