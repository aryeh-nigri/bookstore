const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Book Model
const Book = require("../../models/Book");

// @route   GET api/books
// @desc    Get All Books
// @access  Public
router.get("/", (req, res) => {
  Book.getBooks((err, books) => {
    if (err) {
      throw err;
    }
    res.json(books);
  });
  //   Item.find()
  //     .sort({ date: -1 })
  //     .then(items => res.json(items));
});

// @route   POST api/books
// @desc    Create A Book
// @access  Private
router.post("/", auth, (req, res) => {
  var book = req.body;
  Book.addBook(book, (err, book) => {
    if (err) {
      throw err;
    }
    res.json(book);
  });
  //   const newItem = new Item({
  //     name: req.body.name
  //   });

  //   newItem.save().then(item => res.json(item));
});

// @route   DELETE api/books/:id
// @desc    Delete A Book
// @access  Private
router.delete("/:id", auth, (req, res) => {
  var id = req.params.id;
  Book.removeBook(id, (err, book) => {
    if (err) {
      throw err;
    }
    res.json(book);
  });

  //   Item.findById(req.params.id)
  //     .then(item => item.remove().then(() => res.json({ success: true })))
  //     .catch(err => res.status(404).json({ success: false }));
});

// @route   GET api/books/:id
// @desc    Get A Book
// @access  Public
router.get("/:id", (req, res) => {
  Book.getBookById(req.params.id, (err, book) => {
    if (err) {
      throw err;
    }
    res.json(book);
  });
});

// @route   UPDATE api/books/:id
// @desc    Update A Book
// @access  Private
router.put("/:id", auth, (req, res) => {
  var id = req.params.id;
  var book = req.body;
  Book.updateBook(id, book, {}, (err, book) => {
    if (err) {
      throw err;
    }
    res.json(book);
  });
});

module.exports = router;
