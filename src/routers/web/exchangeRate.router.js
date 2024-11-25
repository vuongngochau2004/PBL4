const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../../middlewares/async.middleware');
const { getDataByBankId, getData, createData } = require('../../app/controllers/web/exchangeRate.controller');
router.route('/')
.get(asyncMiddleware(getData))
.get(asyncMiddleware(createData))
router.route('/:id')
.get(
  getDataByBankId,
);

module.exports = router;