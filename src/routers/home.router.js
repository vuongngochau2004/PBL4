const express = require('express');
const router = express.Router();
const { getData } = require('../app/controllers/home.controller');
router.route('/')
.get(
  getData,
);

module.exports = router;