const express = require('express');
const router = express.Router();
const { getData, createData } = require('../app/controllers/home.controller');
router.route('/')
.get(
  createData,
  getData,
);

module.exports = router;