const express = require('express');
const router = express.Router();
const { getData } = require('../../app/controllers/web/currency.controller');
router.route('/:cur')
.get(
  getData,
);

module.exports = router;