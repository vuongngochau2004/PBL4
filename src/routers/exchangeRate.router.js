const express = require('express');
const router = express.Router();
const { getDataByBankId, getData, createData } = require('../app/controllers/exchangeRate.controller');
router.route('/')
.post(createData)
.get(getData)
router.route('/:id')
.get(
  getDataByBankId,
);

module.exports = router;