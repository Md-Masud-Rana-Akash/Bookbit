const express = require("express");
const router = express.Router();
const { Author } = require("../models/author");
const { Book } = require('../models/book')

//All Author
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }

  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query
    });
  } catch (error) {
    res.send(error.message).redirect("/");
  }
});

//New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});


//Create Author Route
router.post("/", async (req, res) => {
  let author = new Author({
    name: req.body.name
  });

  try {
    author = await author.save();
    res.redirect(`authors/${author.id}`);
    // res.send(req.body.name);
  } catch (error) {
    res.render("authors/new", {
      authors: author,
      erroMessage: `Error creating new author because of ${error.message}`
    });
  }
});


//DETAILS Author Route
router.get("/:id", async(req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id}).limit(6).exec();
    res.render('authors/show' , {
      author: author,
      booksByAuthor: books
    })
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
});


//EDIT
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (error) {
    res.redirect("/authors");
  }
});


//UPDATE
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id,{});
    author.name = req.body.name;
    author = await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        authors: author,
        erroMessage: `Error updating the author because of ${error.message}`
      });
    }
  }
});


//DELETE
router.delete("/:id", async(req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect(`/authors`);
  } catch (error) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
