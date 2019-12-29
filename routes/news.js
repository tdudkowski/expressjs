const express = require("express");
const router = express.Router();

const Articles = require("../models/articles");
const News = require("../models/news");

/* GET NEWS page. */
router.get("/", (req, res) => {
  const search = req.query.search || "";

  const foundArticles = Articles.find({
    $or: [
      { title: new RegExp(search.trim(), "i") },
      { content: new RegExp(search.trim(), "i") }
    ]
  }).sort({ created: -1 });

  const foundNews = News.find({
    $or: [
      { title: new RegExp(search.trim(), "i") },
      { content: new RegExp(search.trim(), "i") }
    ]
  }).sort({ created: -1 });

  foundArticles.exec((err, dataArticles) => {
    foundNews.exec((err, dataNews) => {
      res.render("news", { title: "News", dataArticles, dataNews, search });
    });
  });
});

module.exports = router;
