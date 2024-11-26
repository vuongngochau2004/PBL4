const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async.middleware');
const { getDataByBankId, getData } = require('../../app/controllers/web/exchangeRate.controller');
router.route('/')
.get(asyncMiddleware(getData))
router.route('/:id')
.get(
  getDataByBankId,
);

module.exports = router;