const express = require('express');
const router = express.Router();
const homeRouter = require('./home.router');
const exchangeRateRouter = require('./exchangeRate.router');
const currencyRouter = require('./currency.router');
const searchRouter = require('./search.router');

router.use("/search", searchRouter);
router.use("/exchange-rate", exchangeRateRouter);
router.use("/currency", currencyRouter);
router.use("/", homeRouter);

module.exports = router;

