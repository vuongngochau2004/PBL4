const express = require('express');
const router = express.Router();

const homeRouter = require('./home.router');
const userRouter = require('./user.router');

router.use("/users", userRouter);
router.use("/", homeRouter);

module.exports = router;

