const express = require('express');
const router = express.Router();
const { getDataByBankId, getData, createData } = require('../app/controllers/exchangeRate.controller');
router.route('/')
.get(
  getData,
  createData,
);
router.route('/:id')
.get(
  getDataByBankId,
);

module.exports = router;