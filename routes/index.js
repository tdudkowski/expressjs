const express = require("express");
const config = require("../config");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "About" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", (req, res) => {
  const body = req.body;
  if (body.username === config.username && body.password === config.password) {
    req.session.admin = 1;
    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
