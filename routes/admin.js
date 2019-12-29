const express = require("express");

// ## BASES ##

const Articles = require("../models/articles");
const News = require("../models/news");

// let dataArticles = {};
// let dataNews = {};

// Articles.find((err, res) => {
//   dataArticles = res;
//   return dataArticles;
// });
// News.find((err, res) => {
//   dataNews = res;
//   return dataNews;
// });

// ## ROUTER ALL ##
const router = express.Router();
router.all("*", (req, res, next) => {
  if (!req.session.admin) {
    res.redirect("login");
    return;
  }
  next();
});

/* GET ADMIN page. */

router.get("/", (req, res) => {
  res.render("admin", {
    title: "Admin",
    dataArticles,
    dataNews
  });
});

// ## ADD ##

router.get("/article/add", (req, res) => {
  res.render("article-form", {
    title: "Add Article",
    body: {},
    errors: {}
  });
});

router.post("/article/add", (req, res) => {
  let body = req.body;
  console.log(body);
  let articleData = new Articles(body);
  const errors = articleData.validateSync();
  console.log(
    `przed zapisaniem ${errors},
    body ${body}, nD ${articleData}`
  );

  articleData.save(err => {
    if (err) {
      res.render("article-form", { title: "Add article", errors, body });
      return;
    }
    res.redirect("/admin");
  });
});

router.get("/news/add", (req, res) => {
  res.render("article-form", {
    title: "Add News",
    body: {},
    errors: {}
  });
});

router.post("/news/add", (req, res) => {
  let body = req.body;
  let newsData = new News(body);
  const errors = newsData.validateSync();
  console.log(
    `przed zapisaniem ${errors},
    body ${body}, nD ${newsData}`
  );

  newsData.save(err => {
    if (err) {
      res.render("news-form", { title: "Add News", errors, body });
      return;
    }
    res.redirect("/admin");
  });
});

// ## DELETE ##

router.get("/article/delete/:id", (req, res) => {
  Articles.findByIdAndDelete(req.params.id, err => {
    res.redirect("/admin");
  });
});

router.get("/news/delete/:id", (req, res) => {
  News.findByIdAndDelete(req.params.id, err => {
    res.redirect("/admin");
  });
});

module.exports = router;
