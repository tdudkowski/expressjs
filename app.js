const createError = require("http-errors");
const cookieSession = require("cookie-session");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const port = 3000;
const config = require("./config");

// ## mongoDB ##

const mongoose = require("mongoose");
// mongoose.connect(config.db, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function() {
//   console.log("connected on port " + port);
// });

const indexRouter = require("./routes/index");
const newsRouter = require("./routes/news");
const adminRouter = require("./routes/admin");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/favicon.ico", express.static("public/images/favicon.ico"));

// ## COOKIES ##
app.use(
  cookieSession({
    name: "session",
    keys: config.keySession,
    maxAge: config.maxAgeSession
  })
);

app.use(function(req, res, next) {
  req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge;
  next();
});

const Articles = require("./models/articles");
const News = require("./models/news");

app.use((req, res, next) => {
  res.locals.path = req.path;

  mongoose.connect(config.db, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  // db.once("open", function() {
  //   console.log("connected on port " + port);
  // });

  // let dataArticles = {};
  // let dataNews = {};

  Articles.find((err, res) => {
    dataArticles = res;
    return dataArticles;
  });
  News.find((err, res) => {
    dataNews = res;
    return dataNews;
  });

  next();
});

app.use("/", indexRouter);
app.use("/news", newsRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError("error"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
