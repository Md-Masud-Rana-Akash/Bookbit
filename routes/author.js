const express = require("express");
const router = express.Router();
const Author = require("../models/author");

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
    res.send(req.body.name);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
