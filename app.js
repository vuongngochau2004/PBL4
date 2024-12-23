const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const { createData } = require('./src/app/controllers/crawl.controller');

const adminRouter = require('./src/routers/admin/index.router');
const webRouter = require('./src/routers/web/index.router');  

const db = require('./src/configs/database');

const expressLayouts = require("express-ejs-layouts");
db.connect();

// view engine setup
app.set("views", path.join(__dirname, "src/resources/views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Sử dụng middleware cookie-parser
app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.static(path.join(__dirname, "src/uploads")));

// Crawl data
createData();

// middleware to crawl data
app.use(`/admin`, (req, res, next) => {
  app.set("layout", "admin"); // Set layout for admin
  next();
}, adminRouter);

// Middleware to set layout for web
app.use("/", (req, res, next) => {
  app.set("layout", "web"); // Set layout for web
  next();
}, webRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});