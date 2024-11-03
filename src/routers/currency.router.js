const express = require('express');
const router = express.Router();
const { getData } = require('../app/controllers/currency.controller');
router.route('/:cur')
.get(
  getData,
);

module.exports = router;