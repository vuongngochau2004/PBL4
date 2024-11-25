const express = require('express');
const router = express.Router();

const homeRouter = require('./home.router');
const authRouter = require('./auth.router');


router.use("/auth", authRouter);
router.use("/", homeRouter);

module.exports = router;

